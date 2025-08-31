<?php
// Include database configuration
require_once 'config.php';

/**
 * Get all categories
 * 
 * @return array List of categories
 */
function getAllCategories() {
    global $pdo;
    
    try {
        $stmt = $pdo->query("SELECT * FROM categories ORDER BY name");
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    } catch(PDOException $e) {
        return [];
    }
}

/**
 * Get category by ID
 * 
 * @param int $id Category ID
 * @return array|bool Category data or false if not found
 */
function getCategoryById($id) {
    global $pdo;
    
    try {
        $stmt = $pdo->prepare("SELECT * FROM categories WHERE id = :id");
        $stmt->bindParam(':id', $id);
        $stmt->execute();
        
        return $stmt->fetch(PDO::FETCH_ASSOC);
    } catch(PDOException $e) {
        return false;
    }
}

/**
 * Add new category
 * 
 * @param string $name Category name
 * @param string $description Category description
 * @return array Result with status and message
 */
function addCategory($name, $description = '') {
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
        return ['status' => 'error', 'message' => 'Failed to add category: ' . $e->getMessage()];
    }
}

/**
 * Delete category
 * 
 * @param int $id Category ID
 * @return array Result with status and message
 */
function deleteCategory($id) {
    global $pdo;
    
    try {
        $stmt = $pdo->prepare("DELETE FROM categories WHERE id = :id");
        $stmt->bindParam(':id', $id);
        $stmt->execute();
        
        return ['status' => 'success', 'message' => 'Category deleted successfully'];
    } catch(PDOException $e) {
        return ['status' => 'error', 'message' => 'Failed to delete category: ' . $e->getMessage()];
    }
}

/**
 * Get all resources
 * 
 * @param string $status Filter by status (optional)
 * @param int $category_id Filter by category ID (optional)
 * @return array List of resources
 */
function getAllResources($status = null, $category_id = null) {
    global $pdo;
    
    try {
        $sql = "SELECT r.*, c.name as category_name 
                FROM resources r 
                JOIN categories c ON r.category_id = c.id";
        
        $params = [];
        
        if ($status !== null) {
            $sql .= " WHERE r.status = :status";
            $params[':status'] = $status;
            
            if ($category_id !== null) {
                $sql .= " AND r.category_id = :category_id";
                $params[':category_id'] = $category_id;
            }
        } elseif ($category_id !== null) {
            $sql .= " WHERE r.category_id = :category_id";
            $params[':category_id'] = $category_id;
        }
        
        $sql .= " ORDER BY r.created_at DESC";
        
        $stmt = $pdo->prepare($sql);
        foreach ($params as $key => $value) {
            $stmt->bindValue($key, $value);
        }
        $stmt->execute();
        
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    } catch(PDOException $e) {
        return [];
    }
}

/**
 * Get resource by ID
 * 
 * @param int $id Resource ID
 * @return array|bool Resource data or false if not found
 */
function getResourceById($id) {
    global $pdo;
    
    try {
        $stmt = $pdo->prepare("SELECT r.*, c.name as category_name 
                              FROM resources r 
                              JOIN categories c ON r.category_id = c.id 
                              WHERE r.id = :id");
        $stmt->bindParam(':id', $id);
        $stmt->execute();
        
        return $stmt->fetch(PDO::FETCH_ASSOC);
    } catch(PDOException $e) {
        return false;
    }
}

/**
 * Add new resource
 * 
 * @param string $link Resource link
 * @param string $title Resource title
 * @param int $category_id Category ID
 * @param string $resource_type Resource type (course, video, article, book)
 * @param string $difficulty_level Difficulty level (easy, medium, pro)
 * @param string $added_by Email of user who added the resource
 * @param string $status Resource status (pending, approved, rejected)
 * @return array Result with status and message
 */
function addResource($link, $title, $category_id, $resource_type, $difficulty_level, $added_by = null, $status = 'pending') {
    global $pdo;
    
    try {
        $stmt = $pdo->prepare("INSERT INTO resources (link, title, category_id, resource_type, difficulty_level, added_by, status) 
                              VALUES (:link, :title, :category_id, :resource_type, :difficulty_level, :added_by, :status)");
        $stmt->bindParam(':link', $link);
        $stmt->bindParam(':title', $title);
        $stmt->bindParam(':category_id', $category_id);
        $stmt->bindParam(':resource_type', $resource_type);
        $stmt->bindParam(':difficulty_level', $difficulty_level);
        $stmt->bindParam(':added_by', $added_by);
        $stmt->bindParam(':status', $status);
        $stmt->execute();
        
        return [
            'status' => 'success', 
            'message' => 'Resource added successfully',
            'id' => $pdo->lastInsertId()
        ];
    } catch(PDOException $e) {
        return ['status' => 'error', 'message' => 'Failed to add resource: ' . $e->getMessage()];
    }
}

/**
 * Update resource status
 * 
 * @param int $id Resource ID
 * @param string $status New status (approved, rejected)
 * @return array Result with status and message
 */
function updateResourceStatus($id, $status) {
    global $pdo;
    
    try {
        $stmt = $pdo->prepare("UPDATE resources SET status = :status WHERE id = :id");
        $stmt->bindParam(':status', $status);
        $stmt->bindParam(':id', $id);
        $stmt->execute();
        
        // Get resource details for notification
        $resource = getResourceById($id);
        
        // If resource has an email associated, create notification
        if ($resource && !empty($resource['added_by'])) {
            // Get user by email
            $stmt = $pdo->prepare("SELECT id FROM users WHERE email = :email OR username = :email");
            $stmt->bindParam(':email', $resource['added_by']);
            $stmt->execute();
            $user = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if ($user) {
                $message = "Your resource '{$resource['title']}' has been " . 
                          ($status == 'approved' ? 'approved' : 'rejected') . ".";
                
                $stmt = $pdo->prepare("INSERT INTO notifications (user_id, message) VALUES (:user_id, :message)");
                $stmt->bindParam(':user_id', $user['id']);
                $stmt->bindParam(':message', $message);
                $stmt->execute();
            }
        }
        
        return ['status' => 'success', 'message' => 'Resource status updated successfully'];
    } catch(PDOException $e) {
        return ['status' => 'error', 'message' => 'Failed to update resource status: ' . $e->getMessage()];
    }
}

/**
 * Delete resource
 * 
 * @param int $id Resource ID
 * @return array Result with status and message
 */
function deleteResource($id) {
    global $pdo;
    
    try {
        $stmt = $pdo->prepare("DELETE FROM resources WHERE id = :id");
        $stmt->bindParam(':id', $id);
        $stmt->execute();
        
        return ['status' => 'success', 'message' => 'Resource deleted successfully'];
    } catch(PDOException $e) {
        return ['status' => 'error', 'message' => 'Failed to delete resource: ' . $e->getMessage()];
    }
}

/**
 * Get user notifications
 * 
 * @param int $user_id User ID
 * @param bool $unread_only Get only unread notifications
 * @return array List of notifications
 */
function getUserNotifications($user_id, $unread_only = false) {
    global $pdo;
    
    try {
        $sql = "SELECT * FROM notifications WHERE user_id = :user_id";
        
        if ($unread_only) {
            $sql .= " AND is_read = 0";
        }
        
        $sql .= " ORDER BY created_at DESC";
        
        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(':user_id', $user_id);
        $stmt->execute();
        
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    } catch(PDOException $e) {
        return [];
    }
}

/**
 * Mark notification as read
 * 
 * @param int $notification_id Notification ID
 * @return array Result with status and message
 */
function markNotificationAsRead($notification_id) {
    global $pdo;
    
    try {
        $stmt = $pdo->prepare("UPDATE notifications SET is_read = 1 WHERE id = :id");
        $stmt->bindParam(':id', $notification_id);
        $stmt->execute();
        
        return ['status' => 'success', 'message' => 'Notification marked as read'];
    } catch(PDOException $e) {
        return ['status' => 'error', 'message' => 'Failed to mark notification as read: ' . $e->getMessage()];
    }
}
?>