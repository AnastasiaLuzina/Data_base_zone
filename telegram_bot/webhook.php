<?php
// Enable error reporting for debugging
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Include required files
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/db_helper.php';
require_once __DIR__ . '/telegram_api.php';
require_once __DIR__ . '/../resources.php';

// Check if admin_config.php exists and include it
if (file_exists(__DIR__ . '/admin_config.php')) {
    require_once __DIR__ . '/admin_config.php';
}

// Get the incoming update from Telegram
$update = json_decode(file_get_contents('php://input'), true);

// Log the update for debugging
logBotActivity('Received update', $update);

// Process the update
if (isset($update['message'])) {
    // Handle regular messages
    processMessage($update['message']);
} elseif (isset($update['callback_query'])) {
    // Handle callback queries (button clicks)
    processCallbackQuery($update['callback_query']);
} else {
    // Unknown update type
    logBotActivity('Unknown update type', $update);
}

/**
 * Process incoming message
 * 
 * @param array $message Message data
 */
function processMessage($message) {
    $chat_id = $message['chat']['id'];
    $text = $message['text'] ?? '';
    
    // Get user state
    $user_data = getUserState($chat_id);
    $state = $user_data['state'];
    $data = $user_data['data'];
    
    // Process commands
    if (strpos($text, '/') === 0) {
        processCommand($text, $chat_id, $message);
        return;
    }
    
    // Process based on current state
    switch ($state) {
        case STATE_AWAITING_RESOURCE_URL:
            // Validate URL
            if (filter_var($text, FILTER_VALIDATE_URL)) {
                // Save URL and ask for title
                $data['url'] = $text;
                saveUserState($chat_id, STATE_AWAITING_RESOURCE_TITLE, $data);
                sendTelegramMessage($chat_id, "Great! Now please enter a title for this resource:");
            } else {
                sendTelegramMessage($chat_id, "That doesn't look like a valid URL. Please enter a valid URL (starting with http:// or https://):");
            }
            break;
            
        case STATE_AWAITING_RESOURCE_TITLE:
            // Save title and ask for category
            $data['title'] = $text;
            saveUserState($chat_id, STATE_AWAITING_CATEGORY_SELECTION, $data);
            
            // Get categories and create keyboard
            $categories = getAllCategories();
            $keyboard = createCategoryKeyboard($categories);
            
            sendInlineKeyboard($chat_id, "Please select a category for this resource:", $keyboard);
            break;
            
        case STATE_AWAITING_CATEGORY_NAME:
            // Save category name and ask for description
            $data['category_name'] = $text;
            saveUserState($chat_id, STATE_AWAITING_CATEGORY_DESCRIPTION, $data);
            sendTelegramMessage($chat_id, "Please enter a description for this category (or send 'skip' to skip):");
            break;
            
        case STATE_AWAITING_CATEGORY_DESCRIPTION:
            // Save category description and create category
            $description = ($text === 'skip') ? '' : $text;
            $result = addCategoryFromTelegram($data['category_name'], $description);
            
            if ($result['status'] === 'success') {
                sendTelegramMessage($chat_id, "Category '{$data['category_name']}' created successfully!");
                
                // If we were in the middle of adding a resource, continue with that
                if (isset($data['url']) && isset($data['title'])) {
                    saveUserState($chat_id, STATE_AWAITING_CATEGORY_SELECTION, $data);
                    
                    // Get updated categories and create keyboard
                    $categories = getAllCategories();
                    $keyboard = createCategoryKeyboard($categories);
                    
                    sendInlineKeyboard($chat_id, "Please select a category for your resource:", $keyboard);
                } else {
                    // Reset state
                    saveUserState($chat_id, STATE_NONE, []);
                }
            } else {
                sendTelegramMessage($chat_id, "Failed to create category: " . $result['message']);
                // Reset state
                saveUserState($chat_id, STATE_NONE, []);
            }
            break;
            
        default:
            // Unknown state or no state
            sendTelegramMessage($chat_id, "I'm not sure what you want to do. Use /help to see available commands.");
            break;
    }
}

/**
 * Process command
 * 
 * @param string $command Command text
 * @param int $chat_id Chat ID
 * @param array $message Full message data
 */
function processCommand($command, $chat_id, $message) {
    $command = strtolower(explode(' ', $command)[0]); // Get the command part
    
    switch ($command) {
        case '/start':
            $first_name = $message['from']['first_name'] ?? 'there';
            $welcome_message = "Hello, $first_name! 👋\n\n";
            $welcome_message .= "Welcome to the CyberLearn Resource Bot. I can help you add educational resources to our platform.\n\n";
            $welcome_message .= "Available commands:\n";
            $welcome_message .= "/add - Add a new resource\n";
            $welcome_message .= "/category - Add a new category\n";
            $welcome_message .= "/help - Show this help message\n";
            
            sendTelegramMessage($chat_id, $welcome_message);
            
            // Reset user state
            saveUserState($chat_id, STATE_NONE, []);
            break;
            
        case '/help':
            $help_message = "CyberLearn Resource Bot Help:\n\n";
            $help_message .= "/add - Add a new resource\n";
            $help_message .= "/category - Add a new category\n";
            $help_message .= "/help - Show this help message\n";
            $help_message .= "/cancel - Cancel current operation\n";
            
            sendTelegramMessage($chat_id, $help_message);
            break;
            
        case '/add':
            // Start resource addition flow
            saveUserState($chat_id, STATE_AWAITING_RESOURCE_URL, []);
            sendTelegramMessage($chat_id, "Let's add a new resource! Please enter the URL:");
            break;
            
        case '/category':
            // Start category addition flow
            saveUserState($chat_id, STATE_AWAITING_CATEGORY_NAME, []);
            sendTelegramMessage($chat_id, "Let's add a new category! Please enter the category name:");
            break;
            
        case '/cancel':
            // Cancel current operation
            saveUserState($chat_id, STATE_NONE, []);
            sendTelegramMessage($chat_id, "Current operation cancelled.");
            break;
            
        case '/setadmin':
            // Set current user as admin
            if (setAdminChatId($chat_id)) {
                sendTelegramMessage($chat_id, "You have been set as the admin for this bot. You will receive notifications about new resources.");
            } else {
                sendTelegramMessage($chat_id, "Failed to set you as admin.");
            }
            break;
            
        default:
            sendTelegramMessage($chat_id, "Unknown command. Use /help to see available commands.");
            break;
    }
}

/**
 * Process callback query (button clicks)
 * 
 * @param array $callback_query Callback query data
 */
function processCallbackQuery($callback_query) {
    $chat_id = $callback_query['message']['chat']['id'];
    $message_id = $callback_query['message']['message_id'];
    $callback_data = $callback_query['data'];
    $callback_id = $callback_query['id'];
    
    // Get user state
    $user_data = getUserState($chat_id);
    $state = $user_data['state'];
    $data = $user_data['data'];
    
    // Answer callback query to remove loading state
    answerCallbackQuery($callback_id);
    
    // Process callback data
    if (strpos($callback_data, 'category:') === 0) {
        // Category selection
        $category_id = substr($callback_data, 9);
        $data['category_id'] = $category_id;
        
        // Get category name for confirmation
        $category = getCategoryById($category_id);
        $data['category_name'] = $category['name'];
        
        saveUserState($chat_id, STATE_AWAITING_RESOURCE_TYPE, $data);
        
        // Create resource type keyboard
        $keyboard = createResourceTypeKeyboard();
        
        editMessageText($chat_id, $message_id, "Selected category: <b>{$category['name']}</b>\n\nPlease select the resource type:", ['inline_keyboard' => $keyboard]);
    } elseif ($callback_data === 'new_category') {
        // Add new category
        saveUserState($chat_id, STATE_AWAITING_CATEGORY_NAME, $data);
        editMessageText($chat_id, $message_id, "Please enter a name for the new category:");
    } elseif (strpos($callback_data, 'type:') === 0) {
        // Resource type selection
        $resource_type = substr($callback_data, 5);
        $data['resource_type'] = $resource_type;
        
        saveUserState($chat_id, STATE_AWAITING_DIFFICULTY_LEVEL, $data);
        
        // Create difficulty level keyboard
        $keyboard = createDifficultyLevelKeyboard();
        
        editMessageText($chat_id, $message_id, "Selected type: <b>" . ucfirst($resource_type) . "</b>\n\nPlease select the difficulty level:", ['inline_keyboard' => $keyboard]);
    } elseif (strpos($callback_data, 'difficulty:') === 0) {
        // Difficulty level selection
        $difficulty_level = substr($callback_data, 11);
        $data['difficulty_level'] = $difficulty_level;
        
        // We have all the data, add the resource
        $result = addResourceFromTelegram(
            $data['url'],
            $data['title'],
            $data['category_id'],
            $data['resource_type'],
            $data['difficulty_level'],
            $chat_id
        );
        
        if ($result['status'] === 'success') {
            editMessageText($chat_id, $message_id, "Resource added successfully! It will be reviewed by an administrator.");
            
            // Notify admins about new resource
            $admin_chat_ids = getAdminChatIds();
            $resource_id = $result['id'];
            
            foreach ($admin_chat_ids as $admin_chat_id) {
                $admin_message = "New resource submission:\n\n";
                $admin_message .= "Title: <b>{$data['title']}</b>\n";
                $admin_message .= "URL: {$data['url']}\n";
                $admin_message .= "Category: <b>{$data['category_name']}</b>\n";
                $admin_message .= "Type: <b>" . ucfirst($data['resource_type']) . "</b>\n";
                $admin_message .= "Difficulty: <b>" . ucfirst($data['difficulty_level']) . "</b>\n";
                
                $approval_keyboard = createApprovalKeyboard($resource_id);
                sendInlineKeyboard($admin_chat_id, $admin_message, $approval_keyboard);
            }
        } else {
            editMessageText($chat_id, $message_id, "Failed to add resource: " . $result['message']);
        }
        
        // Reset state
        saveUserState($chat_id, STATE_NONE, []);
    } elseif (strpos($callback_data, 'approve:') === 0 || strpos($callback_data, 'reject:') === 0) {
        // Resource approval/rejection
        $parts = explode(':', $callback_data);
        $action = $parts[0];
        $resource_id = $parts[1];
        
        $status = ($action === 'approve') ? 'approved' : 'rejected';
        $result = updateResourceStatus($resource_id, $status);
        
        if ($result['status'] === 'success') {
            editMessageText($chat_id, $message_id, "Resource has been $status.");
            
            // Notify user about status change
            notifyUserAboutResourceStatus($resource_id, $status);
        } else {
            editMessageText($chat_id, $message_id, "Failed to update resource status: " . $result['message']);
        }
    }
}
?>