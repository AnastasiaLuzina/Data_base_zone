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

// Include the HTML content
include 'index.html';
?>