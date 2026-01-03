import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';

function MyProfile() {
  const [employee, setEmployee] = useState(null);
  const [formData, setFormData] = useState({
    phone: '',
    address: '',
    emergencyContact: ''
  });
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await API.get(`/employees/${user.employeeId}`);
      setEmployee(response.data);
      setFormData({
        phone: response.data.phone || '',
        address: response.data.address || '',
        emergencyContact: response.data.emergency_contact || ''
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/employees/${user.employeeId}`, formData);
      alert('Profile updated successfully!');
      fetchProfile();
    } catch (error) {
      alert('Failed to update profile');
    }
  };

  const getInitials = () => {
    if (!employee) return 'U';
    return employee.full_name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  if (loading) {
    return <div className="loading">Loading profile...</div>;
  }

  if (!employee) {
    return <div>Profile not found</div>;
  }

  return (
    <div>
      <div className="page-header">
        <h1>My Profile</h1>
      </div>

      <div className="profile-container">
        <form onSubmit={handleSubmit}>
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

          <div className="info-section">
            <h3>Personal Information</h3>
            <div className="info-grid">
              <div className="form-group">
                <label>Full Name</label>
                <input type="text" value={employee.full_name} readOnly />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" value={employee.email || '-'} readOnly />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="Enter phone number"
                />
              </div>
              <div className="form-group">
                <label>Date of Birth</label>
                <input 
                  type="text" 
                  value={employee.date_of_birth || '-'} 
                  readOnly 
                />
              </div>
            </div>
          </div>

          <div className="info-section">
            <h3>Contact Information</h3>
            <div className="info-grid">
              <div className="form-group">
                <label>Address</label>
                <textarea
                  rows="3"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Enter address"
                ></textarea>
              </div>
              <div className="form-group">
                <label>Emergency Contact</label>
                <input
                  type="tel"
                  value={formData.emergencyContact}
                  onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                  placeholder="Enter emergency contact number"
                />
              </div>
            </div>
          </div>

          <div className="info-section">
            <h3>Job Information</h3>
            <div className="info-grid">
              <div className="form-group">
                <label>Job Title</label>
                <input type="text" value={employee.job_title || '-'} readOnly />
              </div>
              <div className="form-group">
                <label>Department</label>
                <input type="text" value={employee.department || '-'} readOnly />
              </div>
              <div className="form-group">
                <label>Employee ID</label>
                <input type="text" value={employee.employee_id} readOnly />
              </div>
              <div className="form-group">
                <label>Joining Date</label>
                <input type="text" value={employee.joining_date || '-'} readOnly />
              </div>
            </div>
          </div>

          <button type="submit" className="btn btn-primary">
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}

export default MyProfile;
