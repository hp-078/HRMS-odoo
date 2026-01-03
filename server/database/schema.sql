-- HRMS Database Schema for PostgreSQL

-- Drop existing tables
DROP TABLE IF EXISTS timeoff_requests CASCADE;
DROP TABLE IF EXISTS attendance CASCADE;
DROP TABLE IF EXISTS salary_components CASCADE;
DROP TABLE IF EXISTS employees CASCADE;
DROP TABLE IF EXISTS companies CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Create ENUM types
CREATE TYPE user_role AS ENUM ('admin', 'hr', 'employee');
CREATE TYPE employee_status AS ENUM ('present', 'absent', 'on-leave');
CREATE TYPE attendance_status AS ENUM ('present', 'absent', 'half-day', 'leave');
CREATE TYPE timeoff_type AS ENUM ('paid-time-off', 'sick-leave', 'unpaid-leave');
CREATE TYPE timeoff_status AS ENUM ('pending', 'approved', 'rejected');

-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role user_role DEFAULT 'employee',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Companies table
CREATE TABLE companies (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    logo_url VARCHAR(500),
    admin_user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Employees table
CREATE TABLE employees (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    company_id INTEGER REFERENCES companies(id) ON DELETE CASCADE,
    employee_id VARCHAR(50) UNIQUE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    date_of_birth DATE,
    address TEXT,
    emergency_contact VARCHAR(20),
    job_title VARCHAR(100),
    department VARCHAR(100),
    joining_date DATE,
    profile_picture VARCHAR(500),
    status employee_status DEFAULT 'absent',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Salary Components table
CREATE TABLE salary_components (
    id SERIAL PRIMARY KEY,
    employee_id INTEGER REFERENCES employees(id) ON DELETE CASCADE,
    monthly_wage DECIMAL(10, 2) DEFAULT 0,
    yearly_wage DECIMAL(10, 2) DEFAULT 0,
    working_days INTEGER DEFAULT 22,
    basic_salary DECIMAL(10, 2) DEFAULT 0,
    hra DECIMAL(10, 2) DEFAULT 0,
    standard_allowance DECIMAL(10, 2) DEFAULT 0,
    leave_travel_allowance DECIMAL(10, 2) DEFAULT 0,
    performance_bonus DECIMAL(10, 2) DEFAULT 0,
    fixed_allowance DECIMAL(10, 2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Attendance table
CREATE TABLE attendance (
    id SERIAL PRIMARY KEY,
    employee_id INTEGER REFERENCES employees(id) ON DELETE CASCADE,
    attendance_date DATE NOT NULL,
    check_in TIME,
    check_out TIME,
    work_hours DECIMAL(4, 2) DEFAULT 0,
    extra_hours DECIMAL(4, 2) DEFAULT 0,
    status attendance_status DEFAULT 'absent',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (employee_id, attendance_date)
);

-- Time Off Requests table
CREATE TABLE timeoff_requests (
    id SERIAL PRIMARY KEY,
    employee_id INTEGER REFERENCES employees(id) ON DELETE CASCADE,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    type timeoff_type NOT NULL,
    reason TEXT,
    attachment VARCHAR(500),
    status timeoff_status DEFAULT 'pending',
    approved_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_employees_updated_at BEFORE UPDATE ON employees
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_salary_components_updated_at BEFORE UPDATE ON salary_components
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_attendance_updated_at BEFORE UPDATE ON attendance
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_timeoff_requests_updated_at BEFORE UPDATE ON timeoff_requests
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data

-- Sample Admin User (password: admin123)
INSERT INTO users (email, password, role) VALUES
('admin@company.com', '$2a$10$rI7JZvXvLKvXvXvXvXvXvOHvXvXvXvXvXvXvXvXvXvXvXvXvXvXvX', 'admin'),
('employee@company.com', '$2a$10$rI7JZvXvLKvXvXvXvXvXvOHvXvXvXvXvXvXvXvXvXvXvXvXvXvXvX', 'employee');

-- Sample Company
INSERT INTO companies (name, admin_user_id) VALUES
('Tech Solutions Inc', 1);

-- Sample Employees
INSERT INTO employees (user_id, company_id, employee_id, first_name, last_name, phone, job_title, department, joining_date, status) VALUES
(1, 1, 'EMP001', 'John', 'Doe', '+1234567890', 'CEO', 'Management', '2024-01-01', 'present'),
(2, 1, 'EMP002', 'Jane', 'Smith', '+1234567891', 'Software Engineer', 'Engineering', '2024-02-15', 'present'),
(NULL, 1, 'EMP003', 'Mike', 'Johnson', '+1234567892', 'HR Manager', 'Human Resources', '2024-01-20', 'on-leave'),
(NULL, 1, 'EMP004', 'Sarah', 'Williams', '+1234567893', 'Designer', 'Design', '2024-03-10', 'present'),
(NULL, 1, 'EMP005', 'David', 'Brown', '+1234567894', 'Marketing Manager', 'Marketing', '2024-02-01', 'absent'),
(NULL, 1, 'EMP006', 'Emily', 'Davis', '+1234567895', 'Product Manager', 'Product', '2024-01-15', 'present');

-- Sample Salary Components
INSERT INTO salary_components (employee_id, monthly_wage, yearly_wage, working_days, basic_salary, hra, standard_allowance, leave_travel_allowance, performance_bonus, fixed_allowance) VALUES
(1, 10000.00, 120000.00, 22, 6000.00, 1200.00, 1000.00, 800.00, 600.00, 400.00),
(2, 5000.00, 60000.00, 22, 3000.00, 600.00, 500.00, 400.00, 300.00, 200.00),
(3, 7000.00, 84000.00, 22, 4200.00, 840.00, 700.00, 560.00, 420.00, 280.00),
(4, 4500.00, 54000.00, 22, 2700.00, 540.00, 450.00, 360.00, 270.00, 180.00),
(5, 6000.00, 72000.00, 22, 3600.00, 720.00, 600.00, 480.00, 360.00, 240.00),
(6, 8000.00, 96000.00, 22, 4800.00, 960.00, 800.00, 640.00, 480.00, 320.00);

-- Sample Attendance Records
INSERT INTO attendance (employee_id, attendance_date, check_in, check_out, work_hours, status) VALUES
(1, '2026-01-03', '09:00:00', '18:00:00', 9.0, 'present'),
(2, '2026-01-03', '09:15:00', '18:30:00', 9.25, 'present'),
(4, '2026-01-03', '10:00:00', '19:00:00', 9.0, 'present'),
(6, '2026-01-03', '08:45:00', '17:45:00', 9.0, 'present'),
(1, '2026-01-02', '09:00:00', '18:00:00', 9.0, 'present'),
(2, '2026-01-02', '09:00:00', '18:00:00', 9.0, 'present');

-- Sample Time Off Requests
INSERT INTO timeoff_requests (employee_id, start_date, end_date, type, reason, status) VALUES
(3, '2026-01-03', '2026-01-05', 'paid-time-off', 'Family vacation', 'approved'),
(2, '2026-01-10', '2026-01-12', 'sick-leave', 'Medical appointment', 'pending'),
(4, '2026-01-15', '2026-01-15', 'paid-time-off', 'Personal work', 'pending');
