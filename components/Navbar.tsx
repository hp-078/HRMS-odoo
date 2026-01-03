
import React, { useEffect, useState } from 'react';
import { User, UserRole } from '../types.ts';
import { api } from '../services/api.ts';

interface NavbarProps {
  user: User;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isMenuOpen: boolean;
  onToggleMenu: (open: boolean) => void;
  onLogout: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ 
  user, 
  activeTab, 
  setActiveTab, 
  isMenuOpen, 
  onLogout,
  onMouseEnter,
  onMouseLeave 
}) => {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);

  useEffect(() => {
    const check = async () => {
      try {
        const status = await api.checkConnection();
        setIsConnected(status);
      } catch {
        setIsConnected(false);
      }
    };
    check();
    const interval = setInterval(check, 10000);
    return () => clearInterval(interval);
  }, []);

  const commonLinks = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'attendance', label: 'Attendance', icon: '⏰' },
    { id: 'leaves', label: 'Leaves', icon: '🏖️' },
  ];

  const adminLinks = [
    { id: 'employees', label: 'Employees', icon: '👥' },
    { id: 'payroll', label: 'Payroll', icon: '💰' },
  ];

  const links = user.role === UserRole.ADMIN ? [...commonLinks, ...adminLinks] : commonLinks;

  return (
    <nav className="bg-primary text-white h-16 fixed top-0 left-0 right-0 z-50 px-6 flex items-center justify-between shadow-lg">
      <div className="flex items-center space-x-8">
        <div className="flex items-center space-x-2 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
          <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center font-bold text-white shadow-sm">D</div>
          <span className="text-xl font-bold tracking-tight hidden md:block">Dayflow</span>
        </div>

        <div className="hidden lg:flex items-center space-x-1">
          {links.map((link) => (
            <button
              key={link.id}
              onClick={() => setActiveTab(link.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-custom transition-all duration-200 text-sm font-medium ${
                activeTab === link.id 
                  ? 'bg-white/20 text-white shadow-inner' 
                  : 'text-white/70 hover:bg-white/10 hover:text-white'
              }`}
            >
              <span>{link.icon}</span>
              <span>{link.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center space-x-4 md:space-x-6">
        <div className="hidden sm:flex items-center px-3 py-1 rounded-full bg-black/20 text-[10px] font-bold uppercase tracking-wider">
          <span className={`w-2 h-2 rounded-full mr-2 ${isConnected === true ? 'bg-green-400 animate-pulse' : isConnected === false ? 'bg-red-400' : 'bg-gray-400'}`}></span>
          {isConnected === true ? 'Cloud Active' : isConnected === false ? 'Local Only' : 'Syncing...'}
        </div>

        <button className="text-white/70 hover:text-white transition-colors relative p-2">
          <span className="absolute top-1 right-1 w-2 h-2 bg-secondary rounded-full border border-primary"></span>
          <span className="text-lg">🔔</span>
        </button>

        <div 
          className="relative flex items-center space-x-3 cursor-pointer group py-2"
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        >
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold leading-tight">{user.firstName} {user.lastName}</p>
            <p className="text-[10px] text-white/60 leading-tight uppercase tracking-wider">{user.designation}</p>
          </div>
          
          <div className="relative">
            <img 
              src={user.avatar || `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=017E84&color=fff`} 
              alt="Avatar" 
              className={`w-9 h-9 rounded-full border-2 transition-all ${isMenuOpen ? 'border-white' : 'border-white/20'}`}
            />
            
            {isMenuOpen && (
              <div 
                className="absolute right-0 top-full pt-1 w-48 animate-fadeIn"
                onMouseEnter={onMouseEnter}
              >
                <div className="bg-white rounded-custom shadow-2xl border border-borders py-1 overflow-hidden">
                  <button 
                    onClick={() => setActiveTab('profile')} 
                    className="w-full text-left px-4 py-2.5 text-sm text-mainText hover:bg-softBg flex items-center space-x-2 transition-colors"
                  >
                    <span>👤</span>
                    <span className="font-medium">My Profile</span>
                  </button>
                  <div className="h-px bg-borders mx-2 my-1"></div>
                  <button 
                    onClick={onLogout} 
                    className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2 transition-colors"
                  >
                    <span>🚪</span>
                    <span className="font-medium">Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
