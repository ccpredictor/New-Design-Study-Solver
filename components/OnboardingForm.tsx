import React, { useState, useEffect, useRef } from 'react';
import { TeacherAssistantService, StudentProfile } from '../services/teacherAssistantService';

interface OnboardingFormProps {
    uid: string;
    onComplete: (profile: StudentProfile) => void;
}

interface ChatMessage {
    id: string;
    role: 'AI' | 'USER';
    text: string;
    type?: 'QUESTION' | 'ANSWER';
}

const TRANSLATIONS = {
    GUJARATI: {
        welcome: "તમારા પર્સનલ AI ટીચર સાથે વાત કરો",
        intro: "નમસ્તે! હું તમારો નવો AI ટીચર છું. તમારો શ્રેષ્ઠ અભ્યાસ અનુભવ બનાવવા માટે મારે તમારી થોડી વિગતો જોઈએ છે.",
        analyzing: "તમારી પ્રોફાઇલ તૈયાર થઈ રહી છે...",
        q1: "૧. તમારું પૂરું નામ શું છે?",
        q2: "૨. તમે કયા ધોરણમાં ભણો છો?",
        q3: "૩. તમે કેવી રીતે ભણવાનું વધારે પસંદ કરો છો? (લર્નિંગ સ્ટાઇલ)",
        q4: "૪. તમે કઈ ભાષામાં વાત કરવા માંગો છો?",
        q5: "૫. તમારે ટીચરનો સ્વભાવ કેવો જોઈએ છે?",
        q6: "૬. ભણતી વખતે કઈ મુશ્કેલી વધારે આવે છે?",
        q7: "૭. જો કોઈ ટોપિકમાં અટકો, તો તમે શું કરો છો?",
        q8: "૮. તમને સૌથી વધારે મદદ શેનાથી મળે છે?",
        q9: "૯. મારી પાસે તમે કઈ મુખ્ય મદદ ઈચ્છો છો?",
        q10: "૧૦. તમને ભણવામાં સૌથી વધારે ક્યાં અટક આવે છે?",
        placeholders: {
            name: "તમારું નામ લખો...",
            type: "અહીં લખો..."
        },
        styles: { EXAMPLE: '💡 ઉદાહરણો સાથે', STEP_BY_STEP: '🪜 સ્ટેપ-બાય-સ્ટેપ', SHORT: '⚡ ઝડપથી', DETAILED: '📚 ઊંડાણમાં' },
        tones: { FRIENDLY: '😊 મિત્ર જેવો', STRICT_BUT_KIND: '🧘 ગંભીર', VERY_SIMPLE: '✨ સરળ શબ્દોમાં' },
        diffs: { MEMORY: '🧠 યાદ નથી રહેતું', UNDERSTANDING: '🤯 સમજાતું નથી', QUESTION: '❓ ડાઉટ પૂછવા છે', PRACTICE: '📝 પ્રેક્ટિસ જોઈએ છે' },
        strats: { RE_READ: '📖 ફરી વાંચું છું', ASK: '🙋 પૂછું છું', SKIP: '⏩ આગળ વધું છું', SEARCH: '🔍 સર્ચ કરું છું' },
        formats: { ANALOGIES: '💡 ઉદાહરણો', QA: '❓ પ્રશ્નો', SUMMARY: '📝 સમરી', RE_EXPLAIN: '🔄 બીજી રીતે' },
        goals: { RE_EXPLAIN: '🔄 સમજાવવું', SIMPLIFY: '✨ સરળતા', DOUBT: '❓ ડાઉટ', HOMEWORK: '📝 હોમવર્ક' },
        obstacles: { MATH_SUMS: '🔢 Sums માં', UNDERSTANDING: '🤯 સમજવામાં', READING_WRITING: '✍️ લખવામાં', MEMORY: '🧠 યાદ રાખવામાં', ALL: '😅 બધું જ' }
    },
    HINDI: {
        welcome: "अपने पर्सनल AI टीचर से बात करें",
        intro: "नमस्ते! मैं आपका नया AI टीचर हूँ। आपकी पढ़ाई को बेहतर बनाने के लिए मुझे आपकी कुछ जानकारी चाहिए।",
        analyzing: "आपकी प्रोफ़ाइल तैयार हो रही है...",
        q1: "1. आपका पूरा नाम क्या है?",
        q2: "2. आप कौन सी कक्षा में पढ़ते हैं?",
        q3: "3. आप कैसे पढ़ना पसंद करते हैं? (लर्निंग स्टाइल)",
        q4: "4. आप किस भाषा में बात करना चाहते हैं?",
        q5: "5. टीचर का स्वभाव कैसा होना चाहिए?",
        q6: "6. पढ़ते समय क्या समस्या आती है?",
        q7: "7. यदि आप अटक जाते हैं, तो क्या करते हैं?",
        q8: "8. आपको सबसे ज्यादा मदद किससे मिलती है?",
        q9: "9. आप मुझसे क्या मदद चाहते हैं?",
        q10: "10. आपको पढ़ाई में सबसे ज्यादा कहाँ रुकावट आती है?",
        placeholders: {
            name: "अपना नाम लिखें...",
            type: "यहाँ लिखें..."
        },
        styles: { EXAMPLE: '💡 उदाहरण के साथ', STEP_BY_STEP: '🪜 स्टेप-बाय-स्टेप', SHORT: '⚡ संक्षेप में', DETAILED: '📚 विस्तार में' },
        tones: { FRIENDLY: '😊 दोस्त जैसा', STRICT_BUT_KIND: '🧘 गंभीर', VERY_SIMPLE: '✨ सरल शब्दों में' },
        diffs: { MEMORY: '🧠 याद नहीं रहता', UNDERSTANDING: '🤯 समझ नहीं आता', QUESTION: '❓ सवाल पूछने हैं', PRACTICE: '📝 प्रैक्टिस चाहिए' },
        strats: { RE_READ: '📖 फिर पढ़ता हूँ', ASK: '🙋 पूछता हूँ', SKIP: '⏩ आगे बढ़ता हूँ', SEARCH: '🔍 इंटरनेट' },
        formats: { ANALOGIES: '💡 उदाहरण', QA: '❓ सवाल-जवाब', SUMMARY: '📝 समरी', RE_EXPLAIN: '🔄 अलग तरीका' },
        goals: { RE_EXPLAIN: '🔄 समझाना', SIMPLIFY: '✨ सरल करना', DOUBT: '❓ डाउट', HOMEWORK: '📝 होमवर्क' },
        obstacles: { MATH_SUMS: '🔢 सवाल हल करना', UNDERSTANDING: '🤯 समझने में', READING_WRITING: '✍️ लिखने में', MEMORY: '🧠 याद रखने में', ALL: '😅 सब में' }
    },
    ENGLISH: {
        welcome: "Chat with your AI Teacher",
        intro: "Hi! I'm your new AI Teacher. To give you the best learning experience, I'd like to know a bit about you.",
        analyzing: "Creating your profile...",
        q1: "1. What is your full name?",
        q2: "2. Which grade are you in?",
        q3: "3. How do you like to learn new topics?",
        q4: "4. Which language do you prefer?",
        q5: "5. What should my teaching tone be?",
        q6: "6. What is your main study difficulty?",
        q7: "7. What do you do when you're stuck?",
        q8: "8. What helps you the most while studying?",
        q9: "9. Primary help you expect from me?",
        q10: "10. Where do you get stuck the most?",
        placeholders: {
            name: "Enter your name...",
            type: "Type here..."
        },
        styles: { EXAMPLE: '💡 Examples', STEP_BY_STEP: '🪜 Step-by-Step', SHORT: '⚡ Concise', DETAILED: '📚 Deep Dive' },
        tones: { FRIENDLY: '😊 Friendly', STRICT_BUT_KIND: '🧘 Serious', VERY_SIMPLE: '✨ Simple' },
        diffs: { MEMORY: '🧠 Memory', UNDERSTANDING: '🤯 Understanding', QUESTION: '❓ Questions', PRACTICE: '📝 Practice' },
        strats: { RE_READ: '📖 Re-read', ASK: '🙋 Ask help', SKIP: '⏩ Skip for now', SEARCH: '🔍 Search' },
        formats: { ANALOGIES: '💡 Analogies', QA: '❓ Q&A', SUMMARY: '📝 Summaries', RE_EXPLAIN: '🔄 Re-explain' },
        goals: { RE_EXPLAIN: '🔄 Explaining', SIMPLIFY: '✨ Simplifying', DOUBT: '❓ Doubts', HOMEWORK: '📝 Homework' },
        obstacles: { MATH_SUMS: '🔢 Sums', UNDERSTANDING: '🤯 Understanding', READING_WRITING: '✍️ Writing', MEMORY: '🧠 Memory', ALL: '😅 Everything' }
    }
};

const UI_LANGUAGES = [
    { id: 'GUJARATI', label: 'ગુજરાતી', emoji: '🇮🇳' },
    { id: 'HINDI', label: 'हिन्दी', emoji: '🇮🇳' },
    { id: 'ENGLISH', label: 'English', emoji: '🇬🇧' },
    { id: 'MIX', label: 'Mix (Guj+Eng)', emoji: '✨' }
];

const GRADES = ["5", "6", "7", "8", "9", "10", "11", "12", "Other"];

const OnboardingForm: React.FC<OnboardingFormProps> = ({ uid, onComplete }) => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [currentStep, setCurrentStep] = useState(-1); // -1 = Lang selection
    const [uiLanguage, setUiLanguage] = useState<'GUJARATI' | 'HINDI' | 'ENGLISH'>('GUJARATI');
    const [isTyping, setIsTyping] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [tempSelections, setTempSelections] = useState<string[]>([]);

    // Form Data State
    const [formData, setFormData] = useState({
        name: '',
        grade: '',
        styles: [] as string[],
        language: '',
        tone: '',
        difficulties: [] as string[],
        stuckStrategy: '',
        helpfulFormat: '',
        aiGoal: '',
        obstacles: [] as string[]
    });

    const scrollRef = useRef<HTMLDivElement>(null);
    const t = TRANSLATIONS[uiLanguage] || TRANSLATIONS.GUJARATI;

    // Auto scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
        }
    }, [messages, isTyping]);

    // Initial Message
    useEffect(() => {
        if (currentStep === -1) {
            addAIMessage("👋 નમસ્તે! તમારી ભાષા પસંદ કરો / Select your language:");
        }
    }, []);

    const addAIMessage = (text: string) => {
        setIsTyping(true);
        setTimeout(() => {
            setMessages(prev => [...prev, { id: Date.now().toString(), role: 'AI', text }]);
            setIsTyping(false);
        }, 1000);
    };

    const addUserMessage = (text: string) => {
        setMessages(prev => [...prev, { id: Date.now().toString() + 'u', role: 'USER', text }]);
    };

    const toggleMultiSelect = (id: string, field: 'styles' | 'difficulties' | 'obstacles') => {
        setTempSelections(prev => {
            const isSelected = prev.includes(id);
            if (isSelected) {
                return prev.filter(x => x !== id);
            } else {
                return [...prev, id];
            }
        });
    };

    const handleLanguageSelect = (lang: string) => {
        const actualLang = lang === 'MIX' ? 'GUJARATI' : lang as any;
        setUiLanguage(actualLang);
        setFormData(prev => ({ ...prev, language: lang }));
        addUserMessage(UI_LANGUAGES.find(l => l.id === lang)?.label || lang);

        setTimeout(() => {
            addAIMessage(TRANSLATIONS[actualLang].intro);
            setTimeout(() => {
                addAIMessage(TRANSLATIONS[actualLang].q1);
                setCurrentStep(1);
            }, 1200);
        }, 800);
    };

    const handleNext = (val: any, label: string) => {
        addUserMessage(label);

        // Update Step & AI Response
        const nextStep = currentStep + 1;
        setCurrentStep(nextStep);

        setTimeout(() => {
            if (nextStep <= 10) {
                addAIMessage((t as any)[`q${nextStep}`]);
            } else {
                addAIMessage(t.analyzing);
                finalizeOnboarding({ ...formData });
            }
        }, 1000);
    };

    const finalizeOnboarding = async (data: any) => {
        setIsSubmitting(true);
        try {
            const answers = [
                { q: "1. Name", a: data.name },
                { q: "2. Grade", a: data.grade },
                { q: "3. Styles", a: data.styles.join(", ") },
                { q: "4. Lang", a: data.language },
                { q: "5. Tone", a: data.tone },
                { q: "6. Diffs", a: data.difficulties.join(", ") },
                { q: "7. Stuck", a: data.stuckStrategy },
                { q: "8. Format", a: data.helpfulFormat },
                { q: "9. Goal", a: data.aiGoal },
                { q: "10. Obstacles", a: data.obstacles.join(", ") }
            ];
            const profile = await TeacherAssistantService.completeOnboarding(uid, answers, { name: data.name, grade: data.grade });
            onComplete(profile);
        } catch (e) {
            console.error(e);
            alert("Submission error. Try again.");
            setIsSubmitting(false);
        }
    };

    const renderInput = () => {
        if (isTyping || isSubmitting) return null;

        if (currentStep === -1) {
            return (
                <div className="flex flex-wrap gap-2 justify-center p-4">
                    {UI_LANGUAGES.map(l => (
                        <button key={l.id} onClick={() => handleLanguageSelect(l.id)} className="chip-btn">
                            {l.emoji} {l.label}
                        </button>
                    ))}
                </div>
            );
        }

        switch (currentStep) {
            case 1: // Name
                return (
                    <div className="p-4 flex gap-2">
                        <input
                            autoFocus
                            className="flex-1 bg-slate-100 dark:bg-charcoal-800 rounded-2xl p-4 font-bold outline-none text-slate-800 dark:text-white"
                            placeholder={t.placeholders.name}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && (e.target as any).value) {
                                    const val = (e.target as any).value;
                                    setFormData({ ...formData, name: val });
                                    handleNext(val, val);
                                }
                            }}
                        />
                    </div>
                );
            case 2: // Grade
                return (
                    <div className="flex flex-wrap gap-2 justify-center p-4">
                        {GRADES.map(g => (
                            <button key={g} onClick={() => { setFormData({ ...formData, grade: g }); handleNext(g, `Std ${g}`); }} className="chip-btn">
                                Std {g}
                            </button>
                        ))}
                    </div>
                );
            case 3: // Learning Style (Multi)
                return (
                    <div className="flex flex-col items-center">
                        <div className="flex flex-wrap gap-2 justify-center p-4">
                            {Object.entries(t.styles).map(([id, label]) => {
                                const isSelected = tempSelections.includes(id);
                                return (
                                    <button
                                        key={id}
                                        onClick={() => toggleMultiSelect(id, 'styles')}
                                        className={`chip-btn flex items-center gap-2 ${isSelected ? 'chip-active' : ''}`}
                                    >
                                        <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${isSelected ? 'bg-white border-white' : 'bg-transparent border-slate-300'}`}>
                                            {isSelected && (
                                                <svg className="w-3 h-3 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" />
                                                </svg>
                                            )}
                                        </div>
                                        {label}
                                    </button>
                                );
                            })}
                        </div>
                        <button
                            disabled={tempSelections.length === 0}
                            onClick={() => {
                                setFormData({ ...formData, styles: tempSelections });
                                const labels = tempSelections.map(id => (t.styles as Record<string, string>)[id] || id).join(", ");
                                setTempSelections([]);
                                handleNext(tempSelections, labels);
                            }}
                            className="bg-indigo-500 text-white px-8 py-3 rounded-2xl font-black uppercase tracking-widest mb-4 shadow-lg shadow-indigo-500/20 active:scale-95 transition-all"
                        >
                            Next
                        </button>
                    </div>
                );
            case 4: // Language Pref
                return (
                    <div className="flex flex-wrap gap-2 justify-center p-4">
                        {UI_LANGUAGES.map(l => (
                            <button key={l.id} onClick={() => { setFormData({ ...formData, language: l.id }); handleNext(l.id, l.label); }} className="chip-btn">
                                {l.emoji} {l.label}
                            </button>
                        ))}
                    </div>
                );
            case 5: // Tone
                return (
                    <div className="flex flex-wrap gap-2 justify-center p-4">
                        {Object.entries(t.tones).map(([id, label]) => (
                            <button key={id} onClick={() => { setFormData({ ...formData, tone: id }); handleNext(id, label as string); }} className="chip-btn">
                                {label}
                            </button>
                        ))}
                    </div>
                );
            case 6: // Diffs (Multi)
                return (
                    <div className="flex flex-col items-center">
                        <div className="flex flex-wrap gap-2 justify-center p-4">
                            {Object.entries(t.diffs).map(([id, label]) => {
                                const isSelected = tempSelections.includes(id);
                                return (
                                    <button
                                        key={id}
                                        onClick={() => toggleMultiSelect(id, 'difficulties')}
                                        className={`chip-btn flex items-center gap-2 ${isSelected ? 'chip-active' : ''}`}
                                    >
                                        <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${isSelected ? 'bg-white border-white' : 'bg-transparent border-slate-300'}`}>
                                            {isSelected && (
                                                <svg className="w-3 h-3 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" />
                                                </svg>
                                            )}
                                        </div>
                                        {label}
                                    </button>
                                );
                            })}
                        </div>
                        <button
                            disabled={tempSelections.length === 0}
                            onClick={() => {
                                setFormData({ ...formData, difficulties: tempSelections });
                                const labels = tempSelections.map(id => (t.diffs as Record<string, string>)[id] || id).join(", ");
                                setTempSelections([]);
                                handleNext(tempSelections, labels);
                            }}
                            className="bg-indigo-500 text-white px-8 py-3 rounded-2xl font-black uppercase tracking-widest mb-4 shadow-lg shadow-indigo-500/20 active:scale-95 transition-all"
                        >
                            Next
                        </button>
                    </div>
                );
            case 7: // Stuck
                return (
                    <div className="flex flex-wrap gap-2 justify-center p-4">
                        {Object.entries(t.strats).map(([id, label]) => (
                            <button key={id} onClick={() => { setFormData({ ...formData, stuckStrategy: id }); handleNext(id, label as string); }} className="chip-btn">
                                {label}
                            </button>
                        ))}
                    </div>
                );
            case 8: // Format
                return (
                    <div className="flex flex-wrap gap-2 justify-center p-4">
                        {Object.entries(t.formats).map(([id, label]) => (
                            <button key={id} onClick={() => { setFormData({ ...formData, helpfulFormat: id }); handleNext(id, label as string); }} className="chip-btn">
                                {label}
                            </button>
                        ))}
                    </div>
                );
            case 9: // Goal
                return (
                    <div className="flex flex-wrap gap-2 justify-center p-4">
                        {Object.entries(t.goals).map(([id, label]) => (
                            <button key={id} onClick={() => { setFormData({ ...formData, aiGoal: id }); handleNext(id, label as string); }} className="chip-btn">
                                {label}
                            </button>
                        ))}
                    </div>
                );
            case 10: // Obstacles (Multi)
                return (
                    <div className="flex flex-col items-center">
                        <div className="flex flex-wrap gap-2 justify-center p-4">
                            {Object.entries(t.obstacles).map(([id, label]) => {
                                const isSelected = tempSelections.includes(id);
                                return (
                                    <button
                                        key={id}
                                        onClick={() => toggleMultiSelect(id, 'obstacles')}
                                        className={`chip-btn flex items-center gap-2 ${isSelected ? 'chip-active' : ''}`}
                                    >
                                        <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${isSelected ? 'bg-white border-white' : 'bg-transparent border-slate-300'}`}>
                                            {isSelected && (
                                                <svg className="w-3 h-3 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" />
                                                </svg>
                                            )}
                                        </div>
                                        {label}
                                    </button>
                                );
                            })}
                        </div>
                        <button
                            disabled={tempSelections.length === 0}
                            onClick={() => {
                                setFormData({ ...formData, obstacles: tempSelections });
                                const labels = tempSelections.map(id => (t.obstacles as Record<string, string>)[id] || id).join(", ");
                                setTempSelections([]);
                                handleNext(tempSelections, labels);
                            }}
                            className="bg-indigo-500 text-white px-8 py-3 rounded-2xl font-black uppercase tracking-widest mb-4 shadow-lg shadow-indigo-500/20 active:scale-95 transition-all"
                        >
                            Finish
                        </button>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="flex flex-col h-screen bg-[#F9FBFF] dark:bg-charcoal-950 font-sans">
            {/* Header */}
            <div className="p-4 sm:p-6 border-b border-slate-100 dark:border-white/5 bg-white/80 dark:bg-charcoal-900/80 backdrop-blur-md sticky top-0 z-10">
                <div className="max-w-3xl mx-auto flex items-center justify-between">
                    <div>
                        <h1 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tighter">{t.welcome}</h1>
                        <div className="flex items-center gap-2 mt-1">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">AI Teacher Online</span>
                        </div>
                    </div>
                    <div className="w-10 h-10 rounded-2xl bg-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                        <span className="text-xl">🎓</span>
                    </div>
                </div>
            </div>

            {/* Chat Body */}
            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 custom-scrollbar"
            >
                <div className="max-w-3xl mx-auto space-y-4">
                    {messages.map(m => (
                        <div key={m.id} className={`flex ${m.role === 'AI' ? 'justify-start' : 'justify-end'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                            <div className={`max-w-[85%] sm:max-w-[80%] p-4 rounded-3xl font-bold text-sm sm:text-base ${m.role === 'AI'
                                ? 'bg-white dark:bg-charcoal-800 text-slate-800 dark:text-slate-200 rounded-tl-none shadow-sm border border-slate-100 dark:border-white/5'
                                : 'bg-indigo-500 text-white rounded-tr-none shadow-lg shadow-indigo-500/20'
                                }`}>
                                {m.text}
                            </div>
                        </div>
                    ))}

                    {isTyping && (
                        <div className="flex justify-start">
                            <div className="bg-white dark:bg-charcoal-800 p-4 rounded-3xl rounded-tl-none shadow-sm border border-slate-100 dark:border-white/5 flex gap-1">
                                <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce [animation-delay:-.15s]"></div>
                                <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce [animation-delay:-.3s]"></div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Input Footer */}
            <div className="bg-white/50 dark:bg-charcoal-900/50 backdrop-blur-xl border-t border-slate-100 dark:border-white/5 min-h-[100px] pb-6">
                <div className="max-w-3xl mx-auto w-full flex flex-col justify-end">
                    {renderInput()}

                    {isSubmitting && (
                        <div className="p-8 flex flex-col items-center justify-center animate-pulse">
                            <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                            <p className="text-sm font-black text-indigo-500 uppercase tracking-widest">{t.analyzing}</p>
                        </div>
                    )}
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                .chip-btn {
                    padding: 0.6rem 1.25rem;
                    background: #f1f5f9;
                    border: none;
                    border-radius: 9999px;
                    font-size: 0.875rem;
                    font-weight: 700;
                    color: #475569;
                    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                    cursor: pointer;
                }
                .dark .chip-btn {
                    background: #2D333B;
                    color: #94A3B8;
                }
                .chip-btn:hover {
                    background: #e2e8f0;
                    color: #6366F1;
                }
                .dark .chip-btn:hover {
                    background: #3d444d;
                }
                .chip-active {
                    background: #6366F1 !important;
                    border-color: #6366F1 !important;
                    color: white !important;
                    box-shadow: 0 4px 12px rgba(99, 102, 241, 0.2);
                }
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #E2E8F0;
                    border-radius: 10px;
                }
                .dark .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #2D333B;
                }
            `}} />
        </div>
    );
};

export default OnboardingForm;
