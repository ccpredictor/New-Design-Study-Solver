
import React from 'react';

const LandingPricing: React.FC = () => {
  return (
    <div className="pt-32 pb-20 px-6 animate-in fade-in duration-700">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <span className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.4em] mb-4 block">Investment</span>
          <h2 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tight uppercase">Simple Plans. <br />Better Results.</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <PricingCard 
            name="Starter" 
            price="0" 
            features={["10 Daily AI Solutions", "Basic Study Planner", "Public Channels Access"]} 
            cta="Start Free"
            popular={false}
          />
          <PricingCard 
            name="Academic Pro" 
            price="9" 
            features={["Unlimited Solutions", "Full Exam Generator", "Private Academic Channels", "Priority AI Queue"]} 
            cta="Go Pro Now"
            popular={true}
          />
          <PricingCard 
            name="Institution" 
            price="Custom" 
            features={["Admin Control Panel", "Student Monitoring", "Bulk Onboarding", "Custom System Prompts"]} 
            cta="Contact Sales"
            popular={false}
          />
        </div>
      </div>
    </div>
  );
};

const PricingCard: React.FC<{ name: string, price: string, features: string[], cta: string, popular: boolean }> = ({ name, price, features, cta, popular }) => (
  <div className={`p-10 rounded-[48px] border relative transition-all flex flex-col ${popular ? 'bg-indigo-500 text-white border-indigo-600 shadow-2xl shadow-indigo-500/20 scale-105 z-10' : 'bg-white dark:bg-charcoal-900 border-slate-100 dark:border-white/5 text-slate-900 dark:text-white'}`}>
    {popular && <span className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-emerald-500 text-white text-[8px] font-black uppercase tracking-widest rounded-full">Most Popular</span>}
    <h3 className="text-xs font-black uppercase tracking-widest mb-2 opacity-60">{name}</h3>
    <div className="text-4xl font-black mb-8 flex items-baseline">
      {price !== 'Custom' && <span>$</span>}
      <span>{price}</span>
      {price !== 'Custom' && <span className="text-sm opacity-60 ml-1 font-bold">/mo</span>}
    </div>
    <ul className="space-y-4 mb-10 flex-1">
      {features.map(f => (
        <li key={f} className="flex items-center space-x-3 text-[11px] font-bold">
          <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
          <span className="uppercase tracking-tight">{f}</span>
        </li>
      ))}
    </ul>
    <button className={`w-full py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${popular ? 'bg-white text-indigo-600 hover:bg-slate-50' : 'bg-indigo-500 text-white hover:bg-indigo-600'}`}>
      {cta}
    </button>
  </div>
);

export default LandingPricing;
