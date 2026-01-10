
import React from 'react';

interface LandingFooterProps {
  onNavigate: (view: string) => void;
}

const LandingFooter: React.FC<LandingFooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-white dark:bg-charcoal-950 border-t border-slate-100 dark:border-white/5 pt-20 pb-10 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
        <div className="col-span-1 md:col-span-1">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-8 h-8 bg-indigo-500 rounded-xl flex items-center justify-center text-white">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
            </div>
            <span className="text-base font-black text-slate-900 dark:text-white tracking-tight">AI Study Solver</span>
          </div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs">
            Revolutionizing education through context-aware AI. We empower students to master complex concepts with clarity and confidence.
          </p>
        </div>

        <div>
          <h4 className="text-xs font-black text-slate-900 dark:text-white mb-6">Platform</h4>
          <ul className="space-y-4">
            <FooterLink label="Core Features" onClick={() => onNavigate('features')} />
            <FooterLink label="Academic Roadmap" onClick={() => onNavigate('roadmap')} />
            <FooterLink label="Success Stories" onClick={() => onNavigate('success')} />
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-black text-slate-900 dark:text-white mb-6">Company</h4>
          <ul className="space-y-4">
            <FooterLink label="About Our Mission" onClick={() => onNavigate('about')} />
            <FooterLink label="Privacy & Terms" onClick={() => onNavigate('privacy')} />
            <FooterLink label="Support Center" onClick={() => onNavigate('support')} />
            <FooterLink label="Contact Tech" onClick={() => onNavigate('contact-tech')} />
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-black text-slate-900 dark:text-white mb-6">Stay Connected</h4>
          <p className="text-xs font-bold text-slate-400 mb-4">Subscribe for AI study tips.</p>
          <div className="flex space-x-2">
            <input 
              type="text" 
              placeholder="Your email address" 
              className="bg-slate-50 dark:bg-charcoal-900 border border-slate-100 dark:border-white/5 rounded-xl px-4 py-2 text-sm font-bold outline-none flex-1 focus:ring-2 focus:ring-indigo-500/20" 
            />
            <button className="bg-indigo-500 text-white p-2 rounded-xl">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto border-t border-slate-50 dark:border-white/5 pt-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <p className="text-xs font-bold text-slate-400 dark:text-slate-600">&copy; 2025 AI Study Solver. All rights reserved.</p>
        <div className="flex items-center space-x-6">
           <span className="text-xs font-bold text-slate-400 hover:text-indigo-500 cursor-pointer">Twitter</span>
           <span className="text-xs font-bold text-slate-400 hover:text-indigo-500 cursor-pointer">LinkedIn</span>
           <span className="text-xs font-bold text-slate-400 hover:text-indigo-500 cursor-pointer">GitHub</span>
        </div>
      </div>
    </footer>
  );
};

const FooterLink: React.FC<{ label: string, onClick: () => void }> = ({ label, onClick }) => (
  <li>
    <button 
      onClick={onClick}
      className="text-sm font-bold text-slate-500 dark:text-slate-400 hover:text-indigo-500 transition-colors"
    >
      {label}
    </button>
  </li>
);

export default LandingFooter;
