
import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { generateStudyPlanner } from '../services/geminiService';

const StudyPlannerScreen: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [examDate, setExamDate] = useState('');
  const [subjects, setSubjects] = useState('');
  const [target, setTarget] = useState('90% +');
  const [hours, setHours] = useState('4');
  const [plan, setPlan] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!examDate || !subjects) {
      alert("Please enter Exam Date and Subjects.");
      return;
    }
    setLoading(true);
    try {
      const res = await generateStudyPlanner({ examDate, subjects, targetGrade: target, dailyHours: hours });
      setPlan(res);
    } catch (e) {
      alert("Failed to create plan.");
    } finally {
      setLoading(false);
    }
  };

  if (plan) {
    return (
      <div className="flex-1 overflow-y-auto bg-[#fcfdfe] dark:bg-charcoal-900 p-6 md:p-12">
        <div className="max-w-4xl mx-auto">
          <button onClick={() => setPlan(null)} className="mb-6 text-[10px] font-bold text-indigo-500 uppercase tracking-widest flex items-center space-x-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            <span>Edit Schedule</span>
          </button>
          <div className="bg-white dark:bg-charcoal-800 p-8 rounded-[40px] shadow-sm border border-slate-100 dark:border-white/5 prose prose-indigo dark:prose-invert max-w-none">
            <ReactMarkdown>{plan}</ReactMarkdown>
          </div>
          <button onClick={() => window.print()} className="mt-8 w-full bg-indigo-500 text-white py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl shadow-indigo-500/20">Download My Schedule</button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-[#fcfdfe] dark:bg-charcoal-900 p-6 md:p-12">
      <div className="max-w-3xl mx-auto">
        <button onClick={onBack} className="mb-8 text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center space-x-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          <span>Back to Workspace</span>
        </button>
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-2">AI Study Planner</h1>
          <p className="text-sm text-slate-500 font-medium">Create a high-impact roadmap for your upcoming exams</p>
        </div>
        <div className="bg-white dark:bg-charcoal-800 rounded-[40px] p-8 border border-slate-100 dark:border-white/5 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Target Exam Date</label>
              <input type="date" value={examDate} onChange={(e) => setExamDate(e.target.value)} className="w-full bg-slate-50 dark:bg-charcoal-900 border-none rounded-2xl py-3 px-4 text-sm font-bold dark:text-white outline-none ring-2 ring-transparent focus:ring-indigo-500/20" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Daily Hours Available</label>
              <select value={hours} onChange={(e) => setHours(e.target.value)} className="w-full bg-slate-50 dark:bg-charcoal-900 border-none rounded-2xl py-3.5 px-4 text-sm font-bold dark:text-white outline-none">
                <option value="2">2 Hours</option>
                <option value="4">4 Hours</option>
                <option value="6">6 Hours</option>
                <option value="8">8+ Hours</option>
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">List of Subjects / Topics</label>
            <textarea value={subjects} onChange={(e) => setSubjects(e.target.value)} placeholder="e.g. Calculus, Organic Chemistry, World History..." rows={3} className="w-full bg-slate-50 dark:bg-charcoal-900 border-none rounded-2xl py-3 px-4 text-sm font-medium dark:text-white outline-none resize-none" />
          </div>
          <button onClick={handleGenerate} disabled={loading} className="w-full bg-indigo-500 hover:bg-indigo-600 text-white rounded-2xl py-5 text-[11px] font-black uppercase tracking-widest shadow-xl shadow-indigo-500/20 transition-all flex items-center justify-center space-x-3 active:scale-95">
            {loading ? <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div> : <span>Launch My Study Plan</span>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudyPlannerScreen;
