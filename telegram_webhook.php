<?php
// Enable error reporting for debugging
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Include the webhook handler
require_once __DIR__ . '/telegram_bot/webhook.php';
?>