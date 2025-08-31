<?php
// Include resource functions
require_once '../db/resources.php';
require_once '../db/auth.php';

// Set content type to JSON
header('Content-Type: application/json');

// Check request method
switch ($_SERVER['REQUEST_METHOD']) {
    case 'GET':
        // Get all categories
        $categories = getAllCategories();
        echo json_encode(['status' => 'success', 'data' => $categories]);
        break;
        
    case 'POST':
        // Check if user is admin
        if (!isAdmin()) {
            echo json_encode(['status' => 'error', 'message' => 'Unauthorized']);
            exit;
        }
        
        // Get JSON data
        $data = json_decode(file_get_contents('php://input'), true);
        
        // Check if required fields are present
        if (!isset($data['name'])) {
            echo json_encode(['status' => 'error', 'message' => 'Category name is required']);
            exit;
        }
        
        // Add category
        $description = isset($data['description']) ? $data['description'] : '';
        $result = addCategory($data['name'], $description);
        
        // Return result
        echo json_encode($result);
        break;
        
    case 'DELETE':
        // Check if user is admin
        if (!isAdmin()) {
            echo json_encode(['status' => 'error', 'message' => 'Unauthorized']);
            exit;
        }
        
        // Get category ID from URL
        $url_components = parse_url($_SERVER['REQUEST_URI']);
        parse_str($url_components['query'] ?? '', $params);
        
        if (!isset($params['id'])) {
            echo json_encode(['status' => 'error', 'message' => 'Category ID is required']);
            exit;
        }
        
        // Delete category
        $result = deleteCategory($params['id']);
        
        // Return result
        echo json_encode($result);
        break;
        
    default:
        echo json_encode(['status' => 'error', 'message' => 'Invalid request method']);
        break;
}
?>