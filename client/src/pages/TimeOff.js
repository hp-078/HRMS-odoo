import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';

function TimeOff() {
  const [requests, setRequests] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    type: 'paid-time-off',
    reason: ''
  });
  const [loading, setLoading] = useState(true);
  const { isAdmin } = useAuth();

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await API.get('/timeoff');
      setRequests(response.data);
    } catch (error) {
      console.error('Error fetching time off:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/timeoff', formData);
      alert('Time off request submitted successfully!');
      setShowModal(false);
      setFormData({ startDate: '', endDate: '', type: 'paid-time-off', reason: '' });
      fetchRequests();
    } catch (error) {
      alert('Failed to submit request');
    }
  };

  const handleApprove = async (id) => {
    try {
      await API.put(`/timeoff/${id}/approve`, {});
      alert('Request approved!');
      fetchRequests();
    } catch (error) {
      alert('Failed to approve request');
    }
  };

  const handleReject = async (id) => {
    try {
      await API.put(`/timeoff/${id}/reject`, {});
      alert('Request rejected!');
      fetchRequests();
    } catch (error) {
      alert('Failed to reject request');
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: 'badge-warning',
      approved: 'badge-success',
      rejected: 'badge-danger'
    };
    return badges[status] || 'badge-info';
  };

  if (loading) {
    return <div className="loading">Loading time off requests...</div>;
  }

  return (
    <div>
      <div className="page-header">
        <h1>Time Off</h1>
        {!isAdmin && (
          <button className="btn btn-primary btn-sm" onClick={() => setShowModal(true)}>
            + New Time Off
          </button>
        )}
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              {isAdmin && <th>Employee</th>}
              <th>Start Date</th>
              <th>End Date</th>
              <th>Type</th>
              <th>Reason</th>
              <th>Status</th>
              {isAdmin && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {requests.map((request) => (
              <tr key={request.id}>
                {isAdmin && (
                  <td>
                    <div className="employee-cell">
                      <div className="table-avatar">
                        {request.employee_name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </div>
                      {request.employee_name}
                    </div>
                  </td>
                )}
                <td>{new Date(request.start_date).toLocaleDateString()}</td>
                <td>{new Date(request.end_date).toLocaleDateString()}</td>
                <td>{request.type.replace(/-/g, ' ')}</td>
                <td>{request.reason}</td>
                <td>
                  <span className={`badge ${getStatusBadge(request.status)}`}>
                    {request.status}
                  </span>
                </td>
                {isAdmin && (
                  <td>
                    {request.status === 'pending' && (
                      <div className="action-btns">
                        <button 
                          className="btn btn-success btn-sm"
                          onClick={() => handleApprove(request.id)}
                        >
                          Approve
                        </button>
                        <button 
                          className="btn btn-danger btn-sm"
                          onClick={() => handleReject(request.id)}
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </td>
                )}
              </tr>
            ))}
            {requests.length === 0 && (
              <tr>
                <td colSpan={isAdmin ? "7" : "6"} style={{ textAlign: 'center' }}>
                  No time off requests found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay active">
          <div className="modal">
            <div className="modal-header">
              <h2>New Time Off Request</h2>
              <button className="close-modal" onClick={() => setShowModal(false)}>
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Time Off Type</label>
                <select 
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  required
                >
                  <option value="paid-time-off">Paid Time Off</option>
                  <option value="sick-leave">Sick Leave</option>
                  <option value="unpaid-leave">Unpaid Leave</option>
                </select>
              </div>

              <div className="form-group">
                <label>Start Date</label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>End Date</label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Reason</label>
                <textarea
                  rows="4"
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  placeholder="Enter reason for time off"
                  required
                ></textarea>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default TimeOff;
