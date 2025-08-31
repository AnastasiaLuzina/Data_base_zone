<?php
// Include required files
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/personal_cabinet_integration.php';

/**
 * Initialize Telegram bot integration
 */
function initTelegramBotIntegration() {
    // Register output buffer to modify page content
    ob_start('processTelegramIntegration');
}

/**
 * Process page content for Telegram integration
 * 
 * @param string $content Page content
 * @return string Modified content
 */
function processTelegramIntegration($content) {
    // Check if this is a personal cabinet page
    if (strpos($content, 'personal-cabinet') !== false) {
        $content = addTelegramIntegration($content);
    }
    
    return $content;
}

// Initialize the integration
initTelegramBotIntegration();
?>