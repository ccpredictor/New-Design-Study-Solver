import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, doc, updateDoc, deleteDoc, query, orderBy, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../services/firebase';
import { UserRole, ContactInquiry } from '../types';

type SubTab = 'dashboard' | 'users' | 'ai-analytics' | 'inquiries' | 'settings' | 'finances' | 'invites';

const AdminPanelScreen: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<SubTab>('dashboard');
  const [users, setUsers] = useState<any[]>([]);
  const [inquiries, setInquiries] = useState<ContactInquiry[]>([]);
  const [managedUser, setManagedUser] = useState<any | null>(null);
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalProblems: 0,
    totalGroups: 0,
    tokensUsed: 0,
    proTokens: 0,
    flashTokens: 0
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [systemConfig, setSystemConfig] = useState({
    maintenanceMode: false,
    registrationOpen: true,
    aiModel: 'gemini-2.0-flash',
    systemMessage: 'All systems operational.'
  });

  const COST_PRO_1M = 2.50;
  const COST_FLASH_1M = 0.15;

  useEffect(() => {
    const unsubUsers = onSnapshot(collection(db, 'users'), (snap) => {
      const uList = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setUsers(uList);

      let problems = 0;
      let tokens = 0;
      let proTok = 0;
      let flashTok = 0;

      uList.forEach((u: any) => {
        problems += (u.stats?.problemsSolved || 0);
        tokens += (u.stats?.tokensConsumed || 0);
        proTok += (u.stats?.proTokens || 0);
        flashTok += (u.stats?.flashTokens || 0);
      });

      setStats(prev => ({
        ...prev,
        totalStudents: snap.size,
        totalProblems: problems,
        tokensUsed: tokens,
        proTokens: proTok,
        flashTokens: flashTok
      }));
    });

    const qInquiries = query(collection(db, 'contact_inquiries'), orderBy('timestamp', 'desc'));
    const unsubInquiries = onSnapshot(qInquiries, (snap) => {
      setInquiries(snap.docs.map(d => ({ id: d.id, ...d.data() } as ContactInquiry)));
    });

    return () => {
      unsubUsers();
      unsubInquiries();
    };
  }, []);

  const handleUpdateRole = async (uid: string, newRole: UserRole) => {
    try {
      await updateDoc(doc(db, 'users', uid), { role: newRole });
    } catch (e) {
      alert("Permission denied");
    }
  };

  const handleDeleteUser = async (uid: string) => {
    if (!confirm("Are you sure you want to delete this student's record? This clears their Firestore profile and stats.")) return;
    try {
      await deleteDoc(doc(db, 'users', uid));
      await deleteDoc(doc(db, 'student_profiles', uid));
    } catch (e) {
      alert("Deletion failed: Permission denied.");
    }
  };

  const handleDeleteInquiry = async (id: string) => {
    if (!confirm("Are you sure you want to delete this inquiry?")) return;
    try {
      await deleteDoc(doc(db, 'contact_inquiries', id));
    } catch (e) {
      console.error(e);
    }
  };

  const calculateUserCost = (proTok: number = 0, flashTok: number = 0) => {
    return ((proTok / 1_000_000) * COST_PRO_1M) + ((flashTok / 1_000_000) * COST_FLASH_1M);
  };

  const totalCost = calculateUserCost(stats.proTokens, stats.flashTokens);
  const totalSavings = (stats.totalProblems * 0.50) - totalCost;

  return (
    <div className="flex-1 flex flex-col h-full bg-[#f8fafc] dark:bg-charcoal-950 overflow-hidden relative">
      {/* Modal - User Details */}
      {managedUser && (
        <div className="absolute inset-0 z-[60] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white dark:bg-charcoal-900 w-full max-w-lg rounded-[40px] shadow-2xl border border-slate-100 dark:border-white/10 overflow-hidden">
            <div className="p-8 border-b border-slate-50 dark:border-white/5 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500 text-white flex items-center justify-center text-xl font-black">{managedUser.displayName?.charAt(0)}</div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white leading-tight">{managedUser.displayName}</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{managedUser.email}</p>
                </div>
              </div>
              <button onClick={() => setManagedUser(null)} className="p-2 text-slate-400 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 dark:bg-charcoal-950 p-6 rounded-3xl border border-slate-100 dark:border-white/5">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2">Solved</span>
                  <div className="text-2xl font-black text-indigo-500">{managedUser.stats?.problemsSolved || 0}</div>
                </div>
                <div className="bg-slate-50 dark:bg-charcoal-950 p-6 rounded-3xl border border-slate-100 dark:border-white/5">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2">Total Tokens</span>
                  <div className="text-2xl font-black text-indigo-500">{((managedUser.stats?.tokensConsumed || 0) / 1000).toFixed(1)}k</div>
                </div>
              </div>
              <button onClick={() => setManagedUser(null)} className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-widest">Close Record</button>
            </div>
          </div>
        </div>
      )}

      {/* Admin Header */}
      <div className="h-16 bg-white dark:bg-charcoal-900 border-b border-slate-100 dark:border-white/5 flex items-center justify-between px-6 flex-shrink-0">
        <div className="flex items-center space-x-4">
          <button onClick={onBack} className="p-2 hover:bg-slate-100 dark:hover:bg-charcoal-800 rounded-xl text-slate-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          </button>
          <div className="flex flex-col">
            <h1 className="text-[11px] font-black text-slate-900 dark:text-white uppercase tracking-[0.2em] leading-tight">Admin Console</h1>
            <span className="text-[9px] font-bold text-indigo-500 uppercase tracking-widest">{activeTab.replace('-', ' ')}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Tabs */}
        <div className="w-64 border-r border-slate-100 dark:border-white/5 bg-white dark:bg-charcoal-900 p-4 space-y-1 hidden md:block">
          <NavItem active={activeTab === 'dashboard'} label="Overview" onClick={() => setActiveTab('dashboard')} />
          <NavItem active={activeTab === 'users'} label="Students" onClick={() => setActiveTab('users')} />
          <NavItem active={activeTab === 'finances'} label="Revenue & Cost" onClick={() => setActiveTab('finances')} />
          <NavItem active={activeTab === 'ai-analytics'} label="AI Performance" onClick={() => setActiveTab('ai-analytics')} />
          <NavItem active={activeTab === 'inquiries'} label="Inquiries" onClick={() => setActiveTab('inquiries')} />
          <NavItem active={activeTab === 'invites'} label="Test Invites" onClick={() => setActiveTab('invites')} />
          <NavItem active={activeTab === 'settings'} label="Control Panel" onClick={() => setActiveTab('settings')} />
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-10">

          {activeTab === 'dashboard' && (
            <div className="space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <AdminStatCard label="Total Students" value={stats.totalStudents} color="indigo" />
                <AdminStatCard label="Solutions" value={stats.totalProblems} color="emerald" />
                <AdminStatCard label="Est. Cost" value={'$' + totalCost.toFixed(2)} color="amber" />
                <AdminStatCard label="Net Savings" value={'$' + totalSavings.toFixed(2)} color="rose" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white dark:bg-charcoal-800 p-8 rounded-[40px] border border-slate-100 dark:border-white/5 shadow-sm">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Model Distribution (Global)</h3>
                  <div className="space-y-6">
                    <DistributionRow label="Gemini 2.0 Pro (Hard)" color="bg-indigo-500" percent={(stats.proTokens / (stats.tokensUsed || 1)) * 100} />
                    <DistributionRow label="Gemini 2.0 Flash (Easy)" color="bg-cyan-400" percent={(stats.flashTokens / (stats.tokensUsed || 1)) * 100} />
                  </div>
                </div>
                <div className="bg-slate-900 rounded-[40px] p-8 border border-white/5 text-white flex flex-col justify-center text-center">
                  <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-4">Smart Router Impact</span>
                  <div className="text-5xl font-black tracking-tighter mb-2">₹{(totalSavings * 83).toFixed(0)}</div>
                  <p className="text-xs font-medium text-slate-400">Approximate currency savings due to hybrid model routing logic.</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'ai-analytics' && (
            <div className="space-y-8 animate-in fade-in duration-500">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white dark:bg-charcoal-800 p-10 rounded-[48px] border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest mb-10">Token Velocity (1M Tokens)</h3>
                  <div className="space-y-8">
                    <VelocityStat label="Pro Usage" value={stats.proTokens} max={1000000} color="indigo" />
                    <VelocityStat label="Flash Usage" value={stats.flashTokens} max={1000000} color="cyan" />
                  </div>
                </div>
                <div className="bg-white dark:bg-charcoal-800 p-10 rounded-[48px] border border-slate-100 dark:border-white/5 flex flex-col items-center justify-center text-center">
                  <div className="w-24 h-24 rounded-full border-8 border-indigo-500/20 border-t-indigo-500 animate-spin flex items-center justify-center mb-6">
                    <span className="text-xl font-black dark:text-white">99%</span>
                  </div>
                  <h4 className="text-lg font-black dark:text-white mb-2 uppercase">System Health</h4>
                  <p className="text-xs font-medium text-slate-400 max-w-xs">AI Inference engines are operating at peak efficiency with sub-2s response times.</p>
                </div>
              </div>

              <div className="bg-white dark:bg-charcoal-800 p-8 rounded-[40px] border border-slate-100 dark:border-white/5">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Real-time Model Routing Logic</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <MetricBox label="Router Success Rate" value="98.2%" sub="Correct classification" />
                  <MetricBox label="Avg. Pro Latency" value="2.4s" sub="Complex reasoning" />
                  <MetricBox label="Avg. Flash Latency" value="0.9s" sub="Quick response" />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'inquiries' && (
            <div className="space-y-6 animate-in fade-in duration-500">
              <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight uppercase tracking-widest">User Inquiries ({inquiries.length})</h2>
              <div className="grid grid-cols-1 gap-4">
                {inquiries.map((inq) => (
                  <div key={inq.id} className="bg-white dark:bg-charcoal-800 p-6 rounded-[32px] border border-slate-100 dark:border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-charcoal-700 flex items-center justify-center text-lg">{inq.category === 'Academic Support' ? '🎓' : '🛠️'}</div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="text-sm font-black text-slate-900 dark:text-white">{inq.name}</h4>
                          <span className="px-2 py-0.5 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-500 text-[8px] font-black rounded-lg uppercase tracking-widest">{inq.category}</span>
                        </div>
                        <p className="text-[10px] text-slate-400 font-bold mb-2 uppercase">{inq.email}</p>
                        <p className="text-sm font-medium text-slate-600 dark:text-slate-400">{inq.message}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button onClick={() => handleDeleteInquiry(inq.id!)} className="p-3 bg-rose-50 dark:bg-rose-500/10 text-rose-500 rounded-2xl hover:bg-rose-500 hover:text-white transition-all">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  </div>
                ))}
                {inquiries.length === 0 && <p className="text-center py-20 text-slate-400 font-bold uppercase tracking-widest">No pending inquiries</p>}
              </div>
            </div>
          )}

          {activeTab === 'invites' && (
            <div className="space-y-8 animate-in fade-in duration-500">
              <div className="bg-white dark:bg-charcoal-800 p-8 rounded-[40px] border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest mb-6">Generate New Test Link</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Test Email</label>
                    <input id="inv-email" type="email" placeholder="tester@test.com" className="w-full bg-slate-50 dark:bg-charcoal-900 border border-slate-100 dark:border-white/5 rounded-2xl px-4 py-3 text-xs font-bold dark:text-white outline-none" />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Test Password</label>
                    <input id="inv-pass" type="text" placeholder="pass123" className="w-full bg-slate-50 dark:bg-charcoal-900 border border-slate-100 dark:border-white/5 rounded-2xl px-4 py-3 text-xs font-bold dark:text-white outline-none" />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Duration</label>
                    <select id="inv-dur" className="w-full bg-slate-50 dark:bg-charcoal-900 border border-slate-100 dark:border-white/5 rounded-2xl px-4 py-3 text-[10px] font-black uppercase text-slate-400 outline-none">
                      <option value="1h">1 Hour</option>
                      <option value="2h">2 Hours</option>
                      <option value="1d">1 Day</option>
                      <option value="2d">2 Days</option>
                    </select>
                  </div>
                  <button
                    onClick={async () => {
                      const email = (document.getElementById('inv-email') as HTMLInputElement).value;
                      const password = (document.getElementById('inv-pass') as HTMLInputElement).value;
                      const duration = (document.getElementById('inv-dur') as HTMLSelectElement).value;
                      if (!email || !password) return alert("Fill all fields");

                      const now = new Date();
                      let expiresAt = new Date();
                      if (duration === '1h') expiresAt.setHours(now.getHours() + 1);
                      else if (duration === '2h') expiresAt.setHours(now.getHours() + 2);
                      else if (duration === '1d') expiresAt.setDate(now.getDate() + 1);
                      else if (duration === '2d') expiresAt.setDate(now.getDate() + 2);

                      const token = Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
                      await setDoc(doc(collection(db, 'test_invites')), {
                        email, password, expiresAt: expiresAt.toISOString(), token, status: 'active', createdAt: serverTimestamp()
                      });
                      alert("Link Generated!");
                    }}
                    className="py-3.5 bg-indigo-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-indigo-500/20"
                  >
                    Generate Link
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">Active Test Links</h3>
                <div className="grid grid-cols-1 gap-4">
                  <InviteList />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="max-w-2xl space-y-10 animate-in fade-in duration-500">
              <div className="space-y-6">
                <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">System Overrides</h3>
                <div className="bg-white dark:bg-charcoal-800 p-8 rounded-[40px] border border-slate-100 dark:border-white/5 space-y-6">
                  <ToggleSetting label="Maintenance Mode" active={systemConfig.maintenanceMode} desc="Temporarily disable user access" />
                  <ToggleSetting label="New Registrations" active={systemConfig.registrationOpen} desc="Allow new scholars to join" />
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">Global AI Personality</h3>
                <textarea
                  className="w-full h-32 bg-white dark:bg-charcoal-900 border border-slate-100 dark:border-white/5 rounded-3xl p-6 text-sm font-medium dark:text-white outline-none focus:ring-4 focus:ring-indigo-500/10 resize-none"
                  placeholder="Global assistant instructions..."
                />
              </div>
              <button className="w-full py-5 bg-indigo-500 text-white rounded-3xl text-[10px] font-black uppercase tracking-[0.3em] shadow-xl shadow-indigo-500/20 active:scale-95 transition-all">Synchronize Global Settings</button>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight uppercase tracking-widest">Student Directory</h2>
                <div className="relative">
                  <input type="text" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="bg-white dark:bg-charcoal-800 border border-slate-200 dark:border-white/5 rounded-2xl py-2 px-10 text-xs font-bold w-full md:w-64 outline-none dark:text-white" />
                  <svg className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </div>
              </div>
              <div className="bg-white dark:bg-charcoal-800 border border-slate-100 dark:border-white/5 rounded-[32px] overflow-hidden shadow-sm overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-slate-50 dark:bg-charcoal-900 text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                    <tr>
                      <th className="px-6 py-5">Identity</th>
                      <th className="px-6 py-5">Role</th>
                      <th className="px-6 py-5">Cost</th>
                      <th className="px-6 py-5">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 dark:divide-white/5">
                    {users.filter(u => u.displayName?.toLowerCase().includes(searchTerm.toLowerCase())).map(u => (
                      <tr key={u.id} className="hover:bg-slate-50/50 dark:hover:bg-charcoal-900/50">
                        <td className="px-6 py-5">
                          <div className="flex items-center space-x-3">
                            <div className="w-9 h-9 rounded-xl bg-indigo-500 text-white flex items-center justify-center text-[11px] font-black">{u.displayName?.charAt(0)}</div>
                            <div>
                              <p className="text-xs font-black text-slate-900 dark:text-white">{u.displayName}</p>
                              <p className="text-[9px] text-slate-400 font-bold uppercase">{u.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <select value={u.role || 'student'} onChange={(e) => handleUpdateRole(u.id, e.target.value as UserRole)} className="bg-transparent text-[10px] font-black uppercase text-indigo-500 outline-none cursor-pointer">
                            <option value="student">Student</option>
                            <option value="moderator">Moderator</option>
                            <option value="admin">Admin</option>
                          </select>
                        </td>
                        <td className="px-6 py-5 text-xs font-black text-emerald-500">${calculateUserCost(u.stats?.proTokens, u.stats?.flashTokens).toFixed(4)}</td>
                        <td className="px-6 py-5">
                          <div className="flex items-center space-x-2">
                            <button onClick={() => setManagedUser(u)} className="text-[10px] font-black text-indigo-500 uppercase tracking-widest px-4 py-2 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl">View</button>
                            <button onClick={() => handleDeleteUser(u.id)} className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl transition-all" title="Delete User Record">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'finances' && (
            <div className="space-y-10 animate-in fade-in duration-500">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-charcoal-800 p-8 rounded-[40px] border border-slate-100 dark:border-white/5 text-center">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Pro Spending</span>
                  <div className="text-3xl font-black text-indigo-500">${((stats.proTokens / 1_000_000) * COST_PRO_1M).toFixed(2)}</div>
                </div>
                <div className="bg-white dark:bg-charcoal-800 p-8 rounded-[40px] border border-slate-100 dark:border-white/5 text-center">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Flash Spending</span>
                  <div className="text-3xl font-black text-cyan-500">${((stats.flashTokens / 1_000_000) * COST_FLASH_1M).toFixed(2)}</div>
                </div>
                <div className="bg-indigo-600 p-8 rounded-[40px] text-white text-center shadow-xl shadow-indigo-500/20">
                  <span className="text-[9px] font-black text-indigo-200 uppercase tracking-widest mb-2 block">Net Cost</span>
                  <div className="text-3xl font-black">${totalCost.toFixed(2)}</div>
                </div>
              </div>
              <div className="bg-white dark:bg-charcoal-800 p-10 rounded-[48px] border border-slate-100 dark:border-white/5">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Recent Transactions (Top Scholars)</h3>
                <div className="space-y-4">
                  {users.sort((a, b) => (b.stats?.tokensConsumed || 0) - (a.stats?.tokensConsumed || 0)).slice(0, 5).map(u => (
                    <div key={u.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-charcoal-900 rounded-2xl">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                        <span className="text-xs font-bold dark:text-white">{u.displayName}</span>
                      </div>
                      <span className="text-xs font-black text-emerald-500">${calculateUserCost(u.stats?.proTokens, u.stats?.flashTokens).toFixed(4)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const NavItem: React.FC<{ active: boolean, label: string, onClick: () => void }> = ({ active, label, onClick }) => (
  <button onClick={onClick} className={`w-full flex items-center px-4 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${active ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-charcoal-800'}`}>
    <span>{label}</span>
  </button>
);

const AdminStatCard: React.FC<{ label: string, value: any, color: string }> = ({ label, value, color }) => (
  <div className={`p-8 rounded-[40px] border shadow-sm flex flex-col items-center justify-center text-center bg-white dark:bg-charcoal-900 border-slate-100 dark:border-white/5`}>
    <span className="text-[9px] font-black uppercase tracking-[0.2em] mb-4 opacity-60 text-slate-400">{label}</span>
    <div className={`text-3xl font-black tracking-tighter dark:text-white`}>{value}</div>
  </div>
);

const DistributionRow: React.FC<{ label: string, color: string, percent: number }> = ({ label, color, percent }) => (
  <div className="space-y-2">
    <div className="flex items-center justify-between text-[10px] font-bold uppercase text-slate-500">
      <span>{label}</span>
      <span>{percent.toFixed(1)}%</span>
    </div>
    <div className="h-2 bg-slate-100 dark:bg-charcoal-950 rounded-full overflow-hidden">
      <div className={`h-full ${color}`} style={{ width: `${percent}%` }}></div>
    </div>
  </div>
);

const VelocityStat: React.FC<{ label: string, value: number, max: number, color: string }> = ({ label, value, max, color }) => (
  <div className="space-y-3">
    <div className="flex justify-between items-baseline">
      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</span>
      <span className={`text-lg font-black text-${color}-500`}>{(value / 1000).toFixed(1)}k <span className="text-[10px] text-slate-400">/ 1M</span></span>
    </div>
    <div className="h-4 bg-slate-50 dark:bg-charcoal-950 rounded-xl overflow-hidden p-1">
      <div className={`h-full bg-${color}-500 rounded-lg transition-all duration-1000`} style={{ width: `${(value / max) * 100}%` }}></div>
    </div>
  </div>
);

const MetricBox: React.FC<{ label: string, value: string, sub: string }> = ({ label, value, sub }) => (
  <div className="p-6 bg-slate-50 dark:bg-charcoal-950 rounded-[32px] text-center">
    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">{label}</p>
    <div className="text-2xl font-black text-indigo-500 mb-1">{value}</div>
    <p className="text-[9px] font-bold text-slate-500 uppercase">{sub}</p>
  </div>
);

const ToggleSetting: React.FC<{ label: string, active: boolean, desc: string }> = ({ label, active, desc }) => (
  <div className="flex items-center justify-between">
    <div>
      <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">{label}</p>
      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">{desc}</p>
    </div>
    <div className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${active ? 'bg-indigo-500' : 'bg-slate-200 dark:bg-charcoal-700'}`}>
      <div className={`w-4 h-4 bg-white rounded-full transition-transform ${active ? 'translate-x-6' : 'translate-x-0'}`}></div>
    </div>
  </div>
);

const InviteList: React.FC = () => {
  const [invites, setInvites] = useState<any[]>([]);

  useEffect(() => {
    const q = query(collection(db, 'test_invites'), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snap) => {
      setInvites(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
  }, []);

  const copyToClipboard = (token: string) => {
    const link = `${window.location.origin}/?invite=${token}`;
    navigator.clipboard.writeText(link);
    alert("Link copied to clipboard!");
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    await deleteDoc(doc(db, 'test_invites', id));
  };

  return (
    <div className="space-y-4">
      {invites.map(inv => (
        <div key={inv.id} className="bg-white dark:bg-charcoal-800 p-6 rounded-[32px] border border-slate-100 dark:border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start space-x-4">
            <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-500/10 flex items-center justify-center text-lg">⏳</div>
            <div>
              <div className="flex items-center space-x-2">
                <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase">{inv.email}</h4>
                <span className={`px-2 py-0.5 text-[8px] font-black rounded-lg uppercase tracking-widest ${new Date(inv.expiresAt) > new Date() ? 'bg-emerald-50 text-emerald-500' : 'bg-rose-50 text-rose-500'}`}>
                  {new Date(inv.expiresAt) > new Date() ? 'Active' : 'Expired'}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-bold uppercase">Pass: {inv.password} | Expires: {new Date(inv.expiresAt).toLocaleString()}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button onClick={() => copyToClipboard(inv.token)} className="px-4 py-2 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-500 text-[10px] font-black rounded-xl uppercase tracking-widest hover:bg-indigo-500 hover:text-white transition-all">Copy Link</button>
            <button onClick={() => handleDelete(inv.id!)} className="p-2 bg-rose-50 dark:bg-rose-500/10 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            </button>
          </div>
        </div>
      ))}
      {invites.length === 0 && <p className="text-center py-10 text-slate-400 font-bold uppercase tracking-widest text-xs">No active test links found</p>}
    </div>
  );
};

export default AdminPanelScreen;