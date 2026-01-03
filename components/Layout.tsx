
import React, { useState, useRef } from 'react';
import Navbar from './Navbar.tsx';
import { User } from '../types.ts';

interface LayoutProps {
  user: User;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ user, activeTab, setActiveTab, onLogout, children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }
    setIsMenuOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = window.setTimeout(() => {
      setIsMenuOpen(false);
    }, 300);
  };

  return (
    <div className="min-h-screen bg-softBg flex flex-col">
      <Navbar 
        user={user}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isMenuOpen={isMenuOpen}
        onToggleMenu={setIsMenuOpen}
        onLogout={onLogout}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      />
      
      <div className="flex-1 pt-16 flex flex-col">
        <div className="bg-white border-b border-borders px-8 py-3 flex items-center space-x-2 text-sm">
          <button 
            onClick={() => setActiveTab('dashboard')} 
            className="text-mutedText hover:text-primary transition-colors"
          >
            Home
          </button>
          <span className="text-borders">/</span>
          <span className="font-semibold text-mainText capitalize">{activeTab.replace('-', ' ')}</span>
        </div>

        <main className="p-8 flex-1 animate-fadeIn max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>

      <footer className="bg-white border-t border-borders py-4 px-8 text-center text-xs text-mutedText">
        <p>Dayflow HRMS &copy; 2024 • Enterprise Version 1.0.4 • Every workday, perfectly aligned.</p>
      </footer>
    </div>
  );
};

export default Layout;
