<?php
// Database configuration
$host = 'localhost';
$dbname = 'cyberlearn';
$username = 'root';
$password = '';

try {
    // First connect without specifying a database
    $pdo = new PDO("mysql:host=$host", $username, $password);
    
    // Set PDO error mode to exception
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Create database if it doesn't exist
    $pdo->exec("CREATE DATABASE IF NOT EXISTS `$dbname` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
    
    // Connect to the specific database
    $pdo->exec("USE `$dbname`");
    
    // Set character set
    $pdo->exec("SET NAMES utf8mb4");
} catch(PDOException $e) {
    die("Database connection failed: " . $e->getMessage());
}
?>