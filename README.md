# HRMS - Human Resource Management System

A full-stack HRMS application built with React, Node.js, Express, and MySQL.

## Features

- ✅ User Authentication (Sign In/Sign Up)
- ✅ Employee Management
- ✅ Attendance Tracking
- ✅ Time Off Management
- ✅ Salary Information
- ✅ Profile Management
- ✅ Role-based Access Control (Admin/Employee)

## Tech Stack

**Frontend:**
- React 18
- React Router DOM
- Axios
- CSS3

**Backend:**
- Node.js
- Express.js
- MySQL2
- JWT Authentication
- Bcrypt

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MySQL Server
- npm or yarn

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd HRMS-odoo
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your database credentials and JWT secret.

4. **Set up the database**
   ```bash
   # Login to MySQL
   mysql -u root -p
   
   # Create database
   CREATE DATABASE hrms_db;
   
   # Import schema
   mysql -u root -p hrms_db < server/database/schema.sql
   ```

5. **Start the application**
   ```bash
   # Development mode (both frontend and backend)
   npm run dev
   
   # Or run separately:
   npm run server  # Backend on port 5000
   npm run client  # Frontend on port 3000
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## Default Credentials

**Admin Account:**
- Email: admin@company.com
- Password: admin123

**Employee Account:**
- Email: employee@company.com
- Password: emp123

## Project Structure

```
HRMS-odoo/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── context/       # Context API
│   │   ├── services/      # API services
│   │   ├── styles/        # CSS files
│   │   └── App.js
│   └── package.json
├── server/                # Node.js backend
│   ├── config/           # Configuration files
│   ├── controllers/      # Route controllers
│   ├── middleware/       # Custom middleware
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── database/        # Database schema
│   └── index.js
├── .env                 # Environment variables
├── package.json
└── README.md
```

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register new company/admin
- POST `/api/auth/login` - User login
- GET `/api/auth/me` - Get current user

### Employees
- GET `/api/employees` - Get all employees
- GET `/api/employees/:id` - Get employee by ID
- POST `/api/employees` - Create employee
- PUT `/api/employees/:id` - Update employee
- DELETE `/api/employees/:id` - Delete employee

### Attendance
- GET `/api/attendance` - Get attendance records
- POST `/api/attendance/checkin` - Check in
- POST `/api/attendance/checkout` - Check out
- GET `/api/attendance/employee/:id` - Get employee attendance

### Time Off
- GET `/api/timeoff` - Get time off requests
- POST `/api/timeoff` - Create time off request
- PUT `/api/timeoff/:id/approve` - Approve request
- PUT `/api/timeoff/:id/reject` - Reject request

## License

MIT
