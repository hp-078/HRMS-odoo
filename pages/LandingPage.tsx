
import React, { useState, useEffect } from 'react';

interface LandingPageProps {
  onSignIn: () => void;
  onSignUp: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onSignIn, onSignUp }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen bg-white text-mainText selection:bg-secondary/20 overflow-hidden">
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotateZ(0deg); }
          50% { transform: translateY(-20px) rotateZ(2deg); }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(99, 102, 241, 0.3); }
          50% { box-shadow: 0 0 40px rgba(99, 102, 241, 0.6); }
        }
        @keyframes spin-slow {
          from { transform: rotateX(0deg) rotateY(0deg); }
          to { transform: rotateX(360deg) rotateY(360deg); }
        }
        @keyframes slide-in-left {
          from { opacity: 0; transform: translateX(-50px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slide-in-right {
          from { opacity: 0; transform: translateX(50px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes bounce-in {
          0% { opacity: 0; transform: scale(0.8) translateY(20px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-float { animation: float 4s ease-in-out infinite; }
        .animate-pulse-glow { animation: pulse-glow 3s ease-in-out infinite; }
        .animate-spin-slow { animation: spin-slow 20s linear infinite; perspective: 1000px; }
        .animate-slide-in-left { animation: slide-in-left 0.8s ease-out; }
        .animate-slide-in-right { animation: slide-in-right 0.8s ease-out; }
        .animate-bounce-in { animation: bounce-in 0.8s ease-out; }
      `}</style>
      {/* Navbar */}
      <nav className="h-20 flex items-center justify-between px-8 md:px-20 border-b border-borders sticky top-0 bg-white/80 backdrop-blur-md z-50">
        <div className="flex items-center space-x-2">
           <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center font-bold text-white text-xl">D</div>
           <span className="text-2xl font-bold tracking-tight text-primary">Dayflow</span>
        </div>
        <div className="flex items-center space-x-4">
          <button onClick={onSignIn} className="text-sm font-bold text-primary hover:opacity-80 transition-all">Log In</button>
          <button onClick={onSignUp} className="bg-secondary text-white px-6 py-2.5 rounded-custom text-sm font-bold shadow-md hover:translate-y-[-1px] active:translate-y-0 transition-all">Get Started</button>
        </div>
      </nav>

      {/* Hero Section with 3D Elements */}
      <section className="py-20 px-8 md:px-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative">
        {/* Background animated blobs */}
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-secondary/10 rounded-full blur-3xl animate-pulse-glow"></div>
        <div className="absolute -bottom-10 -right-10 w-60 h-60 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>

        <div className="max-w-xl animate-slide-in-left relative z-10">
          <div className="inline-block px-4 py-1.5 bg-secondary/10 text-secondary text-xs font-bold rounded-full mb-6 tracking-widest uppercase border border-secondary/30 backdrop-blur-sm">
            ✨ Introducing Dayflow
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-6">
            Every workday, <br/>
            <span className="text-primary italic">perfectly aligned.</span>
          </h1>
          <p className="text-xl text-mutedText leading-relaxed mb-10 font-medium">
            Dayflow is the all-in-one HRMS built for modern enterprises. Manage attendance, leaves, payroll, and people—all in a beautiful, intuitive interface.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button onClick={onSignIn} className="bg-primary text-white px-10 py-4 rounded-custom text-lg font-bold shadow-xl hover:opacity-95 transition-all">Log In</button>
          </div>
        </div>

        <div className="relative animate-slide-in-right h-96 lg:h-full flex items-center justify-center perspective">
          {/* 3D rotating card */}
          <div className="animate-spin-slow w-72 h-96 relative" style={{ perspective: '1000px' }}>
            <div className="absolute inset-0 bg-gradient-to-br from-primary to-secondary rounded-3xl blur-2xl opacity-20"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl border border-borders p-8 backdrop-blur-xl">
              <div className="h-full flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="h-3 bg-gradient-to-r from-primary to-secondary rounded-full w-2/3"></div>
                  <div className="h-3 bg-primary/30 rounded-full w-full"></div>
                  <div className="h-3 bg-primary/30 rounded-full w-4/5"></div>
                </div>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="h-12 bg-primary/10 rounded-lg"></div>
                    <div className="h-12 bg-secondary/10 rounded-lg"></div>
                  </div>
                  <div className="h-8 bg-gradient-to-r from-primary to-secondary rounded-lg"></div>
                </div>
              </div>
            </div>
          </div>
          {/* Floating elements */}
          <>
            <div className="absolute top-10 right-10 w-20 h-20 bg-gradient-to-br from-secondary to-primary rounded-lg shadow-xl animate-float opacity-80"></div>
            <div className="absolute bottom-20 left-10 w-16 h-16 bg-gradient-to-tr from-primary to-secondary rounded-full shadow-lg animate-float opacity-70" style={{ animationDelay: '1s' }}></div>
          </>
        </div>
      </section>

      {/* Features Grid */}
      <section className="bg-softBg py-24 px-8 md:px-20">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-4xl font-bold mb-4">Powerful Features for Growing Teams</h2>
          <p className="text-mutedText">Everything you need to manage your most valuable asset: your people.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: 'Smart Attendance', desc: 'Real-time check-in/out with location tracking and automated shift management.', icon: '⏰' },
            { title: 'Easy Leave Approval', desc: 'Customizable leave policies and one-click approvals for HR managers.', icon: '🏖️' },
            { title: 'Precision Payroll', desc: 'Automated salary calculation with direct tax filings and digital slips.', icon: '💰' },
            { title: 'Deep Analytics', desc: 'Get actionable insights on turnover, absenteeism, and team performance.', icon: '📈' },
            { title: 'Self-Service Portal', desc: 'Employees manage their own profiles, requests, and documents easily.', icon: '👤' },
            { title: 'Secure & Compliant', desc: 'Enterprise-grade security and full compliance with local labor laws.', icon: '🛡️' },
          ].map((feature, i) => (
            <div key={i} className="bg-white p-8 rounded-custom shadow-sm hover:shadow-md transition-shadow border border-borders group">
              <div className="text-4xl mb-6 group-hover:scale-110 transition-transform inline-block">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-mutedText leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-8 md:px-20 bg-mainText text-white/60">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 space-y-4">
            <div className="flex items-center space-x-2 text-white mb-6">
               <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center font-bold text-white">D</div>
               <span className="text-xl font-bold tracking-tight">Dayflow</span>
            </div>
            <p className="text-sm leading-relaxed">Modern HR for modern companies. Perfectly aligned, every workday.</p>
            <div className="flex space-x-4">
              <a href="#" className="w-8 h-8 bg-white/10 hover:bg-primary rounded-lg flex items-center justify-center transition-all duration-300">𝕏</a>
              <a href="#" className="w-8 h-8 bg-white/10 hover:bg-primary rounded-lg flex items-center justify-center transition-all duration-300">in</a>
            </div>
          </div>
          <div>
            <h4 className="text-white font-bold mb-6">Product</h4>
            <ul className="space-y-4 text-sm">
              <li><a href="#" className="hover:text-white">Attendance</a></li>
              <li><a href="#" className="hover:text-white">Leave Management</a></li>
              <li><a href="#" className="hover:text-white">Payroll</a></li>
              <li><a href="#" className="hover:text-white">Analytics</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-6">Company</h4>
            <ul className="space-y-4 text-sm">
              <li><a href="#" className="hover:text-white">About Us</a></li>
              <li><a href="#" className="hover:text-white">Careers</a></li>
              <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white">Terms of Service</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-6">Support</h4>
            <ul className="space-y-4 text-sm">
              <li><a href="#" className="hover:text-white">Help Center</a></li>
              <li><a href="#" className="hover:text-white">Contact Sales</a></li>
              <li><a href="#" className="hover:text-white">API Docs</a></li>
              <li><a href="#" className="hover:text-white">System Status</a></li>
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
          <p>&copy; 2024 Dayflow Technologies Inc. All rights reserved.</p>
          <div className="flex space-x-8">
            <a href="#" className="hover:text-white transition-colors">Twitter</a>
            <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
            <a href="#" className="hover:text-white transition-colors">GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
