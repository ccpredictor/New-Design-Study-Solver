
import React from 'react';

const LandingAbout: React.FC = () => {
  return (
    <div className="pt-32 pb-24 px-6 animate-in fade-in duration-1000 selection:bg-indigo-500 selection:text-white">
      <div className="max-w-7xl mx-auto">
        
        {/* Hero Section */}
        <div className="text-center mb-32">
          <span className="text-xs font-black text-indigo-500 mb-6 block uppercase tracking-[0.4em]">The Architecture Of Understanding</span>
          <h2 className="text-5xl md:text-8xl font-black text-slate-900 dark:text-white tracking-tighter leading-[0.9] mb-12">
            AI As A Ladder, <br />
            <span className="text-indigo-500">Not A Crutch.</span>
          </h2>
          <p className="text-xl md:text-2xl text-slate-500 dark:text-slate-400 max-w-3xl mx-auto font-medium leading-relaxed">
            We are redefining the intersection of Artificial Intelligence and Human Pedagogy. Our mission is to move the world beyond "Answers" and toward "Mastery."
          </p>
        </div>

        {/* The Problem & The Pivot */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 mb-48 items-center">
          <div className="space-y-10">
            <h3 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white leading-tight tracking-tight">The Genesis: Solving The <br />"Lazy AI" Problem.</h3>
            <p className="text-lg text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
              In early 2023, we observed a dangerous trend in education: students were using AI to bypass the struggle of learning. Standard LLMs were providing answers with zero context, leading to short-term grades but long-term intellectual stagnation.
            </p>
            <p className="text-lg text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
              AI Study Solver was born from a simple question: <span className="text-indigo-600 dark:text-indigo-400 italic">"Can we build an AI that refuses to just give the answer, and instead insists on teaching the logic?"</span>
            </p>
            <div className="flex items-center space-x-6 pt-4">
               <div className="flex -space-x-3">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white dark:border-charcoal-900 bg-slate-200 dark:bg-charcoal-800"></div>
                  ))}
               </div>
               <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Built by Educators & Engineers</p>
            </div>
          </div>
          <div className="relative">
             <div className="absolute -inset-10 bg-indigo-500/10 blur-[100px] rounded-full"></div>
             <div className="relative bg-white dark:bg-charcoal-900 border border-slate-100 dark:border-white/5 rounded-[64px] p-12 shadow-2xl">
                <div className="space-y-8">
                   <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">The Old Way (Flat AI)</span>
                      <span className="text-[10px] font-black text-red-500 uppercase">Output: Answer Only</span>
                   </div>
                   <div className="h-px bg-slate-50 dark:bg-white/5"></div>
                   <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">The New Way (AI Solver)</span>
                      <span className="text-[10px] font-black text-emerald-500 uppercase">Output: Stepwise Mastery</span>
                   </div>
                   <div className="space-y-3">
                      <div className="h-3 bg-indigo-500/20 rounded-full w-full"></div>
                      <div className="h-3 bg-indigo-500/20 rounded-full w-5/6"></div>
                      <div className="h-3 bg-indigo-500/20 rounded-full w-4/6"></div>
                      <div className="h-3 bg-indigo-500/20 rounded-full w-3/4"></div>
                   </div>
                </div>
             </div>
          </div>
        </div>

        {/* The Five Pillars of Mastery */}
        <div className="mb-48">
          <div className="text-center mb-24">
             <h3 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tight mb-6">The Five Pillars Of Mastery.</h3>
             <p className="text-slate-500 font-medium max-w-2xl mx-auto">Every line of code in our engine is governed by these five pedagogical laws.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <PillarCard 
              number="01" 
              title="Socratic Interrogation" 
              desc="Our AI is trained to guide, not dictate. It identifies what you already know and builds the bridge to what you don't." 
              tags={["Active Learning", "Critical Thinking"]}
            />
            <PillarCard 
              number="02" 
              title="First-Principles Logic" 
              desc="We strip away the academic jargon to reveal the fundamental laws of nature and math that drive the solution." 
              tags={["Conceptual Atoms", "Mental Models"]}
            />
            <PillarCard 
              number="03" 
              title="Symbolic Multi-Modality" 
              desc="The AI simultaneously reasons across text, math symbols, and physical diagrams to ensure contextual accuracy." 
              tags={["Native Math", "Vision Logic"]}
            />
            <PillarCard 
              number="04" 
              title="Linguistic Equity" 
              desc="Intelligence is global; language shouldn't be a barrier. We bring elite STEM reasoning to local vernaculars." 
              tags={["Regional Support", "Global Access"]}
            />
            <PillarCard 
              number="05" 
              title="Zero-Hallucination Integrity" 
              desc="In STEM, being 'close' is wrong. We use multi-stage verification to ensure every calculation is bulletproof." 
              tags={["Factual Grounding", "Precision Code"]}
            />
            <div className="p-10 bg-indigo-500 rounded-[48px] text-white flex flex-col justify-center">
               <h4 className="text-2xl font-black mb-4 leading-tight">Join The Educational Revolution.</h4>
               <p className="text-sm text-indigo-100 font-medium mb-8">Help us build the most helpful teacher in human history.</p>
               <button className="w-full py-4 bg-white text-indigo-600 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg">Our Careers</button>
            </div>
          </div>
        </div>

        {/* Vision 2030 */}
        <div className="bg-slate-900 rounded-[64px] p-12 md:p-24 text-white relative overflow-hidden mb-48">
          <div className="absolute top-0 right-0 w-full h-full bg-indigo-500/5 blur-[120px]"></div>
          <div className="relative z-10 max-w-4xl">
            <span className="text-indigo-400 font-black text-xs uppercase tracking-[0.4em] mb-6 block">The Long View</span>
            <h3 className="text-4xl md:text-7xl font-black mb-10 leading-[0.9] tracking-tighter">Vision 2030: <br />Democratizing Elite Genius.</h3>
            <div className="space-y-8 text-lg md:text-xl text-slate-400 font-medium leading-relaxed">
              <p>
                We believe that the quality of your education should not be determined by your zip code or your family's bank account. Elite private tutoring has historically been a privilege of the few.
              </p>
              <p>
                By 2030, AI Study Solver aims to provide every student on the planet with a personalized, context-aware, and multi-lingual tutor that is more effective than any human counterpart. 
              </p>
              <p className="text-white font-bold">
                We are building the infrastructure for a world where no student ever has to say, "I just don't get it."
              </p>
            </div>
          </div>
        </div>

        {/* Trust & Transparency */}
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-10">Our Commitment To Ethics.</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left">
            <div className="space-y-4">
               <h4 className="text-sm font-black text-indigo-500 uppercase tracking-widest">Privacy By Design</h4>
               <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                 Your learning data is your own. We do not sell student profiles or query history. We use data solely to improve the pedagogical accuracy of your personal tutor.
               </p>
            </div>
            <div className="space-y-4">
               <h4 className="text-sm font-black text-indigo-500 uppercase tracking-widest">Anti-Cheating Policy</h4>
               <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                 We strictly coordinate with educational institutions to ensure our AI acts as a teaching aid, not a loophole. We prioritize the Socratic method to prevent academic dishonesty.
               </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

const PillarCard: React.FC<{ number: string, title: string, desc: string, tags: string[] }> = ({ number, title, desc, tags }) => (
  <div className="p-10 bg-white dark:bg-charcoal-800 border border-slate-100 dark:border-white/5 rounded-[48px] shadow-sm hover:shadow-xl transition-all flex flex-col group">
    <div className="text-5xl font-black text-slate-100 dark:text-charcoal-700 mb-8 group-hover:text-indigo-500/20 transition-colors">{number}</div>
    <h4 className="text-xl font-black text-slate-900 dark:text-white mb-4 leading-tight">{title}</h4>
    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed mb-8 flex-1">{desc}</p>
    <div className="flex flex-wrap gap-2">
      {tags.map(tag => (
        <span key={tag} className="text-[9px] font-black text-indigo-500 uppercase tracking-widest bg-indigo-50 dark:bg-indigo-500/10 px-3 py-1 rounded-lg">
          {tag}
        </span>
      ))}
    </div>
  </div>
);

export default LandingAbout;
