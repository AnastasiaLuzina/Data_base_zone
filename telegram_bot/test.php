<?php
// Enable error reporting for debugging
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Include required files
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/telegram_api.php';
require_once __DIR__ . '/db_helper.php';

// HTML header
echo '<!DOCTYPE html>
<html>
<head>
    <title>CyberLearn Telegram Bot Test</title>
    <style>
        body {
            font-family: "Share Tech Mono", monospace;
            background-color: #0a0a0a;
            color: #00ff41;
            margin: 0;
            padding: 20px;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            background-color: #111;
            padding: 20px;
            border: 1px solid #00ff41;
            box-shadow: 0 0 10px rgba(0, 255, 65, 0.5);
        }
        h1, h2 {
            color: #00ff41;
        }
        .section {
            margin-bottom: 30px;
            padding: 15px;
            background-color: rgba(0, 0, 0, 0.3);
            border-left: 3px solid #00ff41;
        }
        .success {
            color: #00ff41;
        }
        .error {
            color: #ff3366;
        }
        .info {
            color: #00ccff;
        }
        pre {
            background-color: #0a0a0a;
            padding: 10px;
            overflow-x: auto;
            border: 1px solid #333;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>CyberLearn Telegram Bot Test</h1>';

// Test 1: Check Bot Token
echo '<div class="section">
    <h2>1. Bot Token Check</h2>';

if (defined('BOT_TOKEN') && !empty(BOT_TOKEN)) {
    echo '<p class="success">✓ Bot token is defined: ' . substr(BOT_TOKEN, 0, 5) . '...' . substr(BOT_TOKEN, -5) . '</p>';
    
    // Test connection to Telegram API
    $url = "https://api.telegram.org/bot" . BOT_TOKEN . "/getMe";
    $response = @file_get_contents($url);
    
    if ($response !== false) {
        $data = json_decode($response, true);
        if ($data['ok']) {
            echo '<p class="success">✓ Connection to Telegram API successful</p>';
            echo '<p class="info">Bot info: ' . $data['result']['first_name'] . ' (@' . $data['result']['username'] . ')</p>';
        } else {
            echo '<p class="error">✗ Telegram API error: ' . ($data['description'] ?? 'Unknown error') . '</p>';
        }
    } else {
        echo '<p class="error">✗ Failed to connect to Telegram API: ' . error_get_last()['message'] . '</p>';
    }
} else {
    echo '<p class="error">✗ Bot token is not defined</p>';
}

echo '</div>';

// Test 2: Check Database Tables
echo '<div class="section">
    <h2>2. Database Tables Check</h2>';

try {
    global $pdo;
    
    // Check if telegram_users table exists or create it
    $pdo->exec("CREATE TABLE IF NOT EXISTS telegram_users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        chat_id VARCHAR(50) NOT NULL UNIQUE,
        state INT DEFAULT 0,
        data TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");
    
    echo '<p class="success">✓ telegram_users table is ready</p>';
    
    // Check if telegram_links table exists or create it
    $pdo->exec("CREATE TABLE IF NOT EXISTS telegram_links (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        chat_id VARCHAR(50) NOT NULL UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");
    
    echo '<p class="success">✓ telegram_links table is ready</p>';
    
    // Check if telegram_resources table exists or create it
    $pdo->exec("CREATE TABLE IF NOT EXISTS telegram_resources (
        id INT AUTO_INCREMENT PRIMARY KEY,
        resource_id INT NOT NULL,
        chat_id VARCHAR(50) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (resource_id) REFERENCES resources(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");
    
    echo '<p class="success">✓ telegram_resources table is ready</p>';
    
} catch(PDOException $e) {
    echo '<p class="error">✗ Database error: ' . $e->getMessage() . '</p>';
}

echo '</div>';

// Test 3: Check Webhook Status
echo '<div class="section">
    <h2>3. Webhook Status</h2>';

$webhook_info = getWebhookInfo();

if ($webhook_info['ok']) {
    if (!empty($webhook_info['result']['url'])) {
        echo '<p class="success">✓ Webhook is set to: ' . $webhook_info['result']['url'] . '</p>';
        
        if ($webhook_info['result']['has_custom_certificate']) {
            echo '<p class="info">Using custom certificate</p>';
        }
        
        echo '<p class="info">Pending updates: ' . $webhook_info['result']['pending_update_count'] . '</p>';
        
        if (!empty($webhook_info['result']['last_error_message'])) {
            echo '<p class="error">Last error: ' . $webhook_info['result']['last_error_message'] . '</p>';
            echo '<p class="error">Last error date: ' . date('Y-m-d H:i:s', $webhook_info['result']['last_error_date']) . '</p>';
        }
    } else {
        echo '<p class="error">✗ Webhook is not set</p>';
        echo '<p class="info">You need to set up the webhook using the admin panel</p>';
    }
} else {
    echo '<p class="error">✗ Failed to get webhook info: ' . ($webhook_info['description'] ?? 'Unknown error') . '</p>';
}

echo '</div>';

// Test 4: Check Admin Configuration
echo '<div class="section">
    <h2>4. Admin Configuration</h2>';

if (defined('ADMIN_CHAT_ID') && !empty(ADMIN_CHAT_ID)) {
    echo '<p class="success">✓ Admin chat ID is set: ' . ADMIN_CHAT_ID . '</p>';
} else {
    echo '<p class="error">✗ Admin chat ID is not set</p>';
    echo '<p class="info">An admin needs to send /setadmin to the bot</p>';
}

// Check for admin users in the database
try {
    $admin_chat_ids = getAdminChatIds();
    
    if (!empty($admin_chat_ids)) {
        echo '<p class="success">✓ Found ' . count($admin_chat_ids) . ' admin chat ID(s) in the database</p>';
    } else {
        echo '<p class="info">No admin chat IDs found in the database</p>';
    }
} catch(Exception $e) {
    echo '<p class="error">✗ Error checking admin chat IDs: ' . $e->getMessage() . '</p>';
}

echo '</div>';

// HTML footer
echo '</div>
</body>
</html>';
?>