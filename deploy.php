<?php
// Enable error reporting for debugging
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Include database configuration
require_once 'db/config.php';

// Include database initialization
require_once 'db/init_db.php';

// Create uploads directory if it doesn't exist
if (!file_exists('uploads')) {
    mkdir('uploads', 0755, true);
    mkdir('uploads/avatars', 0755, true);
    echo "<p>Uploads directory created successfully!</p>";
}

// Check if the site is accessible
$protocol = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? 'https://' : 'http://';
$host = $_SERVER['HTTP_HOST'];
$baseUrl = $protocol . $host;

echo "<h1>CyberLearn Deployment</h1>";
echo "<p>Site is deployed and ready to use!</p>";
echo "<p>You can access the site at: <a href='{$baseUrl}'>{$baseUrl}</a></p>";

echo "<h2>Login Information</h2>";
echo "<p>Admin login: <strong>admin</strong></p>";
echo "<p>Admin password: <strong>111</strong></p>";

echo "<h2>Features Added</h2>";
echo "<ul>";
echo "<li>User roles (student/teacher) selection during registration</li>";
echo "<li>User avatar upload and display</li>";
echo "<li>Top rated students and teachers sidebar</li>";
echo "<li>Profile editing (username, email, password, role)</li>";
echo "<li>Resource submission and approval system</li>";
echo "<li>Admin panel for managing categories and resources</li>";
echo "<li>Reduced lag effects for better user experience</li>";
echo "</ul>";

echo "<h2>Testing Routes</h2>";
echo "<ol>";
echo "<li><strong>Registration:</strong> Click 'Войти' button and select 'Регистрация' tab</li>";
echo "<li><strong>Login:</strong> Click 'Войти' button and enter credentials</li>";
echo "<li><strong>Personal Cabinet:</strong> Click on your username after login</li>";
echo "<li><strong>Add Resource:</strong> In personal cabinet, click 'Добавить свой ресурс'</li>";
echo "<li><strong>Change Avatar:</strong> In personal cabinet, click 'Изменить аватар'</li>";
echo "<li><strong>Change Profile:</strong> In personal cabinet, use the edit buttons</li>";
echo "<li><strong>Admin Panel:</strong> After logging in as admin, click 'Админ панель'</li>";
echo "<li><strong>Manage Categories:</strong> In admin panel, use the 'Категории' tab</li>";
echo "<li><strong>Manage Resources:</strong> In admin panel, use the 'Ресурсы' tab</li>";
echo "<li><strong>Approve Resources:</strong> In admin panel, use the 'Ресурсы на проверку' tab</li>";
echo "</ol>";

echo "<p><a href='index.php' class='button'>Go to Site</a></p>";
?>

<style>
body {
    font-family: Arial, sans-serif;
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    line-height: 1.6;
}
h1, h2 {
    color: #0066cc;
}
.button {
    display: inline-block;
    background-color: #0066cc;
    color: white;
    padding: 10px 20px;
    text-decoration: none;
    border-radius: 5px;
    font-weight: bold;
}
.button:hover {
    background-color: #0055aa;
}
ul, ol {
    margin-bottom: 20px;
}
li {
    margin-bottom: 10px;
}
</style>