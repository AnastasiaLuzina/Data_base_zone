<?php
// Include required files
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/telegram_button.php';

/**
 * Add Telegram bot button to personal cabinet
 * 
 * @param string $content Current content
 * @return string Modified content with Telegram button
 */
function addTelegramButtonToPersonalCabinet($content) {
    // Get the Telegram button HTML
    $telegram_button = getTelegramBotButton();
    $telegram_styles = getTelegramButtonStyles();
    
    // Add the button and styles to the content
    $content = str_replace('</head>', $telegram_styles . '</head>', $content);
    
    // Find the position to insert the button (after the "Add Your Resource" button)
    $add_resource_button_pos = strpos($content, 'Add Your Resource');
    
    if ($add_resource_button_pos !== false) {
        // Find the end of the button's parent element
        $button_end_pos = strpos($content, '</div>', $add_resource_button_pos);
        
        if ($button_end_pos !== false) {
            // Insert the Telegram button after the "Add Your Resource" button's parent div
            $content = substr_replace($content, $telegram_button, $button_end_pos + 6, 0);
        }
    }
    
    return $content;
}

/**
 * Add Telegram bot integration to personal cabinet JavaScript
 * 
 * @return string JavaScript code for Telegram integration
 */
function getTelegramIntegrationJS() {
    return <<<JAVASCRIPT
    <script>
    // Telegram Bot Integration
    document.addEventListener('DOMContentLoaded', function() {
        // Check if we're in the personal cabinet
        const personalCabinet = document.querySelector('.personal-cabinet');
        if (!personalCabinet) return;
        
        // Add click handler for Telegram button if it exists
        const telegramBtn = document.querySelector('.telegram-btn');
        if (telegramBtn) {
            telegramBtn.addEventListener('click', function(e) {
                // Track usage of Telegram bot
                console.log('Telegram bot button clicked');
                
                // We don't prevent default here to allow the link to open
            });
        }
    });
    </script>
JAVASCRIPT;
}

/**
 * Add Telegram bot integration to the page
 * 
 * @param string $content Current page content
 * @return string Modified content with Telegram integration
 */
function addTelegramIntegration($content) {
    // Add the Telegram button to personal cabinet
    $content = addTelegramButtonToPersonalCabinet($content);
    
    // Add the JavaScript integration
    $telegram_js = getTelegramIntegrationJS();
    $content = str_replace('</body>', $telegram_js . '</body>', $content);
    
    return $content;
}
?>