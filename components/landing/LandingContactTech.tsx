
import React, { useState } from 'react';

const LandingContactTech: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    issueType: 'API Latency',
    os: 'Windows 11',
    browser: 'Chrome',
    description: '',
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1500);
  };

  return (
    <div className="pt-32 pb-24 px-6 animate-in fade-in duration-1000 selection:bg-cyan-500 selection:text-white">
      <div className="max-w-7xl mx-auto">
        
        {/* Tech Hero */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center mb-32">
          <div>
            <span className="text-xs font-black text-cyan-500 mb-6 block uppercase tracking-[0.4em]">Developer & Infrastructure Support</span>
            <h2 className="text-5xl md:text-8xl font-black text-slate-900 dark:text-white tracking-tighter leading-[0.9] mb-12">
              Technical <br />
              <span className="text-indigo-500 underline decoration-cyan-500/30">Command Center.</span>
            </h2>
            <p className="text-xl text-slate-500 dark:text-slate-400 font-medium leading-relaxed mb-10">
              Direct access to our engineering team for API integrations, high-fidelity bug reporting, and infrastructure transparency.
            </p>
            <div className="flex flex-wrap gap-4">
               <TechBadge label="System Uptime: 99.98%" color="emerald" />
               <TechBadge label="API Latency: 42ms" color="cyan" />
               <TechBadge label="Version: v2.5.4-stable" color="indigo" />
            </div>
          </div>
          
          <div className="bg-slate-900 rounded-[48px] p-8 md:p-12 border border-white/10 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 blur-[80px]"></div>
            <div className="relative z-10 space-y-8">
               <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Live Engine Status</h3>
                  <div className="flex items-center space-x-2">
                     <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                     <span className="text-[10px] font-bold text-emerald-500 uppercase">Operational</span>
                  </div>
               </div>
               <div className="space-y-4">
                  <StatusLine label="Gemini Reasoning Engine" status="Healthy" />
                  <StatusLine label="Vision Multi-modal API" status="Healthy" />
                  <StatusLine label="Global Vector Store" status="Syncing" />
                  <StatusLine label="KaTeX Rendering Service" status="Healthy" />
               </div>
               <div className="pt-6 border-t border-white/5">
                  <p className="text-[10px] font-mono text-slate-500 leading-relaxed">
                    > Initializing kernel... <br />
                    > Scaling pods to 12... <br />
                    > Checking academic integrity filters... [OK]
                  </p>
               </div>
            </div>
          </div>
        </div>

        {/* Technical Channels */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-40">
           <TechChannelCard 
              title="Bug Bounty & Security" 
              desc="Reporting a vulnerability? We take security seriously. Access our VDP and responsible disclosure guidelines." 
              action="Access Portal"
              email="security@aistudy.com"
           />
           <TechChannelCard 
              title="API & SDK Access" 
              desc="Integrate our reasoning engine into your LMS or educational platform. Request documentation and sandbox keys." 
              action="Read Docs"
              email="api@aistudy.com"
           />
           <TechChannelCard 
              title="Infrastructure Partnerships" 
              desc="Hardware manufacturers or cloud providers looking to optimize AI inferencing at the edge." 
              action="Inquire"
              email="infra@aistudy.com"
           />
        </div>

        {/* Detailed Tech Support Form */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-20 mb-40 items-start">
           <div className="lg:col-span-2 space-y-8">
              <h3 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Report a <br />System Anomaly.</h3>
              <p className="text-slate-500 font-medium leading-relaxed">
                To help our engineers reproduce and resolve issues quickly, please provide as much environment-specific data as possible.
              </p>
              <div className="space-y-6">
                 <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-indigo-50 dark:bg-charcoal-800 rounded-xl flex items-center justify-center text-indigo-500">
                       <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
                    </div>
                    <div>
                       <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">Developer Console Logs</p>
                       <p className="text-xs text-slate-400 font-medium">Please attach console output if available.</p>
                    </div>
                 </div>
                 <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-indigo-50 dark:bg-charcoal-800 rounded-xl flex items-center justify-center text-indigo-500">
                       <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                    </div>
                    <div>
                       <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">Privacy Vault Intact</p>
                       <p className="text-xs text-slate-400 font-medium">Crash reports are anonymized by default.</p>
                    </div>
                 </div>
              </div>
           </div>

           <div className="lg:col-span-3">
              <div className="bg-white dark:bg-charcoal-900 p-8 md:p-12 rounded-[64px] border border-slate-100 dark:border-white/5 shadow-2xl relative">
                {submitted ? (
                  <div className="text-center py-20 animate-in fade-in zoom-in">
                    <div className="w-20 h-20 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl">
                       <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <h4 className="text-2xl font-black mb-4 dark:text-white">Ticket Created #TR-2940</h4>
                    <p className="text-slate-500 font-medium">Engineering has received your report. Track status via email.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Anomaly Type</label>
                          <select 
                            value={formData.issueType}
                            onChange={(e) => setFormData({...formData, issueType: e.target.value})}
                            className="w-full bg-slate-50 dark:bg-charcoal-950 border-none rounded-2xl py-4 px-6 text-sm font-bold dark:text-white outline-none"
                          >
                             <option>API Latency</option>
                             <option>KaTeX Rendering Error</option>
                             <option>Vision Recognition Failure</option>
                             <option>Session Sync Issue</option>
                             <option>Security/Bounty Report</option>
                          </select>
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Email Address</label>
                          <input 
                            type="email" 
                            placeholder="engineer@domain.com"
                            className="w-full bg-slate-50 dark:bg-charcoal-950 border-none rounded-2xl py-4 px-6 text-sm font-bold dark:text-white outline-none" 
                          />
                       </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Operating System</label>
                          <input 
                            type="text" 
                            placeholder="e.g. macOS Sonoma, iOS 17"
                            className="w-full bg-slate-50 dark:bg-charcoal-950 border-none rounded-2xl py-4 px-6 text-sm font-bold dark:text-white outline-none" 
                          />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Browser & Version</label>
                          <input 
                            type="text" 
                            placeholder="e.g. Brave v1.62"
                            className="w-full bg-slate-50 dark:bg-charcoal-950 border-none rounded-2xl py-4 px-6 text-sm font-bold dark:text-white outline-none" 
                          />
                       </div>
                    </div>

                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Reproduction Steps</label>
                       <textarea 
                         placeholder="1. Open solver... 2. Upload diagram... 3. Error received..." 
                         rows={4}
                         className="w-full bg-slate-50 dark:bg-charcoal-950 border-none rounded-[32px] py-6 px-8 text-sm font-medium dark:text-white outline-none resize-none" 
                       />
                    </div>

                    <button 
                      type="submit"
                      disabled={loading}
                      className="w-full py-6 bg-slate-900 text-white dark:bg-cyan-500 dark:text-slate-900 rounded-[32px] text-sm font-black uppercase tracking-widest shadow-xl hover:scale-[0.98] transition-all flex items-center justify-center space-x-4"
                    >
                      {loading ? (
                        <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                      ) : (
                        <span>Open Technical Ticket</span>
                      )}
                    </button>
                  </form>
                )}
              </div>
           </div>
        </div>

        {/* Global Infrastructure Section */}
        <div className="bg-slate-50 dark:bg-charcoal-900 rounded-[64px] p-12 md:p-24 border border-slate-100 dark:border-white/5 relative overflow-hidden">
           <div className="max-w-4xl mx-auto text-center">
              <span className="text-xs font-black text-indigo-500 mb-6 block uppercase tracking-[0.4em]">Global Backbone</span>
              <h3 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tighter mb-10 leading-none">Scale Without Compromise.</h3>
              <p className="text-slate-500 font-medium leading-relaxed mb-16">
                Our infrastructure spans 24 global regions to ensure that every student, regardless of their location, experiences sub-second processing for basic queries.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
                 <InfraStat label="Compute Clusters" value="1,200+" />
                 <InfraStat label="Edge Locations" value="280" />
                 <InfraStat label="Peak Throughput" value="2PB/Day" />
                 <InfraStat label="Security Scans" value="24/7" />
              </div>
           </div>
        </div>

      </div>
    </div>
  );
};

const TechBadge: React.FC<{ label: string, color: string }> = ({ label, color }) => {
  const colors: any = {
    emerald: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    cyan: 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20',
    indigo: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20'
  };
  return (
    <span className={`px-4 py-2 rounded-full border text-[10px] font-black uppercase tracking-widest ${colors[color]}`}>
       {label}
    </span>
  );
};

const StatusLine: React.FC<{ label: string, status: string }> = ({ label, status }) => (
  <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
     <span className="text-xs font-bold text-slate-300">{label}</span>
     <span className={`text-[10px] font-black uppercase tracking-widest ${status === 'Healthy' ? 'text-emerald-400' : 'text-amber-400'}`}>
        {status}
     </span>
  </div>
);

const TechChannelCard: React.FC<{ title: string, desc: string, action: string, email: string }> = ({ title, desc, action, email }) => (
  <div className="p-10 bg-white dark:bg-charcoal-800 border border-slate-100 dark:border-white/5 rounded-[48px] shadow-sm hover:shadow-xl transition-all flex flex-col group">
     <h4 className="text-xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">{title}</h4>
     <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed mb-8 flex-1">{desc}</p>
     <div className="pt-6 border-t border-slate-50 dark:border-white/5 flex items-center justify-between">
        <span className="text-[10px] font-mono text-indigo-500">{email}</span>
        <button className="text-[10px] font-black uppercase text-slate-400 group-hover:text-indigo-500 transition-colors">
          {action} →
        </button>
     </div>
  </div>
);

const InfraStat: React.FC<{ label: string, value: string }> = ({ label, value }) => (
  <div className="space-y-1">
     <div className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">{value}</div>
     <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{label}</div>
  </div>
);

export default LandingContactTech;
