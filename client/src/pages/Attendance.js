import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';

function Attendance() {
  const [attendance, setAttendance] = useState([]);
  const [summary, setSummary] = useState(null);
  const [checkInStatus, setCheckInStatus] = useState(null);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(true);
  const { isAdmin, user } = useAuth();

  useEffect(() => {
    fetchAttendance();
    if (!isAdmin) {
      fetchSummary();
      fetchCheckInStatus();
    }
  }, [date]);

  const fetchAttendance = async () => {
    try {
      const params = isAdmin ? { date } : { employeeId: user.employeeId };
      const response = await API.get('/attendance', { params });
      setAttendance(response.data);
    } catch (error) {
      console.error('Error fetching attendance:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSummary = async () => {
    try {
      const response = await API.get(`/attendance/summary/${user.employeeId}`);
      setSummary(response.data);
    } catch (error) {
      console.error('Error fetching summary:', error);
    }
  };

  const fetchCheckInStatus = async () => {
    try {
      const response = await API.get('/attendance/status');
      setCheckInStatus(response.data);
    } catch (error) {
      console.error('Error fetching status:', error);
    }
  };

  const handleCheckIn = async () => {
    try {
      await API.post('/attendance/checkin');
      fetchCheckInStatus();
      fetchAttendance();
      alert('Checked in successfully!');
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to check in');
    }
  };

  const handleCheckOut = async () => {
    try {
      await API.post('/attendance/checkout');
      fetchCheckInStatus();
      fetchAttendance();
      alert('Checked out successfully!');
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to check out');
    }
  };

  const formatTime = (time) => {
    if (!time) return '-';
    return new Date(`2000-01-01 ${time}`).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (loading) {
    return <div className="loading">Loading attendance...</div>;
  }

  return (
    <div>
      <div className="page-header">
        <h1>Attendance</h1>
      </div>

      {!isAdmin && checkInStatus && (
        <div className="check-in-card">
          <div className="check-status">
            <span className={`status-dot ${checkInStatus.checkedIn ? 'active' : ''}`}></span>
            <span>
              {!checkInStatus.checkedIn && 'Not Checked In'}
              {checkInStatus.checkedIn && !checkInStatus.checkedOut && 'Checked In'}
              {checkInStatus.checkedOut && 'Checked Out'}
            </span>
          </div>
          
          {checkInStatus.checkedIn && (
            <p style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>
              Check In: {formatTime(checkInStatus.checkIn)}
              {checkInStatus.checkOut && ` • Check Out: ${formatTime(checkInStatus.checkOut)}`}
            </p>
          )}

          {!checkInStatus.checkedIn && (
            <button className="btn btn-success" onClick={handleCheckIn}>
              Check In
            </button>
          )}
          
          {checkInStatus.checkedIn && !checkInStatus.checkedOut && (
            <button className="btn btn-danger" onClick={handleCheckOut}>
              Check Out
            </button>
          )}
        </div>
      )}

      {!isAdmin && summary && (
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-label">Days Present</div>
            <div className="stat-value">{summary.days_present}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Leave Count</div>
            <div className="stat-value">{summary.leave_count}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Total Working Days</div>
            <div className="stat-value">{summary.total_working_days}</div>
          </div>
        </div>
      )}

      {isAdmin && (
        <div className="date-selector">
          <button className="date-nav-btn" onClick={() => {
            const d = new Date(date);
            d.setDate(d.getDate() - 1);
            setDate(d.toISOString().split('T')[0]);
          }}>
            ←
          </button>
          <div className="date-display">
            {new Date(date).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </div>
          <button className="date-nav-btn" onClick={() => {
            const d = new Date(date);
            d.setDate(d.getDate() + 1);
            setDate(d.toISOString().split('T')[0]);
          }}>
            →
          </button>
        </div>
      )}

      <div className="table-container">
        <table>
          <thead>
            <tr>
              {isAdmin && <th>Employee</th>}
              <th>Date</th>
              <th>Check In</th>
              <th>Check Out</th>
              <th>Work Hours</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {attendance.map((record) => (
              <tr key={record.id}>
                {isAdmin && (
                  <td>
                    <div className="employee-cell">
                      <div className="table-avatar">
                        {record.employee_name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </div>
                      {record.employee_name}
                    </div>
                  </td>
                )}
                <td>{new Date(record.attendance_date).toLocaleDateString()}</td>
                <td>{formatTime(record.check_in)}</td>
                <td>{formatTime(record.check_out)}</td>
                <td>{record.work_hours || '-'} hrs</td>
                <td>
                  <span className={`badge badge-${record.status}`}>
                    {record.status}
                  </span>
                </td>
              </tr>
            ))}
            {attendance.length === 0 && (
              <tr>
                <td colSpan={isAdmin ? "6" : "5"} style={{ textAlign: 'center' }}>
                  No attendance records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Attendance;
