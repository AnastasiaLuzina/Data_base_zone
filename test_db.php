<?php
// Enable error reporting for debugging
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Start session
session_start();

echo "<h1>Database and Session Test</h1>";

// Test database connection
try {
    require_once 'db/config.php';
    echo "<p>Database connection successful!</p>";
    
    // Test if tables exist
    $tables = ['users', 'categories', 'resources', 'notifications'];
    echo "<h2>Checking Tables:</h2>";
    echo "<ul>";
    
    foreach ($tables as $table) {
        $stmt = $pdo->prepare("SHOW TABLES LIKE :table");
        $stmt->bindParam(':table', $table);
        $stmt->execute();
        
        if ($stmt->rowCount() > 0) {
            echo "<li>Table '{$table}' exists ✓</li>";
            
            // Count records
            $stmt = $pdo->prepare("SELECT COUNT(*) FROM {$table}");
            $stmt->execute();
            $count = $stmt->fetchColumn();
            echo " ({$count} records)";
        } else {
            echo "<li>Table '{$table}' does not exist ✗</li>";
        }
    }
    
    echo "</ul>";
    
    // Check admin user
    $stmt = $pdo->prepare("SELECT * FROM users WHERE username = 'admin'");
    $stmt->execute();
    $admin = $stmt->fetch(PDO::FETCH_ASSOC);
    
    echo "<h2>Admin User:</h2>";
    if ($admin) {
        echo "<p>Admin user exists ✓</p>";
        echo "<pre>";
        print_r($admin);
        echo "</pre>";
    } else {
        echo "<p>Admin user does not exist ✗</p>";
    }
    
} catch (PDOException $e) {
    echo "<p>Database connection failed: " . $e->getMessage() . "</p>";
}

// Test session
echo "<h2>Session Information:</h2>";
echo "<p>Session ID: " . session_id() . "</p>";

echo "<h3>Current Session Data:</h3>";
echo "<pre>";
print_r($_SESSION);
echo "</pre>";

// Set a test session variable
$_SESSION['test'] = 'This is a test session value - ' . time();
echo "<p>Test session variable set. Refresh the page to see if it persists.</p>";

echo "<h2>PHP Information:</h2>";
echo "<p>PHP Version: " . phpversion() . "</p>";
echo "<p>Session Save Path: " . session_save_path() . "</p>";
echo "<p>Session Name: " . session_name() . "</p>";

// Check if cookies are enabled
echo "<p>Cookies Enabled: " . (isset($_SERVER['HTTP_COOKIE']) ? 'Yes' : 'No') . "</p>";
?>