
import React, { useState } from 'react';

const LandingSupport: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="pt-32 pb-24 px-6 animate-in fade-in duration-1000 selection:bg-indigo-500 selection:text-white">
      <div className="max-w-7xl mx-auto">
        
        {/* Support Hero */}
        <div className="text-center mb-24">
          <span className="text-xs font-black text-indigo-500 mb-6 block uppercase tracking-[0.4em]">Help & Documentation</span>
          <h2 className="text-5xl md:text-8xl font-black text-slate-900 dark:text-white tracking-tighter leading-[0.9] mb-12">
            How Can We <br />
            <span className="text-indigo-500">Help You Master?</span>
          </h2>
          
          <div className="max-w-2xl mx-auto relative group">
             <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-[32px] blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
             <div className="relative flex items-center bg-white dark:bg-charcoal-900 border border-slate-100 dark:border-white/5 rounded-[32px] p-2 shadow-2xl">
                <div className="pl-6 text-slate-400">
                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </div>
                <input 
                  type="text" 
                  placeholder="Search articles, FAQs, and STEM guides..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-transparent border-none outline-none py-4 px-6 text-lg font-medium text-slate-700 dark:text-white placeholder-slate-400"
                />
                <button className="bg-indigo-500 text-white px-8 py-4 rounded-[24px] text-sm font-black uppercase tracking-widest shadow-lg shadow-indigo-500/20 hover:scale-105 transition-all">Search</button>
             </div>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-40">
           <SupportCategory 
             icon="🚀" 
             title="Getting Started" 
             desc="New to the platform? Learn how to set up your profile and start your first lesson." 
             links={["Creating an Account", "Platform Walkthrough", "Pro Subscription Guide"]}
           />
           <SupportCategory 
             icon="📐" 
             title="STEM Reasoning" 
             desc="Documentation on how our AI handles complex math, physics, and chemical equations." 
             links={["KaTeX & Math Syntax", "Vision Engine Tips", "Handling Diagrams"]}
           />
           <SupportCategory 
             icon="🔒" 
             title="Account & Billing" 
             desc="Manage your subscription, update payment methods, or request account deletion." 
             links={["Updating Payment", "Privacy Settings", "Security Protocols"]}
           />
           <SupportCategory 
             icon="🎓" 
             title="Pedagogy & Logic" 
             desc="Understand the 'Socratic Ladder' and how to interact with the AI for best results." 
             links={["First-Principles Logic", "Socratic Prompting", "Learning Insights"]}
           />
        </div>

        {/* Deep Dive FAQ Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-20 mb-40">
           <div className="lg:col-span-1">
              <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-6">Detailed Knowledge Base.</h3>
              <p className="text-slate-500 font-medium leading-relaxed mb-10">
                Can't find what you're looking for? Explore our most detailed technical and pedagogical documentation.
              </p>
              <div className="space-y-4">
                 <div className="flex items-center space-x-3 text-sm font-bold text-indigo-500 group cursor-pointer">
                    <span>View System Status</span>
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                 </div>
                 <div className="flex items-center space-x-3 text-sm font-bold text-emerald-500 group cursor-pointer">
                    <span>AI Model Accuracy Report</span>
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                 </div>
              </div>
           </div>

           <div className="lg:col-span-2 space-y-12">
              <FAQBlock 
                question="Why doesn't the AI give me the answer immediately?"
                answer="AI Study Solver is built as a Socratic Mentor. Our engine detects if you're trying to bypass learning or if you're genuinely stuck. If it detects a 'cheat' query, it will ask you a clarifying question or provide a conceptual hint first. This 'Ladder' approach ensures that the logic actually sticks in your long-term memory."
              />
              <FAQBlock 
                question="How do I get the best results from the Vision Engine?"
                answer="To ensure 99% accuracy in STEM vision: 1) Ensure the lighting is bright and even. 2) Avoid shadows on the paper. 3) Keep the camera parallel to the page. 4) If the handwriting is exceptionally messy, try tracing the key equation with a darker pen. Our AI handles 3D diagrams and graphs natively."
              />
              <FAQBlock 
                question="Is my academic data shared with other students?"
                answer="No. Your Private Lessons are 100% private and encrypted. No other student can see your queries or solutions unless you explicitly share them or post them in a collaborative Academic Channel. We do not use your private student data to train public AI models."
              />
              <FAQBlock 
                question="How does the Regional Language Lab work?"
                answer="Our AI doesn't just translate; it 're-reasons'. If you ask a Physics question in Hindi, the AI identifies the physical laws in Hindi, maps them to global scientific constants, and then provides a dual-language response to help you bridge the gap between your mother tongue and academic English."
              />
           </div>
        </div>

        {/* Mastery Troubleshooting Section */}
        <div className="bg-slate-50 dark:bg-charcoal-900 border border-slate-100 dark:border-white/5 rounded-[64px] p-12 md:p-24 mb-40">
           <div className="max-w-4xl mx-auto text-center">
              <h3 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-8">Troubleshooting Mastery.</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left">
                 <div className="space-y-4">
                    <h4 className="text-sm font-black text-indigo-500 uppercase tracking-widest">Scanning Equations</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                       If the AI misses a subscript or a decimal point, use the 'Edit Prompt' feature. You can manually correct the LaTeX notation to ensure the calculation engine uses the right values.
                    </p>
                 </div>
                 <div className="space-y-4">
                    <h4 className="text-sm font-black text-indigo-500 uppercase tracking-widest">Grounding Errors</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                       While Gemini 3.0 is highly accurate, it occasionally encounters web grounding conflicts. If a solution seems wrong, click 'Regenerate with Search' to trigger a fresh multi-source verification.
                    </p>
                 </div>
              </div>
           </div>
        </div>

        {/* Final CTA */}
        <div className="p-12 md:p-24 bg-indigo-500 rounded-[64px] text-white text-center relative overflow-hidden shadow-2xl shadow-indigo-500/20">
           <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 blur-[100px] rounded-full"></div>
           <h3 className="text-4xl md:text-6xl font-black tracking-tighter mb-8 leading-none">Still Have Questions?</h3>
           <p className="text-xl text-indigo-50 font-medium max-w-2xl mx-auto mb-12">
             Our human support team and AI tutors are standing by. Get the clarity you need to keep moving forward.
           </p>
           <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8">
              <button className="px-12 py-6 bg-white text-indigo-600 rounded-[32px] text-lg font-black shadow-xl hover:scale-105 active:scale-95 transition-all">
                Contact Support Desk
              </button>
              <button className="px-12 py-6 bg-indigo-600/50 border border-white/20 text-white rounded-[32px] text-lg font-black shadow-xl hover:scale-105 active:scale-95 transition-all">
                Join Community Forum
              </button>
           </div>
        </div>

      </div>
    </div>
  );
};

const SupportCategory: React.FC<{ icon: string, title: string, desc: string, links: string[] }> = ({ icon, title, desc, links }) => (
  <div className="p-10 bg-white dark:bg-charcoal-800 border border-slate-100 dark:border-white/5 rounded-[48px] shadow-sm hover:shadow-xl transition-all group">
     <div className="text-5xl mb-8 group-hover:scale-125 transition-transform duration-500 origin-left">{icon}</div>
     <h4 className="text-xl font-black text-slate-900 dark:text-white mb-4 leading-tight">{title}</h4>
     <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed mb-8">{desc}</p>
     <div className="space-y-3 pt-6 border-t border-slate-50 dark:border-white/5">
        {links.map(link => (
          <div key={link} className="text-xs font-black text-indigo-500 hover:underline cursor-pointer uppercase tracking-widest">{link}</div>
        ))}
     </div>
  </div>
);

const FAQBlock: React.FC<{ question: string, answer: string }> = ({ question, answer }) => (
  <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-700">
    <h4 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Q: {question}</h4>
    <div className="p-8 bg-slate-50 dark:bg-charcoal-900 border border-slate-100 dark:border-white/5 rounded-[32px]">
       <p className="text-sm text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
         {answer}
       </p>
    </div>
  </div>
);

export default LandingSupport;
