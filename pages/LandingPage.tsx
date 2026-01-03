
import React from 'react';

interface LandingPageProps {
  onSignIn: () => void;
  onSignUp: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onSignIn, onSignUp }) => {
  return (
    <div className="min-h-screen bg-white text-mainText selection:bg-secondary/20">
      {/* Navbar */}
      <nav className="h-20 flex items-center justify-between px-8 md:px-20 border-b border-borders sticky top-0 bg-white/80 backdrop-blur-md z-50">
        <div className="flex items-center space-x-2">
           <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center font-bold text-white text-xl">D</div>
           <span className="text-2xl font-bold tracking-tight text-primary">Dayflow</span>
        </div>
        <div className="hidden md:flex items-center space-x-8 text-sm font-semibold text-mutedText">
          <a href="#" className="hover:text-primary transition-colors">Features</a>
          <a href="#" className="hover:text-primary transition-colors">Pricing</a>
          <a href="#" className="hover:text-primary transition-colors">Testimonials</a>
          <a href="#" className="hover:text-primary transition-colors">About</a>
        </div>
        <div className="flex items-center space-x-4">
          <button onClick={onSignIn} className="text-sm font-bold text-primary hover:opacity-80 transition-all">Log In</button>
          <button onClick={onSignUp} className="bg-secondary text-white px-6 py-2.5 rounded-custom text-sm font-bold shadow-md hover:translate-y-[-1px] active:translate-y-0 transition-all">Get Started</button>
        </div>
      </nav>

      {/* Hero */}
      <section className="py-20 px-8 md:px-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="max-w-xl animate-slideUp">
          <div className="inline-block px-4 py-1.5 bg-secondary/10 text-secondary text-xs font-bold rounded-full mb-6 tracking-widest uppercase">
            Introducing Dayflow 2.0
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-mainText leading-tight mb-6">
            Every workday, <br/>
            <span className="text-primary italic">perfectly aligned.</span>
          </h1>
          <p className="text-xl text-mutedText leading-relaxed mb-10">
            Dayflow is the all-in-one HRMS built for modern enterprises. Manage attendance, leaves, payroll, and people—all in a beautiful, intuitive interface.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button onClick={onSignUp} className="bg-primary text-white px-10 py-4 rounded-custom text-lg font-bold shadow-xl hover:opacity-95 transition-all">Start 14-Day Free Trial</button>
            <button className="bg-white border-2 border-borders px-10 py-4 rounded-custom text-lg font-bold text-mainText hover:bg-softBg transition-all">Watch Demo Video</button>
          </div>
          <p className="mt-6 text-sm text-mutedText">No credit card required. Cancel anytime.</p>
        </div>
        <div className="relative animate-fadeIn">
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-secondary/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-10 -right-10 w-60 h-60 bg-primary/10 rounded-full blur-3xl"></div>
          <img 
            src="https://picsum.photos/seed/hrms-dashboard/800/600" 
            alt="Dashboard Preview" 
            className="rounded-2xl shadow-2xl border border-borders relative z-10"
          />
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

      {/* CTA */}
      <section className="py-24 px-8 md:px-20 text-center">
        <div className="bg-primary p-12 md:p-20 rounded-3xl text-white max-w-5xl mx-auto shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/20 rounded-full blur-3xl -mr-32 -mt-32"></div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to transform your HR?</h2>
          <p className="text-lg opacity-80 mb-10 max-w-xl mx-auto">Join 2,500+ companies who trust Dayflow to power their daily work life.</p>
          <button onClick={onSignUp} className="bg-white text-primary px-12 py-4 rounded-custom text-xl font-bold hover:bg-softBg transition-all shadow-lg">Get Started Now</button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-8 md:px-20 bg-mainText text-white/60">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1">
            <div className="flex items-center space-x-2 text-white mb-6">
               <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center font-bold text-white">D</div>
               <span className="text-xl font-bold tracking-tight">Dayflow</span>
            </div>
            <p className="text-sm leading-relaxed">Modern HR for modern companies. Perfectly aligned, every workday.</p>
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
          <div className="flex space-x-6">
            <a href="#" className="hover:text-white">Twitter</a>
            <a href="#" className="hover:text-white">LinkedIn</a>
            <a href="#" className="hover:text-white">GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
