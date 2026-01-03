
import React, { useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { api } from '../services/api';

const EmployeeManagement: React.FC = () => {
  const [employees, setEmployees] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const data = await api.getEmployees();
      setEmployees(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredEmployees = employees.filter(emp => 
    `${emp.firstName} ${emp.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-mainText">Employee Management</h1>
          <p className="text-mutedText">Manage workforce directory and access.</p>
        </div>
        <button className="bg-secondary text-white px-6 py-3 rounded-custom font-semibold">+ Add New Employee</button>
      </div>

      <div className="bg-white rounded-custom custom-shadow overflow-hidden">
        <div className="p-6 border-b border-borders flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <span className="absolute left-4 top-3.5 opacity-40">🔍</span>
            <input 
              type="text" 
              placeholder="Search by name, ID or department..." 
              className="w-full bg-softBg border border-borders pl-10 pr-4 py-3 rounded-custom outline-none focus:ring-1 ring-primary/20"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-2">
            <button className="px-4 py-2 bg-softBg border border-borders text-sm rounded-custom">Filter</button>
            <button className="px-4 py-2 bg-softBg border border-borders text-sm rounded-custom">Sort</button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-softBg text-mutedText text-xs uppercase tracking-wider font-bold">
                <th className="px-6 py-4">Employee</th>
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">Department</th>
                <th className="px-6 py-4">Designation</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Joining Date</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-borders">
              {filteredEmployees.map((emp) => (
                <tr key={emp.id} className="hover:bg-softBg transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <img src={emp.avatar || `https://ui-avatars.com/api/?name=${emp.firstName}+${emp.lastName}&background=714B67&color=fff`} className="w-10 h-10 rounded-full" alt="User" />
                      <div>
                        <p className="font-bold text-mainText text-sm">{emp.firstName} {emp.lastName}</p>
                        <p className="text-xs text-mutedText">{emp.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-mono text-xs">{emp.employeeId}</td>
                  <td className="px-6 py-4 text-sm">{emp.department}</td>
                  <td className="px-6 py-4 text-sm">{emp.designation}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${emp.role === UserRole.ADMIN ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700'}`}>
                      {emp.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">{emp.joiningDate}</td>
                  <td className="px-6 py-4 text-sm">
                    <button className="text-primary font-semibold hover:underline mr-3">Edit</button>
                    <button className="text-red-600 font-semibold hover:underline">Deactivate</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 bg-softBg border-t border-borders flex justify-between items-center text-xs text-mutedText font-semibold">
          <span>Showing {filteredEmployees.length} of {employees.length} employees</span>
          <div className="flex space-x-1">
            <button className="px-2 py-1 bg-white border border-borders rounded">Prev</button>
            <button className="px-2 py-1 bg-primary text-white rounded">1</button>
            <button className="px-2 py-1 bg-white border border-borders rounded">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeManagement;
