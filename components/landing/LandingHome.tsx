
import React from 'react';

const LandingHome: React.FC<{ onGetStarted: () => void }> = ({ onGetStarted }) => {
  return (
    <div className="animate-in fade-in duration-700">
      {/* Hero Section */}
      <section className="pt-40 pb-24 px-6 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[800px] bg-indigo-500/5 dark:bg-indigo-500/10 blur-[150px] rounded-full -z-10"></div>
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 px-5 py-2.5 bg-white dark:bg-charcoal-900 border border-slate-100 dark:border-white/5 rounded-full shadow-sm mb-10 animate-in fade-in slide-in-from-bottom-4">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 tracking-tight">Next-Gen Learning: Gemini 3.0 Integrated</span>
          </div>
          <h1 className="text-5xl md:text-8xl font-black text-slate-900 dark:text-white tracking-tighter leading-[1] mb-8">
            Master the "Why" <br />
            <span className="text-indigo-500">Behind the "How".</span>
          </h1>
          <p className="text-lg md:text-2xl text-slate-500 dark:text-slate-400 font-medium max-w-3xl mx-auto mb-14 leading-relaxed">
            Stop memorizing answers. Start understanding the logic. AI Study Solver is your 24/7 personal mentor that breaks down complex academic hurdles into clear, logical steps.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8">
            <button 
              onClick={onGetStarted}
              className="w-full sm:w-auto px-14 py-6 bg-indigo-500 text-white rounded-[28px] text-lg font-bold shadow-2xl shadow-indigo-500/40 hover:scale-105 active:scale-95 transition-all"
            >
              Start Your Free Journey
            </button>
            <button 
               className="w-full sm:w-auto px-14 py-6 bg-white dark:bg-charcoal-900 border border-slate-100 dark:border-white/5 text-slate-600 dark:text-white rounded-[28px] text-lg font-bold shadow-sm hover:bg-slate-50 dark:hover:bg-charcoal-800 transition-all"
            >
              See it in Action
            </button>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="py-16 border-y border-slate-50 dark:border-white/5 bg-slate-50/30 dark:bg-transparent">
        <div className="max-w-7xl mx-auto px-6">
           <p className="text-sm font-bold text-center text-slate-400 mb-12">Empowering Students From Global Institutions</p>
           <div className="flex flex-wrap items-center justify-center gap-12 md:gap-32 opacity-25 grayscale dark:invert brightness-0 dark:brightness-200">
              <span className="text-2xl font-black tracking-tighter italic">Stanford</span>
              <span className="text-2xl font-black tracking-tighter italic">IIT Delhi</span>
              <span className="text-2xl font-black tracking-tighter italic">Harvard</span>
              <span className="text-2xl font-black tracking-tighter italic">Singapore NTU</span>
           </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <span className="text-xs font-bold text-indigo-500 mb-4 block">The Process</span>
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-none">Four Steps to Academic Clarity.</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <ProcessStep 
              number="01" 
              title="Input Your Doubt" 
              desc="Snap a photo of your handwritten math, a diagram in your textbook, or simply type your question." 
            />
            <ProcessStep 
              number="02" 
              title="AI Contextualization" 
              desc="Our Gemini-powered engine identifies the specific subject, grade level, and core concepts involved." 
            />
            <ProcessStep 
              number="03" 
              title="Step-by-Step Guidance" 
              desc="Receive a detailed walkthrough that explains not just the result, but the logical reasoning for every move." 
            />
            <ProcessStep 
              number="04" 
              title="Verify & Retain" 
              desc="Check reliable web sources and save the solution to your review deck for future exam revision." 
            />
          </div>
        </div>
      </section>

      {/* Master Any Subject */}
      <section className="py-32 px-6 bg-slate-900 text-white rounded-[60px] md:rounded-[100px] mx-4 md:mx-10 my-10 overflow-hidden relative">
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-indigo-500/20 blur-[100px] rounded-full"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col lg:flex-row items-end justify-between mb-20 gap-8">
            <div className="max-w-2xl text-left">
              <span className="text-xs font-bold text-indigo-400 mb-4 block">Curriculum Depth</span>
              <h2 className="text-4xl md:text-6xl font-black tracking-tight leading-tight">From Arithmetic to Astrophysics.</h2>
            </div>
            <p className="text-slate-400 font-medium max-w-sm text-left lg:text-right text-base leading-relaxed">
              Whether you're in school or pursuing a PhD, our AI is trained across hundreds of academic disciplines to provide accurate, context-aware assistance.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <SubjectBox icon="📐" label="Mathematics" />
            <SubjectBox icon="⚛️" label="Physics" />
            <SubjectBox icon="🧪" label="Chemistry" />
            <SubjectBox icon="🧬" label="Biology" />
            <SubjectBox icon="💻" label="Coding" />
            <SubjectBox icon="🏛️" label="History" />
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-8">
               <span className="text-xs font-bold text-indigo-500 block">The Competitive Edge</span>
               <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white leading-tight">Built for Students, Not Just for Search.</h2>
               <p className="text-lg text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                 Traditional AI often gives "flat" answers. We provide a 3-dimensional learning experience that prioritizes your cognitive growth over simple completion of tasks.
               </p>
               <div className="space-y-4">
                  <BenefitItem title="Unrivaled Accuracy" desc="We use specialized 'Academic Prompts' to minimize AI hallucinations in STEM subjects." />
                  <BenefitItem title="Visual Intelligence" desc="Handwriting recognition that works even for messy blackboard notes and sketches." />
                  <BenefitItem title="Study Continuity" desc="Every question you ask is stored in a beautiful dashboard for later review and revision." />
               </div>
            </div>
            <div className="relative">
               <div className="bg-indigo-500 p-12 rounded-[60px] shadow-2xl shadow-indigo-500/20 transform rotate-2">
                  <div className="bg-white/10 backdrop-blur-md rounded-[40px] p-8 border border-white/20 -rotate-2">
                     <div className="w-10 h-10 bg-white rounded-2xl mb-6 flex items-center justify-center text-indigo-500 font-black">AI</div>
                     <h4 className="text-xl font-bold text-white mb-4">"Explain Bernoulli's Principle in simple terms."</h4>
                     <div className="space-y-2 opacity-60">
                        <div className="h-2 bg-white rounded-full w-full"></div>
                        <div className="h-2 bg-white rounded-full w-3/4"></div>
                        <div className="h-2 bg-white rounded-full w-1/2"></div>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-32 px-6 bg-slate-50 dark:bg-charcoal-900/50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-20">
            <span className="text-xs font-bold text-indigo-500 mb-4 block">Common Doubts</span>
            <h2 className="text-4xl font-black text-slate-900 dark:text-white">Frequently Asked Questions</h2>
          </div>
          
          <div className="space-y-6">
            <FAQItem 
              q="Is AI Study Solver free to use?" 
              a="Yes, we offer a generous free tier for all students. You get daily AI solutions and access to the basic study planner without any credit card required." 
            />
            <FAQItem 
              q="Does it work for regional languages?" 
              a="Absolutely. You can ask questions and receive explanations in Hindi, Gujarati, Marathi, and several other languages. Just specify your preferred medium." 
            />
            <FAQItem 
              q="Can I upload PDF textbooks?" 
              a="Yes! Our Exam Designer and Solver can process PDF files up to 20MB. You can generate tests directly from your notes or reference documents." 
            />
            <FAQItem 
              q="How accurate are the solutions?" 
              a="We utilize Gemini 3.0, one of the world's most capable AI models, supplemented by real-time Google Search grounding to ensure technical and factual accuracy." 
            />
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 px-6">
        <div className="max-w-4xl mx-auto bg-indigo-500 rounded-[64px] p-12 md:p-20 text-center text-white shadow-2xl shadow-indigo-500/40 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-tr from-indigo-600 to-indigo-400 opacity-50"></div>
          <div className="relative z-10">
            <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight tracking-tighter">Ready to Become a Subject Master?</h2>
            <p className="text-indigo-50 font-medium text-lg mb-12 max-w-lg mx-auto leading-relaxed">Join 50,000+ students who have transformed their study habits with AI Study Solver.</p>
            <button 
              onClick={onGetStarted}
              className="px-12 py-6 bg-white text-indigo-500 rounded-3xl text-sm font-bold hover:scale-105 active:scale-95 transition-all shadow-xl"
            >
              Unlock Your Free Access Now
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

const ProcessStep: React.FC<{ number: string, title: string, desc: string }> = ({ number, title, desc }) => (
  <div className="group">
    <div className="text-5xl font-black text-slate-100 dark:text-charcoal-800 mb-6 group-hover:text-indigo-500 transition-colors duration-500">{number}</div>
    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">{title}</h3>
    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{desc}</p>
  </div>
);

const SubjectBox: React.FC<{ icon: string, label: string }> = ({ icon, label }) => (
  <div className="bg-white/5 border border-white/10 p-6 rounded-[32px] text-center hover:bg-white/10 transition-all cursor-default group">
    <div className="text-3xl mb-3 group-hover:scale-125 transition-transform">{icon}</div>
    <span className="text-xs font-bold text-slate-300">{label}</span>
  </div>
);

const BenefitItem: React.FC<{ title: string, desc: string }> = ({ title, desc }) => (
  <div className="flex items-start space-x-4">
    <div className="mt-1 w-5 h-5 bg-indigo-500/10 rounded-full flex items-center justify-center text-indigo-500">
      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
    </div>
    <div>
      <h4 className="text-base font-bold text-slate-900 dark:text-white mb-1">{title}</h4>
      <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-tight">{desc}</p>
    </div>
  </div>
);

const FAQItem: React.FC<{ q: string, a: string }> = ({ q, a }) => (
  <div className="bg-white dark:bg-charcoal-800 p-8 rounded-[32px] border border-slate-100 dark:border-white/5 group hover:border-indigo-500/30 transition-all">
    <h4 className="text-base font-bold text-slate-900 dark:text-white mb-4">{q}</h4>
    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{a}</p>
  </div>
);

export default LandingHome;
