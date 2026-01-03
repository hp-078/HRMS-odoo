import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';

function Employees() {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAdmin) {
      fetchEmployees();
    }
  }, [isAdmin]);

  const fetchEmployees = async () => {
    try {
      const response = await API.get('/employees');
      setEmployees(response.data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredEmployees = employees.filter(emp =>
    emp.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.job_title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusClass = (status) => {
    switch (status) {
      case 'present':
        return 'status-present';
      case 'on-leave':
        return 'status-on-leave';
      default:
        return 'status-absent';
    }
  };

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  if (!isAdmin) {
    return (
      <div>
        <h2>Access Denied</h2>
        <p>You don't have permission to view this page.</p>
      </div>
    );
  }

  if (loading) {
    return <div className="loading">Loading employees...</div>;
  }

  return (
    <div>
      <div className="page-header">
        <h1>Employees</h1>
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search employees..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="employee-grid">
        {filteredEmployees.map((employee) => (
          <div
            key={employee.id}
            className="employee-card"
            onClick={() => navigate(`/employees/${employee.id}`)}
          >
            <div className={`status-indicator ${getStatusClass(employee.current_status)}`}></div>
            
            <div className="employee-avatar">
              {employee.profile_picture ? (
                <img src={employee.profile_picture} alt={employee.full_name} />
              ) : (
                <span>{getInitials(employee.full_name)}</span>
              )}
            </div>

            <div className="employee-info">
              <div className="employee-name">{employee.full_name}</div>
              <div className="employee-role">{employee.job_title || 'Employee'}</div>
            </div>
          </div>
        ))}

        {filteredEmployees.length === 0 && (
          <div className="no-results">No employees found</div>
        )}
      </div>
    </div>
  );
}

export default Employees;
