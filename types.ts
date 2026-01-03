
export enum UserRole {
  ADMIN = 'ADMIN',
  EMPLOYEE = 'EMPLOYEE'
}

export enum LeaveStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export enum AttendanceStatus {
  PRESENT = 'PRESENT',
  ABSENT = 'ABSENT',
  LATE = 'LATE',
  ON_LEAVE = 'ON_LEAVE'
}

export interface SalaryComponent {
  name: string;
  amount: number;
  percentage: number;
  period: 'month' | 'yearly';
}

export interface SalaryInfo {
  wageType: 'Fixed wage' | 'Hourly wage';
  monthlyWage: number;
  yearlyWage: number;
  workingDaysPerWeek: number;
  components: SalaryComponent[];
}

export interface User {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  department: string;
  designation: string;
  joiningDate: string;
  salary: number;
  salaryInfo?: SalaryInfo;
  dateOfBirth?: string;
  workingAddress?: string;
  nationality?: string;
  personalEmail?: string;
  bankName?: string;
  bankAccount?: string;
  gender?: string;
  maritalStatus?: string;
  dateOfJoining?: string;
  avatar?: string;
  // Added optional password field to support registration and authentication flows
  password?: string;
}

export interface AttendanceRecord {
  id: string;
  userId: string;
  date: string;
  checkIn: string;
  checkOut?: string;
  status: AttendanceStatus;
  location?: string;
}

export interface LeaveRequest {
  id: string;
  userId: string;
  userName: string;
  type: 'Annual' | 'Sick' | 'Unpaid';
  startDate: string;
  endDate: string;
  reason: string;
  status: LeaveStatus;
  appliedDate: string;
  adminComment?: string;
}

export interface PayrollRecord {
  id: string;
  userId: string;
  month: string;
  year: number;
  baseSalary: number;
  allowances: number;
  deductions: number;
  netSalary: number;
  status: 'PAID' | 'PENDING';
}

export interface DashboardStats {
  totalEmployees: number;
  presentToday: number;
  onLeaveToday: number;
  pendingLeaves: number;
}
