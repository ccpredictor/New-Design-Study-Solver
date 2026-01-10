
import React from 'react';

const LandingSuccessStories: React.FC = () => {
  return (
    <div className="pt-32 pb-24 px-6 animate-in fade-in duration-700 selection:bg-indigo-500 selection:text-white">
      <div className="max-w-7xl mx-auto">
        
        {/* Hero Section */}
        <div className="text-center mb-32">
          <span className="text-xs font-black text-indigo-500 mb-6 block uppercase tracking-[0.4em]">Proven Results</span>
          <h2 className="text-5xl md:text-8xl font-black text-slate-900 dark:text-white tracking-tighter leading-[0.9] mb-10">
            Real Stories. <br />
            <span className="text-indigo-500">Real Mastery.</span>
          </h2>
          <p className="text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed">
            From overcoming final exams to mastering professional certifications, see how AI Study Solver is helping thousands of students reach their full potential.
          </p>
        </div>

        {/* Global Impact Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-40">
           <ImpactStat value="22%" label="Average Exam Score Increase" desc="Based on a survey of 5,000 active 'Pro' users over 6 months." />
           <ImpactStat value="14M+" label="Logical Steps Explained" desc="Our AI has broken down millions of complex academic hurdles into simple logic." />
           <ImpactStat value="98%" label="Conceptual Confidence" desc="Percentage of users who feel more capable of solving problems independently." />
        </div>

        {/* Deep Mastery Narratives */}
        <div className="space-y-40 mb-40">
          
          <MasteryCase 
            side="left"
            image="🎓"
            name="Priya S."
            role="University Physics Major, Bangalore"
            title="Conquering Vector Calculus With Visual Logic."
            story="Priya struggled with 3D spatial visualization in her Advanced Physics course. Using our Vision Engine, she was able to upload her lecture sketches and receive a breakdown of how integrals map to physical surfaces. 'It was like having a 24/7 TA who never gets tired of explaining the same concept five times.'"
            feature="Vision Logic & Socratic Tutoring"
            result="B+ to A in Semester Finals"
          />

          <MasteryCase 
            side="right"
            image="🧪"
            name="Marcus T."
            role="Medical Student, London"
            title="The Lifesaver For Organic Chemistry."
            story="Organic Chemistry requires identifying molecular patterns—something Marcus found impossible to memorize. He used AI Study Solver's specialized STEM Mode to identify reaction mechanisms. 'The AI didn't just give the product; it showed me the electron flow, which finally made the mechanisms click.'"
            feature="STEM Specialist Reasoning"
            result="Top 5% of Clinical Cohort"
          />

          <MasteryCase 
            side="left"
            image="🏫"
            name="Arjun K."
            role="Class 12 Student, Ahmedabad"
            title="Breaking The Language Barrier In STEM."
            story="Arjun's primary language is Gujarati, but his textbooks are in English. He used our Regional Language Lab to ask questions in Gujarati and receive explanations that bridged the gap. 'For the first time, I wasn't fighting the language; I was actually fighting the problem. My Physics marks jumped instantly.'"
            feature="Regional Language Lab"
            result="92% in State Board Exams"
          />

        </div>

        {/* The Wall Of Love (Masonry-style snippets) */}
        <div className="mb-40">
          <div className="text-center mb-20">
             <h3 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">The Wall Of Love.</h3>
             <p className="text-slate-500 font-medium">Voices from our growing global student community.</p>
          </div>
          <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
            <TestimonialSnippet 
              author="Sarah L." 
              text="The Study Planner is insane. It calculated exactly how much I needed to study each day for my SATs and I actually stuck to it." 
              tag="Planner" 
            />
            <TestimonialSnippet 
              author="David Chen" 
              text="No other AI handles LaTeX math as cleanly as this. The steps are actually readable on a phone screen." 
              tag="UX Design" 
            />
            <TestimonialSnippet 
              author="Dr. Sofia" 
              text="I recommend this to my undergrads as a supplementary tutor. The Socratic mode encourages them to think instead of just copy-pasting." 
              tag="Educator" 
            />
            <TestimonialSnippet 
              author="Rajiv M." 
              text="Solving chemistry equations on the fly during late-night study sessions has never been easier. Truly a lifesaver." 
              tag="STEM" 
            />
            <TestimonialSnippet 
              author="Elena Ross" 
              text="The regional support for Spanish is remarkably accurate. It's helping me bridge the gap in my engineering lectures." 
              tag="Language" 
            />
            <TestimonialSnippet 
              author="Kofi B." 
              text="Finally an AI that doesn't hallucinate math results. The grounding with Google Search makes a huge difference." 
              tag="Accuracy" 
            />
          </div>
        </div>

        {/* Closing CTA */}
        <div className="p-12 md:p-24 bg-indigo-500 rounded-[64px] text-white text-center relative overflow-hidden shadow-2xl shadow-indigo-500/20">
           <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 blur-[100px] rounded-full"></div>
           <h3 className="text-4xl md:text-6xl font-black tracking-tighter mb-8 leading-none">Your Success Story <br />Starts Here.</h3>
           <p className="text-xl text-indigo-50 font-medium max-w-2xl mx-auto mb-12">
             Join over 50,000 students who have transformed their grades and their confidence with AI Study Solver.
           </p>
           <button className="px-12 py-6 bg-white text-indigo-600 rounded-[32px] text-lg font-black shadow-xl hover:scale-105 active:scale-95 transition-all">
             Unlock Your Potential Now
           </button>
        </div>

      </div>
    </div>
  );
};

const ImpactStat: React.FC<{ value: string, label: string, desc: string }> = ({ value, label, desc }) => (
  <div className="p-10 bg-white dark:bg-charcoal-800 border border-slate-100 dark:border-white/5 rounded-[48px] shadow-sm text-center">
    <div className="text-5xl font-black text-indigo-500 tracking-tighter mb-4">{value}</div>
    <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest mb-4">{label}</h4>
    <p className="text-xs text-slate-400 font-medium leading-relaxed">{desc}</p>
  </div>
);

const MasteryCase: React.FC<{ 
  side: 'left' | 'right', 
  image: string, 
  name: string, 
  role: string, 
  title: string, 
  story: string, 
  feature: string, 
  result: string 
}> = ({ side, image, name, role, title, story, feature, result }) => (
  <div className={`flex flex-col lg:flex-row items-center gap-16 ${side === 'right' ? 'lg:flex-row-reverse' : ''}`}>
    <div className="w-full lg:w-1/3 flex flex-col items-center">
       <div className="w-48 h-48 bg-slate-50 dark:bg-charcoal-900 rounded-[64px] border border-slate-100 dark:border-white/5 flex items-center justify-center text-7xl shadow-xl">
          {image}
       </div>
       <div className="mt-8 text-center">
          <p className="text-xl font-black text-slate-900 dark:text-white">{name}</p>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">{role}</p>
       </div>
    </div>
    <div className="flex-1 space-y-8">
       <h3 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">{title}</h3>
       <p className="text-lg text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
         "{story}"
       </p>
       <div className="flex flex-wrap gap-4">
          <div className="px-6 py-3 bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 rounded-2xl">
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Key Feature Used</span>
             <span className="text-sm font-bold text-indigo-500">{feature}</span>
          </div>
          <div className="px-6 py-3 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 rounded-2xl">
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Impact Delivered</span>
             <span className="text-sm font-bold text-emerald-500">{result}</span>
          </div>
       </div>
    </div>
  </div>
);

const TestimonialSnippet: React.FC<{ author: string, text: string, tag: string }> = ({ author, text, tag }) => (
  <div className="break-inside-avoid bg-white dark:bg-charcoal-900 p-8 rounded-[40px] border border-slate-100 dark:border-white/5 shadow-sm hover:shadow-xl transition-all group">
     <div className="flex items-center justify-between mb-6">
        <span className="text-xs font-black text-indigo-500 uppercase tracking-widest bg-indigo-50 dark:bg-indigo-500/10 px-3 py-1 rounded-lg">{tag}</span>
        <div className="flex space-x-0.5">
           {[...Array(5)].map((_, i) => (
             <svg key={i} className="w-3 h-3 text-amber-400 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" /></svg>
           ))}
        </div>
     </div>
     <p className="text-sm text-slate-600 dark:text-slate-400 font-medium leading-relaxed italic mb-6">
        "{text}"
     </p>
     <p className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tighter">— {author}</p>
  </div>
);

export default LandingSuccessStories;
