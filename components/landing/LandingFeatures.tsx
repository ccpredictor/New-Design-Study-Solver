
import React from 'react';

const LandingFeatures: React.FC = () => {
  return (
    <div className="pt-32 pb-24 px-6 animate-in fade-in slide-in-from-bottom-6 duration-700 selection:bg-indigo-500 selection:text-white">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-32">
          <span className="text-xs font-black text-indigo-500 mb-6 block uppercase tracking-[0.3em]">Our Platform Capabilities</span>
          <h2 className="text-5xl md:text-8xl font-black text-slate-900 dark:text-white tracking-tighter leading-[0.9] mb-10">
            Engineered For <br />
            <span className="text-indigo-500">Academic Mastery.</span>
          </h2>
          <p className="text-xl text-slate-500 dark:text-slate-400 max-w-3xl mx-auto font-medium leading-relaxed">
            AI Study Solver is not just another chatbot. It is a specialized pedagogical engine designed to transform how students perceive and solve complex problems.
          </p>
        </div>

        {/* Deep Dive: Visual Intelligence */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 mb-40 items-center">
          <div className="space-y-10">
            <div className="inline-flex items-center space-x-3 px-4 py-2 bg-indigo-500/10 rounded-2xl border border-indigo-500/20">
              <span className="text-indigo-500 text-xl">👁️</span>
              <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">Multi-Modal Vision Engine</span>
            </div>
            <h3 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white leading-tight tracking-tight">Advanced Visual <br />Reasoning Intelligence.</h3>
            <p className="text-lg text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
              Our Vision AI goes beyond basic Character Recognition (OCR). It understands context, spatial geometry, and technical symbology to provide accurate interpretations of complex visuals.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <DetailedFeatureItem
                title="Handwriting Deciphering"
                desc="Proprietary models trained on messy student handwriting and blackboard chalk notes."
              />
              <DetailedFeatureItem
                title="Circuit & Diagram Logic"
                desc="Identifies electrical components, biological pathways, and chemical structures from photos."
              />
              <DetailedFeatureItem
                title="Graph To Equation"
                desc="Automatically extracts data points from plotted graphs and converts them into solvable math."
              />
              <DetailedFeatureItem
                title="Symbolic Accuracy"
                desc="Flawless recognition of Greek symbols, subscripts, and complex mathematical notation."
              />
            </div>
          </div>
          <div className="relative group">
            <div className="absolute -inset-4 bg-indigo-500/10 rounded-[64px] blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            <div className="bg-slate-50 dark:bg-charcoal-900 rounded-[56px] p-10 border border-slate-100 dark:border-white/5 relative overflow-hidden shadow-2xl">
              <div className="space-y-6">
                <div className="bg-white dark:bg-charcoal-800 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-white/5">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Image Analysis In Progress</span>
                    <div className="w-2 h-2 bg-indigo-500 rounded-full animate-ping"></div>
                  </div>
                  <div className="aspect-video bg-slate-100 dark:bg-charcoal-950 rounded-2xl flex items-center justify-center overflow-hidden">
                    <div className="text-4xl">📸</div>
                  </div>
                </div>
                <div className="bg-indigo-500 text-white p-6 rounded-3xl shadow-xl shadow-indigo-500/20">
                  <p className="text-sm font-bold leading-relaxed">"I've detected a Vector Calculus problem involving a Surface Integral. Would you like me to identify the parameters first?"</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Deep Dive: Socratic Pedagogy */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 mb-40 items-center">
          <div className="order-2 lg:order-1 relative">
            <div className="bg-indigo-600 rounded-[64px] p-12 text-white shadow-2xl shadow-indigo-500/20">
              <h4 className="text-2xl font-black mb-6">The Logic Chain</h4>
              <div className="space-y-4">
                <LogicStep number="1" label="Conceptual Anchor" desc="Defining the laws of physics applied." />
                <LogicStep number="2" label="Variable Extraction" desc="Isolating knowns and unknowns." />
                <LogicStep number="3" label="Stepwise Execution" desc="No skips. Full logical progression." />
                <LogicStep number="4" label="Sanity Check" desc="Verifying results against grounding sources." />
              </div>
            </div>
          </div>
          <div className="order-1 lg:order-2 space-y-10">
            <div className="inline-flex items-center space-x-3 px-4 py-2 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
              <span className="text-emerald-500 text-xl">🧠</span>
              <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">Pedagogical Framework</span>
            </div>
            <h3 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white leading-tight tracking-tight">Socratic Method <br />And Logical Reasoning.</h3>
            <p className="text-lg text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
              We discourage rote memorization. Our AI is designed to simulate a high-end personal tutor that focuses on developing your critical thinking skills.
            </p>
            <ul className="space-y-6">
              <DetailedBullet
                title="Conceptual Why-First Approach"
                desc="Before showing the math, we explain the theory. Understanding the 'Why' makes the 'How' much easier."
              />
              <DetailedBullet
                title="Mistake Diagnostics"
                desc="If you provide your own solution, the AI analyzes exactly where your logic failed and explains how to fix it."
              />
              <DetailedBullet
                title="Adaptive Complexity"
                desc="Whether you are in 8th Grade or a Senior in University, the language and complexity of explanations scale automatically."
              />
            </ul>
          </div>
        </div>

        {/* Technical Capabilities Grid */}
        <div className="mb-40">
          <div className="text-center mb-20">
            <h3 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-4">Unmatched Feature Set.</h3>
            <p className="text-slate-500 font-medium">Tools built to handle every aspect of your academic lifecycle.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FullToolCard
              icon="📝"
              title="Exam Engineering Suite"
              desc="Generate full-length mock papers with MCQs, Short Answers, and Case Studies. Includes an assistant-grade marking scheme."
              bullets={["Syllabus Alignment", "Difficulty Selection", "PDF Contextualization"]}
            />
            <FullToolCard
              icon="📅"
              title="Dynamic Study Planner"
              desc="Create adaptive roadmaps based on your exam dates, target scores, and current subject proficiency."
              bullets={["Revision Cycles", "Milestone Tracking", "Target-Based Scheduling"]}
            />
            <FullToolCard
              icon="🌐"
              title="Regional Language Lab"
              desc="Truly multi-lingual support. Reason in your native tongue (Hindi, Gujarati, Tamil, etc.) and solve in English."
              bullets={["Translation-Free Logic", "Vernacular Support", "Dual-Language Output"]}
            />
            <FullToolCard
              icon="🔍"
              title="Verified Grounding"
              desc="Every solution is cross-referenced with Google Search and scholarly articles to ensure zero hallucinations."
              bullets={["Live Web Citations", "Source Linking", "Fact Verification"]}
            />
            <FullToolCard
              icon="🧬"
              title="STEM Specialist Mode"
              desc="Specialized prompts for Physics, Organic Chemistry, and Advanced Calculus that handle complex symbolic math."
              bullets={["LaTeX Support", "Molecular Visualization", "Formula Breakdown"]}
            />
            <FullToolCard
              icon="🔒"
              title="Private Learning Vault"
              desc="Securely store your solved problems and notes for later review. Build a personalized knowledge base over time."
              bullets={["Cloud Sync", "Folder Organization", "Quick Revision Deck"]}
            />
          </div>
        </div>

        {/* Tech Stack Specs */}
        <div className="bg-slate-900 rounded-[64px] p-12 md:p-24 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-full h-full bg-indigo-500/5 blur-[120px] rounded-full"></div>
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <span className="text-indigo-400 font-black text-xs uppercase tracking-[0.3em] mb-6 block">The Tech Behind The Magic</span>
              <h3 className="text-4xl md:text-6xl font-black mb-8 leading-none tracking-tighter">Performance At Scale.</h3>
              <p className="text-slate-400 text-lg font-medium leading-relaxed mb-12">
                Our infrastructure is built on an Advanced AI backbone, ensuring that your queries are processed with the highest fidelity and lowest latency in the industry.
              </p>
              <div className="grid grid-cols-2 gap-10">
                <StatBlock label="Average Latency" value="1.8s" />
                <StatBlock label="Token Window" value="2.1M" />
                <StatBlock label="Accuracy Rate" value="99.2%" />
                <StatBlock label="Uptime SLA" value="99.9%" />
              </div>
            </div>
            <div className="space-y-4">
              <CapabilityRow label="Vision Modality" value="Native Gemini Vision" />
              <CapabilityRow label="Logical Grounding" value="Google Search Integration" />
              <CapabilityRow label="Reasoning Chain" value="Multi-Step Socratic" />
              <CapabilityRow label="Data Security" value="End-to-End Encryption" />
              <CapabilityRow label="Global CDN" value="Edge-Optimized Delivery" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const DetailedFeatureItem: React.FC<{ title: string, desc: string }> = ({ title, desc }) => (
  <div className="space-y-2">
    <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">{title}</h4>
    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{desc}</p>
  </div>
);

const DetailedBullet: React.FC<{ title: string, desc: string }> = ({ title, desc }) => (
  <li className="flex items-start space-x-4">
    <div className="mt-1 w-6 h-6 bg-indigo-500 text-white rounded-lg flex items-center justify-center flex-shrink-0 text-[10px] font-bold">✓</div>
    <div>
      <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-1">{title}</h4>
      <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-tight">{desc}</p>
    </div>
  </li>
);

const LogicStep: React.FC<{ number: string, label: string, desc: string }> = ({ number, label, desc }) => (
  <div className="flex items-center space-x-6 bg-white/10 p-5 rounded-3xl border border-white/10 backdrop-blur-md">
    <span className="text-2xl font-black text-indigo-300">0{number}</span>
    <div>
      <p className="text-sm font-black text-white uppercase tracking-wider">{label}</p>
      <p className="text-[11px] text-indigo-100 font-medium">{desc}</p>
    </div>
  </div>
);

const FullToolCard: React.FC<{ icon: string, title: string, desc: string, bullets: string[] }> = ({ icon, title, desc, bullets }) => (
  <div className="p-10 bg-white dark:bg-charcoal-800 border border-slate-100 dark:border-white/5 rounded-[48px] shadow-sm hover:shadow-xl transition-all flex flex-col group">
    <div className="text-4xl mb-8 group-hover:scale-125 transition-transform duration-500 origin-left">{icon}</div>
    <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-4">{title}</h4>
    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed mb-8 flex-1">{desc}</p>
    <div className="space-y-2 border-t border-slate-50 dark:border-white/5 pt-6">
      {bullets.map(b => (
        <div key={b} className="flex items-center space-x-2">
          <div className="w-1 h-1 bg-indigo-500 rounded-full"></div>
          <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{b}</span>
        </div>
      ))}
    </div>
  </div>
);

const StatBlock: React.FC<{ label: string, value: string }> = ({ label, value }) => (
  <div className="space-y-1">
    <div className="text-4xl font-black text-indigo-400 tracking-tighter">{value}</div>
    <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{label}</div>
  </div>
);

const CapabilityRow: React.FC<{ label: string, value: string }> = ({ label, value }) => (
  <div className="flex items-center justify-between p-5 bg-white/5 rounded-2xl border border-white/10">
    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</span>
    <span className="text-sm font-bold text-white">{value}</span>
  </div>
);

export default LandingFeatures;
