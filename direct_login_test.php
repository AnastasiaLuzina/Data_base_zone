<?php
// Enable error reporting for debugging
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Include session configuration
require_once 'session_config.php';

// Include auth functions
require_once 'db/auth.php';

echo "<h1>Direct Login Test</h1>";

// Try to login as admin
$result = loginUser('admin', '111');

echo "<h2>Login Result:</h2>";
echo "<pre>";
print_r($result);
echo "</pre>";

echo "<h2>Session Data:</h2>";
echo "<pre>";
print_r($_SESSION);
echo "</pre>";

echo "<h2>Is Logged In: " . (isLoggedIn() ? 'Yes' : 'No') . "</h2>";
echo "<h2>Is Admin: " . (isAdmin() ? 'Yes' : 'No') . "</h2>";

echo "<p><a href='index.php'>Go to Main Page</a></p>";
?>