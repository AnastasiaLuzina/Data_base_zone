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

// Check if user is logged in
if (!isLoggedIn()) {
    echo json_encode(['status' => 'error', 'message' => 'Unauthorized']);
    exit;
}

// Handle POST request
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        // Get JSON data
        $data = json_decode(file_get_contents('php://input'), true);
        
        // Check if required fields are present
        if (!isset($data['current_password']) || !isset($data['new_password'])) {
            echo json_encode(['status' => 'error', 'message' => 'Current password and new password are required']);
            exit;
        }
        
        // Validate new password
        if (strlen($data['new_password']) < 6) {
            echo json_encode(['status' => 'error', 'message' => 'New password must be at least 6 characters long']);
            exit;
        }
        
        // Update user password
        $result = updateUserPassword(
            $_SESSION['user_id'],
            $data['current_password'],
            $data['new_password']
        );
        
        // Return result
        echo json_encode($result);
    } catch (Exception $e) {
        echo json_encode(['status' => 'error', 'message' => 'An error occurred: ' . $e->getMessage()]);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method']);
}
?>