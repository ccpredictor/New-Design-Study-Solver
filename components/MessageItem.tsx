import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { Message, Role } from '../types';
import { doc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../services/firebase';

interface MessageItemProps {
  message: Message;
  index: number;
  chatId?: string | null;
  isChannel?: boolean;
}

const MessageItem: React.FC<MessageItemProps> = ({ message, chatId, isChannel }) => {
  const isUser = message.role === Role.USER;
  const user = auth.currentUser;

  const handleFeedback = async (type: 'like' | 'dislike') => {
    if (!user || !chatId || !message.id) return;
    try {
      let messageRef;
      if (isChannel) {
        messageRef = doc(db, 'channels', chatId, 'messages', message.id);
      } else {
        messageRef = doc(db, 'users', user.uid, 'chats', chatId, 'messages', message.id);
      }
      const newFeedback = message.feedback === type ? null : type;
      await updateDoc(messageRef, { feedback: newFeedback });
    } catch (e) {
      console.error(e);
    }
  };

  const copyToClipboard = () => {
    const text = message.text.replace(/[\*\#\$\_]/g, '').trim();
    navigator.clipboard.writeText(text);
  };

  const getSubjectIcon = (title: string) => {
    const t = title.toLowerCase();
    if (t.includes('math') || t.includes('trig') || t.includes('મેથ્સ') || t.includes('ગણિત')) return '📐';
    if (t.includes('physics') || t.includes('फिजिक्स') || t.includes('નિયમ') || t.includes('ભૌતિક')) return '🍎';
    if (t.includes('history') || t.includes('ઇતિહાસ')) return '⌛';
    if (t.includes('bio') || t.includes('બાયોલોજી')) return '🍃';
    return '✏️';
  };

  const detectLanguage = (text: string) => {
    const gujaratiRange = /[\u0A80-\u0AFF]/;
    const hindiRange = /[\u0900-\u097F]/;
    if (gujaratiRange.test(text)) return 'gu';
    if (hindiRange.test(text)) return 'hi';
    return 'en';
  };

  const getDynamicTitle = (text: string) => {
    const lang = detectLanguage(text);
    switch (lang) {
      case 'gu': return 'મલ્ટી-સબ્જેક્ટ સ્ટડી નોટ્સ';
      case 'hi': return 'मल्टी-सब्जेक्ट स्टडी नोट्स';
      default: return 'Multi-Subject Study Notes';
    }
  };

  const getDynamicDateLabel = (text: string) => {
    const lang = detectLanguage(text);
    switch (lang) {
      case 'gu': return 'તારીખ';
      case 'hi': return 'तारीख';
      default: return 'Date';
    }
  };

  const getDynamicTip = (text: string) => {
    const lang = detectLanguage(text);
    switch (lang) {
      case 'gu': return 'રિવિઝન ટિપ: રોજ 10 મિનિટ પઢો।';
      case 'hi': return 'रिवीजन टिप: रोज 10 मिनट पढ़ें।';
      default: return 'Revision Tip: Read 10 minutes daily.';
    }
  };

  if (isUser) {
    return (
      <div className="flex flex-col items-end mb-8 px-4 md:px-0 group">
        <div className="max-w-[92%] md:max-w-[85%] bg-slate-50 dark:bg-charcoal-800 text-slate-800 dark:text-slate-100 px-5 py-3 rounded-[24px] rounded-tr-none shadow-sm border border-slate-100 dark:border-white/5 transition-all">
          {message.image && (
            <div className="mb-3 rounded-xl overflow-hidden border border-slate-200 dark:border-white/10">
              <img src={message.image} alt="User upload" className="max-h-60 w-full object-contain bg-black/5" />
            </div>
          )}
          <p className="text-[14px] md:text-[16px] leading-relaxed whitespace-pre-wrap">{message.text}</p>
        </div>
      </div>
    );
  }
  const checkIsEasy = () => {
    // 1. Explicit metadata (EASY/HARD)
    if (message.metadata?.complexity === 'EASY') return true;
    if (message.metadata?.complexity === 'HARD') return false;

    // 2. Local heuristic fallback (for old messages or missing metadata)
    const text = message.text.toLowerCase();
    const hardIndicators = [
      'step 1', 'step 2', 'problem understanding', 'concept used',
      'solution', 'final answer', 'ટિપ્સ', 'સમજૂતી', 'ઉકેલ',
      'विवरण', 'अंतिम उत्तर', 'चरण', 'grounding chunks', 'web search'
    ];

    // If it's short, it's almost certainly EASY
    if (text.length < 150 && !hardIndicators.some(ind => text.includes(ind))) {
      return true;
    }

    // If text has academic headers, it's HARD
    if (hardIndicators.some(ind => text.includes(ind))) {
      return false;
    }

    // Default: If it's reasonably long, show notebook, otherwise bubble
    return text.length < 250;
  };

  const isEasy = checkIsEasy();

  // Casual Response UI (Simple Bubble)
  if (isEasy) {
    return (
      <div className="flex flex-col mb-8 px-4 md:px-0 animate-in fade-in slide-in-from-bottom-2 duration-300 group">
        <div className="max-w-[92%] md:max-w-[85%] bg-white dark:bg-charcoal-800 text-slate-800 dark:text-slate-100 px-5 py-3 rounded-[24px] rounded-tl-none shadow-sm border border-slate-100 dark:border-white/5">
          <div className="text-[14px] md:text-[16px] leading-relaxed whitespace-pre-wrap">
            <ReactMarkdown
              remarkPlugins={[remarkMath]}
              rehypePlugins={[rehypeKatex]}
            >
              {message.text}
            </ReactMarkdown>
          </div>
        </div>

        {/* Actions for easy items */}
        <div className="mt-2 flex items-center space-x-3 opacity-0 group-hover:opacity-100 transition-opacity pl-2">
          <button onClick={copyToClipboard} className="text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-indigo-500">Copy</button>
          <button onClick={() => handleFeedback('like')} className={`p-1 rounded-lg ${message.feedback === 'like' ? 'text-emerald-500' : 'text-slate-300'}`}>
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 10h4.708C19.723 10 20.5 10.741 20.5 11.64c0 .351-.11.68-.316.963l-2.617 3.663c-.347.487-.903.774-1.498.774H8.5V10h4.04l.972-3.89a2 2 0 00-1.942-2.484H10l-1.5 1.5V10" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M7 10H4a1 1 0 00-1 1v7a1 1 0 001 1h3V10z" /></svg>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col mb-16 px-2 md:px-0 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="notebook-paper handwritten px-4 md:px-0 rounded-[12px] shadow-2xl relative overflow-hidden border border-slate-200/50">
        {/* Eraser Marks / Smudges Background Effect */}
        <div className="absolute inset-0 pointer-events-none opacity-20" style={{
          backgroundImage: 'radial-gradient(circle at 20% 30%, #ffffff 0%, transparent 40%), radial-gradient(circle at 80% 70%, #ffffff 0%, transparent 30%)'
        }}></div>

        {/* Header - Aligned to grid height (2.2rem) */}
        <div className="relative mb-8 pl-[90px] pr-8 border-b-2 border-[#0047ab]/30 pb-2" style={{ minHeight: '4.4rem' }}>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight mb-1">{getDynamicTitle(message.text)}</h2>
          <div className="flex items-center justify-between text-[10px] font-bold opacity-70">
            <span>{getDynamicDateLabel(message.text)}: {new Date().toLocaleDateString()}</span>
            <div className="flex space-x-2">
              <span>⭐</span><span>📚</span>
            </div>
          </div>
        </div>

        {/* Content Body - Using notebook-content for grid lock */}
        <div className="notebook-content max-w-none relative pl-[90px] pr-8 handwritten text-[#0047ab]">
          <ReactMarkdown
            remarkPlugins={[remarkMath]}
            rehypePlugins={[rehypeKatex]}
            components={{
              h1: ({ children }) => (
                <div className="relative">
                  <span className="absolute left-[-80px] top-0 text-xl">{getSubjectIcon(String(children))}</span>
                  <h3 className="text-lg md:text-xl underline decoration-wavy decoration-[#0047ab]/40 flex items-center gap-2">{children}</h3>
                </div>
              ),
              h2: ({ children }) => (
                <div className="relative">
                  <span className="absolute left-[-80px] top-0 text-xl">{getSubjectIcon(String(children))}</span>
                  <h3 className="text-lg md:text-xl underline decoration-wavy decoration-[#0047ab]/40 flex items-center gap-2">{children}</h3>
                </div>
              ),
              strong: ({ node, ...props }) => {
                const content = String(props.children);

                // Boxed Answer Handling
                if (content.toLowerCase().includes('final answer') || content.toLowerCase().includes('જવાબ') || content.toLowerCase().includes('अंतिम उत्तर')) {
                  return (
                    <div className="my-2 inline-block border-2 border-[#0047ab] px-3 py-0 leading-[2rem] rotate-[-0.5deg] shadow-[2px_2px_0px_#0047ab20]">
                      <strong className="text-lg uppercase">{props.children}</strong>
                    </div>
                  );
                }

                // Section Labels - Moved to Margin (Hasiya)
                const isSectionHeader = content.match(/Step \d|Problem Understanding|Concept|Tips|Notes|સમજૂતી|ઉકેલ|चरण|विवरण|टिप्स/i);
                if (isSectionHeader) {
                  return (
                    <div className="relative h-0">
                      <span className="absolute left-[-85px] top-0 w-[70px] text-right text-[9px] font-bold uppercase leading-tight pr-2 opacity-80">
                        {content}
                      </span>
                    </div>
                  );
                }

                return <strong {...props} />
              },
              hr: () => <div className="h-px w-full border-t border-dashed border-[#0047ab]/20 my-4" />,
              p: ({ children }) => <p>{children}</p>,
              ul: ({ children }) => <ul className="list-disc pl-5">{children}</ul>,
              li: ({ children }) => <li>{children}</li>
            }}
          >
            {message.text}
          </ReactMarkdown>
        </div>

        {/* Verified Grounding Sources */}
        {message.sources && message.sources.length > 0 && (
          <div className="mt-8 pl-[90px] pr-8 border-t border-dashed border-[#0047ab]/20 pt-4 pb-4">
            <h4 className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-3">Verified Academic Sources</h4>
            <div className="flex flex-wrap gap-2">
              {message.sources.map((source, sIdx) => {
                if (source.web) {
                  return (
                    <a
                      key={sIdx}
                      href={source.web.uri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-1.5 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-bold border border-indigo-100 hover:bg-indigo-100 transition-colors"
                    >
                      <span>{source.web.title || 'Source'}</span>
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                    </a>
                  );
                }
                return null;
              })}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-4 pt-2 pl-[90px] pr-8 border-t-2 border-[#0047ab]/30 text-center pb-4">
          <p className="text-sm md:text-lg font-bold">{getDynamicTip(message.text)}</p>
        </div>
      </div>

      {/* Action Buttons (External to paper) */}
      <div className="mt-4 flex items-center justify-end space-x-3 opacity-60 hover:opacity-100 transition-opacity pr-4">
        <button onClick={copyToClipboard} className="p-2 hover:bg-slate-100 dark:hover:bg-charcoal-800 rounded-lg text-xs font-bold uppercase tracking-widest text-slate-400">Copy Text</button>
        <div className="flex space-x-1">
          <button onClick={() => handleFeedback('like')} className={`p-1.5 rounded-lg ${message.feedback === 'like' ? 'bg-emerald-500 text-white' : 'text-slate-400'}`}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.708C19.723 10 20.5 10.741 20.5 11.64c0 .351-.11.68-.316.963l-2.617 3.663c-.347.487-.903.774-1.498.774H8.5V10h4.04l.972-3.89a2 2 0 00-1.942-2.484H10l-1.5 1.5V10" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 10H4a1 1 0 00-1 1v7a1 1 0 001 1h3V10z" /></svg>
          </button>
          <button onClick={() => handleFeedback('dislike')} className={`p-1.5 rounded-lg ${message.feedback === 'dislike' ? 'bg-rose-500 text-white' : 'text-slate-400'}`}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ transform: 'rotate(180deg)' }}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.708C19.723 10 20.5 10.741 20.5 11.64c0 .351-.11.68-.316.963l-2.617 3.663c-.347.487-.903.774-1.498.774H8.5V10h4.04l.972-3.89a2 2 0 00-1.942-2.484H10l-1.5 1.5V10" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 10H4a1 1 0 00-1 1v7a1 1 0 001 1h3V10z" /></svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessageItem;