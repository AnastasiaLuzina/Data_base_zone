<?php
// Session configuration
ini_set('session.cookie_httponly', 1);
ini_set('session.use_only_cookies', 1);
ini_set('session.cookie_secure', 0); // Set to 1 if using HTTPS
ini_set('session.cookie_samesite', 'Strict');
ini_set('session.gc_maxlifetime', 86400); // 24 hours
ini_set('session.cookie_lifetime', 86400); // 24 hours

// Start session
session_start();
?>