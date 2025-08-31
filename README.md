# CyberLearn - Cyberpunk Programming Hub

CyberLearn is a cyberpunk-themed educational platform for programming resources. This project provides a visually engaging interface for users to discover and share programming resources across various categories.

## Features

### User Features
- **User Authentication**: Register and login system
- **Personal Cabinet**: User profile with stats and preferences
- **Resource Browsing**: Browse resources by categories and goals
- **Resource Submission**: Users can submit their own resources for approval
- **Favorites**: Save and manage favorite resources

### Admin Features
- **Admin Panel**: Secure admin interface (login: admin, password: 111)
- **Category Management**: Add and delete resource categories
- **Resource Management**: Add, edit, and delete resources
- **Resource Approval System**: Review and approve/reject user-submitted resources
- **User Notification System**: Notify users about their resource submission status

## Database Structure

### Users Table
- `id`: User ID (Primary Key)
- `username`: Username (Unique)
- `password`: Hashed password
- `email`: User email (Optional)
- `created_at`: Account creation timestamp
- `is_admin`: Admin status flag

### Categories Table
- `id`: Category ID (Primary Key)
- `name`: Category name (Unique)
- `description`: Category description
- `created_at`: Creation timestamp

### Resources Table
- `id`: Resource ID (Primary Key)
- `link`: Resource URL
- `title`: Resource title
- `category_id`: Foreign key to Categories table
- `resource_type`: Type (course, video, article, book)
- `difficulty_level`: Difficulty (easy, medium, pro)
- `added_by`: Username or email of the user who added the resource
- `status`: Status (pending, approved, rejected)
- `created_at`: Creation timestamp

### Notifications Table
- `id`: Notification ID (Primary Key)
- `user_id`: Foreign key to Users table
- `message`: Notification message
- `is_read`: Read status flag
- `created_at`: Creation timestamp

## API Endpoints

### Authentication
- `POST /api/login.php`: User login
- `POST /api/register.php`: User registration
- `GET /api/logout.php`: User logout
- `GET /api/check_session.php`: Check current session status

### Categories
- `GET /api/categories.php`: Get all categories
- `POST /api/categories.php`: Add new category (admin only)
- `DELETE /api/categories.php?id={id}`: Delete category (admin only)

### Resources
- `GET /api/resources.php`: Get all resources
- `GET /api/resources.php?status={status}`: Get resources by status
- `GET /api/resources.php?category_id={id}`: Get resources by category
- `POST /api/resources.php`: Add new resource
- `PUT /api/resources.php`: Update resource status (admin only)
- `DELETE /api/resources.php?id={id}`: Delete resource (admin only)

### Notifications
- `GET /api/notifications.php`: Get user notifications
- `GET /api/notifications.php?unread_only=true`: Get only unread notifications
- `PUT /api/notifications.php`: Mark notification as read

## Setup Instructions

1. Place all files on a PHP-enabled web server
2. Make sure the server has MySQL/MariaDB installed
3. Update database configuration in `db/config.php` if needed
4. Access the website through a browser
5. The database will be automatically initialized on first access
6. Default admin credentials: username `admin`, password `111`

## Technologies Used

- HTML5, CSS3, JavaScript
- PHP for backend processing
- MySQL/MariaDB for database
- Cyberpunk-themed UI with glitch effects and animations

## License

This project is for educational purposes only.