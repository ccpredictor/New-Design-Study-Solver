import React, { useState, useRef, useEffect } from 'react';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, doc, updateDoc, increment, getDoc, where, getDocs, limit, arrayUnion } from 'firebase/firestore';
import { auth, db } from '../services/firebase';
import { Message, Role, ChatState, Channel, UserRole } from '../types';
import { solveProblem } from '../services/geminiService';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import BottomNav from '../components/BottomNav';
import MessageItem from '../components/MessageItem';
import ChatInput from '../components/ChatInput';
import TypingIndicator from '../components/TypingIndicator';
import ProfileScreen from './ProfileScreen';
import PaperDesignerScreen from './PaperDesignerScreen';
import StudyPlannerScreen from './StudyPlannerScreen';
import AdminPanelScreen from './AdminPanelScreen';
import DashboardScreen from './DashboardScreen';
import CustomModal from '../components/CustomModal';
import OnboardingForm from '../components/OnboardingForm';
import { AIAssistantService, StudentProfile } from '../services/teacherAssistantService';

interface ChatSession {
  id: string;
  title: string;
  updatedAt: any;
  isShared?: boolean;
  ownerId?: string;
  isJoined?: boolean;
  isDeleted?: boolean;
}

const StudySolverScreen: React.FC = () => {
  const [chat, setChat] = useState<ChatState>({
    messages: [],
    isLoading: false,
    error: null
  });

  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [activeChannelId, setActiveChannelId] = useState<string | null>(null);
  const [activeChannelData, setActiveChannelData] = useState<Channel | null>(null);
  const [channelMembers, setChannelMembers] = useState<any[]>([]);

  const [sharedOwnerId, setSharedOwnerId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'workflow' | 'review' | 'profile' | 'designer' | 'channels' | 'planner' | 'admin'>('dashboard');
  const [inputText, setInputText] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedDoc, setSelectedDoc] = useState<{ name: string, text: string } | null>(null);
  const [userStats, setUserStats] = useState({ problemsSolved: 0 });
  const [userRole, setUserRole] = useState<UserRole>(UserRole.STUDENT);
  const [userGrade, setUserGrade] = useState<string | undefined>(undefined);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false);
  const [modalInput, setModalInput] = useState('');
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  const [studentProfile, setStudentProfile] = useState<StudentProfile | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingLoading, setOnboardingLoading] = useState(true);

  const scrollRef = useRef<HTMLDivElement>(null);
  const user = auth.currentUser;

  // Dynamic Metadata Update based on Active Tab
  useEffect(() => {
    const metaData: Record<string, { title: string; desc: string; keywords: string }> = {
      dashboard: {
        title: 'Dashboard | AI Study Solver',
        desc: 'Academic command center. Track your solving progress and get personalized AI learning insights.',
        keywords: 'AI dashboard, study progress, academic insights, student stats'
      },
      workflow: {
        title: 'Workspace | AI Study Solver',
        desc: 'Solve complex problems with step-by-step Socratic guidance using Gemini 3.0 Pro.',
        keywords: 'math solver, physics logic, socratic tutor, AI assistant, science helper'
      },
      review: {
        title: 'History | AI Study Solver',
        desc: 'Access your full learning history. Review past solutions and revise key concepts.',
        keywords: 'study history, lesson revision, academic notebook, saved lessons'
      },
      profile: {
        title: 'Settings | AI Study Solver',
        desc: 'Manage your student profile, academic grade settings, and language preferences.',
        keywords: 'user settings, language preference, student profile, account management'
      },
      designer: {
        title: 'Exam Lab | AI Study Solver',
        desc: 'Generate professional mock exam papers and practice tests from PDFs or topics.',
        keywords: 'exam generator, test maker, PDF question paper, practice exams'
      },
      channels: {
        title: 'Groups | AI Study Solver',
        desc: 'Collaborate with fellow students in shared academic channels for peer learning.',
        keywords: 'study groups, academic collaboration, peer learning, student communities'
      },
      planner: {
        title: 'Roadmap | AI Study Solver',
        desc: 'Create an AI-powered study roadmap tailored to your specific exam dates and targets.',
        keywords: 'study roadmap, exam schedule, AI planner, productivity tool'
      },
      admin: {
        title: 'Admin | AI Study Solver',
        desc: 'System administration console for monitoring performance and user queries.',
        keywords: 'system admin, AI monitoring, user management, analytics'
      }
    };

    const current = metaData[activeTab] || metaData['dashboard'];

    // Update Title
    document.title = current.title;

    // Update Description
    const descTag = document.querySelector('meta[name="description"]');
    if (descTag) descTag.setAttribute('content', current.desc);

    // Update Keywords
    const keywordsTag = document.querySelector('meta[name="keywords"]');
    if (keywordsTag) keywordsTag.setAttribute('content', current.keywords);

    // Update OG Tags for social sharing consistency
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', current.title);
    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', current.desc);
  }, [activeTab]);

  useEffect(() => {
    if (!user) return;
    const userRef = doc(db, 'users', user.uid);
    const unsubscribe = onSnapshot(userRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        setUserRole(data.role || UserRole.STUDENT);
        setUserGrade(data.grade);
        setUserStats({ problemsSolved: data.stats?.problemsSolved || 0 });
      }
    });

    // Check for Student Profile
    const checkProfile = async () => {
      setOnboardingLoading(true);
      const profile = await AIAssistantService.getProfile(user.uid);
      if (profile) {
        setStudentProfile(profile);
        setShowOnboarding(false);
      } else {
        setShowOnboarding(true);
      }
      setOnboardingLoading(false);
    };
    checkProfile();

    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    if (!user) return;
    const sessionsRef = collection(db, 'users', user.uid, 'chats');
    const q = query(sessionsRef, orderBy('updatedAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedSessions: ChatSession[] = snapshot.docs
        .map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            title: data.title || 'New Conversation',
            updatedAt: data.updatedAt,
            isShared: data.isShared,
            ownerId: data.ownerId || user.uid,
            isDeleted: data.isDeleted || false
          };
        })
        .filter(s => !s.isDeleted);
      setSessions(fetchedSessions);
    });
    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    if (!user) return;
    const channelsRef = collection(db, 'channels');
    const q = query(channelsRef, where('members', 'array-contains', user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedChannels: Channel[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Channel));
      setChannels(fetchedChannels);
    });
    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    if (!activeChannelId) {
      setActiveChannelData(null);
      setChannelMembers([]);
      return;
    }

    const channelRef = doc(db, 'channels', activeChannelId);
    const unsubChannel = onSnapshot(channelRef, async (snap) => {
      if (snap.exists()) {
        const data = { id: snap.id, ...snap.data() } as Channel;
        setActiveChannelData(data);

        const memberIds = data.members || [];
        const memberProfiles = [];
        for (const uid of memberIds) {
          const uRef = doc(db, 'users', uid);
          const uSnap = await getDoc(uRef);
          if (uSnap.exists()) {
            memberProfiles.push({ uid: uSnap.id, ...uSnap.data() });
          }
        }
        setChannelMembers(memberProfiles);
      }
    });

    return () => unsubChannel();
  }, [activeChannelId]);

  useEffect(() => {
    if (!user) return;
    let messagesRef;
    if (activeChannelId) {
      messagesRef = collection(db, 'channels', activeChannelId, 'messages');
    } else if (activeChatId) {
      const targetOwnerId = sharedOwnerId || user.uid;
      messagesRef = collection(db, 'users', targetOwnerId, 'chats', activeChatId, 'messages');
    } else {
      setChat(prev => ({ ...prev, messages: [] }));
      return;
    }
    const q = query(messagesRef, orderBy('timestamp', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedMessages: Message[] = snapshot.docs.map(doc => {
        const data = doc.data() as any;
        return {
          id: doc.id,
          role: data.role as Role,
          text: data.text,
          timestamp: data.timestamp?.toMillis() || Date.now(),
          image: data.image,
          feedback: data.feedback || null,
          senderName: data.senderName,
          tokensUsed: data.tokensUsed || 0,
          sources: data.sources || []
        };
      });
      setChat(prev => ({ ...prev, messages: fetchedMessages }));
    });
    return () => unsubscribe();
  }, [user, activeChatId, activeChannelId, sharedOwnerId]);

  useEffect(() => {
    scrollToBottom();
  }, [chat.messages, chat.isLoading]);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  const handleDeleteChat = async (id: string) => {
    if (!user) return;
    try {
      const chatRef = doc(db, 'users', user.uid, 'chats', id);
      await updateDoc(chatRef, { isDeleted: true });
      if (activeChatId === id) {
        setActiveChatId(null);
        setChat(prev => ({ ...prev, messages: [] }));
      }
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const handleRenameChat = async (id: string, newTitle: string) => {
    if (!user) return;
    try {
      const chatRef = doc(db, 'users', user.uid, 'chats', id);
      await updateDoc(chatRef, { title: newTitle });
    } catch (err) {
      console.error("Rename failed:", err);
    }
  };

  const handleCreateChannelSubmit = async () => {
    if (!modalInput.trim() || !user) return;
    setModalLoading(true);
    setModalError(null);
    try {
      const docRef = await addDoc(collection(db, 'channels'), {
        name: modalInput.trim(),
        ownerId: user.uid,
        members: [user.uid],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      setActiveChannelId(docRef.id);
      setActiveChatId(null);
      setActiveTab('workflow');
      setShowCreateModal(false);
      setModalInput('');
    } catch (err) {
      setModalError("Failed to create channel.");
    } finally {
      setModalLoading(false);
    }
  };

  const handleJoinChannelSubmit = async () => {
    if (!modalInput.trim() || !user) return;
    setModalLoading(true);
    setModalError(null);
    try {
      const channelRef = doc(db, 'channels', modalInput.trim());
      const snap = await getDoc(channelRef);
      if (snap.exists()) {
        await updateDoc(channelRef, {
          members: arrayUnion(user.uid),
          updatedAt: serverTimestamp()
        });
        setActiveChannelId(channelRef.id);
        setActiveChatId(null);
        setActiveTab('workflow');
        setShowJoinModal(false);
        setModalInput('');
      } else {
        setModalError("Channel not found.");
      }
    } catch (err) {
      setModalError("Error joining channel.");
    } finally {
      setModalLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if ((!inputText.trim() && !selectedImage) || !user || chat.isLoading) return;
    setChat(prev => ({ ...prev, isLoading: true, error: null }));

    const currentInput = inputText;
    const currentImg = selectedImage;
    const currentDoc = selectedDoc;
    const historyForModel = [...chat.messages];

    setInputText('');
    setSelectedImage(null);
    setSelectedDoc(null);

    try {
      let targetMessagesRef;
      let updateMetadataRef;

      if (activeChannelId) {
        targetMessagesRef = collection(db, 'channels', activeChannelId, 'messages');
        updateMetadataRef = doc(db, 'channels', activeChannelId);
      } else {
        let currentChatId = activeChatId;
        if (!currentChatId) {
          const chatsRef = collection(db, 'users', user.uid, 'chats');
          const newChatDoc = await addDoc(chatsRef, {
            title: currentInput.slice(0, 40) || 'New Chat',
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            isDeleted: false,
            ownerId: user.uid
          });
          currentChatId = newChatDoc.id;
          setActiveChatId(currentChatId);
        }
        targetMessagesRef = collection(db, 'users', user.uid, 'chats', currentChatId, 'messages');
        updateMetadataRef = doc(db, 'users', user.uid, 'chats', currentChatId);
      }

      await addDoc(targetMessagesRef, {
        role: Role.USER,
        text: currentInput,
        image: currentImg || null,
        timestamp: serverTimestamp(),
        senderName: user.displayName || 'Student'
      });

      let responseText: string = "";
      let tokensUsed: number = 0;
      let sources: any[] = [];
      let isCached = false;
      let modelMetadata: any = { modelUsed: 'cached', routerTriggered: false };

      if (!currentImg) {
        const cacheQuery = query(
          collection(db, 'knowledge_base'),
          where('prompt', '==', currentInput.trim()),
          where('grade', '==', userGrade || 'Class 10'),
          limit(1)
        );
        const cacheSnap = await getDocs(cacheQuery);

        if (!cacheSnap.empty) {
          const cachedDoc = cacheSnap.docs[0].data();
          responseText = cachedDoc.response;
          tokensUsed = cachedDoc.tokensUsed || 0;
          sources = cachedDoc.sources || [];
          isCached = true;
          await new Promise(resolve => setTimeout(resolve, Math.floor(Math.random() * 2000) + 3000));
        }
      }

      if (!isCached) {
        let result;
        if (studentProfile && !activeChannelId) {
          // Use Teacher Assistant Logic (Profile-aware)
          const aiResponse = await AIAssistantService.getTutoringResponse(
            user.uid,
            currentInput,
            historyForModel,
            currentDoc?.text
          );
          result = { text: aiResponse, tokensUsed: 0, sources: [], metadata: { modelUsed: 'gemini-2.0-flash', routerTriggered: false } };
        } else {
          result = await solveProblem(currentInput, historyForModel, currentImg || undefined, userGrade);
        }

        responseText = result.text;
        tokensUsed = result.tokensUsed || 0;
        sources = result.sources || [];
        modelMetadata = result.metadata || {};

        if (!currentImg && !studentProfile) { // Only cache regular queries
          try {
            await addDoc(collection(db, 'knowledge_base'), {
              prompt: currentInput.trim(),
              response: responseText,
              grade: userGrade || 'Class 10',
              tokensUsed: tokensUsed,
              sources: sources,
              createdAt: serverTimestamp()
            });
          } catch (e) { console.warn("Cache write failed", e); }
        }
      }

      await addDoc(targetMessagesRef, {
        role: Role.MODEL,
        text: responseText,
        timestamp: serverTimestamp(),
        tokensUsed: tokensUsed,
        sources: sources,
        modelUsed: modelMetadata.modelUsed || 'unknown',
        routerTriggered: modelMetadata.routerTriggered || false
      });

      await updateDoc(updateMetadataRef, { updatedAt: serverTimestamp() });

      // If we have a profile and it's a private chat, check if session should end (simplified: after 10 messages)
      if (studentProfile && !activeChannelId && chat.messages.length >= 10) {
        await AIAssistantService.updateProfile(user.uid, activeChatId || "default", "Progressing through concepts.");
      }

      const userUpdate: any = {
        'stats.problemsSolved': increment(1),
        'stats.tokensConsumed': increment(tokensUsed),
      };

      if (modelMetadata.modelUsed === 'gemini-3-pro-preview' || modelMetadata.modelUsed === 'gemini-3-pro-preview') {
        userUpdate['stats.proTokens'] = increment(tokensUsed);
      } else if (modelMetadata.modelUsed === 'gemini-3-pro-preview') {
        userUpdate['stats.flashTokens'] = increment(tokensUsed);
      }

      await updateDoc(doc(db, 'users', user.uid), userUpdate);
    } catch (err: any) {
      console.error(err);
      setChat(prev => ({ ...prev, error: "Failed to solve problem." }));
    } finally {
      setChat(prev => ({ ...prev, isLoading: false }));
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'profile': return <ProfileScreen onBack={() => setActiveTab('dashboard')} />;
      case 'designer': return <PaperDesignerScreen onBack={() => setActiveTab('dashboard')} />;
      case 'planner': return <StudyPlannerScreen onBack={() => setActiveTab('dashboard')} />;
      case 'admin': return <AdminPanelScreen onBack={() => setActiveTab('dashboard')} />;
      case 'dashboard': return (
        <DashboardScreen
          stats={userStats}
          sessions={sessions}
          onSelectChat={(id) => { setActiveChatId(id); setActiveTab('workflow'); }}
          onAction={setActiveTab}
        />
      );
      case 'review': return (
        <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#f8fafc] dark:bg-charcoal-950 p-4 md:p-6 pb-24">
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-[0.2em]">History</h2>
              <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest bg-indigo-50 dark:bg-indigo-500/10 px-3 py-1 rounded-full">{sessions.length} Lessons</span>
            </div>
            {sessions.length === 0 ? (
              <div className="text-center py-20 bg-white dark:bg-charcoal-900 rounded-[40px] border border-slate-100 dark:border-white/5">
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Your notebook is empty</p>
              </div>
            ) : (
              <div className="space-y-3">
                {sessions.map((s) => (
                  <button key={s.id} onClick={() => { setActiveChatId(s.id); setActiveChannelId(null); setActiveTab('workflow'); }} className="w-full p-6 bg-white dark:bg-charcoal-900 border border-slate-100 dark:border-white/5 rounded-[32px] text-left hover:scale-[1.01] transition-all flex items-center justify-between group shadow-sm">
                    <div className="flex items-center space-x-4 overflow-hidden">
                      <div className="w-12 h-12 bg-indigo-500/10 text-indigo-500 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-sm font-black text-slate-800 dark:text-white truncate">{s.title}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">{s.updatedAt?.toMillis ? new Date(s.updatedAt.toMillis()).toLocaleDateString() : 'Active now'}</p>
                      </div>
                    </div>
                    <svg className="w-5 h-5 text-slate-300 group-hover:text-indigo-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" /></svg>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      );
      case 'channels': return (
        <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#f8fafc] dark:bg-charcoal-950 p-4 md:p-6 pb-24">
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-[0.2em]">Groups</h2>
              <div className="flex space-x-2">
                <button onClick={() => { setModalInput(''); setModalError(null); setShowJoinModal(true); }} className="px-4 py-2 bg-white dark:bg-charcoal-900 text-indigo-500 rounded-xl text-[10px] font-black uppercase tracking-widest border border-slate-100 dark:border-white/5">Join</button>
                <button onClick={() => { setModalInput(''); setModalError(null); setShowCreateModal(true); }} className="px-4 py-2 bg-indigo-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-indigo-500/20">Create</button>
              </div>
            </div>
            {channels.length === 0 ? (
              <div className="text-center py-20 bg-white dark:bg-charcoal-900 rounded-[40px] border border-slate-100 dark:border-white/5">
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Connect with other students</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {channels.map((c) => (
                  <button key={c.id} onClick={() => { setActiveChannelId(c.id); setActiveChatId(null); setActiveTab('workflow'); }} className="w-full p-6 bg-white dark:bg-charcoal-900 border border-slate-100 dark:border-white/5 rounded-[32px] text-left hover:scale-[1.01] transition-all flex items-center justify-between group shadow-sm">
                    <div className="flex items-center space-x-4 overflow-hidden">
                      <div className="w-12 h-12 bg-emerald-500 text-white rounded-2xl flex items-center justify-center flex-shrink-0 text-xl font-black group-hover:rotate-12 transition-transform">
                        {c.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-sm font-black text-slate-800 dark:text-white truncate">{c.name}</p>
                        <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest mt-1 flex items-center">
                          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-2"></span>
                          {c.members?.length || 0} Scholars
                        </p>
                      </div>
                    </div>
                    <svg className="w-5 h-5 text-slate-300 group-hover:text-emerald-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" /></svg>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      );
      default:
        return (
          <div className="flex-1 flex flex-col h-full bg-[#f8fafc] dark:bg-charcoal-950 overflow-hidden relative">
            <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 md:px-0 py-10 custom-scrollbar scroll-smooth">
              <div className="max-w-3xl mx-auto space-y-6 pb-24 md:pb-12">
                {chat.messages.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="w-16 h-16 bg-indigo-500/10 text-indigo-500 rounded-3xl flex items-center justify-center mb-6">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                    </div>
                    <h2 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight mb-2">Academic Workspace</h2>
                    <p className="text-slate-400 dark:text-slate-500 font-medium max-w-sm">
                      {activeChannelData ? `Welcome to ${activeChannelData.name}. Collaborate with your peers.` : 'Start a guided private lesson now.'}
                    </p>
                  </div>
                )}
                {chat.messages.map((msg, idx) => (
                  <MessageItem key={msg.id || idx} message={msg} index={idx} chatId={activeChannelId || activeChatId} isChannel={!!activeChannelId} />
                ))}
                {chat.isLoading && <TypingIndicator />}
              </div>
            </div>
            <div className="flex-shrink-0 border-t border-slate-50 dark:border-white/5 bg-white/80 dark:bg-charcoal-900/80 backdrop-blur-xl md:pb-0">
              {studentProfile && !activeChannelId && activeChatId && (
                <div className="px-4 py-2 flex justify-end">
                  <button
                    onClick={async () => {
                      if (confirm("End this session and update your learning profile?")) {
                        await AIAssistantService.updateProfile(user.uid, activeChatId, "Session ended by student.");
                        alert("Profile updated with new insights!");
                      }
                    }}
                    className="text-[10px] font-black text-indigo-500 hover:text-indigo-600 uppercase tracking-widest bg-indigo-50 dark:bg-indigo-500/10 px-4 py-2 rounded-full transition-all"
                  >
                    End Session & Update Profile
                  </button>
                </div>
              )}
              <ChatInput
                inputText={inputText}
                setInputText={setInputText}
                selectedImage={selectedImage}
                setSelectedImage={setSelectedImage}
                selectedDoc={selectedDoc}
                setSelectedDoc={setSelectedDoc}
                onSendMessage={handleSendMessage}
                isLoading={chat.isLoading}
              />
            </div>
          </div>
        );
    }
  };

  if (onboardingLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] dark:bg-charcoal-950">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-500 rounded-full animate-spin mb-4"></div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] animate-pulse">Syncing Profile</p>
        </div>
      </div>
    );
  }

  if (showOnboarding && user) {
    return <OnboardingForm uid={user.uid} onComplete={(profile) => { setStudentProfile(profile); setShowOnboarding(false); }} />;
  }

  return (
    <div className="flex flex-col h-screen h-[100dvh] bg-white dark:bg-charcoal-950 transition-colors overflow-hidden">
      <Header onProfileClick={() => setActiveTab('profile')} onInfoClick={activeChannelId ? () => setIsRightSidebarOpen(!isRightSidebarOpen) : undefined} />
      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar sessions={sessions} channels={channels} activeChatId={activeChatId} activeChannelId={activeChannelId} onSelectChat={(id, owner) => { setActiveChatId(id); setActiveChannelId(null); setSharedOwnerId(owner || null); setActiveTab('workflow'); setIsRightSidebarOpen(false); }} onSelectChannel={(id) => { setActiveChannelId(id); setActiveChatId(null); setActiveTab('workflow'); }} onNewChat={() => { setActiveChatId(null); setActiveChannelId(null); setChat(prev => ({ ...prev, messages: [] })); setActiveTab('workflow'); setIsRightSidebarOpen(false); }} onOpenDashboard={() => setActiveTab('dashboard')} onOpenProfile={() => setActiveTab('profile')} onOpenDesigner={() => setActiveTab('designer')} onOpenPlanner={() => setActiveTab('planner')} onOpenAdmin={userRole === UserRole.ADMIN ? () => setActiveTab('admin') : undefined} onRenameChat={handleRenameChat} onDeleteChat={handleDeleteChat} onCreateChannel={() => { setModalInput(''); setModalError(null); setShowCreateModal(true); }} onJoinChannel={() => { setModalInput(''); setModalError(null); setShowJoinModal(true); }} />
        <main className="flex-1 flex flex-col h-full min-w-0 transition-all duration-300">{renderContent()}</main>
        {activeChannelId && (
          <aside className={`fixed md:relative top-0 right-0 h-full w-72 bg-white dark:bg-charcoal-900 border-l border-slate-100 dark:border-white/5 shadow-2xl md:shadow-none z-50 transform transition-transform duration-500 ease-in-out ${isRightSidebarOpen ? 'translate-x-0' : 'translate-x-full md:hidden'}`}>
            <div className="flex flex-col h-full">
              <div className="p-6 border-b border-slate-50 dark:border-white/5 flex items-center justify-between">
                <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Channel Info</h3>
                <button onClick={() => setIsRightSidebarOpen(false)} className="md:hidden text-slate-400 p-1"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg></button>
              </div>
              <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8">
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-indigo-500 rounded-3xl flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-indigo-500/20">{activeChannelData?.name.charAt(0).toUpperCase()}</div>
                  <div>
                    <h4 className="text-lg font-black text-slate-900 dark:text-white leading-tight">{activeChannelData?.name}</h4>
                    <p className="text-[9px] font-bold text-indigo-500 uppercase tracking-widest mt-1">Academic Community</p>
                  </div>
                </div>
                <div className="bg-slate-50 dark:bg-charcoal-800 p-4 rounded-2xl border border-slate-100 dark:border-white/5">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Invite Others (Channel ID)</p>
                  <div className="flex items-center space-x-2">
                    <code className="flex-1 text-[10px] font-bold text-indigo-600 dark:text-indigo-400 truncate">{activeChannelId}</code>
                    <button onClick={() => { navigator.clipboard.writeText(activeChannelId!); alert("ID Copied!"); }} className="p-1.5 text-slate-400 hover:text-indigo-500 transition-colors"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg></button>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Members</h5>
                    <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-500 text-[9px] font-black rounded-full uppercase">{channelMembers.length}</span>
                  </div>
                  <div className="space-y-3">
                    {channelMembers.map((m) => (
                      <div key={m.uid} className="flex items-center space-x-3 group">
                        <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-charcoal-700 flex-shrink-0 flex items-center justify-center overflow-hidden border border-slate-200 dark:border-white/5">{m.photoURL ? <img src={m.photoURL} alt={m.displayName} className="w-full h-full object-cover" /> : <span className="text-[10px] font-black text-slate-400 uppercase">{m.displayName?.charAt(0)}</span>}</div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[11px] font-bold text-slate-700 dark:text-slate-300 truncate">{m.displayName}</p>
                          <p className="text-[8px] font-medium text-slate-400 uppercase tracking-tighter">{m.role || 'Student'}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="p-6 border-t border-slate-50 dark:border-white/5 bg-slate-50/50 dark:bg-charcoal-800/30"><p className="text-[8px] font-black text-slate-400 uppercase text-center tracking-[0.2em]">End-to-End Encrypted Workspace</p></div>
            </div>
          </aside>
        )}
      </div>
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
      <CustomModal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="Create Channel" onConfirm={handleCreateChannelSubmit} confirmLabel="Create" isLoading={modalLoading}>
        <input autoFocus placeholder="Channel Name..." value={modalInput} onChange={(e) => setModalInput(e.target.value)} className="w-full bg-slate-50 dark:bg-charcoal-950 border-slate-100 dark:border-white/5 rounded-2xl py-4 px-6 text-sm font-bold dark:text-white outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all" />
        {modalError && <p className="text-[10px] font-bold text-rose-500 uppercase tracking-widest text-center mt-2">{modalError}</p>}
      </CustomModal>
      <CustomModal isOpen={showJoinModal} onClose={() => setShowJoinModal(false)} title="Join Group" onConfirm={handleJoinChannelSubmit} confirmLabel="Join" isLoading={modalLoading}>
        <input autoFocus placeholder="Academic ID..." value={modalInput} onChange={(e) => setModalInput(e.target.value)} className="w-full bg-slate-50 dark:bg-charcoal-950 border-slate-100 dark:border-white/5 rounded-2xl py-4 px-6 text-sm font-bold dark:text-white outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all" />
        {modalError && <p className="text-[10px] font-bold text-rose-500 uppercase tracking-widest text-center mt-2">{modalError}</p>}
      </CustomModal>
    </div>
  );
};

export default StudySolverScreen;