
import React from 'react';

const LandingRoadmap: React.FC = () => {
  return (
    <div className="pt-32 pb-24 px-6 animate-in fade-in duration-700">
      <div className="max-w-6xl mx-auto">
        {/* Hero Header */}
        <div className="text-center mb-32">
          <span className="text-xs font-black text-indigo-500 mb-6 block uppercase tracking-[0.4em]">The Path To Excellence</span>
          <h2 className="text-5xl md:text-8xl font-black text-slate-900 dark:text-white tracking-tighter leading-[0.9] mb-10">
            Your Academic <br />
            <span className="text-indigo-500">Mastery Roadmap.</span>
          </h2>
          <p className="text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed">
            A structured, AI-guided journey designed to take you from initial curiosity to professional-level subject proficiency.
          </p>
        </div>

        {/* Timeline Layout */}
        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-slate-100 dark:bg-white/10 hidden lg:block"></div>

          <div className="space-y-32 relative">
            
            {/* Phase 1 */}
            <RoadmapSection 
              side="left"
              number="01"
              title="Intelligence Profiling & Baseline"
              subtitle="Establishing Your Starting Point"
              desc="The journey begins with a deep analysis of your current academic standing. Our AI diagnostic tools evaluate your strengths and weaknesses across core curriculum topics."
              milestones={[
                "AI Diagnostic Assessment",
                "Personalized Learning Profile Setup",
                "Curriculum Gap Identification",
                "Goal Setting & Target Grade Definition"
              ]}
              icon="🧬"
            />

            {/* Phase 2 */}
            <RoadmapSection 
              side="right"
              number="02"
              title="Active Multi-Modal Interaction"
              subtitle="Breaking Down The Barriers"
              desc="Master the tools of the future. Learn to solve complex problems using Vision AI, voice queries, and multi-lingual reasoning."
              milestones={[
                "Vision Engine Mastery (Image-to-Logic)",
                "Complex Symbolic Interpretation",
                "Context-Aware Solving Drills",
                "Multi-Lingual Conceptual Bridging"
              ]}
              icon="👁️"
            />

            {/* Phase 3 */}
            <RoadmapSection 
              side="left"
              number="03"
              title="First-Principles Reasoning"
              subtitle="Moving Beyond The Answer"
              desc="The core of mastery. Transition from finding results to understanding the underlying logic. Our Socratic AI pushes you to reason from fundamentals."
              milestones={[
                "Socratic Tutoring Sessions",
                "Logical Fallacy Detection",
                "Step-by-Step Logic Verification",
                "Conceptual Why-First Analysis"
              ]}
              icon="🧠"
            />

            {/* Phase 4 */}
            <RoadmapSection 
              side="right"
              number="04"
              title="Peer-to-Peer Synergy"
              subtitle="Collaborative Learning At Scale"
              desc="Join Academic Channels to test your knowledge against peers. Explain concepts to others and participate in AI-moderated group discussions."
              milestones={[
                "Academic Channel Integration",
                "Collaborative Problem Solving",
                "Shared Lesson Reviews",
                "Peer Logic Auditing"
              ]}
              icon="🤝"
            />

            {/* Phase 5 */}
            <RoadmapSection 
              side="left"
              number="05"
              title="Predictive Success & Excellence"
              subtitle="Securing Your Future"
              desc="Use advanced Exam Engineering and AI Insights to simulate actual tests. Ensure zero-hallucination accuracy and time-management mastery."
              milestones={[
                "Mock Exam Generation",
                "AI Performance Insights Report",
                "Dynamic Revision Cycles",
                "Certification Of Mastery"
              ]}
              icon="🏆"
            />

          </div>
        </div>

        {/* Strategic Growth Banner */}
        <div className="mt-48 p-12 md:p-24 bg-slate-900 rounded-[64px] text-white relative overflow-hidden shadow-2xl shadow-slate-900/30">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-indigo-500/10 blur-[120px]"></div>
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12 text-left">
            <div className="max-w-2xl">
              <h3 className="text-4xl md:text-6xl font-black mb-6 leading-none tracking-tighter">Ready To Start Phase 01?</h3>
              <p className="text-slate-400 text-lg font-medium leading-relaxed">
                The roadmap is set. All that remains is your first step. Join thousands of students already moving through the phases of academic excellence.
              </p>
            </div>
            <button className="whitespace-nowrap px-12 py-6 bg-indigo-500 text-white rounded-[32px] text-lg font-black shadow-xl shadow-indigo-500/30 hover:scale-105 active:scale-95 transition-all">
              Begin Your Journey
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const RoadmapSection: React.FC<{ 
  side: 'left' | 'right', 
  number: string, 
  title: string, 
  subtitle: string, 
  desc: string, 
  milestones: string[],
  icon: string
}> = ({ side, number, title, subtitle, desc, milestones, icon }) => (
  <div className={`flex flex-col lg:flex-row items-center w-full ${side === 'right' ? 'lg:flex-row-reverse' : ''}`}>
    {/* Content Side */}
    <div className={`w-full lg:w-1/2 ${side === 'left' ? 'lg:pr-20 lg:text-right' : 'lg:pl-20 lg:text-left'} space-y-6`}>
      <div className={`flex items-center space-x-4 ${side === 'left' ? 'lg:flex-row-reverse lg:space-x-reverse' : ''}`}>
        <span className="text-4xl font-black text-indigo-500/20">{number}</span>
        <span className="text-xs font-black text-indigo-500 uppercase tracking-widest">{subtitle}</span>
      </div>
      <h3 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">{title}</h3>
      <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
        {desc}
      </p>
      <ul className={`space-y-3 pt-4 flex flex-col ${side === 'left' ? 'lg:items-end' : 'lg:items-start'}`}>
        {milestones.map((m, idx) => (
          <li key={idx} className="flex items-center space-x-3 text-sm font-bold text-slate-700 dark:text-slate-300">
             <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></div>
             <span>{m}</span>
          </li>
        ))}
      </ul>
    </div>

    {/* Center Node */}
    <div className="hidden lg:flex items-center justify-center relative z-20">
      <div className="w-16 h-16 bg-white dark:bg-charcoal-800 rounded-2xl border-2 border-slate-100 dark:border-white/10 shadow-xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-500">
        {icon}
      </div>
    </div>

    {/* Spacer Side */}
    <div className="hidden lg:block w-1/2"></div>
  </div>
);

export default LandingRoadmap;
