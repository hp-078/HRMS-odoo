# HRMS Server - MongoDB Atlas Setup

## 🚀 Database Migration to MongoDB Atlas

This server has been migrated to use MongoDB Atlas as the database.

## 📋 Prerequisites

- Node.js installed
- MongoDB Atlas account
- Database credentials

## 🔧 Setup Instructions

### 1. Install Dependencies

Navigate to the server directory and install required packages:

```bash
cd server
npm install
```

### 2. Environment Configuration

The `.env` file has been created with your MongoDB Atlas connection string:

```
MONGODB_URI=mongodb+srv://HRMS:user@123@hrms.kkpnvrx.mongodb.net/?appName=HRMS
PORT=5000
```

⚠️ **Important**: Replace `<db_password>` in the connection string with your actual database password if needed.

### 3. Seed the Database

To populate the database with dummy data, run:

```bash
npm run seed
```

This will:
- Clear existing data
- Create 10 users (1 admin + 9 employees)
- Generate 30 days of attendance records
- Create multiple leave requests

### 4. Start the Server

Development mode (with auto-reload):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The server will run on `http://localhost:5000`

## 👥 Default Users

After seeding, you can login with:

**Admin Account:**
- Email: `admin@dayflow.com`
- Password: `123456`

**Employee Accounts:**
- Email: `john@dayflow.com` (or any other employee email)
- Password: `123456`

## 📊 Database Collections

The database includes three main collections:

1. **Users** (`users`)
   - Employee information
   - Authentication details
   - Role management (ADMIN/EMPLOYEE)

2. **Attendance** (`attendances`)
   - Daily check-in/check-out records
   - Attendance status (PRESENT, LATE, ABSENT, ON_LEAVE)
   - Last 30 days of data

3. **Leaves** (`leaves`)
   - Leave requests
   - Leave types (Annual, Sick, Unpaid)
   - Approval status (PENDING, APPROVED, REJECTED)

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration

### Employees
- `GET /api/employees` - Get all employees
- `PATCH /api/employees/:id` - Update employee

### Attendance
- `GET /api/attendance` - Get attendance records
- `POST /api/attendance/check-in` - Check in
- `POST /api/attendance/check-out` - Check out

### Leaves
- `GET /api/leaves` - Get leave requests
- `POST /api/leaves` - Create leave request
- `PATCH /api/leaves/:id` - Update leave request

## 🛠️ Troubleshooting

### Connection Issues
- Verify your MongoDB Atlas credentials
- Check if your IP is whitelisted in MongoDB Atlas
- Ensure the database user has proper permissions

### Seeding Issues
- Make sure the server is not running when seeding
- Check MongoDB Atlas cluster is active
- Verify network connectivity

## 📝 Sample Data

The seed script creates:
- **10 employees** across different departments (Engineering, Marketing, Sales, Design, etc.)
- **~270 attendance records** (30 days × 9 employees with ~90% attendance rate)
- **25-40 leave requests** with varying statuses

All employees use the default password: `123456`

## 🔐 Security Notes

⚠️ For production use:
1. Change default passwords
2. Use environment variables securely
3. Implement proper password hashing
4. Add JWT authentication
5. Set up proper CORS policies
6. Never commit `.env` files to version control
