<?php
// Enable error reporting for debugging
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Include required files
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/telegram_api.php';

// Check if the script is being run from the command line
$is_cli = (php_sapi_name() === 'cli');

// Get the webhook URL
$webhook_url = '';

if ($is_cli) {
    // Command line setup
    echo "CyberLearn Telegram Bot Setup\n";
    echo "-----------------------------\n\n";
    
    // Ask for webhook URL
    echo "Enter the webhook URL (e.g., https://yourdomain.com/telegram_bot/webhook.php):\n";
    $webhook_url = trim(fgets(STDIN));
} else {
    // Web setup
    if (isset($_POST['webhook_url'])) {
        $webhook_url = $_POST['webhook_url'];
    }
}

// Validate and set webhook
if (!empty($webhook_url)) {
    // Set the webhook
    $result = setWebhook($webhook_url);
    
    if ($result['ok']) {
        $success_message = "Webhook set successfully to: $webhook_url";
        
        // Update the config file with the webhook URL
        $config_file = __DIR__ . '/config.php';
        $config_content = file_get_contents($config_file);
        $config_content = preg_replace(
            "/define\('WEBHOOK_URL', '.*?'\);/",
            "define('WEBHOOK_URL', '$webhook_url');",
            $config_content
        );
        file_put_contents($config_file, $config_content);
        
        if ($is_cli) {
            echo "$success_message\n";
            echo "Bot is now ready to receive updates.\n";
        } else {
            echo "<div class='success'>$success_message</div>";
        }
    } else {
        $error_message = "Failed to set webhook: " . ($result['description'] ?? 'Unknown error');
        
        if ($is_cli) {
            echo "$error_message\n";
        } else {
            echo "<div class='error'>$error_message</div>";
        }
    }
} elseif (!$is_cli) {
    // Show the web form
    ?>
    <!DOCTYPE html>
    <html>
    <head>
        <title>CyberLearn Telegram Bot Setup</title>
        <style>
            body {
                font-family: 'Share Tech Mono', monospace;
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
            h1 {
                color: #00ff41;
                text-align: center;
                margin-bottom: 30px;
            }
            .form-group {
                margin-bottom: 20px;
            }
            label {
                display: block;
                margin-bottom: 5px;
                color: #00ff41;
            }
            input[type="text"] {
                width: 100%;
                padding: 10px;
                background-color: #222;
                border: 1px solid #00ff41;
                color: #00ff41;
                font-family: 'Share Tech Mono', monospace;
            }
            button {
                background-color: #00ff41;
                color: #000;
                border: none;
                padding: 10px 20px;
                cursor: pointer;
                font-family: 'Share Tech Mono', monospace;
                font-weight: bold;
            }
            button:hover {
                background-color: #00cc33;
            }
            .success {
                color: #00ff41;
                padding: 10px;
                background-color: rgba(0, 255, 65, 0.1);
                border: 1px solid #00ff41;
                margin-top: 20px;
            }
            .error {
                color: #ff0033;
                padding: 10px;
                background-color: rgba(255, 0, 51, 0.1);
                border: 1px solid #ff0033;
                margin-top: 20px;
            }
            .info {
                margin-top: 20px;
                padding: 10px;
                background-color: #222;
                border: 1px solid #00ff41;
            }
            .info h3 {
                margin-top: 0;
            }
            code {
                display: block;
                padding: 10px;
                background-color: #333;
                color: #00ff41;
                margin: 10px 0;
                overflow-x: auto;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>CyberLearn Telegram Bot Setup</h1>
            
            <form method="post" action="">
                <div class="form-group">
                    <label for="webhook_url">Webhook URL:</label>
                    <input type="text" id="webhook_url" name="webhook_url" placeholder="https://yourdomain.com/telegram_bot/webhook.php" required>
                </div>
                
                <button type="submit">Set Webhook</button>
            </form>
            
            <div class="info">
                <h3>Bot Information</h3>
                <p>Bot Token: <?php echo BOT_TOKEN; ?></p>
                
                <?php
                // Get current webhook info
                $webhook_info = getWebhookInfo();
                if ($webhook_info['ok']) {
                    echo "<h3>Current Webhook Status</h3>";
                    echo "<p>URL: " . ($webhook_info['result']['url'] ?? 'Not set') . "</p>";
                    echo "<p>Pending updates: " . ($webhook_info['result']['pending_update_count'] ?? '0') . "</p>";
                    
                    if (!empty($webhook_info['result']['last_error_message'])) {
                        echo "<p>Last error: " . $webhook_info['result']['last_error_message'] . "</p>";
                        echo "<p>Last error date: " . date('Y-m-d H:i:s', $webhook_info['result']['last_error_date']) . "</p>";
                    }
                }
                ?>
                
                <h3>Setup Instructions</h3>
                <ol>
                    <li>Make sure your server is accessible from the internet with HTTPS.</li>
                    <li>Enter the full URL to your webhook.php file.</li>
                    <li>Click "Set Webhook" to configure the bot.</li>
                    <li>Test the bot by sending a message to it on Telegram.</li>
                </ol>
                
                <h3>Admin Setup</h3>
                <p>To set yourself as an admin, send the following command to the bot:</p>
                <code>/setadmin</code>
                <p>This will allow you to receive notifications about new resource submissions.</p>
            </div>
        </div>
    </body>
    </html>
    <?php
}
?>