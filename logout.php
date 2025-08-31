<?php
// Include auth functions
require_once '../db/auth.php';

// Set content type to JSON
header('Content-Type: application/json');

// Logout user
logoutUser();

// Return success
echo json_encode(['status' => 'success', 'message' => 'Logged out successfully']);
?>