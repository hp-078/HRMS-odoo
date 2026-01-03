import { mockDb } from './mockDb';
import { User, UserRole, AttendanceRecord, LeaveRequest, AttendanceStatus, LeaveStatus } from '../types';

const BASE_URL = 'http://localhost:5000/api';

const handleFetch = async (url: string, options?: RequestInit) => {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      let message = 'Server error';
      try {
        const err = await response.json();
        message = err.message || message;
      } catch (e) {}
      throw new Error(message);
    }
    return await response.json();
  } catch (err: any) {
    if (err.name === 'TypeError' || err.message === 'Failed to fetch') {
      throw new Error('BACKEND_DISCONNECTED');
    }
    throw err;
  }
};

export const api = {
  checkConnection: async (): Promise<boolean> => {
    try {
      const response = await fetch(`${BASE_URL}/employees`, { method: 'HEAD' });
      return response.ok;
    } catch {
      return false;
    }
  },

  login: async (email: string): Promise<User> => {
    try {
      const user = await handleFetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      mockDb.setSession(user);
      return user;
    } catch (err: any) {
      if (err.message === 'BACKEND_DISCONNECTED') {
        const users = mockDb.getUsers();
        const existing = users.find(u => u.email === email);
        if (existing) {
          mockDb.setSession(existing);
          return existing;
        }
        throw new Error('Database connection failed. Is node server/server.js running?');
      }
      throw err;
    }
  },

  signUp: async (userData: Partial<User>): Promise<User> => {
    try {
      const newUser = await handleFetch(`${BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      mockDb.setSession(newUser);
      return newUser;
    } catch (err: any) {
      if (err.message === 'BACKEND_DISCONNECTED') {
        const users = mockDb.getUsers();
        const newUser: User = {
          id: Math.random().toString(36).substr(2, 9),
          employeeId: `EMP-${(users.length + 1).toString().padStart(3, '0')}`,
          firstName: userData.email?.split('@')[0] || 'User',
          lastName: userData.role === UserRole.ADMIN ? '(HR)' : '(Employee)',
          email: userData.email || '',
          role: userData.role || UserRole.EMPLOYEE,
          department: userData.role === UserRole.ADMIN ? 'Human Resources' : 'General',
          designation: userData.role === UserRole.ADMIN ? 'HR Manager' : 'Employee Member',
          joiningDate: new Date().toISOString().split('T')[0],
          salary: userData.role === UserRole.ADMIN ? 95000 : 50000,
          avatar: `https://ui-avatars.com/api/?name=${userData.email?.split('@')[0]}&background=714B67&color=fff`,
          ...userData
        };
        users.push(newUser);
        mockDb.saveUsers(users);
        mockDb.setSession(newUser);
        return newUser;
      }
      throw err;
    }
  },

  logout: () => {
    mockDb.setSession(null);
  },

  getEmployees: async (): Promise<User[]> => {
    try {
      return await handleFetch(`${BASE_URL}/employees`);
    } catch (err: any) {
      return mockDb.getUsers();
    }
  },

  addEmployee: async (employeeData: {
    email: string;
    firstName: string;
    lastName: string;
    department: string;
    designation: string;
    salary: number;
    role?: string;
  }): Promise<User> => {
    try {
      return await handleFetch(`${BASE_URL}/employees`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(employeeData)
      });
    } catch (err: any) {
      if (err.message === 'BACKEND_DISCONNECTED') {
        const users = mockDb.getUsers();
        const newUser: User = {
          id: Math.random().toString(36).substr(2, 9),
          employeeId: `EMP-${(users.length + 1).toString().padStart(3, '0')}`,
          firstName: employeeData.firstName,
          lastName: employeeData.lastName,
          email: employeeData.email,
          role: (employeeData.role as UserRole) || UserRole.EMPLOYEE,
          department: employeeData.department,
          designation: employeeData.designation,
          joiningDate: new Date().toISOString().split('T')[0],
          salary: employeeData.salary,
          avatar: `https://ui-avatars.com/api/?name=${employeeData.firstName}+${employeeData.lastName}&background=017E84&color=fff`
        };
        users.push(newUser);
        mockDb.saveUsers(users);
        return newUser;
      }
      throw err;
    }
  },

  updateEmployee: async (id: string, updates: Partial<User>): Promise<User> => {
    try {
      return await handleFetch(`${BASE_URL}/employees/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
    } catch (err: any) {
      const users = mockDb.getUsers();
      const idx = users.findIndex(u => u.id === id);
      if (idx !== -1) {
        users[idx] = { ...users[idx], ...updates };
        mockDb.saveUsers(users);
        return users[idx];
      }
      throw err;
    }
  },

  deleteEmployee: async (id: string): Promise<void> => {
    try {
      await handleFetch(`${BASE_URL}/employees/${id}`, {
        method: 'DELETE'
      });
    } catch (err: any) {
      const users = mockDb.getUsers();
      const filtered = users.filter(u => u.id !== id);
      mockDb.saveUsers(filtered);
    }
  },

  getAttendance: async (userId?: string): Promise<AttendanceRecord[]> => {
    try {
      const url = userId ? `${BASE_URL}/attendance?userId=${userId}` : `${BASE_URL}/attendance`;
      return await handleFetch(url);
    } catch (err: any) {
      const all = mockDb.getAttendance();
      return userId ? all.filter(r => r.userId === userId) : all;
    }
  },

  checkIn: async (userId: string): Promise<AttendanceRecord> => {
    try {
      return await handleFetch(`${BASE_URL}/attendance/check-in`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });
    } catch (err: any) {
      const records = mockDb.getAttendance();
      const today = new Date().toISOString().split('T')[0];
      const newRecord: AttendanceRecord = {
        id: Math.random().toString(36).substr(2, 9),
        userId,
        date: today,
        checkIn: new Date().toLocaleTimeString(),
        status: AttendanceStatus.PRESENT
      };
      records.push(newRecord);
      mockDb.saveAttendance(records);
      return newRecord;
    }
  },

  checkOut: async (userId: string): Promise<AttendanceRecord> => {
    try {
      return await handleFetch(`${BASE_URL}/attendance/check-out`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });
    } catch (err: any) {
      const records = mockDb.getAttendance();
      const today = new Date().toISOString().split('T')[0];
      const record = records.find(r => r.userId === userId && r.date === today);
      if (record) {
        record.checkOut = new Date().toLocaleTimeString();
        mockDb.saveAttendance(records);
        return record;
      }
      throw new Error('No check-in record found for today');
    }
  },

  getLeaves: async (userId?: string): Promise<LeaveRequest[]> => {
    try {
      const url = userId ? `${BASE_URL}/leaves?userId=${userId}` : `${BASE_URL}/leaves`;
      return await handleFetch(url);
    } catch (err: any) {
      return mockDb.getLeaves().filter(l => !userId || l.userId === userId);
    }
  },

  applyLeave: async (request: Omit<LeaveRequest, 'id' | 'status' | 'appliedDate'>): Promise<LeaveRequest> => {
    try {
      return await handleFetch(`${BASE_URL}/leaves`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request)
      });
    } catch (err: any) {
      const leaves = mockDb.getLeaves();
      const newLeave: LeaveRequest = {
        ...request,
        id: Math.random().toString(36).substr(2, 9),
        status: LeaveStatus.PENDING,
        appliedDate: new Date().toISOString().split('T')[0]
      };
      leaves.push(newLeave);
      mockDb.saveLeaves(leaves);
      return newLeave;
    }
  },

  updateLeaveStatus: async (id: string, status: LeaveStatus, comment?: string): Promise<LeaveRequest> => {
    try {
      return await handleFetch(`${BASE_URL}/leaves/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, adminComment: comment })
      });
    } catch (err: any) {
      const leaves = mockDb.getLeaves();
      const idx = leaves.findIndex(l => l.id === id);
      if (idx !== -1) {
        leaves[idx].status = status;
        leaves[idx].adminComment = comment;
        mockDb.saveLeaves(leaves);
        return leaves[idx];
      }
      throw err;
    }
  }
};