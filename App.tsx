
import React, { useState, useEffect } from 'react';
import { User, UserRole } from './types.ts';
import { api } from './services/api.ts';
import { mockDb } from './services/mockDb.ts';

// Pages
import LandingPage from './pages/LandingPage.tsx';
import Layout from './components/Layout.tsx';
import Dashboard from './pages/Dashboard.tsx';
import Attendance from './pages/Attendance.tsx';
import LeaveManagement from './pages/LeaveManagement.tsx';
import Profile from './pages/Profile.tsx';
import EmployeeManagement from './pages/EmployeeManagement.tsx';
import Payroll from './pages/Payroll.tsx';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<'LANDING' | 'AUTH' | 'APP'>('LANDING');
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [authMode, setAuthMode] = useState<'LOGIN' | 'SIGNUP'>('LOGIN');
  const [selectedRole, setSelectedRole] = useState<UserRole>(UserRole.EMPLOYEE);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    mockDb.init();
    const session = mockDb.getSession();
    if (session) {
      setUser(session);
      setView('APP');
    }
  }, []);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      let u: User;
      if (authMode === 'LOGIN') {
        u = await api.login(email);
      } else {
        u = await api.signUp({
          email,
          password,
          role: selectedRole,
        });
      }
      setUser(u);
      setView('APP');
    } catch (err: any) {
      if (err.message === 'BACKEND_DISCONNECTED') {
        setError('Database connection failed. Please ensure your backend server (node server/server.js) is running to use MongoDB.');
      } else {
        setError(err.message || 'Authentication failed');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    api.logout();
    setUser(null);
    setView('LANDING');
    setActiveTab('dashboard');
    setEmail('');
    setPassword('');
    setError('');
  };

  const renderContent = () => {
    if (!user) return <div className="p-8 text-center text-mutedText italic">Please log in to continue.</div>;
    
    switch (activeTab) {
      case 'dashboard': return <Dashboard user={user} />;
      case 'attendance': return <Attendance user={user} />;
      case 'leaves': return <LeaveManagement user={user} />;
      case 'profile': return <Profile user={user} onUpdate={setUser} />;
      case 'employees': return user.role === UserRole.ADMIN ? <EmployeeManagement /> : <Dashboard user={user} />;
      case 'payroll': return <Payroll user={user} />;
      default: return <Dashboard user={user} />;
    }
  };

  if (view === 'LANDING') {
    return (
      <LandingPage 
        onSignIn={() => { setAuthMode('LOGIN'); setError(''); setView('AUTH'); }} 
        onSignUp={() => { setAuthMode('SIGNUP'); setError(''); setView('AUTH'); }} 
      />
    );
  }

  if (view === 'AUTH') {
    return (
      <div className="min-h-screen bg-softBg flex items-center justify-center p-4">
        <div className="bg-white w-full max-w-md rounded-custom custom-shadow overflow-hidden p-8 border border-borders">
          <div className="text-center mb-6">
             <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center font-bold text-white text-3xl mx-auto mb-4 shadow-lg shadow-primary/20">D</div>
             <h2 className="text-2xl font-bold text-mainText">{authMode === 'LOGIN' ? 'Welcome Back' : 'Create Account'}</h2>
             <p className="text-mutedText text-sm mt-1">
               {authMode === 'LOGIN' ? 'Enter your details to login.' : 'Join the Dayflow workforce today.'}
             </p>
          </div>

          {authMode === 'SIGNUP' && (
            <div className="flex mb-8 bg-softBg p-1 rounded-custom border border-borders">
              <button 
                type="button"
                onClick={() => setSelectedRole(UserRole.EMPLOYEE)}
                className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-custom transition-all duration-300 ${selectedRole === UserRole.EMPLOYEE ? 'bg-white text-secondary shadow-sm ring-1 ring-black/5' : 'text-mutedText hover:text-mainText'}`}
              >
                Employee
              </button>
              <button 
                type="button"
                onClick={() => setSelectedRole(UserRole.ADMIN)}
                className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-custom transition-all duration-300 ${selectedRole === UserRole.ADMIN ? 'bg-white text-primary shadow-sm ring-1 ring-black/5' : 'text-mutedText hover:text-mainText'}`}
              >
                HR / Admin
              </button>
            </div>
          )}

          <form onSubmit={handleAuth} className="space-y-5">
            <div>
              <label className="block text-[10px] font-bold text-mutedText uppercase mb-1 ml-1 tracking-widest">Email Address</label>
              <input 
                type="email" 
                required 
                placeholder="email@company.com" 
                className="w-full bg-softBg border border-borders p-3 rounded-custom outline-none focus:bg-white focus:ring-2 ring-primary/10 transition-all"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-[10px] font-bold text-mutedText uppercase mb-1 ml-1 tracking-widest">Password</label>
              <input 
                type="password" 
                required 
                placeholder="••••••••" 
                className="w-full bg-softBg border border-borders p-3 rounded-custom outline-none focus:bg-white focus:ring-2 ring-primary/10 transition-all"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>
            
            {error && (
              <div className="p-3 rounded text-xs font-medium border bg-red-50 border-red-100 text-red-600 animate-fadeIn">
                {error}
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className={`w-full py-4 rounded-custom font-bold shadow-lg transition-all active:scale-[0.98] disabled:opacity-50 mt-2 text-white ${selectedRole === UserRole.ADMIN && authMode === 'SIGNUP' ? 'bg-primary shadow-primary/20' : 'bg-secondary shadow-secondary/20'}`}
            >
              {loading ? 'Processing...' : (authMode === 'LOGIN' ? 'Sign In' : `Sign Up as ${selectedRole === UserRole.ADMIN ? 'HR' : 'Employee'}`)}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-borders text-center">
             <p className="text-sm text-mutedText">
               {authMode === 'LOGIN' ? "Don't have an account?" : "Already a member?"} 
               <button 
                 onClick={() => { setAuthMode(authMode === 'LOGIN' ? 'SIGNUP' : 'LOGIN'); setError(''); }} 
                 className={`ml-1 font-bold hover:underline ${selectedRole === UserRole.ADMIN ? 'text-primary' : 'text-secondary'}`}
               >
                 {authMode === 'LOGIN' ? 'Sign Up' : 'Log In'}
               </button>
             </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Layout 
      user={user!} 
      activeTab={activeTab} 
      setActiveTab={setActiveTab} 
      onLogout={handleLogout}
    >
      {renderContent()}
    </Layout>
  );
};

export default App;
