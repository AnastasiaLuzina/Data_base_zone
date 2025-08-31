# CyberLearn Resource Center with Telegram Bot Integration

This project enhances the CyberLearn Resource Center with a Telegram bot integration, allowing users to add and find educational resources through the Telegram messaging platform.

## Features

- **Resource Submission via Telegram**: Users can submit resources (URLs, titles, categories) directly through Telegram
- **Category Management**: Create new categories via Telegram
- **Admin Approval System**: Administrators receive notifications about new submissions and can approve/reject them
- **User Notifications**: Users receive updates about the status of their submissions
- **Web Integration**: Seamless integration with the existing web application

## Setup Instructions

### Prerequisites

- Web server with PHP and MySQL
- HTTPS enabled (required for Telegram webhooks)
- Telegram bot token (already configured: `8092413671:AAG_tkBYpkd8GKDeXGEA8Fvl7qgDxcAHqL8`)

### Installation

1. The bot files are already included in the `telegram_bot` directory
2. Access the admin panel in the CyberLearn web application
3. Go to the "Telegram Bot" tab
4. Click "Configure Webhook" and enter your server's URL:
   ```
   https://your-domain.com/telegram_webhook.php
   ```
5. Test the connection using the "Test Connection" button

### Admin Setup

To receive notifications about new resource submissions:

1. Find the bot on Telegram using the token
2. Start a chat with the bot by sending `/start`
3. Send the command `/setadmin` to register yourself as an admin
4. You will now receive notifications about new resource submissions

## User Guide

### Available Commands

- `/start` - Begin interaction with the bot
- `/help` - Show available commands and instructions
- `/add` - Start the process of adding a new resource
- `/category` - Start the process of adding a new category
- `/cancel` - Cancel the current operation

### Adding a Resource

1. Send `/add` to the bot
2. Enter the resource URL when prompted
3. Enter a title for the resource
4. Select a category from the list (or create a new one)
5. Select the resource type (course, video, article, book)
6. Select the difficulty level (easy, medium, pro)
7. The resource will be submitted for admin approval

### Adding a Category

1. Send `/category` to the bot
2. Enter the category name when prompted
3. Enter a description for the category (or send 'skip' to skip)
4. The category will be created immediately

## Testing

You can test the Telegram bot integration by accessing:

```
/telegram_bot/test.php
```

This page will check:
- Bot token configuration
- Database tables setup
- Webhook status
- Admin configuration

## File Structure

- `telegram_bot/` - Main directory for bot files
  - `config.php` - Bot configuration and constants
  - `db_helper.php` - Database interaction functions
  - `telegram_api.php` - Telegram API helper functions
  - `webhook.php` - Main webhook handler for Telegram updates
  - `setup.php` - Setup script for configuring the webhook
  - `test_connection.php` - Script to test the Telegram API connection
  - `telegram_button.php` - Functions to generate the Telegram button
  - `personal_cabinet_integration.php` - Integration with the personal cabinet
  - `integration.php` - Main integration file for the web application
  - `test.php` - Test script to verify the bot setup
  - `README.md` - Detailed documentation

- `telegram_webhook.php` - Entry point for Telegram webhook
- `telegram_setup.php` - Admin interface for setting up the webhook

## Troubleshooting

### Common Issues

- **Webhook not working**: Ensure your server has HTTPS enabled and the webhook URL is correct
- **Bot not responding**: Check the bot token and make sure the webhook is set up correctly
- **Database errors**: Verify database connection settings in `config.php`

### Logs

Bot activity is logged in `telegram_bot/bot_log.txt`. Check this file for debugging information.