<?php
// Enable error reporting for debugging
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Include database configuration
require_once 'db/config.php';

echo "<h1>Admin User Check</h1>";

try {
    // Check if users table exists
    $stmt = $pdo->prepare("SHOW TABLES LIKE 'users'");
    $stmt->execute();
    
    if ($stmt->rowCount() == 0) {
        echo "<p style='color: red;'>Users table does not exist!</p>";
        echo "<p>Running database initialization...</p>";
        
        // Include database initialization
        require_once 'db/init_db.php';
    } else {
        echo "<p style='color: green;'>Users table exists.</p>";
    }
    
    // Check if admin user exists
    $stmt = $pdo->prepare("SELECT * FROM users WHERE username = 'admin'");
    $stmt->execute();
    
    if ($stmt->rowCount() == 0) {
        echo "<p style='color: red;'>Admin user does not exist!</p>";
        echo "<p>Creating admin user...</p>";
        
        // Create admin user
        $stmt = $pdo->prepare("INSERT INTO users (username, password, is_admin) VALUES ('admin', '111', 1)");
        $stmt->execute();
        
        echo "<p style='color: green;'>Admin user created successfully!</p>";
    } else {
        $admin = $stmt->fetch(PDO::FETCH_ASSOC);
        echo "<p style='color: green;'>Admin user exists.</p>";
        echo "<p>Admin ID: " . $admin['id'] . "</p>";
        echo "<p>Admin Password: " . $admin['password'] . "</p>";
        
        // Update admin password to '111'
        $stmt = $pdo->prepare("UPDATE users SET password = '111' WHERE username = 'admin'");
        $stmt->execute();
        
        echo "<p style='color: green;'>Admin password updated to '111'.</p>";
    }
    
    echo "<p><a href='login_test.html'>Go to Login Test Page</a></p>";
    
} catch (PDOException $e) {
    echo "<p style='color: red;'>Database error: " . $e->getMessage() . "</p>";
}
?>