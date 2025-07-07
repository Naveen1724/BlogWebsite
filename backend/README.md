# Blog Website Backend API

A scalable Node.js REST API with MongoDB and JWT authentication for login and signup functionality.

## Features

- 🔐 JWT Authentication
- 📧 User Registration (Signup)
- 🔑 User Login
- 👤 User Profile Management
- 🛡️ Password Hashing with bcrypt
- ✅ Input Validation
- 🚀 Scalable folder structure
- 🔒 Security middleware (Helmet, CORS, Rate Limiting)
- 📝 Error handling

## Folder Structure

```
backend/
├── config/
│   └── database.js          # Database configuration
├── controllers/
│   └── authController.js    # Authentication logic
├── middleware/
│   ├── auth.js             # JWT authentication middleware
│   ├── error.js            # Error handling middleware
│   └── validation.js       # Input validation rules
├── models/
│   └── User.js             # User model schema
├── routes/
│   └── auth.js             # Authentication routes
├── .env                    # Environment variables
├── .env.example           # Environment variables example
├── .gitignore             # Git ignore file
├── package.json           # Dependencies and scripts
└── server.js              # Main server file
```

## Installation

1. Install dependencies:

```bash
npm install
```

2. Set up environment variables:

```bash
cp .env.example .env
```

3. Update `.env` file with your MongoDB URL and JWT secret:

```
PORT=5000
MONGODB_URL=your_mongodb_connection_string_here
JWT_SECRET=your_super_secure_jwt_secret_key_here
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

## Usage

### Development

```bash
npm run dev
```

### Production

```bash
npm start
```

## API Endpoints

### Authentication

#### Register User

- **POST** `/api/auth/signup`
- **Body:**

```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "Password123"
}
```

#### Login User

- **POST** `/api/auth/login`
- **Body:**

```json
{
  "email": "john@example.com",
  "password": "Password123"
}
```

#### Get Profile

- **GET** `/api/auth/profile`
- **Headers:** `Authorization: Bearer <token>`

#### Health Check

- **GET** `/api/health`

## Response Format

### Success Response

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    "user": {
      "id": "user_id",
      "username": "johndoe",
      "email": "john@example.com",
      "role": "user",
      "isActive": true
    },
    "token": "jwt_token_here"
  }
}
```

### Error Response

```json
{
  "success": false,
  "message": "Error message",
  "errors": []
}
```

## Security Features

- Password hashing with bcrypt (12 rounds)
- JWT token authentication
- Input validation and sanitization
- Rate limiting (100 requests per 15 minutes)
- CORS protection
- Helmet security headers
- Environment variables for sensitive data

## Validation Rules

### Signup

- Username: 3-50 characters, alphanumeric and underscores only
- Email: Valid email format
- Password: Minimum 6 characters, must contain uppercase, lowercase, and number

### Login

- Email: Valid email format
- Password: Required field

## Future Enhancements

This scalable structure allows for easy addition of:

- Password reset functionality
- Email verification
- Role-based access control
- Additional user fields
- Social authentication
- API documentation with Swagger
- Unit and integration tests

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a pull request
