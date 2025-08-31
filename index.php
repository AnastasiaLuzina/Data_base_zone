<?php
// Enable error reporting for debugging
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Include session configuration
require_once 'session_config.php';

// Include database initialization
try {
    require_once 'db/config.php';
    require_once 'db/init_db.php';
} catch (Exception $e) {
    echo "Error initializing database: " . $e->getMessage();
}

// Include Telegram bot integration
try {
    require_once 'telegram_bot/integration.php';
} catch (Exception $e) {
    error_log("Error initializing Telegram bot: " . $e->getMessage());
}

// Include the HTML content
include 'index.html';
?>