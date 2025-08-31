<?php
/**
 * Generate HTML for the "Add via Telegram Bot" button
 * 
 * @return string HTML button code
 */
function getTelegramBotButton() {
    // Get bot username from token
    $bot_token = BOT_TOKEN;
    $bot_username = '';
    
    // Extract username from token if possible
    $api_url = "https://api.telegram.org/bot$bot_token/getMe";
    $response = @file_get_contents($api_url);
    
    if ($response) {
        $bot_data = json_decode($response, true);
        if ($bot_data && $bot_data['ok'] && isset($bot_data['result']['username'])) {
            $bot_username = $bot_data['result']['username'];
        }
    }
    
    // If we couldn't get the username, use a generic link
    $telegram_link = $bot_username ? "https://t.me/$bot_username" : "https://t.me/";
    
    // Generate the button HTML
    $button_html = <<<HTML
    <div class="telegram-bot-button">
        <a href="$telegram_link" target="_blank" class="cyber-btn telegram-btn">
            <span class="telegram-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                    <path fill="currentColor" d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18.717-.962 4.394-1.362 5.839-.167.6-.5 1.6-.834 1.6-.334 0-.417-.25-.667-.5-.417-.417-2.084-1.334-2.834-1.917-.834-.667-1.5-1.084-.25-2.25.417-.417 2.25-2.084 2.667-2.5.417-.417.417-.417.25-.417-.167 0-3.667 2.25-4.084 2.5-.417.25-.834.25-1.5.084-.667-.167-1.334-.334-1.334-.5 0-.167.667-.334 1.084-.5.417-.167 2.834-1.167 5.5-2.084 2.667-.917 3.5-1.084 3.834-1.084.334 0 .334.25.334.25s.083.25 0 .417c-.083.167-.084.334-.084.417z"/>
                </svg>
            </span>
            Add via Telegram Bot
        </a>
    </div>
HTML;

    return $button_html;
}

/**
 * Add CSS styles for the Telegram button
 * 
 * @return string CSS styles
 */
function getTelegramButtonStyles() {
    return <<<CSS
    <style>
    .telegram-bot-button {
        margin: 20px 0;
    }
    
    .telegram-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(45deg, #0088cc, #0099cc);
        color: white;
        border: 2px solid #0088cc;
        box-shadow: 0 0 10px rgba(0, 136, 204, 0.7);
        transition: all 0.3s ease;
    }
    
    .telegram-btn:hover {
        background: linear-gradient(45deg, #0099cc, #00aadd);
        box-shadow: 0 0 15px rgba(0, 136, 204, 0.9);
        transform: translateY(-2px);
    }
    
    .telegram-icon {
        margin-right: 10px;
        display: flex;
        align-items: center;
    }
    
    .telegram-icon svg {
        width: 24px;
        height: 24px;
    }
    </style>
CSS;
}
?>