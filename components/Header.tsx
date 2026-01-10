
import React, { useState } from 'react';
// Fixed: Corrected named export for signOut from firebase/auth modular SDK
import { signOut } from 'firebase/auth';
import { auth } from '../services/firebase';

interface HeaderProps {
  onProfileClick?: () => void;
  onShare?: () => void;
  onInfoClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onProfileClick, onShare, onInfoClick }) => {
  const user = auth.currentUser;
  const [isDark, setIsDark] = useState(document.documentElement.classList.contains('dark'));

  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    if (newIsDark) {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
    }
  };

  const handleLogout = () => {
    signOut(auth);
  };

  return (
    <header className="h-16 bg-white dark:bg-charcoal-900 border-b border-slate-50 dark:border-white/5 px-4 flex items-center justify-between sticky top-0 z-40 transition-colors">
      <div className="flex items-center space-x-3">
        <div className="w-9 h-9 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-500 rounded-xl border border-indigo-100 dark:border-indigo-800/50 flex items-center justify-center">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
        <div onClick={onProfileClick} className="cursor-pointer group">
          <h1 className="text-[10px] font-bold text-[#1e293b] dark:text-white uppercase tracking-widest leading-none mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">AI Study Solver</h1>
          {user?.displayName && (
            <span className="text-[9px] font-bold text-indigo-500 uppercase tracking-tighter block group-hover:underline">{user.displayName}</span>
          )}
        </div>
      </div>
      
      <div className="flex items-center space-x-2 md:space-x-4">
        {onInfoClick && (
          <button 
            onClick={onInfoClick}
            className="flex items-center justify-center w-9 h-9 bg-slate-50 dark:bg-charcoal-800 text-slate-400 hover:text-indigo-500 transition-all rounded-xl border border-slate-100 dark:border-white/5 active:scale-95"
            title="Channel Information"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </button>
        )}

        {onShare && (
          <button 
            onClick={onShare}
            className="hidden sm:flex items-center space-x-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-500 rounded-xl border border-indigo-100 dark:border-indigo-500/20 text-[10px] font-black uppercase tracking-widest hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition-all shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            <span>Share</span>
          </button>
        )}

        <button 
          onClick={toggleTheme}
          className="p-2 text-slate-400 hover:text-indigo-500 dark:text-slate-500 dark:hover:text-indigo-400 transition-all rounded-xl hover:bg-slate-50 dark:hover:bg-charcoal-800"
          title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {isDark ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          )}
        </button>

        <button 
          onClick={handleLogout}
          className="text-[10px] font-bold text-[#f87171] hover:text-red-600 uppercase tracking-widest transition-colors flex items-center space-x-1 p-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
