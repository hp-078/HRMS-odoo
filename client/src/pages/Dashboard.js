import React, { useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Dashboard.css';

function Dashboard() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/signin');
  };

  const getInitials = () => {
    if (!user?.name) return 'U';
    return user.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  return (
    <div className="dashboard-wrapper">
      <nav className="top-navbar">
        <div className="navbar-left">
          <div className="company-logo">HR</div>
          <ul className="nav-tabs">
            <li><Link to="/employees">Employees</Link></li>
            <li><Link to="/attendance">Attendance</Link></li>
            <li><Link to="/timeoff">Time Off</Link></li>
          </ul>
        </div>

        <div className="navbar-right">
          <div 
            className="user-avatar" 
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <span>{getInitials()}</span>
          </div>

          {dropdownOpen && (
            <div className="user-dropdown active">
              <Link to="/my-profile" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                My Profile
              </Link>
              <button className="dropdown-item" onClick={handleLogout}>
                Log Out
              </button>
            </div>
          )}
        </div>
      </nav>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}

export default Dashboard;
