<?php
// Telegram Bot Configuration
define('BOT_TOKEN', '8092413671:AAG_tkBYpkd8GKDeXGEA8Fvl7qgDxcAHqL8');
define('WEBHOOK_URL', ''); // Will be set during deployment
define('ADMIN_CHAT_ID', ''); // Will be set during setup

// Database connection is inherited from the main application
require_once __DIR__ . '/../db/config.php';

// Bot states for conversation management
define('STATE_NONE', 0);
define('STATE_AWAITING_RESOURCE_URL', 1);
define('STATE_AWAITING_RESOURCE_TITLE', 2);
define('STATE_AWAITING_CATEGORY_SELECTION', 3);
define('STATE_AWAITING_RESOURCE_TYPE', 4);
define('STATE_AWAITING_DIFFICULTY_LEVEL', 5);
define('STATE_AWAITING_CATEGORY_NAME', 6);
define('STATE_AWAITING_CATEGORY_DESCRIPTION', 7);
define('STATE_AWAITING_ADMIN_APPROVAL', 8);

// Resource types
$RESOURCE_TYPES = ['course', 'video', 'article', 'book'];

// Difficulty levels
$DIFFICULTY_LEVELS = ['easy', 'medium', 'pro'];
?>