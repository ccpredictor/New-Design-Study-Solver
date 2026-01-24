import React, { useState, useEffect, useRef } from 'react';
import { TeacherAssistantService, StudentProfile } from '../services/teacherAssistantService';

interface OnboardingChatProps {
    uid: string;
    onComplete: (profile: StudentProfile) => void;
}

const ONBOARDING_QUESTIONS = [
    "તમારું નામ શું છે અને તમે કયા ધોરણમાં ભણો છો?",
    "તમારો મનપસંદ વિષય કયો છે?",
    "તમારે જીવનમાં શું બનવું છે અથવા તમારા ભણતરના લક્ષ્યો શું છે?",
    "તમને કેવી રીતે સમજવું વધુ ગમે છે? ઉદાહરણો સાથે, સ્ટેપ-બાય-સ્ટેપ, કે ટૂંકમાં?",
    "શું તમને શિક્ષકને સવાલ પૂછવામાં સંકોચ કે ડર લાગે છે?",
    "તમને કઈ ભાષામાં વાતચીત કરવી વધુ ગમે છે? ગુજરાતી, હિન્દી, અંગ્રેજી કે મિક્સ?",
    "તમારો ભણવા પ્રત્યેનો આત્મવિશ્વાસ ૧ થી ૧૦ માં કેટલો છે?",
    "જયારે કોઈ નવી વસ્તુ શીખો છો, ત્યારે તમને તે સમજવામાં કેટલી વાર લાગે છે?"
];

const OnboardingChat: React.FC<OnboardingChatProps> = ({ uid, onComplete }) => {
    const [step, setStep] = useState(0);
    const [answers, setAnswers] = useState<{ q: string, a: string }[]>([]);
    const [currentInput, setCurrentInput] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [answers, isAnalyzing]);

    const handleSend = async () => {
        if (!currentInput.trim()) return;

        const newAnswers = [...answers, { q: ONBOARDING_QUESTIONS[step], a: currentInput }];
        setAnswers(newAnswers);
        setCurrentInput('');

        if (step < ONBOARDING_QUESTIONS.length - 1) {
            setStep(step + 1);
        } else {
            setIsAnalyzing(true);
            try {
                const profile = await TeacherAssistantService.completeOnboarding(uid, newAnswers);
                onComplete(profile);
            } catch (error) {
                console.error("Onboarding failed", error);
                alert("Something went wrong during analysis. Please try again.");
                setIsAnalyzing(false);
            }
        }
    };

    return (
        <div className="flex flex-col h-full bg-white dark:bg-charcoal-950 p-6 md:p-12 overflow-hidden">
            <div className="max-w-xl mx-auto w-full flex flex-col h-full bg-slate-50 dark:bg-charcoal-900 rounded-[40px] border border-slate-100 dark:border-white/5 shadow-2xl relative">

                {/* Header */}
                <div className="p-8 border-b border-slate-100 dark:border-white/5 bg-white/50 dark:bg-charcoal-800/50 backdrop-blur-xl rounded-t-[40px]">
                    <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-widest">Setup Your Profile</h2>
                    <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-tighter mt-1">Let's personalize your learning journey</p>
                </div>

                {/* Chat Area */}
                <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar pb-24">
                    {answers.map((ans, idx) => (
                        <div key={idx} className="space-y-4">
                            <div className="flex justify-start">
                                <div className="bg-indigo-500 text-white p-5 rounded-[28px] rounded-tl-none text-sm font-bold shadow-lg shadow-indigo-500/10 max-w-[85%] leading-relaxed">
                                    {ans.q}
                                </div>
                            </div>
                            <div className="flex justify-end">
                                <div className="bg-white dark:bg-charcoal-800 text-slate-800 dark:text-white p-5 rounded-[28px] rounded-tr-none text-sm font-bold border border-slate-100 dark:border-white/5 shadow-sm max-w-[85%] leading-relaxed">
                                    {ans.a}
                                </div>
                            </div>
                        </div>
                    ))}

                    {step < ONBOARDING_QUESTIONS.length && !isAnalyzing && (
                        <div className="flex justify-start">
                            <div className="bg-indigo-500 text-white p-5 rounded-[28px] rounded-tl-none text-sm font-bold shadow-lg shadow-indigo-500/10 max-w-[85%] leading-relaxed animate-in fade-in slide-in-from-bottom-2 duration-500">
                                {ONBOARDING_QUESTIONS[step]}
                            </div>
                        </div>
                    )}

                    {isAnalyzing && (
                        <div className="flex flex-col items-center justify-center py-10 space-y-4">
                            <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-500 rounded-full animate-spin"></div>
                            <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest animate-pulse">Analyzing your learning style...</p>
                        </div>
                    )}
                </div>

                {/* Input Area */}
                {!isAnalyzing && (
                    <div className="absolute bottom-6 left-6 right-6 flex items-center bg-white dark:bg-charcoal-800 rounded-[24px] p-2 border border-slate-100 dark:border-white/5 shadow-xl">
                        <input
                            autoFocus
                            className="flex-1 bg-transparent border-none px-6 py-4 text-sm font-bold text-slate-800 dark:text-white focus:outline-none"
                            placeholder="અહીં જવાબ લખો..."
                            value={currentInput}
                            onChange={(e) => setCurrentInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        />
                        <button
                            onClick={handleSend}
                            className="bg-indigo-500 text-white p-4 rounded-2xl hover:bg-indigo-600 transition-all shadow-lg shadow-indigo-500/20 active:scale-95"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OnboardingChat;
