import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Pages
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard';
import Employees from './pages/Employees';
import EmployeeProfile from './pages/EmployeeProfile';
import MyProfile from './pages/MyProfile';
import Attendance from './pages/Attendance';
import TimeOff from './pages/TimeOff';

// Styles
import './styles/App.css';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="loading">Loading...</div>;
  }
  
  return user ? children : <Navigate to="/signin" />;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      >
        <Route index element={<Employees />} />
        <Route path="employees" element={<Employees />} />
        <Route path="employees/:id" element={<EmployeeProfile />} />
        <Route path="my-profile" element={<MyProfile />} />
        <Route path="attendance" element={<Attendance />} />
        <Route path="timeoff" element={<TimeOff />} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
