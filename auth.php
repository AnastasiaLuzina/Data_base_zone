<?php
// Include session configuration
require_once dirname(__DIR__) . '/session_config.php';

// Enable error reporting for debugging
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Include database configuration
require_once 'config.php';

/**
 * Register a new user
 * 
 * @param string $username Username
 * @param string $password Password
 * @param string $email Email (optional)
 * @param string $role User role (student or teacher)
 * @return array Result with status and message
 */
function registerUser($username, $password, $email = null, $role = 'student') {
    global $pdo;
    
    try {
        // Check if username already exists
        $stmt = $pdo->prepare("SELECT id FROM users WHERE username = :username");
        $stmt->bindParam(':username', $username);
        $stmt->execute();
        
        if ($stmt->rowCount() > 0) {
            return ['status' => 'error', 'message' => 'Username already exists'];
        }
        
        // Hash password (except for admin user)
        $hashed_password = ($username === 'admin') ? $password : password_hash($password, PASSWORD_DEFAULT);
        
        // Insert new user
        $stmt = $pdo->prepare("INSERT INTO users (username, password, email, role) VALUES (:username, :password, :email, :role)");
        $stmt->bindParam(':username', $username);
        $stmt->bindParam(':password', $hashed_password);
        $stmt->bindParam(':email', $email);
        $stmt->bindParam(':role', $role);
        $stmt->execute();
        
        // Get the new user ID
        $user_id = $pdo->lastInsertId();
        
        // Create initial rating entry for the user
        $stmt = $pdo->prepare("INSERT INTO ratings (user_id, rating) VALUES (:user_id, 0)");
        $stmt->bindParam(':user_id', $user_id);
        $stmt->execute();
        
        return [
            'status' => 'success', 
            'message' => 'User registered successfully',
            'user_id' => $user_id
        ];
    } catch(PDOException $e) {
        error_log("Registration error: " . $e->getMessage());
        return ['status' => 'error', 'message' => 'Registration failed: ' . $e->getMessage()];
    }
}

/**
 * Login a user
 * 
 * @param string $username Username
 * @param string $password Password
 * @return array Result with status and message
 */
function loginUser($username, $password) {
    global $pdo;
    
    try {
        // Get user by username
        $stmt = $pdo->prepare("SELECT id, username, password, email, role, avatar, is_admin FROM users WHERE username = :username");
        $stmt->bindParam(':username', $username);
        $stmt->execute();
        
        if ($stmt->rowCount() == 0) {
            return ['status' => 'error', 'message' => 'Invalid username or password'];
        }
        
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        
        // Special case for admin user
        if ($username === 'admin' && $password === $user['password']) {
            // Set session variables
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['username'] = $user['username'];
            $_SESSION['email'] = $user['email'];
            $_SESSION['role'] = $user['role'] ?? 'admin';
            $_SESSION['avatar'] = $user['avatar'];
            $_SESSION['is_admin'] = 1;
            
            // Log successful login
            error_log("Admin user logged in successfully. Session ID: " . session_id());
            
            return [
                'status' => 'success', 
                'message' => 'Login successful',
                'is_admin' => 1,
                'user' => [
                    'id' => $user['id'],
                    'username' => $user['username'],
                    'email' => $user['email'],
                    'role' => $user['role'] ?? 'admin',
                    'avatar' => $user['avatar']
                ]
            ];
        }
        // Regular password verification
        else if (password_verify($password, $user['password'])) {
            // Set session variables
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['username'] = $user['username'];
            $_SESSION['email'] = $user['email'];
            $_SESSION['role'] = $user['role'];
            $_SESSION['avatar'] = $user['avatar'];
            $_SESSION['is_admin'] = $user['is_admin'];
            
            // Log successful login
            error_log("User {$username} logged in successfully. Session ID: " . session_id());
            
            return [
                'status' => 'success', 
                'message' => 'Login successful',
                'is_admin' => $user['is_admin'],
                'user' => [
                    'id' => $user['id'],
                    'username' => $user['username'],
                    'email' => $user['email'],
                    'role' => $user['role'],
                    'avatar' => $user['avatar']
                ]
            ];
        } else {
            return ['status' => 'error', 'message' => 'Invalid username or password'];
        }
    } catch(PDOException $e) {
        error_log("Login error: " . $e->getMessage());
        return ['status' => 'error', 'message' => 'Login failed: ' . $e->getMessage()];
    }
}

/**
 * Check if user is logged in
 * 
 * @return bool True if logged in, false otherwise
 */
function isLoggedIn() {
    // Log session data for debugging
    error_log("Session data: " . print_r($_SESSION, true));
    return isset($_SESSION['user_id']);
}

/**
 * Check if user is admin
 * 
 * @return bool True if admin, false otherwise
 */
function isAdmin() {
    return isset($_SESSION['is_admin']) && $_SESSION['is_admin'] == 1;
}

/**
 * Logout user
 */
function logoutUser() {
    // Unset all session variables
    $_SESSION = [];
    
    // Destroy the session
    session_destroy();
}

/**
 * Update user profile
 * 
 * @param int $user_id User ID
 * @param array $data Profile data to update
 * @return array Result with status and message
 */
function updateUserProfile($user_id, $data) {
    global $pdo;
    
    try {
        $fields = [];
        $params = [':user_id' => $user_id];
        
        // Build the SET clause for the SQL query
        foreach ($data as $key => $value) {
            if (in_array($key, ['username', 'email', 'role', 'avatar'])) {
                $fields[] = "{$key} = :{$key}";
                $params[":{$key}"] = $value;
            }
        }
        
        if (empty($fields)) {
            return ['status' => 'error', 'message' => 'No valid fields to update'];
        }
        
        $sql = "UPDATE users SET " . implode(', ', $fields) . " WHERE id = :user_id";
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        
        // Update session variables if they exist
        if (isset($_SESSION['user_id']) && $_SESSION['user_id'] == $user_id) {
            foreach ($data as $key => $value) {
                if (in_array($key, ['username', 'email', 'role', 'avatar'])) {
                    $_SESSION[$key] = $value;
                }
            }
        }
        
        return ['status' => 'success', 'message' => 'Profile updated successfully'];
    } catch(PDOException $e) {
        return ['status' => 'error', 'message' => 'Profile update failed: ' . $e->getMessage()];
    }
}

/**
 * Update user password
 * 
 * @param int $user_id User ID
 * @param string $current_password Current password
 * @param string $new_password New password
 * @return array Result with status and message
 */
function updateUserPassword($user_id, $current_password, $new_password) {
    global $pdo;
    
    try {
        // Get user by ID
        $stmt = $pdo->prepare("SELECT password, username FROM users WHERE id = :user_id");
        $stmt->bindParam(':user_id', $user_id);
        $stmt->execute();
        
        if ($stmt->rowCount() == 0) {
            return ['status' => 'error', 'message' => 'User not found'];
        }
        
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        
        // Special case for admin user
        if ($user['username'] === 'admin' && $current_password === $user['password']) {
            $stmt = $pdo->prepare("UPDATE users SET password = :password WHERE id = :user_id");
            $stmt->bindParam(':password', $new_password);
            $stmt->bindParam(':user_id', $user_id);
            $stmt->execute();
            
            return ['status' => 'success', 'message' => 'Password updated successfully'];
        }
        // Regular password verification
        else if (password_verify($current_password, $user['password'])) {
            // Hash new password
            $hashed_password = password_hash($new_password, PASSWORD_DEFAULT);
            
            $stmt = $pdo->prepare("UPDATE users SET password = :password WHERE id = :user_id");
            $stmt->bindParam(':password', $hashed_password);
            $stmt->bindParam(':user_id', $user_id);
            $stmt->execute();
            
            return ['status' => 'success', 'message' => 'Password updated successfully'];
        } else {
            return ['status' => 'error', 'message' => 'Current password is incorrect'];
        }
    } catch(PDOException $e) {
        return ['status' => 'error', 'message' => 'Password update failed: ' . $e->getMessage()];
    }
}

/**
 * Get user by ID
 * 
 * @param int $user_id User ID
 * @return array|bool User data or false if not found
 */
function getUserById($user_id) {
    global $pdo;
    
    try {
        $stmt = $pdo->prepare("SELECT u.*, r.rating FROM users u 
                              LEFT JOIN ratings r ON u.id = r.user_id 
                              WHERE u.id = :user_id");
        $stmt->bindParam(':user_id', $user_id);
        $stmt->execute();
        
        return $stmt->fetch(PDO::FETCH_ASSOC);
    } catch(PDOException $e) {
        error_log("Error getting user: " . $e->getMessage());
        return false;
    }
}

/**
 * Get top rated users by role
 * 
 * @param string $role User role (student or teacher)
 * @param int $limit Number of users to return
 * @return array List of top rated users
 */
function getTopRatedUsers($role, $limit = 10) {
    global $pdo;
    
    try {
        $stmt = $pdo->prepare("SELECT u.id, u.username, u.avatar, r.rating 
                              FROM users u 
                              JOIN ratings r ON u.id = r.user_id 
                              WHERE u.role = :role 
                              ORDER BY r.rating DESC 
                              LIMIT :limit");
        $stmt->bindParam(':role', $role);
        $stmt->bindParam(':limit', $limit, PDO::PARAM_INT);
        $stmt->execute();
        
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    } catch(PDOException $e) {
        error_log("Error getting top rated users: " . $e->getMessage());
        return [];
    }
}
?>