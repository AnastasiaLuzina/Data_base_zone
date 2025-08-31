<?php
// Enable error reporting for debugging
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Start session
session_start();

echo "<h1>Login Test</h1>";

// Include auth functions
require_once 'db/auth.php';

// Test login function
if (isset($_POST['username']) && isset($_POST['password'])) {
    $username = $_POST['username'];
    $password = $_POST['password'];
    
    echo "<h2>Attempting Login:</h2>";
    echo "<p>Username: {$username}</p>";
    
    $result = loginUser($username, $password);
    
    echo "<h3>Login Result:</h3>";
    echo "<pre>";
    print_r($result);
    echo "</pre>";
    
    echo "<h3>Session After Login:</h3>";
    echo "<pre>";
    print_r($_SESSION);
    echo "</pre>";
}

// Display login form
echo '
<h2>Login Form:</h2>
<form method="post" action="">
    <div>
        <label for="username">Username:</label>
        <input type="text" id="username" name="username" value="admin">
    </div>
    <div>
        <label for="password">Password:</label>
        <input type="password" id="password" name="password" value="111">
    </div>
    <div>
        <button type="submit">Login</button>
    </div>
</form>
';

// Display current session info
echo "<h2>Current Session:</h2>";
echo "<p>Session ID: " . session_id() . "</p>";
echo "<pre>";
print_r($_SESSION);
echo "</pre>";

// Display logout link if logged in
if (isLoggedIn()) {
    echo '<p><a href="?logout=1">Logout</a></p>';
}

// Handle logout
if (isset($_GET['logout'])) {
    logoutUser();
    echo "<p>Logged out successfully!</p>";
    echo "<script>window.location.href = 'test_login.php';</script>";
}
?>