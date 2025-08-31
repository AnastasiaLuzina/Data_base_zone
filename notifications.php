<?php
// Include resource functions
require_once '../db/resources.php';
require_once '../db/auth.php';

// Set content type to JSON
header('Content-Type: application/json');

// Check if user is logged in
if (!isLoggedIn()) {
    echo json_encode(['status' => 'error', 'message' => 'Unauthorized']);
    exit;
}

// Check request method
switch ($_SERVER['REQUEST_METHOD']) {
    case 'GET':
        // Get unread only parameter
        $unread_only = isset($_GET['unread_only']) && $_GET['unread_only'] === 'true';
        
        // Get notifications
        $notifications = getUserNotifications($_SESSION['user_id'], $unread_only);
        echo json_encode(['status' => 'success', 'data' => $notifications]);
        break;
        
    case 'PUT':
        // Get JSON data
        $data = json_decode(file_get_contents('php://input'), true);
        
        // Check if notification ID is present
        if (!isset($data['id'])) {
            echo json_encode(['status' => 'error', 'message' => 'Notification ID is required']);
            exit;
        }
        
        // Mark notification as read
        $result = markNotificationAsRead($data['id']);
        
        // Return result
        echo json_encode($result);
        break;
        
    default:
        echo json_encode(['status' => 'error', 'message' => 'Invalid request method']);
        break;
}
?>