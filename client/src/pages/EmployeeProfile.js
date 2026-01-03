import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';

function EmployeeProfile() {
  const [employee, setEmployee] = useState(null);
  const [activeTab, setActiveTab] = useState('resume');
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchEmployee();
  }, [id]);

  const fetchEmployee = async () => {
    try {
      const response = await API.get(`/employees/${id}`);
      setEmployee(response.data);
    } catch (error) {
      console.error('Error fetching employee:', error);
    } finally {
      setLoading(false);
    }
  };

  const getInitials = () => {
    if (!employee) return 'E';
    return employee.full_name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  if (loading) {
    return <div className="loading">Loading profile...</div>;
  }

  if (!employee) {
    return <div>Employee not found</div>;
  }

  return (
    <div>
      <div className="page-header">
        <h1>Employee Profile</h1>
        <button className="btn btn-secondary btn-sm" onClick={() => navigate(-1)}>
          ← Back
        </button>
      </div>

      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-avatar-large">
            {employee.profile_picture ? (
              <img src={employee.profile_picture} alt={employee.full_name} />
            ) : (
              <span>{getInitials()}</span>
            )}
          </div>

          <div className="profile-details">
            <h2 className="profile-name">{employee.full_name}</h2>
            <p className="profile-role">{employee.job_title || 'Employee'}</p>
          </div>
        </div>

        <div className="profile-tabs">
          <button 
            className={activeTab === 'resume' ? 'active' : ''} 
            onClick={() => setActiveTab('resume')}
          >
            Resume
          </button>
          <button 
            className={activeTab === 'private' ? 'active' : ''} 
            onClick={() => setActiveTab('private')}
          >
            Private Info
          </button>
          {isAdmin && (
            <button 
              className={activeTab === 'salary' ? 'active' : ''} 
              onClick={() => setActiveTab('salary')}
            >
              Salary Info
            </button>
          )}
          <button 
            className={activeTab === 'security' ? 'active' : ''} 
            onClick={() => setActiveTab('security')}
          >
            Security
          </button>
        </div>

        {activeTab === 'resume' && (
          <div className="tab-content active">
            <div className="info-section">
              <h3>Personal Information</h3>
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">Full Name</span>
                  <span className="info-value">{employee.full_name}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Email</span>
                  <span className="info-value">{employee.email || '-'}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Phone</span>
                  <span className="info-value">{employee.phone || '-'}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Date of Birth</span>
                  <span className="info-value">{employee.date_of_birth || '-'}</span>
                </div>
              </div>
            </div>

            <div className="info-section">
              <h3>Job Information</h3>
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">Job Title</span>
                  <span className="info-value">{employee.job_title || '-'}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Department</span>
                  <span className="info-value">{employee.department || '-'}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Employee ID</span>
                  <span className="info-value">{employee.employee_id}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Joining Date</span>
                  <span className="info-value">{employee.joining_date || '-'}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'private' && (
          <div className="tab-content active">
            <div className="info-section">
              <h3>Contact Information</h3>
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">Address</span>
                  <span className="info-value">{employee.address || '-'}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Emergency Contact</span>
                  <span className="info-value">{employee.emergency_contact || '-'}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'salary' && isAdmin && employee.salary && (
          <div className="tab-content active">
            <div className="info-section">
              <h3>Salary Structure</h3>
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">Monthly Wage</span>
                  <span className="info-value">${employee.salary.monthly_wage}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Yearly Wage</span>
                  <span className="info-value">${employee.salary.yearly_wage}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Working Days (Monthly)</span>
                  <span className="info-value">{employee.salary.working_days} days</span>
                </div>
              </div>
            </div>

            <div className="info-section">
              <h3>Salary Components</h3>
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Component</th>
                      <th>Type</th>
                      <th>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Basic Salary</td>
                      <td>60% of wage</td>
                      <td>${employee.salary.basic_salary}</td>
                    </tr>
                    <tr>
                      <td>HRA (House Rent Allowance)</td>
                      <td>20% of Basic</td>
                      <td>${employee.salary.hra}</td>
                    </tr>
                    <tr>
                      <td>Standard Allowance</td>
                      <td>Fixed</td>
                      <td>${employee.salary.standard_allowance}</td>
                    </tr>
                    <tr>
                      <td>Leave Travel Allowance</td>
                      <td>Fixed</td>
                      <td>${employee.salary.leave_travel_allowance}</td>
                    </tr>
                    <tr>
                      <td>Performance Bonus</td>
                      <td>10% of Basic</td>
                      <td>${employee.salary.performance_bonus}</td>
                    </tr>
                    <tr>
                      <td>Fixed Allowance</td>
                      <td>Fixed</td>
                      <td>${employee.salary.fixed_allowance}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="tab-content active">
            <div className="info-section">
              <h3>Account Security</h3>
              <p style={{ color: 'var(--text-secondary)' }}>Security settings are managed by the system administrator.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default EmployeeProfile;
