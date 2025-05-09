
# Project Title: **User Authentication API with JWT and Email Verification**

## Overview

This is a user authentication backend API built using **Node.js**, **Express**, **MongoDB**, and **JWT** for secure authentication. The API supports various features such as user registration, login, email verification, password reset, and more.

## Features

- **User Registration**: Allows users to register with email and password.
- **Login**: Authenticated login via JWT tokens.
- **Email Verification**: Sends verification emails for user confirmation.
- **Forgot Password**: Allows users to request password reset via email.
- **Reset Password**: Allows users to reset their password after verification.
- **Logout**: Logs users out by clearing the JWT token.
- **Protected Routes**: Protects certain routes using middleware to verify JWT tokens.

## Technologies Used

- **Node.js**: Backend JavaScript runtime.
- **Express.js**: Web framework for Node.js.
- **MongoDB**: NoSQL database for storing user data.
- **JWT (JSON Web Tokens)**: For authentication and token-based authorization.
- **Bcrypt.js**: For securely hashing and comparing passwords.
- **Nodemailer**: For sending email verification and reset password emails.
- **Dotenv**: For managing environment variables.
- **Crypto**: For generating random tokens for verification and password reset.
- **Postman**: For testing API routes.

## Project Structure

```
├── controllers/
│   ├── user.controller.js         # Handles user registration, login, email verification, etc.
├── middleware/
│   ├── user.middleware.js         # JWT verification and user auth middleware
├── models/
│   ├── user.model.js             # Mongoose User schema
├── routes/
│   ├── user.routes.js            # Routes for user authentication (register, login, etc.)
├── .gitignore                    # Git ignore file
├── .env                           # Environment variables
├── index.js                         # Main entry point of the server
├── utils/
│   ├── db.js                         # MongoDB connection setup
└── package.json                   # Project dependencies and scripts
```

## Setup and Installation

Follow these steps to get the project up and running locally.

### 1. Clone the repository

```bash
git clone https://github.com/Dikshant-Koriwar/backend-auth-user.git
cd auth-user
```

### 2. Install dependencies

Make sure you have **Node.js** installed on your machine. Then, run the following command to install the required dependencies.

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory and add the following environment variables:

```bash
MONGO_URL=<your-mongo-db-connection-string>
JWT_SECRET=<your-jwt-secret-key>
BASE_URL=http://localhost:3000   # Or your base URL if deployed
MAILTRAP_HOST=<your-mailtrap-host>
MAILTRAP_USERNAME=<your-mailtrap-username>
MAILTRAP_PASSWORD=<your-mailtrap-password>
MAILTRAP_SENDER_EMAIL=<your-sender-email>
```

Make sure you replace the values with your actual configuration, especially for **MongoDB** and **Mailtrap**.

### 4. Start the Server

To start the application locally, run:

```bash
npm start
```

By default, the server will run on **http://localhost:3000**.

### 5. Testing Routes in Postman

You can test the following API routes using **Postman**:

1. **POST /api/v1/users/register**: Register a new user with `name`, `email`, and `password`.
2. **POST /api/v1/users/login**: Login with `email` and `password` to receive a JWT token.
3. **GET /api/v1/users/me**: Get currently logged-in user’s profile (requires JWT token in the `Authorization` header).
4. **GET /api/v1/users/verify/:token**: Verify user email with the token sent in the registration email.
5. **GET /api/v1/users/logout**: Logout the user by clearing the JWT token cookie.
6. **POST /api/v1/users/forgot-password**: Request a password reset link via email.
7. **POST /api/v1/users/reset-password/:token**: Reset the password using the token from the reset email.

### Example Requests

#### 1. Register User
- **Method**: `POST`
- **URL**: `http://localhost:3000/api/v1/users/register`
- **Body (JSON)**:
    ```json
    {
      "name": "John Doe",
      "email": "john.doe@example.com",
      "password": "password123"
    }
    ```

#### 2. Login User
- **Method**: `POST`
- **URL**: `http://localhost:3000/api/v1/users/login`
- **Body (JSON)**:
    ```json
    {
      "email": "john.doe@example.com",
      "password": "password123"
    }
    ```

#### 3. Get Logged-in User Info (Protected Route)
- **Method**: `GET`
- **URL**: `http://localhost:3000/api/v1/users/me`
- **Headers**: 
    ```json
    {
      "Authorization": "Bearer <JWT_TOKEN>"
    }
    ```

## Error Handling

The API will return the appropriate status code and message for different error situations such as invalid input, user not found, authentication errors, etc.

Example of an error response:

```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

## Contributing

Feel free to fork this repository, submit issues, and open pull requests for improvements. All contributions are welcome.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Let me know if you need any adjustments to the README or if you want to add more details to the sections!