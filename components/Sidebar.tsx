
import React, { useState } from 'react';

interface SidebarProps {
  sessions: any[];
  channels: any[];
  activeChatId: string | null;
  activeChannelId: string | null;
  onSelectChat: (id: string, ownerId?: string) => void;
  onSelectChannel: (id: string) => void;
  onNewChat: () => void;
  onOpenDashboard?: () => void;
  onOpenProfile?: () => void;
  onOpenDesigner?: () => void;
  onOpenPlanner?: () => void;
  onOpenAdmin?: () => void;
  onRenameChat?: (id: string, newTitle: string) => void;
  onDeleteChat?: (id: string) => void;
  onCreateChannel: () => void;
  onJoinChannel: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  sessions, 
  channels,
  activeChatId, 
  activeChannelId,
  onSelectChat, 
  onSelectChannel,
  onNewChat, 
  onOpenDashboard,
  onOpenProfile, 
  onOpenDesigner,
  onOpenPlanner,
  onOpenAdmin,
  onRenameChat,
  onDeleteChat,
  onCreateChannel,
  onJoinChannel
}) => {
  const [editingChatId, setEditingChatId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  const handleStartEdit = (e: React.MouseEvent, id: string, title: string) => {
    e.stopPropagation();
    setEditingChatId(id);
    setEditValue(title);
  };

  const handleSaveEdit = (id: string) => {
    if (onRenameChat && editValue.trim()) {
      onRenameChat(id, editValue);
    }
    setEditingChatId(null);
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (onDeleteChat) {
      onDeleteChat(id);
    }
  };

  return (
    <nav className="hidden md:flex flex-col w-72 bg-white dark:bg-charcoal-950 border-r border-slate-100 dark:border-white/5 h-full overflow-hidden transition-colors">
      <div className="p-5 space-y-2">
        <button 
          type="button"
          onClick={onNewChat}
          className="w-full flex items-center justify-center space-x-2 bg-indigo-500 text-white rounded-2xl py-3 px-4 text-[13px] font-bold hover:bg-indigo-600 transition-all shadow-lg shadow-indigo-500/20 active:scale-95 mb-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
          </svg>
          <span>New Private Lesson</span>
        </button>

        <div className="grid grid-cols-2 gap-2">
          <button 
            type="button"
            onClick={onOpenDashboard}
            className="flex flex-col items-center justify-center space-y-1.5 bg-slate-50 dark:bg-charcoal-800 text-slate-600 dark:text-slate-400 rounded-2xl py-3 px-2 text-[10px] font-bold hover:bg-slate-100 dark:hover:bg-charcoal-700 transition-all border border-slate-100 dark:border-white/5 group"
          >
            <svg className="w-4 h-4 text-indigo-500 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            <span className="uppercase tracking-widest">Dashboard</span>
          </button>
          
          <button 
            type="button"
            onClick={onOpenDesigner}
            className="flex flex-col items-center justify-center space-y-1.5 bg-slate-50 dark:bg-charcoal-800 text-slate-600 dark:text-slate-400 rounded-2xl py-3 px-2 text-[10px] font-bold hover:bg-slate-100 dark:hover:bg-charcoal-700 transition-all border border-slate-100 dark:border-white/5 group"
          >
            <svg className="w-4 h-4 text-emerald-500 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="uppercase tracking-widest">Exam Gen</span>
          </button>
        </div>

        <button 
          type="button"
          onClick={onOpenPlanner}
          className="w-full flex items-center justify-center space-x-2 bg-slate-50 dark:bg-charcoal-800 text-slate-600 dark:text-slate-400 rounded-2xl py-2.5 px-4 text-[10px] font-bold hover:bg-slate-100 dark:hover:bg-charcoal-700 transition-all border border-slate-100 dark:border-white/5 group"
        >
          <svg className="w-4 h-4 text-amber-500 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="uppercase tracking-widest">Study Planner</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar px-3 space-y-6 pt-2 pb-10">
        <section>
          <div className="px-3 py-2">
            <span className="text-[11px] font-bold text-indigo-500 tracking-wider uppercase">Academic Channels</span>
          </div>
          <div className="px-3 pb-4 grid grid-cols-2 gap-2">
            <button 
              type="button"
              onClick={() => onJoinChannel()}
              className="flex items-center justify-center space-x-2 py-2.5 bg-slate-50 dark:bg-charcoal-800 hover:bg-indigo-500/10 rounded-xl text-[9px] font-black text-slate-500 dark:text-slate-400 hover:text-indigo-500 border border-slate-100 dark:border-white/5 transition-all uppercase tracking-widest"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" /></svg>
              <span>Join</span>
            </button>
            <button 
              type="button"
              onClick={() => onCreateChannel()}
              className="flex items-center justify-center space-x-2 py-2.5 bg-slate-50 dark:bg-charcoal-800 hover:bg-emerald-500/10 rounded-xl text-[9px] font-black text-slate-500 dark:text-slate-400 hover:text-emerald-500 border border-slate-100 dark:border-white/5 transition-all uppercase tracking-widest"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" /></svg>
              <span>Create</span>
            </button>
          </div>

          <div className="space-y-0.5">
            {channels.map((channel) => (
              <button
                key={channel.id}
                type="button"
                onClick={() => onSelectChannel(channel.id)}
                className={`w-full text-left px-4 py-3 rounded-2xl transition-all flex items-center space-x-3 ${
                  activeChannelId === channel.id 
                    ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400' 
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-charcoal-800/50'
                }`}
              >
                <div className={`w-2 h-2 rounded-full ${activeChannelId === channel.id ? 'bg-indigo-500 animate-pulse' : 'bg-slate-300 dark:bg-slate-700'}`}></div>
                <div className="flex-1 overflow-hidden">
                  <p className="text-[12px] font-semibold truncate leading-tight">{channel.name}</p>
                </div>
              </button>
            ))}
          </div>
        </section>

        <section>
          <div className="px-3 py-2">
            <span className="text-[11px] font-bold text-slate-400 dark:text-slate-600 tracking-wider">Private History</span>
          </div>
          <div className="space-y-0.5">
            {sessions.map((session) => (
              <div key={session.id} className="group relative">
                <button
                  type="button"
                  onClick={() => onSelectChat(session.id, session.ownerId)}
                  className={`w-full text-left px-4 py-3 rounded-2xl transition-all flex items-start space-x-3 ${
                    activeChatId === session.id && !activeChannelId
                      ? 'bg-slate-50 dark:bg-charcoal-800 text-indigo-600 dark:text-indigo-400' 
                      : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-charcoal-800/50'
                  }`}
                >
                  <div className="mt-0.5 flex-shrink-0">
                    <svg className={`w-4 h-4 ${activeChatId === session.id ? 'text-indigo-400' : 'text-slate-300 dark:text-slate-700'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                  </div>
                  <div className="flex-1 overflow-hidden pr-10">
                    {editingChatId === session.id ? (
                      <input
                        autoFocus
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onBlur={() => handleSaveEdit(session.id)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit(session.id)}
                        className="w-full bg-white dark:bg-charcoal-900 border border-indigo-500 rounded px-1 py-0.5 text-[12px] font-semibold focus:outline-none"
                      />
                    ) : (
                      <>
                        <p className="text-[12px] font-semibold truncate leading-tight mb-0.5">{session.title}</p>
                        <p className="text-[10px] text-slate-400 dark:text-slate-600 font-medium tracking-tight">
                          {session.updatedAt?.toMillis ? new Date(session.updatedAt.toMillis()).toLocaleDateString() : 'Just now'}
                        </p>
                      </>
                    )}
                  </div>
                </button>
                
                {!editingChatId && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button type="button" onClick={(e) => handleStartEdit(e, session.id, session.title)} className="p-1 text-slate-400 hover:text-indigo-500 dark:hover:text-indigo-400 rounded-lg hover:bg-slate-100 dark:hover:bg-charcoal-700 transition-all">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                    </button>
                    <button type="button" onClick={(e) => handleDelete(e, session.id)} className="p-1 text-slate-400 hover:text-red-500 rounded-lg hover:bg-slate-100 dark:hover:bg-charcoal-700 transition-all">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="p-5 border-t border-slate-50 dark:border-white/5 space-y-2">
        {onOpenAdmin && (
          <button 
            type="button"
            onClick={onOpenAdmin}
            className="w-full flex items-center space-x-3 px-4 py-3 bg-indigo-500/5 hover:bg-indigo-500/10 border border-indigo-500/10 rounded-2xl transition-all text-indigo-600 dark:text-indigo-400 group"
          >
            <svg className="w-4 h-4 text-indigo-500 group-hover:rotate-45 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924-1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-[11px] font-black uppercase tracking-widest">Admin Control</span>
          </button>
        )}
        <button 
          type="button"
          onClick={onOpenProfile}
          className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-charcoal-800 rounded-2xl transition-all text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 group"
        >
          <svg className="w-4 h-4 text-slate-300 dark:text-slate-700 group-hover:text-indigo-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span className="text-[12px] font-semibold">Settings</span>
        </button>
      </div>
    </nav>
  );
};

export default Sidebar;
