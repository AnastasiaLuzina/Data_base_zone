<?php
require_once __DIR__ . '/config.php';

/**
 * Send message to Telegram chat
 * 
 * @param int $chat_id Telegram chat ID
 * @param string $text Message text
 * @param array $reply_markup Optional reply markup
 * @return array Response from Telegram API
 */
function sendTelegramMessage($chat_id, $text, $reply_markup = null) {
    $url = "https://api.telegram.org/bot" . BOT_TOKEN . "/sendMessage";
    
    $data = [
        'chat_id' => $chat_id,
        'text' => $text,
        'parse_mode' => 'HTML'
    ];
    
    if ($reply_markup !== null) {
        $data['reply_markup'] = json_encode($reply_markup);
    }
    
    return makeRequest($url, $data);
}

/**
 * Send inline keyboard to Telegram chat
 * 
 * @param int $chat_id Telegram chat ID
 * @param string $text Message text
 * @param array $buttons Array of buttons
 * @return array Response from Telegram API
 */
function sendInlineKeyboard($chat_id, $text, $buttons) {
    $keyboard = [
        'inline_keyboard' => $buttons
    ];
    
    return sendTelegramMessage($chat_id, $text, $keyboard);
}

/**
 * Edit message text
 * 
 * @param int $chat_id Telegram chat ID
 * @param int $message_id Message ID
 * @param string $text New message text
 * @param array $reply_markup Optional reply markup
 * @return array Response from Telegram API
 */
function editMessageText($chat_id, $message_id, $text, $reply_markup = null) {
    $url = "https://api.telegram.org/bot" . BOT_TOKEN . "/editMessageText";
    
    $data = [
        'chat_id' => $chat_id,
        'message_id' => $message_id,
        'text' => $text,
        'parse_mode' => 'HTML'
    ];
    
    if ($reply_markup !== null) {
        $data['reply_markup'] = json_encode($reply_markup);
    }
    
    return makeRequest($url, $data);
}

/**
 * Answer callback query
 * 
 * @param string $callback_query_id Callback query ID
 * @param string $text Text to show to user
 * @param bool $show_alert Whether to show as alert
 * @return array Response from Telegram API
 */
function answerCallbackQuery($callback_query_id, $text = '', $show_alert = false) {
    $url = "https://api.telegram.org/bot" . BOT_TOKEN . "/answerCallbackQuery";
    
    $data = [
        'callback_query_id' => $callback_query_id,
        'text' => $text,
        'show_alert' => $show_alert
    ];
    
    return makeRequest($url, $data);
}

/**
 * Set webhook for Telegram bot
 * 
 * @param string $url Webhook URL
 * @return array Response from Telegram API
 */
function setWebhook($url) {
    $api_url = "https://api.telegram.org/bot" . BOT_TOKEN . "/setWebhook";
    
    $data = [
        'url' => $url,
        'allowed_updates' => json_encode(['message', 'callback_query'])
    ];
    
    return makeRequest($api_url, $data);
}

/**
 * Get webhook info
 * 
 * @return array Response from Telegram API
 */
function getWebhookInfo() {
    $url = "https://api.telegram.org/bot" . BOT_TOKEN . "/getWebhookInfo";
    return makeRequest($url);
}

/**
 * Delete webhook
 * 
 * @return array Response from Telegram API
 */
function deleteWebhook() {
    $url = "https://api.telegram.org/bot" . BOT_TOKEN . "/deleteWebhook";
    return makeRequest($url);
}

/**
 * Make HTTP request to Telegram API
 * 
 * @param string $url API URL
 * @param array $data Request data
 * @return array Response from Telegram API
 */
function makeRequest($url, $data = []) {
    $options = [
        'http' => [
            'header' => "Content-type: application/x-www-form-urlencoded\r\n",
            'method' => 'POST',
            'content' => http_build_query($data)
        ]
    ];
    
    $context = stream_context_create($options);
    $response = file_get_contents($url, false, $context);
    
    if ($response === false) {
        error_log("Error making request to Telegram API: " . error_get_last()['message']);
        return ['ok' => false, 'error' => 'Failed to make request'];
    }
    
    return json_decode($response, true);
}

/**
 * Create keyboard with categories
 * 
 * @param array $categories List of categories
 * @param string $callback_prefix Prefix for callback data
 * @return array Keyboard buttons
 */
function createCategoryKeyboard($categories, $callback_prefix = 'category') {
    $keyboard = [];
    $row = [];
    
    foreach ($categories as $category) {
        $row[] = [
            'text' => $category['name'],
            'callback_data' => $callback_prefix . ':' . $category['id']
        ];
        
        // Create a new row after every 2 buttons
        if (count($row) == 2) {
            $keyboard[] = $row;
            $row = [];
        }
    }
    
    // Add any remaining buttons
    if (!empty($row)) {
        $keyboard[] = $row;
    }
    
    // Add "Add New Category" button
    $keyboard[] = [
        [
            'text' => '➕ Add New Category',
            'callback_data' => 'new_category'
        ]
    ];
    
    return $keyboard;
}

/**
 * Create keyboard with resource types
 * 
 * @return array Keyboard buttons
 */
function createResourceTypeKeyboard() {
    global $RESOURCE_TYPES;
    
    $keyboard = [];
    $row = [];
    
    foreach ($RESOURCE_TYPES as $type) {
        $row[] = [
            'text' => ucfirst($type),
            'callback_data' => 'type:' . $type
        ];
        
        // Create a new row after every 2 buttons
        if (count($row) == 2) {
            $keyboard[] = $row;
            $row = [];
        }
    }
    
    // Add any remaining buttons
    if (!empty($row)) {
        $keyboard[] = $row;
    }
    
    return $keyboard;
}

/**
 * Create keyboard with difficulty levels
 * 
 * @return array Keyboard buttons
 */
function createDifficultyLevelKeyboard() {
    global $DIFFICULTY_LEVELS;
    
    $keyboard = [];
    $row = [];
    
    foreach ($DIFFICULTY_LEVELS as $level) {
        $row[] = [
            'text' => ucfirst($level),
            'callback_data' => 'difficulty:' . $level
        ];
    }
    
    $keyboard[] = $row;
    
    return $keyboard;
}

/**
 * Create keyboard for admin approval
 * 
 * @param int $resource_id Resource ID
 * @return array Keyboard buttons
 */
function createApprovalKeyboard($resource_id) {
    return [
        [
            [
                'text' => '✅ Approve',
                'callback_data' => 'approve:' . $resource_id
            ],
            [
                'text' => '❌ Reject',
                'callback_data' => 'reject:' . $resource_id
            ]
        ]
    ];
}

/**
 * Log bot activity
 * 
 * @param string $message Log message
 * @param array $data Additional data
 */
function logBotActivity($message, $data = []) {
    $log_file = __DIR__ . '/bot_log.txt';
    $timestamp = date('Y-m-d H:i:s');
    $log_entry = "[$timestamp] $message";
    
    if (!empty($data)) {
        $log_entry .= " - " . json_encode($data);
    }
    
    $log_entry .= "\n";
    
    file_put_contents($log_file, $log_entry, FILE_APPEND);
}
?>