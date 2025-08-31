<?php
// Include resource functions
require_once '../db/resources.php';
require_once '../db/auth.php';

// Set content type to JSON
header('Content-Type: application/json');

// Check request method
switch ($_SERVER['REQUEST_METHOD']) {
    case 'GET':
        // Get query parameters
        $status = isset($_GET['status']) ? $_GET['status'] : null;
        $category_id = isset($_GET['category_id']) ? $_GET['category_id'] : null;
        
        // Get resources
        $resources = getAllResources($status, $category_id);
        echo json_encode(['status' => 'success', 'data' => $resources]);
        break;
        
    case 'POST':
        // Get JSON data
        $data = json_decode(file_get_contents('php://input'), true);
        
        // Check if required fields are present
        if (!isset($data['link']) || !isset($data['title']) || !isset($data['category_id']) || 
            !isset($data['resource_type']) || !isset($data['difficulty_level'])) {
            echo json_encode(['status' => 'error', 'message' => 'Missing required fields']);
            exit;
        }
        
        // Set status based on user role
        $status = isAdmin() ? 'approved' : 'pending';
        
        // Get user email if logged in
        $added_by = null;
        if (isLoggedIn() && isset($_SESSION['username'])) {
            $added_by = $_SESSION['username'];
        }
        
        // Add resource
        $result = addResource(
            $data['link'],
            $data['title'],
            $data['category_id'],
            $data['resource_type'],
            $data['difficulty_level'],
            $added_by,
            $status
        );
        
        // Return result
        echo json_encode($result);
        break;
        
    case 'PUT':
        // Check if user is admin
        if (!isAdmin()) {
            echo json_encode(['status' => 'error', 'message' => 'Unauthorized']);
            exit;
        }
        
        // Get JSON data
        $data = json_decode(file_get_contents('php://input'), true);
        
        // Check if required fields are present
        if (!isset($data['id']) || !isset($data['status'])) {
            echo json_encode(['status' => 'error', 'message' => 'Resource ID and status are required']);
            exit;
        }
        
        // Update resource status
        $result = updateResourceStatus($data['id'], $data['status']);
        
        // Return result
        echo json_encode($result);
        break;
        
    case 'DELETE':
        // Check if user is admin
        if (!isAdmin()) {
            echo json_encode(['status' => 'error', 'message' => 'Unauthorized']);
            exit;
        }
        
        // Get resource ID from URL
        $url_components = parse_url($_SERVER['REQUEST_URI']);
        parse_str($url_components['query'] ?? '', $params);
        
        if (!isset($params['id'])) {
            echo json_encode(['status' => 'error', 'message' => 'Resource ID is required']);
            exit;
        }
        
        // Delete resource
        $result = deleteResource($params['id']);
        
        // Return result
        echo json_encode($result);
        break;
        
    default:
        echo json_encode(['status' => 'error', 'message' => 'Invalid request method']);
        break;
}
?>