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
![Login](https://github.com/user-attachments/assets/b348884d-66f7-4ad1-9bac-77613d4e2b10)


### Register Page
![Register](https://github.com/user-attachments/assets/9c880f52-3ed2-43ad-ba46-57be6f34a244)


### Forgot Password Page
![Forgot-Password](https://github.com/user-attachments/assets/5cb2f950-c84b-4c0b-a081-3703a906a5d1)


### Reset Password Page
![Reset-Password](https://github.com/user-attachments/assets/08d935bd-3366-431e-bb8f-6923fce95c9a)


### Dashboard
![Dashboard](https://github.com/user-attachments/assets/430d4435-bb1c-4687-9269-1aa12e8f86f4)


### MySQL Items Table
![mysql-items](https://github.com/user-attachments/assets/298844d8-0d10-42c0-9a66-5460277f5409)


### MySQL Users Table
![mysql-users](https://github.com/user-attachments/assets/1041469c-e8b6-48e3-a29c-9a1041c31e3c)


## Author
Anagha Acharya H R

## Conclusion
This project demonstrates complete MERN-style full-stack development with MySQL integration, secure authentication, and dashboard CRUD functionality.  
It showcases practical backend API development, frontend state management, and database-driven application design suitable for real-world use.
