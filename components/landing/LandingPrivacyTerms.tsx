
import React from 'react';

const LandingPrivacyTerms: React.FC = () => {
  return (
    <div className="pt-32 pb-24 px-6 animate-in fade-in duration-1000 selection:bg-indigo-500 selection:text-white">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="mb-20">
          <span className="text-xs font-black text-indigo-500 mb-6 block uppercase tracking-[0.4em]">Governance & Trust</span>
          <h2 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white tracking-tighter leading-[0.9] mb-8">
            Privacy & <br />
            <span className="text-indigo-500">Legal Terms.</span>
          </h2>
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Effective Date: January 1, 2025</p>
        </div>

        {/* Content Navigation (Anchor links style) */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          
          {/* Side Nav */}
          <div className="lg:col-span-1 hidden lg:block sticky top-32 h-fit space-y-4">
             <LegalNavLink label="Privacy Policy" href="#privacy" />
             <LegalNavLink label="Terms of Service" href="#terms" />
             <LegalNavLink label="AI Ethical Guidelines" href="#ethics" />
             <LegalNavLink label="Refund Policy" href="#refunds" />
             <LegalNavLink label="Contact Legal" href="#contact" />
          </div>

          {/* Main Document */}
          <div className="lg:col-span-3 space-y-24">
            
            {/* Section: Privacy Policy */}
            <section id="privacy" className="space-y-8 scroll-mt-32">
               <div className="space-y-4">
                  <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">1. Privacy Policy</h3>
                  <p className="text-lg text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                     At AI Study Solver, we believe your academic curiosity should never come at the cost of your privacy. This policy outlines how we handle your data with the highest standards of security and transparency.
                  </p>
               </div>

               <div className="space-y-6">
                  <LegalSubSection title="1.1 Information We Collect">
                     <p>We collect only the information necessary to provide an elite learning experience:</p>
                     <ul className="list-disc pl-5 space-y-2 mt-2">
                        <li><strong>Identity Data:</strong> Name and email used for account verification.</li>
                        <li><strong>Academic Data:</strong> The queries, images, and documents you upload for AI analysis.</li>
                        <li><strong>Usage Data:</strong> Technical logs to improve our Socratic reasoning engine.</li>
                     </ul>
                  </LegalSubSection>

                  <LegalSubSection title="1.2 AI Processing & Data Sovereignty">
                     <p>Your academic queries are processed using Google Gemini 1.5/2.5 Pro models. We ensure that:</p>
                     <ul className="list-disc pl-5 space-y-2 mt-2">
                        <li><strong>Transient Processing:</strong> Your data is used to generate answers but is not used to train global public AI models.</li>
                        <li><strong>Encryption:</strong> All data in transit is protected using TLS 1.3 encryption.</li>
                        <li><strong>Data Portability:</strong> You can export your entire study history at any time.</li>
                     </ul>
                  </LegalSubSection>

                  <LegalSubSection title="1.3 Data Storage & Deletion">
                     <p>We store your data securely in Firebase (Google Cloud). You have the right to request full account deletion, which results in the permanent removal of all your study history and files from our active servers within 30 days.</p>
                  </LegalSubSection>
               </div>
            </section>

            {/* Section: Terms of Service */}
            <section id="terms" className="space-y-8 scroll-mt-32">
               <div className="space-y-4">
                  <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">2. Terms of Service</h3>
                  <p className="text-lg text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                     By using AI Study Solver, you agree to these terms. Please read them carefully to understand your rights and responsibilities.
                  </p>
               </div>

               <div className="space-y-6">
                  <LegalSubSection title="2.1 Acceptable Use">
                     <p>You agree to use AI Study Solver solely for academic and educational purposes. Prohibited uses include:</p>
                     <ul className="list-disc pl-5 space-y-2 mt-2">
                        <li>Attempting to bypass safety filters to generate harmful content.</li>
                        <li>Automated "scraping" or reverse-engineering of our reasoning engine.</li>
                        <li>Harassment or abusive behavior toward other students in Academic Channels.</li>
                     </ul>
                  </LegalSubSection>

                  <LegalSubSection title="2.2 Disclaimer of Warranties (AI Accuracy)">
                     <p>AI Study Solver is a tool designed to aid learning. While we ground our AI with real-time Google Search, AI models can still produce inaccurate information ("hallucinations").</p>
                     <p className="font-bold text-slate-900 dark:text-white mt-4">Users are solely responsible for verifying the accuracy of AI-generated solutions before submitting them for formal grading or examinations.</p>
                  </LegalSubSection>

                  <LegalSubSection title="2.3 Subscription & Billing">
                     <p>Subscriptions are billed on a monthly or annual basis. You can cancel at any time via your Profile Settings. Cancellations will take effect at the end of the current billing cycle. We do not provide prorated refunds for partially used months.</p>
                  </LegalSubSection>
               </div>
            </section>

            {/* Section: Ethical Guidelines */}
            <section id="ethics" className="space-y-8 scroll-mt-32">
               <div className="space-y-4">
                  <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">3. AI Ethical Guidelines</h3>
                  <p className="text-lg text-slate-600 dark:text-slate-400 font-medium leading-relaxed italic">
                     "Our AI is a ladder to understanding, not a shortcut to answers."
                  </p>
               </div>
               
               <div className="p-10 bg-indigo-50 dark:bg-indigo-500/5 border border-indigo-100 dark:border-indigo-500/20 rounded-[48px]">
                  <h4 className="text-sm font-black text-indigo-500 uppercase tracking-widest mb-6">The Socratic Guardrail</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                     We purposefully build our AI to refuse "flat answers" when it detects the user is trying to bypass critical thinking. Our engine is programmed to identify the user's current level of understanding and provide the minimum necessary hint to move them to the next logical step. This is our core commitment to academic integrity.
                  </p>
               </div>
            </section>

            {/* Contact Section */}
            <section id="contact" className="p-12 bg-slate-900 rounded-[64px] text-white">
               <h3 className="text-3xl font-black mb-6 tracking-tight">Questions?</h3>
               <p className="text-slate-400 font-medium mb-8">If you have questions about these policies, please reach out to our legal compliance team.</p>
               <div className="flex flex-col md:flex-row gap-6">
                  <div className="p-6 bg-white/5 rounded-3xl border border-white/10 flex-1">
                     <p className="text-[10px] font-black uppercase text-indigo-400 mb-2">Legal Team</p>
                     <p className="text-sm font-bold">legal@aistudysolver.com</p>
                  </div>
                  <div className="p-6 bg-white/5 rounded-3xl border border-white/10 flex-1">
                     <p className="text-[10px] font-black uppercase text-indigo-400 mb-2">Privacy Officer</p>
                     <p className="text-sm font-bold">dpo@aistudysolver.com</p>
                  </div>
               </div>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
};

const LegalNavLink: React.FC<{ label: string, href: string }> = ({ label, href }) => (
  <a 
    href={href} 
    className="block text-sm font-bold text-slate-500 hover:text-indigo-500 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors py-1"
  >
    {label}
  </a>
);

const LegalSubSection: React.FC<{ title: string, children: React.ReactNode }> = ({ title, children }) => (
  <div className="space-y-3">
    <h4 className="text-base font-black text-slate-800 dark:text-slate-200 uppercase tracking-tight">{title}</h4>
    <div className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
      {children}
    </div>
  </div>
);

export default LandingPrivacyTerms;
