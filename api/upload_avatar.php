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

// Check if file was uploaded
if (!isset($_FILES['avatar']) || $_FILES['avatar']['error'] !== UPLOAD_ERR_OK) {
    $error = isset($_FILES['avatar']) ? $_FILES['avatar']['error'] : 'No file uploaded';
    echo json_encode(['status' => 'error', 'message' => 'File upload failed: ' . $error]);
    exit;
}

// Validate file type
$allowed_types = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
$file_info = finfo_open(FILEINFO_MIME_TYPE);
$mime_type = finfo_file($file_info, $_FILES['avatar']['tmp_name']);
finfo_close($file_info);

if (!in_array($mime_type, $allowed_types)) {
    echo json_encode(['status' => 'error', 'message' => 'Invalid file type. Only JPG, PNG, GIF, and WEBP are allowed.']);
    exit;
}

// Validate file size (max 2MB)
if ($_FILES['avatar']['size'] > 2 * 1024 * 1024) {
    echo json_encode(['status' => 'error', 'message' => 'File size exceeds the limit of 2MB.']);
    exit;
}

// Create uploads directory if it doesn't exist
$upload_dir = '../uploads/avatars/';
if (!file_exists($upload_dir)) {
    mkdir($upload_dir, 0755, true);
}

// Generate unique filename
$user_id = $_SESSION['user_id'];
$file_extension = pathinfo($_FILES['avatar']['name'], PATHINFO_EXTENSION);
$filename = 'avatar_' . $user_id . '_' . time() . '.' . $file_extension;
$filepath = $upload_dir . $filename;

// Move uploaded file
if (move_uploaded_file($_FILES['avatar']['tmp_name'], $filepath)) {
    // Update user avatar in database
    $avatar_url = 'uploads/avatars/' . $filename;
    $result = updateUserProfile($user_id, ['avatar' => $avatar_url]);
    
    if ($result['status'] === 'success') {
        echo json_encode([
            'status' => 'success',
            'message' => 'Avatar uploaded successfully',
            'avatar_url' => $avatar_url
        ]);
    } else {
        echo json_encode([
            'status' => 'error',
            'message' => 'Failed to update user profile: ' . $result['message']
        ]);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'Failed to move uploaded file']);
}
?>