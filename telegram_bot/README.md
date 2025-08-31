# CyberLearn Telegram Bot Documentation

## Overview

The CyberLearn Telegram Bot allows users to add educational resources and categories directly through the Telegram messaging platform. This integration enhances the user experience by providing an alternative way to contribute to the resource center.

## Features

- Add new resources with URL, title, category, type, and difficulty level
- Create new categories with name and description
- Admin approval system for submitted resources
- Notification system for resource status updates
- Simple command-based interface

## Setup Instructions

### Prerequisites

- Web server with PHP support
- HTTPS enabled (required for Telegram webhooks)
- MySQL database (shared with the main application)

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

1. Find the bot on Telegram using the token: `8092413671:AAG_tkBYpkd8GKDeXGEA8Fvl7qgDxcAHqL8`
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

## Technical Details

### File Structure

- `config.php` - Bot configuration and constants
- `db_helper.php` - Database interaction functions
- `telegram_api.php` - Telegram API helper functions
- `webhook.php` - Main webhook handler for Telegram updates
- `setup.php` - Setup script for configuring the webhook
- `test_connection.php` - Script to test the Telegram API connection
- `telegram_button.php` - Functions to generate the Telegram button
- `personal_cabinet_integration.php` - Integration with the personal cabinet
- `integration.php` - Main integration file for the web application

### Database Tables

The bot creates the following additional tables:

- `telegram_users` - Stores user state and conversation data
- `telegram_links` - Links Telegram users to website users
- `telegram_resources` - Tracks resources submitted via Telegram

### Webhook Flow

1. Telegram sends updates to the webhook URL
2. `telegram_webhook.php` processes the update
3. Based on the update type and user state, appropriate actions are taken
4. Responses are sent back to the user via the Telegram API

## Troubleshooting

### Common Issues

- **Webhook not working**: Ensure your server has HTTPS enabled and the webhook URL is correct
- **Bot not responding**: Check the bot token and make sure the webhook is set up correctly
- **Database errors**: Verify database connection settings in `config.php`

### Logs

Bot activity is logged in `telegram_bot/bot_log.txt`. Check this file for debugging information.

## Security Considerations

- The bot token is stored in the configuration file and should be kept secure
- Admin commands are protected by checking the user's admin status
- Input validation is performed on all user input

## Future Enhancements

- User authentication via Telegram
- Rich media support for resource submissions
- Analytics and reporting features
- Multi-language support