<?php
// Enable error reporting for debugging
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Database configuration
$host = 'localhost';
$dbname = 'cyberlearn';
$username = 'root';
$password = '';

try {
    // Connect to MySQL without database
    $pdo = new PDO("mysql:host=$host", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    echo "<h1>Database Reset</h1>";
    
    // Drop database if exists
    $pdo->exec("DROP DATABASE IF EXISTS `$dbname`");
    echo "<p>Database '$dbname' dropped.</p>";
    
    // Create database
    $pdo->exec("CREATE DATABASE `$dbname` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
    echo "<p>Database '$dbname' created.</p>";
    
    // Connect to the specific database
    $pdo->exec("USE `$dbname`");
    
    // Create users table
    $pdo->exec("CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        email VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        is_admin TINYINT(1) DEFAULT 0
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");
    echo "<p>Users table created.</p>";
    
    // Create categories table
    $pdo->exec("CREATE TABLE IF NOT EXISTS categories (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");
    echo "<p>Categories table created.</p>";
    
    // Create resources table
    $pdo->exec("CREATE TABLE IF NOT EXISTS resources (
        id INT AUTO_INCREMENT PRIMARY KEY,
        link VARCHAR(255) NOT NULL,
        title VARCHAR(255) NOT NULL,
        category_id INT NOT NULL,
        resource_type ENUM('course', 'video', 'article', 'book') NOT NULL,
        difficulty_level ENUM('easy', 'medium', 'pro') NOT NULL,
        added_by VARCHAR(100),
        status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");
    echo "<p>Resources table created.</p>";
    
    // Create notifications table
    $pdo->exec("CREATE TABLE IF NOT EXISTS notifications (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        message TEXT NOT NULL,
        is_read TINYINT(1) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");
    echo "<p>Notifications table created.</p>";
    
    // Insert admin user
    $stmt = $pdo->prepare("INSERT INTO users (username, password, is_admin) VALUES ('admin', '111', 1)");
    $stmt->execute();
    echo "<p>Admin user created.</p>";
    
    // Insert default categories
    $default_categories = [
        ['name' => 'JavaScript', 'description' => 'JavaScript programming language resources'],
        ['name' => 'Python', 'description' => 'Python programming language resources'],
        ['name' => 'Java', 'description' => 'Java programming language resources'],
        ['name' => 'C++', 'description' => 'C++ programming language resources'],
        ['name' => 'Web Development', 'description' => 'Web development resources'],
        ['name' => 'Mobile Development', 'description' => 'Mobile app development resources'],
        ['name' => 'Machine Learning', 'description' => 'Machine learning and AI resources']
    ];
    
    $stmt = $pdo->prepare("INSERT INTO categories (name, description) VALUES (:name, :description)");
    foreach ($default_categories as $category) {
        $stmt->bindParam(':name', $category['name']);
        $stmt->bindParam(':description', $category['description']);
        $stmt->execute();
    }
    echo "<p>Default categories created.</p>";
    
    echo "<p style='color: green;'>Database reset completed successfully!</p>";
    echo "<p><a href='check_admin.php'>Check Admin User</a></p>";
    echo "<p><a href='login_test.html'>Go to Login Test Page</a></p>";
    
} catch(PDOException $e) {
    die("<p style='color: red;'>Database reset failed: " . $e->getMessage() . "</p>");
}
?>