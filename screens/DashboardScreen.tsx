import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { analyzeLearningInsights } from '../services/geminiService';
import { auth } from '../services/firebase';

interface DashboardScreenProps {
  stats: { problemsSolved: number };
  sessions: any[];
  onSelectChat: (id: string) => void;
  onAction: (tab: 'designer' | 'planner' | 'workflow') => void;
}

const DashboardScreen: React.FC<DashboardScreenProps> = ({ stats, sessions, onSelectChat, onAction }) => {
  const user = auth.currentUser;

  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#f8fafc] dark:bg-charcoal-950 p-6 md:p-10">
      <div className="max-w-6xl mx-auto space-y-10">

        {/* Welcome Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              {getTimeGreeting()}, <span className="text-indigo-500">{user?.displayName?.split(' ')[0] || 'Scholar'}</span>
            </h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">Here is your academic progress overview for today.</p>
          </div>
          <div className="flex items-center space-x-3 bg-white dark:bg-charcoal-900 p-2 rounded-2xl border border-slate-100 dark:border-white/5 shadow-sm">
            <div className="w-10 h-10 bg-emerald-500/10 text-emerald-500 rounded-xl flex items-center justify-center font-black">
              {stats.problemsSolved}
            </div>
            <div className="pr-4">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Total Solved</p>
              <p className="text-xs font-bold text-slate-700 dark:text-white">Mastery Level 1</p>
            </div>
          </div>
        </header>


        {/* Quick Actions Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ActionCard
            icon="📐"
            title="Smart Solver"
            desc="Solve a new problem now"
            color="indigo"
            onClick={() => onAction('workflow')}
          />
          <ActionCard
            icon="📝"
            title="Exam Lab"
            desc="Generate mock papers"
            color="emerald"
            onClick={() => onAction('designer')}
          />
          <ActionCard
            icon="📅"
            title="Roadmap"
            desc="View your study plan"
            color="amber"
            onClick={() => onAction('planner')}
          />
        </section>

        {/* Stats & Activity Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

          {/* Stats Breakdown */}
          <div className="bg-white dark:bg-charcoal-900 border border-slate-100 dark:border-white/5 rounded-[40px] p-8 space-y-8">
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest ml-1">Performance Matrix</h3>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-1">
                <div className="text-3xl font-black text-slate-900 dark:text-white">{stats.problemsSolved}</div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Solved Concepts</div>
              </div>
              <div className="space-y-1">
                <div className="text-3xl font-black text-emerald-500">100%</div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Accuracy Rate</div>
              </div>
              <div className="space-y-1">
                <div className="text-3xl font-black text-amber-500">3 Days</div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Study Streak</div>
              </div>
              <div className="space-y-1">
                <div className="text-3xl font-black text-indigo-500">Top 5%</div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Global Rank</div>
              </div>
            </div>
          </div>

          {/* Recent Lessons */}
          <div className="bg-white dark:bg-charcoal-900 border border-slate-100 dark:border-white/5 rounded-[40px] p-8 space-y-6">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">Recent Lessons</h3>
              <button onClick={() => onAction('workflow')} className="text-[10px] font-black text-indigo-500 uppercase tracking-widest hover:underline">View All</button>
            </div>
            <div className="space-y-3">
              {sessions.length > 0 ? (
                sessions.slice(0, 3).map(session => (
                  <button
                    key={session.id}
                    onClick={() => onSelectChat(session.id)}
                    className="w-full flex items-center justify-between p-4 bg-slate-50 dark:bg-charcoal-950 rounded-2xl hover:ring-2 hover:ring-indigo-500/20 transition-all text-left"
                  >
                    <div className="flex items-center space-x-4 overflow-hidden">
                      <div className="w-10 h-10 bg-indigo-500/10 text-indigo-500 rounded-xl flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-sm font-bold text-slate-800 dark:text-white truncate">{session.title}</p>
                        <p className="text-[10px] text-slate-400 font-medium uppercase tracking-tighter">Continued yesterday</p>
                      </div>
                    </div>
                    <svg className="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" /></svg>
                  </button>
                ))
              ) : (
                <div className="text-center py-10">
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">No recent sessions found.</p>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

const ActionCard: React.FC<{ icon: string, title: string, desc: string, color: string, onClick: () => void }> = ({ icon, title, desc, color, onClick }) => {
  const colors: any = {
    indigo: 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 border-indigo-100 dark:border-indigo-500/20',
    emerald: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 border-emerald-100 dark:border-emerald-500/20',
    amber: 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 border-amber-100 dark:border-amber-500/20'
  };

  return (
    <button
      onClick={onClick}
      className={`p-8 rounded-[40px] border flex flex-col items-center text-center transition-all hover:scale-[1.02] active:scale-[0.98] group ${colors[color]}`}
    >
      <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">{icon}</div>
      <h4 className="text-lg font-black uppercase tracking-tight mb-1">{title}</h4>
      <p className="text-[10px] font-bold opacity-60 uppercase tracking-widest">{desc}</p>
    </button>
  );
};

export default DashboardScreen;
