
import { User, UserRole, AttendanceRecord, LeaveRequest, PayrollRecord, AttendanceStatus, LeaveStatus } from '../types';

const STORAGE_KEYS = {
  USERS: 'dayflow_users',
  ATTENDANCE: 'dayflow_attendance',
  LEAVES: 'dayflow_leaves',
  PAYROLL: 'dayflow_payroll',
  SESSION: 'dayflow_session'
};

const INITIAL_USERS: User[] = [
  {
    id: '1',
    employeeId: 'EMP001',
    firstName: 'System',
    lastName: 'Admin',
    email: 'admin@dayflow.com',
    role: UserRole.ADMIN,
    department: 'Management',
    designation: 'HR Director',
    joiningDate: '2023-01-01',
    salary: 120000,
    avatar: 'https://picsum.photos/seed/admin/200'
  },
  {
    id: '2',
    employeeId: 'EMP002',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@dayflow.com',
    role: UserRole.EMPLOYEE,
    department: 'Engineering',
    designation: 'Senior Developer',
    joiningDate: '2023-03-15',
    salary: 95000,
    avatar: 'https://picsum.photos/seed/john/200'
  }
];

export const mockDb = {
  init: () => {
    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.ATTENDANCE)) {
      localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify([]));
    }
    if (!localStorage.getItem(STORAGE_KEYS.LEAVES)) {
      localStorage.setItem(STORAGE_KEYS.LEAVES, JSON.stringify([]));
    }
    if (!localStorage.getItem(STORAGE_KEYS.PAYROLL)) {
      localStorage.setItem(STORAGE_KEYS.PAYROLL, JSON.stringify([]));
    }
  },

  getUsers: (): User[] => JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]'),
  saveUsers: (users: User[]) => localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users)),

  getAttendance: (): AttendanceRecord[] => JSON.parse(localStorage.getItem(STORAGE_KEYS.ATTENDANCE) || '[]'),
  saveAttendance: (records: AttendanceRecord[]) => localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(records)),

  getLeaves: (): LeaveRequest[] => JSON.parse(localStorage.getItem(STORAGE_KEYS.LEAVES) || '[]'),
  saveLeaves: (leaves: LeaveRequest[]) => localStorage.setItem(STORAGE_KEYS.LEAVES, JSON.stringify(leaves)),

  getPayroll: (): PayrollRecord[] => JSON.parse(localStorage.getItem(STORAGE_KEYS.PAYROLL) || '[]'),
  savePayroll: (payroll: PayrollRecord[]) => localStorage.setItem(STORAGE_KEYS.PAYROLL, JSON.stringify(payroll)),

  getSession: (): User | null => {
    const session = localStorage.getItem(STORAGE_KEYS.SESSION);
    return session ? JSON.parse(session) : null;
  },
  setSession: (user: User | null) => {
    if (user) localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(user));
    else localStorage.removeItem(STORAGE_KEYS.SESSION);
  }
};
