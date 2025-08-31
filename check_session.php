<?php
// Enable error reporting for debugging
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Include session configuration
require_once '../session_config.php';

// Include auth functions
require_once '../db/auth.php';

// Set content type to JSON
header('Content-Type: application/json');

// Log session information
error_log("Session ID: " . session_id());
error_log("Session data: " . print_r($_SESSION, true));

// Check if user is logged in
if (isLoggedIn()) {
    echo json_encode([
        'status' => 'success',
        'logged_in' => true,
        'username' => $_SESSION['username'],
        'is_admin' => isAdmin(),
        'session_id' => session_id()
    ]);
} else {
    echo json_encode([
        'status' => 'success',
        'logged_in' => false,
        'session_id' => session_id()
    ]);
}
?>