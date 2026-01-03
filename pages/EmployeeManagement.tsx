
import React, { useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { api } from '../services/api';

const EmployeeManagement: React.FC = () => {
  const [employees, setEmployees] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showSortModal, setShowSortModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    department: '',
    designation: '',
    salary: '',
    role: 'EMPLOYEE'
  });
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  
  // Filter states
  const [filterDepartment, setFilterDepartment] = useState<string>('');
  const [filterRole, setFilterRole] = useState<string>('');
  const [filterSalaryMin, setFilterSalaryMin] = useState<string>('');
  const [filterSalaryMax, setFilterSalaryMax] = useState<string>('');
  
  // Sort states
  const [sortBy, setSortBy] = useState<'name' | 'id' | 'department' | 'salary' | 'date'>('id');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setFormError('');
  };

  const handleAddEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    // Validation
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.department || !formData.designation || !formData.salary) {
      setFormError('All fields are required');
      return;
    }

    if (!formData.email.includes('@')) {
      setFormError('Please enter a valid email address');
      return;
    }

    if (isNaN(Number(formData.salary)) || Number(formData.salary) <= 0) {
      setFormError('Please enter a valid salary amount');
      return;
    }

    try {
      const newEmployee = await api.addEmployee({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        department: formData.department,
        designation: formData.designation,
        salary: Number(formData.salary),
        role: formData.role
      });

      setEmployees([...employees, newEmployee]);
      setFormSuccess('Employee added successfully!');
      
      // Reset form
      setTimeout(() => {
        setShowAddModal(false);
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          department: '',
          designation: '',
          salary: '',
          role: 'EMPLOYEE'
        });
        setFormSuccess('');
      }, 2000);
    } catch (err: any) {
      setFormError(err.message || 'Failed to add employee');
    }
  };

  const handleDeleteEmployee = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete ${name}?`)) return;

    try {
      await api.deleteEmployee(id);
      setEmployees(employees.filter(emp => emp.id !== id));
    } catch (err: any) {
      alert(err.message || 'Failed to delete employee');
    }
  };

  const handleEditEmployee = (employee: User) => {
    setEditingEmployee(employee);
    setFormData({
      firstName: employee.firstName,
      lastName: employee.lastName,
      email: employee.email,
      department: employee.department,
      designation: employee.designation,
      salary: employee.salary.toString(),
      role: employee.role
    });
    setShowEditModal(true);
    setFormError('');
    setFormSuccess('');
  };

  const handleUpdateEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEmployee) return;

    setFormError('');
    setFormSuccess('');

    // Validation
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.department || !formData.designation || !formData.salary) {
      setFormError('All fields are required');
      return;
    }

    if (!formData.email.includes('@')) {
      setFormError('Please enter a valid email address');
      return;
    }

    if (isNaN(Number(formData.salary)) || Number(formData.salary) <= 0) {
      setFormError('Please enter a valid salary amount');
      return;
    }

    try {
      const updatedEmployee = await api.updateEmployee(editingEmployee.id, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        department: formData.department,
        designation: formData.designation,
        salary: Number(formData.salary),
        role: formData.role as UserRole
      });

      setEmployees(employees.map(emp => emp.id === editingEmployee.id ? updatedEmployee : emp));
      setFormSuccess('Employee updated successfully!');
      
      // Reset form
      setTimeout(() => {
        setShowEditModal(false);
        setEditingEmployee(null);
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          department: '',
          designation: '',
          salary: '',
          role: 'EMPLOYEE'
        });
        setFormSuccess('');
      }, 2000);
    } catch (err: any) {
      setFormError(err.message || 'Failed to update employee');
    }
  };

  const handleApplyFilters = () => {
    setShowFilterModal(false);
  };

  const handleClearFilters = () => {
    setFilterDepartment('');
    setFilterRole('');
    setFilterSalaryMin('');
    setFilterSalaryMax('');
  };

  const handleApplySort = () => {
    setShowSortModal(false);
  };

  // Get unique departments for filter
  const uniqueDepartments = Array.from(new Set(employees.map(emp => emp.department))).sort();

  // Apply filters and search
  const filteredEmployees = employees.filter(emp => {
    // Search filter
    const searchMatch = searchTerm === '' || 
      `${emp.firstName} ${emp.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.designation.toLowerCase().includes(searchTerm.toLowerCase());

    // Department filter
    const deptMatch = filterDepartment === '' || emp.department === filterDepartment;

    // Role filter
    const roleMatch = filterRole === '' || emp.role === filterRole;

    // Salary filter
    const salaryMin = filterSalaryMin === '' ? 0 : Number(filterSalaryMin);
    const salaryMax = filterSalaryMax === '' ? Infinity : Number(filterSalaryMax);
    const salaryMatch = emp.salary >= salaryMin && emp.salary <= salaryMax;

    return searchMatch && deptMatch && roleMatch && salaryMatch;
  });

  // Apply sorting
  const sortedEmployees = [...filteredEmployees].sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case 'name':
        comparison = `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`);
        break;
      case 'id':
        comparison = a.employeeId.localeCompare(b.employeeId);
        break;
      case 'department':
        comparison = a.department.localeCompare(b.department);
        break;
      case 'salary':
        comparison = a.salary - b.salary;
        break;
      case 'date':
        comparison = new Date(a.joiningDate).getTime() - new Date(b.joiningDate).getTime();
        break;
    }

    return sortOrder === 'asc' ? comparison : -comparison;
  });

  const activeFiltersCount = [filterDepartment, filterRole, filterSalaryMin, filterSalaryMax].filter(f => f !== '').length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-mainText">Employee Management</h1>
          <p className="text-mutedText">Manage workforce directory and access.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-secondary text-white px-6 py-3 rounded-custom font-semibold hover:bg-opacity-90 transition"
        >
          + Add New Employee
        </button>
      </div>

      {/* Add Employee Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-custom p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-mainText">Add New Employee</h2>
              <button 
                onClick={() => {
                  setShowAddModal(false);
                  setFormError('');
                  setFormSuccess('');
                }}
                className="text-2xl text-mutedText hover:text-mainText"
              >
                ×
              </button>
            </div>

            {formError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-custom mb-4 text-sm">
                {formError}
              </div>
            )}

            {formSuccess && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-custom mb-4 text-sm">
                {formSuccess}
              </div>
            )}

            <form onSubmit={handleAddEmployee} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-mainText mb-1">First Name *</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full border border-borders px-3 py-2 rounded-custom outline-none focus:ring-1 ring-primary/20"
                    placeholder="John"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-mainText mb-1">Last Name *</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full border border-borders px-3 py-2 rounded-custom outline-none focus:ring-1 ring-primary/20"
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-mainText mb-1">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full border border-borders px-3 py-2 rounded-custom outline-none focus:ring-1 ring-primary/20"
                  placeholder="john.doe@company.com"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-mainText mb-1">Department *</label>
                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  className="w-full border border-borders px-3 py-2 rounded-custom outline-none focus:ring-1 ring-primary/20"
                  placeholder="Engineering"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-mainText mb-1">Designation *</label>
                <input
                  type="text"
                  name="designation"
                  value={formData.designation}
                  onChange={handleInputChange}
                  className="w-full border border-borders px-3 py-2 rounded-custom outline-none focus:ring-1 ring-primary/20"
                  placeholder="Senior Developer"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-mainText mb-1">Salary *</label>
                <input
                  type="number"
                  name="salary"
                  value={formData.salary}
                  onChange={handleInputChange}
                  className="w-full border border-borders px-3 py-2 rounded-custom outline-none focus:ring-1 ring-primary/20"
                  placeholder="50000"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-mainText mb-1">Role *</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="w-full border border-borders px-3 py-2 rounded-custom outline-none focus:ring-1 ring-primary/20"
                >
                  <option value="EMPLOYEE">Employee</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>

              <div className="flex space-x-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-primary text-white px-4 py-2 rounded-custom font-semibold hover:bg-opacity-90 transition"
                >
                  Add Employee
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setFormError('');
                    setFormSuccess('');
                  }}
                  className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-custom font-semibold hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Employee Modal */}
      {showEditModal && editingEmployee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-custom p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-mainText">Edit Employee</h2>
              <button 
                onClick={() => {
                  setShowEditModal(false);
                  setEditingEmployee(null);
                  setFormError('');
                  setFormSuccess('');
                }}
                className="text-2xl text-mutedText hover:text-mainText"
              >
                ×
              </button>
            </div>

            {formError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-custom mb-4 text-sm">
                {formError}
              </div>
            )}

            {formSuccess && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-custom mb-4 text-sm">
                {formSuccess}
              </div>
            )}

            <form onSubmit={handleUpdateEmployee} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-mainText mb-1">First Name *</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full border border-borders px-3 py-2 rounded-custom outline-none focus:ring-1 ring-primary/20"
                    placeholder="John"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-mainText mb-1">Last Name *</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full border border-borders px-3 py-2 rounded-custom outline-none focus:ring-1 ring-primary/20"
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-mainText mb-1">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full border border-borders px-3 py-2 rounded-custom outline-none focus:ring-1 ring-primary/20"
                  placeholder="john.doe@company.com"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-mainText mb-1">Department *</label>
                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  className="w-full border border-borders px-3 py-2 rounded-custom outline-none focus:ring-1 ring-primary/20"
                  placeholder="Engineering"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-mainText mb-1">Designation *</label>
                <input
                  type="text"
                  name="designation"
                  value={formData.designation}
                  onChange={handleInputChange}
                  className="w-full border border-borders px-3 py-2 rounded-custom outline-none focus:ring-1 ring-primary/20"
                  placeholder="Senior Developer"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-mainText mb-1">Salary *</label>
                <input
                  type="number"
                  name="salary"
                  value={formData.salary}
                  onChange={handleInputChange}
                  className="w-full border border-borders px-3 py-2 rounded-custom outline-none focus:ring-1 ring-primary/20"
                  placeholder="50000"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-mainText mb-1">Role *</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="w-full border border-borders px-3 py-2 rounded-custom outline-none focus:ring-1 ring-primary/20"
                >
                  <option value="EMPLOYEE">Employee</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>

              <div className="flex space-x-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-primary text-white px-4 py-2 rounded-custom font-semibold hover:bg-opacity-90 transition"
                >
                  Update Employee
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingEmployee(null);
                    setFormError('');
                    setFormSuccess('');
                  }}
                  className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-custom font-semibold hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
            <button 
              onClick={() => setShowFilterModal(true)}
              className="px-4 py-2 bg-softBg border border-borders text-sm rounded-custom hover:bg-gray-100 transition relative"
            >
              Filter
              {activeFiltersCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </button>
            <button 
              onClick={() => setShowSortModal(true)}
              className="px-4 py-2 bg-softBg border border-borders text-sm rounded-custom hover:bg-gray-100 transition"
            >
              Sort {sortOrder === 'asc' ? '↑' : '↓'}
            </button>
          </div>
        </div>

        {/* Filter Modal */}
        {showFilterModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-custom p-6 max-w-md w-full">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-mainText">Filter Employees</h2>
                <button 
                  onClick={() => setShowFilterModal(false)}
                  className="text-2xl text-mutedText hover:text-mainText"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-mainText mb-2">Department</label>
                  <select
                    value={filterDepartment}
                    onChange={(e) => setFilterDepartment(e.target.value)}
                    className="w-full border border-borders px-3 py-2 rounded-custom outline-none focus:ring-1 ring-primary/20"
                  >
                    <option value="">All Departments</option>
                    {uniqueDepartments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-mainText mb-2">Role</label>
                  <select
                    value={filterRole}
                    onChange={(e) => setFilterRole(e.target.value)}
                    className="w-full border border-borders px-3 py-2 rounded-custom outline-none focus:ring-1 ring-primary/20"
                  >
                    <option value="">All Roles</option>
                    <option value="ADMIN">Admin</option>
                    <option value="EMPLOYEE">Employee</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-mainText mb-2">Salary Range</label>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="number"
                      placeholder="Min"
                      value={filterSalaryMin}
                      onChange={(e) => setFilterSalaryMin(e.target.value)}
                      className="border border-borders px-3 py-2 rounded-custom outline-none focus:ring-1 ring-primary/20"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={filterSalaryMax}
                      onChange={(e) => setFilterSalaryMax(e.target.value)}
                      className="border border-borders px-3 py-2 rounded-custom outline-none focus:ring-1 ring-primary/20"
                    />
                  </div>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={handleApplyFilters}
                    className="flex-1 bg-primary text-white px-4 py-2 rounded-custom font-semibold hover:bg-opacity-90 transition"
                  >
                    Apply Filters
                  </button>
                  <button
                    onClick={handleClearFilters}
                    className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-custom font-semibold hover:bg-gray-300 transition"
                  >
                    Clear All
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Sort Modal */}
        {showSortModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-custom p-6 max-w-md w-full">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-mainText">Sort Employees</h2>
                <button 
                  onClick={() => setShowSortModal(false)}
                  className="text-2xl text-mutedText hover:text-mainText"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-mainText mb-2">Sort By</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="w-full border border-borders px-3 py-2 rounded-custom outline-none focus:ring-1 ring-primary/20"
                  >
                    <option value="id">Employee ID</option>
                    <option value="name">Name</option>
                    <option value="department">Department</option>
                    <option value="salary">Salary</option>
                    <option value="date">Joining Date</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-mainText mb-2">Order</label>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setSortOrder('asc')}
                      className={`flex-1 px-4 py-2 rounded-custom font-semibold transition ${
                        sortOrder === 'asc' 
                          ? 'bg-primary text-white' 
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      ↑ Ascending
                    </button>
                    <button
                      onClick={() => setSortOrder('desc')}
                      className={`flex-1 px-4 py-2 rounded-custom font-semibold transition ${
                        sortOrder === 'desc' 
                          ? 'bg-primary text-white' 
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      ↓ Descending
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleApplySort}
                  className="w-full bg-primary text-white px-4 py-2 rounded-custom font-semibold hover:bg-opacity-90 transition mt-4"
                >
                  Apply Sort
                </button>
              </div>
            </div>
          </div>
        )}

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
              {sortedEmployees.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-mutedText">
                    No employees found matching your criteria
                  </td>
                </tr>
              ) : (
                sortedEmployees.map((emp) => (
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
                      <button 
                        onClick={() => handleEditEmployee(emp)}
                        className="text-primary font-semibold hover:underline mr-3"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDeleteEmployee(emp.id, `${emp.firstName} ${emp.lastName}`)}
                        className="text-red-600 font-semibold hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="p-4 bg-softBg border-t border-borders flex justify-between items-center text-xs text-mutedText font-semibold">
          <span>Showing {sortedEmployees.length} of {employees.length} employees</span>
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
