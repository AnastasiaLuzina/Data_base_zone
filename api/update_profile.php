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
        
        // Validate data
        $valid_fields = [];
        
        // Username validation
        if (isset($data['username']) && !empty($data['username'])) {
            $valid_fields['username'] = $data['username'];
        }
        
        // Email validation
        if (isset($data['email'])) {
            if (empty($data['email']) || filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
                $valid_fields['email'] = $data['email'];
            } else {
                echo json_encode(['status' => 'error', 'message' => 'Invalid email format']);
                exit;
            }
        }
        
        // Role validation
        if (isset($data['role']) && in_array($data['role'], ['student', 'teacher'])) {
            $valid_fields['role'] = $data['role'];
        }
        
        if (empty($valid_fields)) {
            echo json_encode(['status' => 'error', 'message' => 'No valid fields to update']);
            exit;
        }
        
        // Update user profile
        $result = updateUserProfile($_SESSION['user_id'], $valid_fields);
        
        // Return result
        echo json_encode($result);
    } catch (Exception $e) {
        echo json_encode(['status' => 'error', 'message' => 'An error occurred: ' . $e->getMessage()]);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method']);
}
?>