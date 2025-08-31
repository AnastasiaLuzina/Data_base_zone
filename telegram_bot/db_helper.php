<?php
require_once __DIR__ . '/config.php';

/**
 * Save user state in the database
 * 
 * @param int $chat_id Telegram chat ID
 * @param int $state Current state
 * @param array $data Additional data to store
 * @return bool Success status
 */
function saveUserState($chat_id, $state, $data = []) {
    global $pdo;
    
    try {
        // Check if we need to create the telegram_users table
        $pdo->exec("CREATE TABLE IF NOT EXISTS telegram_users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            chat_id VARCHAR(50) NOT NULL UNIQUE,
            state INT DEFAULT 0,
            data TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");
        
        // Check if user exists
        $stmt = $pdo->prepare("SELECT id FROM telegram_users WHERE chat_id = :chat_id");
        $stmt->bindParam(':chat_id', $chat_id);
        $stmt->execute();
        
        $serialized_data = json_encode($data);
        
        if ($stmt->rowCount() > 0) {
            // Update existing user
            $stmt = $pdo->prepare("UPDATE telegram_users SET state = :state, data = :data, updated_at = NOW() WHERE chat_id = :chat_id");
            $stmt->bindParam(':state', $state);
            $stmt->bindParam(':data', $serialized_data);
            $stmt->bindParam(':chat_id', $chat_id);
            return $stmt->execute();
        } else {
            // Insert new user
            $stmt = $pdo->prepare("INSERT INTO telegram_users (chat_id, state, data) VALUES (:chat_id, :state, :data)");
            $stmt->bindParam(':chat_id', $chat_id);
            $stmt->bindParam(':state', $state);
            $stmt->bindParam(':data', $serialized_data);
            return $stmt->execute();
        }
    } catch(PDOException $e) {
        error_log("Database error in saveUserState: " . $e->getMessage());
        return false;
    }
}

/**
 * Get user state from the database
 * 
 * @param int $chat_id Telegram chat ID
 * @return array User state and data
 */
function getUserState($chat_id) {
    global $pdo;
    
    try {
        $stmt = $pdo->prepare("SELECT state, data FROM telegram_users WHERE chat_id = :chat_id");
        $stmt->bindParam(':chat_id', $chat_id);
        $stmt->execute();
        
        if ($stmt->rowCount() > 0) {
            $result = $stmt->fetch(PDO::FETCH_ASSOC);
            return [
                'state' => (int)$result['state'],
                'data' => json_decode($result['data'], true) ?: []
            ];
        } else {
            // User doesn't exist, create with default state
            saveUserState($chat_id, STATE_NONE, []);
            return [
                'state' => STATE_NONE,
                'data' => []
            ];
        }
    } catch(PDOException $e) {
        error_log("Database error in getUserState: " . $e->getMessage());
        return [
            'state' => STATE_NONE,
            'data' => []
        ];
    }
}

/**
 * Link Telegram user to website user
 * 
 * @param int $chat_id Telegram chat ID
 * @param string $username Website username
 * @return bool Success status
 */
function linkTelegramUser($chat_id, $username) {
    global $pdo;
    
    try {
        // Check if the username exists in the users table
        $stmt = $pdo->prepare("SELECT id FROM users WHERE username = :username");
        $stmt->bindParam(':username', $username);
        $stmt->execute();
        
        if ($stmt->rowCount() == 0) {
            return false; // User doesn't exist
        }
        
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        $user_id = $user['id'];
        
        // Check if we need to create the telegram_links table
        $pdo->exec("CREATE TABLE IF NOT EXISTS telegram_links (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            chat_id VARCHAR(50) NOT NULL UNIQUE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");
        
        // Check if link already exists
        $stmt = $pdo->prepare("SELECT id FROM telegram_links WHERE chat_id = :chat_id");
        $stmt->bindParam(':chat_id', $chat_id);
        $stmt->execute();
        
        if ($stmt->rowCount() > 0) {
            // Update existing link
            $stmt = $pdo->prepare("UPDATE telegram_links SET user_id = :user_id WHERE chat_id = :chat_id");
            $stmt->bindParam(':user_id', $user_id);
            $stmt->bindParam(':chat_id', $chat_id);
        } else {
            // Create new link
            $stmt = $pdo->prepare("INSERT INTO telegram_links (user_id, chat_id) VALUES (:user_id, :chat_id)");
            $stmt->bindParam(':user_id', $user_id);
            $stmt->bindParam(':chat_id', $chat_id);
        }
        
        return $stmt->execute();
    } catch(PDOException $e) {
        error_log("Database error in linkTelegramUser: " . $e->getMessage());
        return false;
    }
}

/**
 * Get website user ID linked to Telegram chat ID
 * 
 * @param int $chat_id Telegram chat ID
 * @return int|bool User ID or false if not linked
 */
function getLinkedUserId($chat_id) {
    global $pdo;
    
    try {
        $stmt = $pdo->prepare("SELECT user_id FROM telegram_links WHERE chat_id = :chat_id");
        $stmt->bindParam(':chat_id', $chat_id);
        $stmt->execute();
        
        if ($stmt->rowCount() > 0) {
            $result = $stmt->fetch(PDO::FETCH_ASSOC);
            return $result['user_id'];
        } else {
            return false;
        }
    } catch(PDOException $e) {
        error_log("Database error in getLinkedUserId: " . $e->getMessage());
        return false;
    }
}

/**
 * Add resource submission from Telegram
 * 
 * @param string $link Resource URL
 * @param string $title Resource title
 * @param int $category_id Category ID
 * @param string $resource_type Resource type
 * @param string $difficulty_level Difficulty level
 * @param int $chat_id Telegram chat ID
 * @return array Result with status and message
 */
function addResourceFromTelegram($link, $title, $category_id, $resource_type, $difficulty_level, $chat_id) {
    global $pdo;
    
    try {
        // Get linked user if available
        $user_id = getLinkedUserId($chat_id);
        $added_by = null;
        
        if ($user_id) {
            // Get username from user_id
            $stmt = $pdo->prepare("SELECT username FROM users WHERE id = :user_id");
            $stmt->bindParam(':user_id', $user_id);
            $stmt->execute();
            
            if ($stmt->rowCount() > 0) {
                $user = $stmt->fetch(PDO::FETCH_ASSOC);
                $added_by = $user['username'];
            }
        }
        
        // If no linked user, use chat_id as identifier
        if (!$added_by) {
            $added_by = "telegram_" . $chat_id;
        }
        
        // Insert resource
        $stmt = $pdo->prepare("INSERT INTO resources (link, title, category_id, resource_type, difficulty_level, added_by, status) 
                              VALUES (:link, :title, :category_id, :resource_type, :difficulty_level, :added_by, 'pending')");
        $stmt->bindParam(':link', $link);
        $stmt->bindParam(':title', $title);
        $stmt->bindParam(':category_id', $category_id);
        $stmt->bindParam(':resource_type', $resource_type);
        $stmt->bindParam(':difficulty_level', $difficulty_level);
        $stmt->bindParam(':added_by', $added_by);
        $stmt->execute();
        
        $resource_id = $pdo->lastInsertId();
        
        // Store the resource ID in telegram_resources table for tracking
        $pdo->exec("CREATE TABLE IF NOT EXISTS telegram_resources (
            id INT AUTO_INCREMENT PRIMARY KEY,
            resource_id INT NOT NULL,
            chat_id VARCHAR(50) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (resource_id) REFERENCES resources(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");
        
        $stmt = $pdo->prepare("INSERT INTO telegram_resources (resource_id, chat_id) VALUES (:resource_id, :chat_id)");
        $stmt->bindParam(':resource_id', $resource_id);
        $stmt->bindParam(':chat_id', $chat_id);
        $stmt->execute();
        
        return [
            'status' => 'success', 
            'message' => 'Resource added successfully',
            'id' => $resource_id
        ];
    } catch(PDOException $e) {
        error_log("Database error in addResourceFromTelegram: " . $e->getMessage());
        return ['status' => 'error', 'message' => 'Failed to add resource: ' . $e->getMessage()];
    }
}

/**
 * Add new category from Telegram
 * 
 * @param string $name Category name
 * @param string $description Category description
 * @return array Result with status and message
 */
function addCategoryFromTelegram($name, $description = '') {
    global $pdo;
    
    try {
        $stmt = $pdo->prepare("INSERT INTO categories (name, description) VALUES (:name, :description)");
        $stmt->bindParam(':name', $name);
        $stmt->bindParam(':description', $description);
        $stmt->execute();
        
        return [
            'status' => 'success', 
            'message' => 'Category added successfully',
            'id' => $pdo->lastInsertId()
        ];
    } catch(PDOException $e) {
        error_log("Database error in addCategoryFromTelegram: " . $e->getMessage());
        return ['status' => 'error', 'message' => 'Failed to add category: ' . $e->getMessage()];
    }
}

/**
 * Get all admin chat IDs
 * 
 * @return array List of admin chat IDs
 */
function getAdminChatIds() {
    global $pdo;
    
    try {
        // Get all users with is_admin=1
        $stmt = $pdo->prepare("SELECT u.id FROM users u WHERE u.is_admin = 1");
        $stmt->execute();
        $admin_ids = $stmt->fetchAll(PDO::FETCH_COLUMN);
        
        // Get linked telegram chat_ids for these admins
        $admin_chat_ids = [];
        
        if (!empty($admin_ids)) {
            $placeholders = implode(',', array_fill(0, count($admin_ids), '?'));
            $stmt = $pdo->prepare("SELECT chat_id FROM telegram_links WHERE user_id IN ($placeholders)");
            
            foreach ($admin_ids as $i => $id) {
                $stmt->bindValue($i + 1, $id);
            }
            
            $stmt->execute();
            $admin_chat_ids = $stmt->fetchAll(PDO::FETCH_COLUMN);
        }
        
        // Also include the configured admin chat ID if set
        if (defined('ADMIN_CHAT_ID') && !empty(ADMIN_CHAT_ID)) {
            $admin_chat_ids[] = ADMIN_CHAT_ID;
        }
        
        return array_unique($admin_chat_ids);
    } catch(PDOException $e) {
        error_log("Database error in getAdminChatIds: " . $e->getMessage());
        return [];
    }
}

/**
 * Notify user about resource status change
 * 
 * @param int $resource_id Resource ID
 * @param string $status New status
 * @return bool Success status
 */
function notifyUserAboutResourceStatus($resource_id, $status) {
    global $pdo;
    
    try {
        // Get the chat_id of the user who submitted this resource
        $stmt = $pdo->prepare("SELECT tr.chat_id, r.title 
                              FROM telegram_resources tr 
                              JOIN resources r ON tr.resource_id = r.id 
                              WHERE tr.resource_id = :resource_id");
        $stmt->bindParam(':resource_id', $resource_id);
        $stmt->execute();
        
        if ($stmt->rowCount() > 0) {
            $result = $stmt->fetch(PDO::FETCH_ASSOC);
            $chat_id = $result['chat_id'];
            $title = $result['title'];
            
            // Send notification via Telegram
            $message = "Your resource '$title' has been " . ($status == 'approved' ? 'approved' : 'rejected') . ".";
            sendTelegramMessage($chat_id, $message);
            
            return true;
        }
        
        return false;
    } catch(PDOException $e) {
        error_log("Database error in notifyUserAboutResourceStatus: " . $e->getMessage());
        return false;
    }
}

/**
 * Set admin chat ID
 * 
 * @param string $chat_id Telegram chat ID
 * @return bool Success status
 */
function setAdminChatId($chat_id) {
    // Create a config file to store the admin chat ID
    $config_file = __DIR__ . '/admin_config.php';
    $content = "<?php\ndefine('ADMIN_CHAT_ID', '$chat_id');\n?>";
    
    return file_put_contents($config_file, $content) !== false;
}
?>