
import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../services/firebase';

const LandingContact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    category: 'Academic Support',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      alert("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, 'contact_inquiries'), {
        ...formData,
        timestamp: serverTimestamp(),
        status: 'new'
      });
      setSuccess(true);
      setFormData({ name: '', email: '', subject: '', category: 'Academic Support', message: '' });
      setTimeout(() => setSuccess(false), 5000);
    } catch (error) {
      console.error("Error submitting inquiry:", error);
      alert("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-32 pb-24 px-6 animate-in fade-in duration-700">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-20">
          <span className="text-xs font-bold text-indigo-500 mb-4 block">Get In Touch</span>
          <h2 className="text-4xl md:text-7xl font-black text-slate-900 dark:text-white tracking-tight leading-none mb-8">
            How Can We <br />Support Your Journey?
          </h2>
          <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed">
            Have a technical question, an academic doubt, or a partnership proposal? Our team is available 24/7 to ensure your learning experience is seamless.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-32">
          {/* Contact Details & Info */}
          <div className="lg:col-span-1 space-y-10">
            <div className="space-y-6">
              <h3 className="text-2xl font-black text-slate-900 dark:text-white">Our Departments</h3>
              <DepartmentItem 
                icon="🎓" 
                title="Academic Tutoring" 
                desc="For complex subject-matter doubts and curriculum alignment."
                email="academic@aistudy.com"
              />
              <DepartmentItem 
                icon="🛠️" 
                title="Technical Support" 
                desc="For login issues, OCR scanning errors, or app bugs."
                email="tech@aistudy.com"
              />
              <DepartmentItem 
                icon="🤝" 
                title="Partnerships" 
                desc="For institutional integration and licensing inquiries."
                email="partners@aistudy.com"
              />
            </div>

            <div className="pt-10 border-t border-slate-100 dark:border-white/5 space-y-6">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Global Offices</h3>
              <div className="space-y-4">
                <OfficeItem city="San Francisco" addr="101 Mission St, CA 94105, USA" />
                <OfficeItem city="London" addr="70 St Mary Axe, London EC3A 8BE, UK" />
                <OfficeItem city="Bangalore" addr="Prestige Shantiniketan, Whitefield, IN" />
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-charcoal-900 p-8 md:p-14 rounded-[64px] border border-slate-100 dark:border-white/5 shadow-sm relative overflow-hidden">
              {success && (
                <div className="absolute inset-0 z-20 bg-emerald-500 flex flex-col items-center justify-center text-white p-10 text-center animate-in fade-in zoom-in duration-500">
                  <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mb-6">
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <h3 className="text-3xl font-black mb-4">Inquiry Received!</h3>
                  <p className="text-emerald-50 font-medium">Your message has been safely delivered to our support desk. We typically respond within 2-4 hours.</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Your Full Name</label>
                    <input 
                      type="text" 
                      placeholder="Jane Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-slate-50 dark:bg-charcoal-950 border-none rounded-3xl py-4 px-6 text-base font-bold outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Email Address</label>
                    <input 
                      type="email" 
                      placeholder="jane@university.edu"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full bg-slate-50 dark:bg-charcoal-950 border-none rounded-3xl py-4 px-6 text-base font-bold outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Inquiry Subject</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Question about Physics logic"
                      value={formData.subject}
                      onChange={(e) => setFormData({...formData, subject: e.target.value})}
                      className="w-full bg-slate-50 dark:bg-charcoal-950 border-none rounded-3xl py-4 px-6 text-base font-bold outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Select Category</label>
                    <select 
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className="w-full bg-slate-50 dark:bg-charcoal-950 border-none rounded-3xl py-4.5 px-6 text-base font-bold outline-none appearance-none"
                    >
                      <option>Academic Support</option>
                      <option>Technical Help</option>
                      <option>Billing Inquiry</option>
                      <option>Report A Bug</option>
                      <option>Feature Request</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Detailed Message</label>
                  <textarea 
                    placeholder="Tell us exactly how we can help you..." 
                    rows={6}
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    className="w-full bg-slate-50 dark:bg-charcoal-950 border-none rounded-[40px] py-6 px-8 text-base font-medium outline-none focus:ring-4 focus:ring-indigo-500/10 resize-none custom-scrollbar" 
                  />
                </div>

                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full py-6 bg-indigo-500 text-white rounded-[40px] text-lg font-black shadow-2xl shadow-indigo-500/30 hover:scale-[0.98] transition-all flex items-center justify-center space-x-4"
                >
                  {loading ? (
                    <div className="w-6 h-6 border-3 border-white/20 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                      <span>Send Your Message</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const DepartmentItem: React.FC<{ icon: string, title: string, desc: string, email: string }> = ({ icon, title, desc, email }) => (
  <div className="flex items-start space-x-5 group">
    <div className="w-12 h-12 bg-slate-50 dark:bg-charcoal-800 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 group-hover:scale-110 transition-transform">{icon}</div>
    <div className="space-y-1">
      <h4 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">{title}</h4>
      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{desc}</p>
      <p className="text-xs font-black text-indigo-500 tracking-tighter">{email}</p>
    </div>
  </div>
);

const OfficeItem: React.FC<{ city: string, addr: string }> = ({ city, addr }) => (
  <div className="flex items-center space-x-4">
    <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
    <div>
      <p className="text-sm font-bold text-slate-900 dark:text-white">{city}</p>
      <p className="text-[10px] text-slate-400 font-medium uppercase tracking-tighter">{addr}</p>
    </div>
  </div>
);

export default LandingContact;
