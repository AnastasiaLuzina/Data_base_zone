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

// Get query parameters
$role = isset($_GET['role']) ? $_GET['role'] : 'student';
$limit = isset($_GET['limit']) ? intval($_GET['limit']) : 10;

// Validate role
if (!in_array($role, ['student', 'teacher'])) {
    $role = 'student';
}

// Validate limit
if ($limit < 1 || $limit > 50) {
    $limit = 10;
}

// Get top rated users
$users = getTopRatedUsers($role, $limit);

// Return result
echo json_encode([
    'status' => 'success',
    'role' => $role,
    'data' => $users
]);
?>