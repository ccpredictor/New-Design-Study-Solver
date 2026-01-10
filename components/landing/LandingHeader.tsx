
import React from 'react';

interface LandingHeaderProps {
  currentView: string;
  onNavigate: (view: string) => void;
  onGetStarted: () => void;
}

const LandingHeader: React.FC<LandingHeaderProps> = ({ currentView, onNavigate, onGetStarted }) => {
  return (
    <nav className="fixed top-0 w-full z-50 bg-white/70 dark:bg-charcoal-950/70 backdrop-blur-2xl border-b border-slate-100 dark:border-white/5 transition-all">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onNavigate('home')}>
          <div className="w-10 h-10 bg-indigo-500 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <span className="text-base font-black text-slate-900 dark:text-white tracking-tight">AI Study Solver</span>
        </div>

        <div className="hidden lg:flex items-center space-x-8">
          <NavLink active={currentView === 'home'} label="Home" onClick={() => onNavigate('home')} />
          <NavLink active={currentView === 'features'} label="Features" onClick={() => onNavigate('features')} />
          <NavLink active={currentView === 'success'} label="Success Stories" onClick={() => onNavigate('success')} />
          <NavLink active={currentView === 'about'} label="About Us" onClick={() => onNavigate('about')} />
          <NavLink active={currentView === 'contact'} label="Contact" onClick={() => onNavigate('contact')} />
        </div>

        <div className="flex items-center space-x-6">
          <button 
            onClick={onGetStarted}
            className="hidden md:block text-sm font-bold text-indigo-500 hover:text-indigo-600 transition-colors"
          >
            Sign In
          </button>
          <button 
            onClick={onGetStarted}
            className="px-6 py-2.5 bg-indigo-500 text-white rounded-xl text-sm font-bold shadow-xl shadow-indigo-500/20 hover:scale-105 active:scale-95 transition-all"
          >
            Join for Free
          </button>
        </div>
      </div>
    </nav>
  );
};

const NavLink: React.FC<{ active: boolean, label: string, onClick: () => void }> = ({ active, label, onClick }) => (
  <button 
    onClick={onClick}
    className={`text-sm font-bold transition-all hover:text-indigo-500 ${active ? 'text-indigo-500' : 'text-slate-500 dark:text-slate-400'}`}
  >
    {label}
  </button>
);

export default LandingHeader;
