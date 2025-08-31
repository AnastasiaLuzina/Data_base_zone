<?php
// Enable error reporting for debugging
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Include database configuration
require_once 'config.php';

try {
    // Create users table with role and avatar fields
    $pdo->exec("CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        email VARCHAR(100),
        role ENUM('student', 'teacher') DEFAULT 'student',
        avatar VARCHAR(255) DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        is_admin TINYINT(1) DEFAULT 0
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");
    
    // Create categories table
    $pdo->exec("CREATE TABLE IF NOT EXISTS categories (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");
    
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
    
    // Create notifications table
    $pdo->exec("CREATE TABLE IF NOT EXISTS notifications (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        message TEXT NOT NULL,
        is_read TINYINT(1) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");
    
    // Create ratings table for students and teachers
    $pdo->exec("CREATE TABLE IF NOT EXISTS ratings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        rating INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");
    
    // Check if admin user exists
    $stmt = $pdo->prepare("SELECT id FROM users WHERE username = 'admin'");
    $stmt->execute();
    
    if ($stmt->rowCount() == 0) {
        // Insert default admin user
        $stmt = $pdo->prepare("INSERT INTO users (username, password, is_admin) VALUES ('admin', '111', 1)");
        $stmt->execute();
        
        echo "Admin user created successfully!<br>";
    } else {
        // Update admin password to '111' for consistency
        $stmt = $pdo->prepare("UPDATE users SET password = '111' WHERE username = 'admin'");
        $stmt->execute();
        
        echo "Admin password updated successfully!<br>";
    }
    
    // Check if default categories exist
    $stmt = $pdo->prepare("SELECT COUNT(*) FROM categories");
    $stmt->execute();
    $category_count = $stmt->fetchColumn();
    
    if ($category_count == 0) {
        // Insert some default categories
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
        
        echo "Default categories created successfully!<br>";
    }
    
    // Create uploads directory if it doesn't exist
    if (!file_exists('../uploads')) {
        mkdir('../uploads', 0755, true);
        mkdir('../uploads/avatars', 0755, true);
        echo "Uploads directory created successfully!<br>";
    }
    
    echo "Database initialized successfully!";
} catch(PDOException $e) {
    die("Database initialization failed: " . $e->getMessage());
}
?>