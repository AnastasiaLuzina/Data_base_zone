<?php
// Enable error reporting for debugging
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Include session configuration
require_once 'session_config.php';

// Check if user is logged in and is admin
require_once 'check_admin.php';

// Include the setup script
require_once __DIR__ . '/telegram_bot/setup.php';
?>