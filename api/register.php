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

// Handle POST request
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        // Get JSON data
        $json_data = file_get_contents('php://input');
        $data = json_decode($json_data, true);
        
        // Check if required fields are present
        if (!isset($data['username']) || !isset($data['password'])) {
            echo json_encode(['status' => 'error', 'message' => 'Username and password are required']);
            exit;
        }
        
        // Optional email
        $email = isset($data['email']) ? $data['email'] : null;
        
        // Optional role (default to student)
        $role = isset($data['role']) && in_array($data['role'], ['student', 'teacher']) 
            ? $data['role'] : 'student';
        
        // Register user
        $result = registerUser($data['username'], $data['password'], $email, $role);
        
        // Return result
        echo json_encode($result);
    } catch (Exception $e) {
        // Log the error
        error_log("Registration error: " . $e->getMessage());
        echo json_encode(['status' => 'error', 'message' => 'An error occurred: ' . $e->getMessage()]);
    }
} else {
    // Return error for non-POST requests
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method']);
}
?>