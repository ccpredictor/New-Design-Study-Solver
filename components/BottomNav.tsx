import React from 'react';

interface BottomNavProps {
  activeTab: 'dashboard' | 'workflow' | 'review' | 'designer' | 'channels' | 'profile';
  setActiveTab: (tab: 'dashboard' | 'workflow' | 'review' | 'designer' | 'channels' | 'profile') => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab }) => {
  return (
    <nav className="md:hidden h-16 bg-white dark:bg-charcoal-950 border-t border-slate-50 dark:border-white/5 flex items-center justify-around px-1 z-50 transition-colors shrink-0" style={{ paddingBottom: 'env(safe-area-inset-bottom)', height: 'calc(4rem + env(safe-area-inset-bottom))' }}>
      <button 
        onClick={() => setActiveTab('dashboard')}
        className={`flex-1 flex flex-col items-center justify-center space-y-1 h-full transition-all ${activeTab === 'dashboard' ? 'text-indigo-500' : 'text-[#c0c5d6] dark:text-slate-600'}`}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
        <span className="text-[8px] font-bold uppercase tracking-[0.1em]">Dash</span>
      </button>

      <button 
        onClick={() => setActiveTab('channels')}
        className={`flex-1 flex flex-col items-center justify-center space-y-1 h-full transition-all ${activeTab === 'channels' ? 'text-indigo-500' : 'text-[#c0c5d6] dark:text-slate-600'}`}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <span className="text-[8px] font-bold uppercase tracking-[0.1em]">Groups</span>
      </button>

      <button 
        onClick={() => setActiveTab('workflow')}
        className={`flex-1 flex flex-col items-center justify-center space-y-1 h-full transition-all ${activeTab === 'workflow' ? 'text-indigo-500' : 'text-[#c0c5d6] dark:text-slate-600'}`}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
        <span className="text-[8px] font-bold uppercase tracking-[0.1em]">Solve</span>
      </button>

      <button 
        onClick={() => setActiveTab('designer')}
        className={`flex-1 flex flex-col items-center justify-center space-y-1 h-full transition-all ${activeTab === 'designer' ? 'text-indigo-500' : 'text-[#c0c5d6] dark:text-slate-600'}`}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <span className="text-[8px] font-bold uppercase tracking-[0.1em]">Exam</span>
      </button>
      
      <button 
        onClick={() => setActiveTab('review')}
        className={`flex-1 flex flex-col items-center justify-center space-y-1 h-full transition-all ${activeTab === 'review' ? 'text-indigo-500' : 'text-[#c0c5d6] dark:text-slate-600'}`}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="text-[8px] font-bold uppercase tracking-[0.1em]">History</span>
      </button>

      <button 
        onClick={() => setActiveTab('profile')}
        className={`flex-1 flex flex-col items-center justify-center space-y-1 h-full transition-all ${activeTab === 'profile' ? 'text-indigo-500' : 'text-[#c0c5d6] dark:text-slate-600'}`}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924-1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <span className="text-[8px] font-bold uppercase tracking-[0.1em]">Settings</span>
      </button>
    </nav>
  );
};

export default BottomNav;