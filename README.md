# MERN Stack Authentication System with MySQL & Dashboard CRUD

## Project Description
This project is a full-stack authentication and dashboard CRUD application built for the CampusPe assignment.  
It allows users to register, log in, reset passwords, and manage personal dashboard items with full create, read, update, and delete operations.  
All data is stored in MySQL, and authentication is handled securely with JWT.

## Features
- User Registration with password hashing
- User Login with JWT token generation
- Forgot Password and Reset Password flow
- Protected user route (`/api/auth/me`)
- Dashboard CRUD operations for user-specific items
- Item status management (`active`, `pending`, `completed`)
- Dashboard statistics (total, active, pending, completed)
- Responsive UI with form validation and loading/error/success states

## Tech Stack
- Frontend: React.js, React Router, Axios, Tailwind CSS
- Backend: Node.js, Express.js
- Database: MySQL (`mysql2`)
- Authentication & Security: JWT, bcryptjs
- Email: Nodemailer

## Project Structure
```text
mern-mysql-auth-crud/
|-- backend/
|   |-- config/
|   |   `-- db.js
|   |-- controllers/
|   |   |-- authController.js
|   |   `-- itemController.js
|   |-- middleware/
|   |   |-- auth.js
|   |   `-- errorHandler.js
|   |-- routes/
|   |   |-- authRoutes.js
|   |   `-- itemRoutes.js
|   |-- .env.example
|   |-- .gitignore
|   |-- database.sql
|   |-- package.json
|   `-- server.js
|-- frontend/
|   |-- src/
|   |   |-- api/
|   |   |-- components/
|   |   |-- context/
|   |   |-- App.jsx
|   |   |-- main.jsx
|   |   `-- index.css
|   |-- .env.example
|   |-- .gitignore
|   |-- package.json
|   `-- vite.config.js
|-- database.sql
|-- screenshots/
`-- README.md
```

## Screenshots
### Login Page
![Login](C:/Users/91797/Documents/New project 2/screenshots/Login.jpeg)

### Register Page
![Register](C:/Users/91797/Documents/New project 2/screenshots/Register.jpeg)

### Forgot Password Page
![Forgot Password](C:/Users/91797/Documents/New project 2/screenshots/Forgot-Password.jpeg)

### Reset Password Page
![Reset Password](C:/Users/91797/Documents/New project 2/screenshots/Reset-Password.jpeg)

### Dashboard
![Dashboard](C:/Users/91797/Documents/New project 2/screenshots/Dashboard.jpeg)

### MySQL Items Table
![MySQL Items](C:/Users/91797/Documents/New project 2/screenshots/mysql-items.jpeg)

### MySQL Users Table
![MySQL Users](C:/Users/91797/Documents/New project 2/screenshots/mysql-users.jpeg)

## Author
Anagha Acharya

## Conclusion
This project demonstrates complete MERN-style full-stack development with MySQL integration, secure authentication, and dashboard CRUD functionality.  
It showcases practical backend API development, frontend state management, and database-driven application design suitable for real-world use.
