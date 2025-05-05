# Marketing Agency Backend

This is the backend server for the Marketing Agency website, built with Node.js, Express, and MongoDB.

## Features

- User authentication (register, login)
- Services management
- Contact form handling with email notifications
- Admin dashboard functionality

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- Gmail account for email notifications

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory with the following variables:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/marketing-agency
JWT_SECRET=your_jwt_secret_key_here
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password
ADMIN_EMAIL=admin@marketingagency.com
NODE_ENV=development
```

3. Start MongoDB server

4. Run the development server:
```bash
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Services
- `GET /api/services` - Get all active services
- `GET /api/services/:id` - Get service by ID
- `GET /api/services/category/:category` - Get services by category
- `POST /api/services` - Create new service (admin only)
- `PUT /api/services/:id` - Update service (admin only)
- `DELETE /api/services/:id` - Deactivate service (admin only)

### Contact
- `POST /api/contact` - Submit contact form
- `GET /api/contact` - Get all contact submissions (admin only)
- `PUT /api/contact/:id` - Update contact status (admin only)

## Environment Variables

- `PORT` - Server port (default: 5000)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT token generation
- `EMAIL_USER` - Gmail account for sending emails
- `EMAIL_PASS` - Gmail app password
- `ADMIN_EMAIL` - Admin email for notifications
- `NODE_ENV` - Environment mode (development/production)

## Security

- Password hashing with bcrypt
- JWT authentication
- Input validation with express-validator
- CORS enabled
- Environment variables for sensitive data

## Error Handling

- Global error handling middleware
- Validation error responses
- Database error handling
- HTTP status codes for different scenarios 