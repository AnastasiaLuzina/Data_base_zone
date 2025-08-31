<?php
// Enable error reporting for debugging
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Include required files
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/telegram_api.php';

// Set content type to JSON
header('Content-Type: application/json');

// Test connection to Telegram API
try {
    // Get bot info
    $url = "https://api.telegram.org/bot" . BOT_TOKEN . "/getMe";
    $response = file_get_contents($url);
    
    if ($response === false) {
        echo json_encode([
            'success' => false,
            'message' => 'Failed to connect to Telegram API: ' . error_get_last()['message']
        ]);
        exit;
    }
    
    $data = json_decode($response, true);
    
    if (!$data['ok']) {
        echo json_encode([
            'success' => false,
            'message' => 'Telegram API error: ' . ($data['description'] ?? 'Unknown error')
        ]);
        exit;
    }
    
    // Get webhook info
    $webhook_info = getWebhookInfo();
    
    echo json_encode([
        'success' => true,
        'bot_info' => $data['result'],
        'webhook_info' => $webhook_info['result'] ?? null
    ]);
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Exception: ' . $e->getMessage()
    ]);
}
?>