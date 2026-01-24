import React, { useState, useEffect } from 'react';
import { TeacherAssistantService, StudentProfile } from '../services/teacherAssistantService';

interface OnboardingFormProps {
    uid: string;
    onComplete: (profile: StudentProfile) => void;
}



const GRADES = ["5", "6", "7", "8", "9", "10", "11", "12", "Other"];
const STYLES = [
    { id: 'EXAMPLE', label: 'ઉદાહરણ સાથે', desc: 'Learning through examples' },
    { id: 'STEP_BY_STEP', label: 'સ્ટેપ-બાય-સ્ટેપ', desc: 'Logical breakdown' },
    { id: 'SHORT', label: 'ટૂંકમાં (ઝડપથી)', desc: 'Quick summary' },
    { id: 'DETAILED', label: 'ઊંડાણમાં (detail સાથે)', desc: 'Deep dive theory' }
];
const LANGUAGES = [
    { id: 'GUJARATI', label: 'ગુજરાતી' },
    { id: 'HINDI', label: 'हिन्दी' },
    { id: 'ENGLISH', label: 'English' },
    { id: 'MIX', label: 'મિક્સ' }
];
const TONES = [
    { id: 'FRIENDLY', label: 'મિત્ર જેવો' },
    { id: 'STRICT_BUT_KIND', label: 'શાંત અને ગંભીર' },
    { id: 'VERY_SIMPLE', label: 'બહુ સરળ શબ્દોમાં સમજાવતો' }
];
const DIFFICULTIES = [
    { id: 'MEMORY', label: 'વિષય સમજાય છે પણ યાદ નથી રહેતું' },
    { id: 'UNDERSTANDING', label: 'શરૂઆતમાં સમજાતું નથી' },
    { id: 'QUESTION_FORMULATION', label: 'પ્રશ્નો ક્યાંથી પૂછવા તે સમજાતું નથી' },
    { id: 'PRACTICE', label: 'બધું ઠીક લાગે છે, બસ practice ઓછી છે' }
];
const STRATEGIES = [
    { id: 'RE_READ', label: 'ફરી વાંચું છું' },
    { id: 'ASK', label: 'કોઈને પૂછું છું' },
    { id: 'SKIP', label: 'છોડીને આગળ વધું છું' },
    { id: 'SEARCH', label: 'Google / Internet પર શોધું છું' }
];
const HELPFUL_FORMATS = [
    { id: 'ANALOGIES', label: 'રોજિંદા જીવનનાં ઉદાહરણો' },
    { id: 'QA', label: 'પ્રશ્ન–જવાબ' },
    { id: 'SUMMARY', label: 'ટૂંકા summary' },
    { id: 'RE_EXPLAIN', label: 'એક જ વાત અલગ રીતે સમજાવવી' }
];
const AI_GOALS = [
    { id: 'RE_EXPLAIN', label: 'શાંતિથી ફરી સમજાવવી' },
    { id: 'SIMPLIFY', label: 'સરળ શબ્દોમાં સમજાવવી' },
    { id: 'DOUBT_CLEAR', label: 'doubt clear કરવું' },
    { id: 'HOMEWORK', label: 'homework / practice માં મદદ' }
];
const SUBJECT_LIST = ["ગણિત", "વિજ્ઞાન", "ગુજરાતી", "અંગ્રેજી", "સામાજિક વિજ્ઞાન", "અન્ય"];

const OnboardingForm: React.FC<OnboardingFormProps> = ({ uid, onComplete }) => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        name: '',
        grade: '10',
        style: 'STEP_BY_STEP',
        language: 'GUJARATI',
        tone: 'FRIENDLY',
        difficulty: 'MEMORY',
        stuckStrategy: 'RE_READ',
        helpfulFormat: 'ANALOGIES',
        aiGoal: 'RE_EXPLAIN',
        subjects: [] as string[]
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showHelpline, setShowHelpline] = useState(false);
    const [helplineQuery, setHelplineQuery] = useState('');
    const [helplineResponse, setHelplineResponse] = useState('');
    const [isLoadingHelp, setIsLoadingHelp] = useState(false);

    const totalSteps = 5;

    const nextStep = () => setStep(s => Math.min(s + 1, totalSteps));
    const prevStep = () => setStep(s => Math.max(s - 1, 1));

    const toggleSubject = (sub: string) => {
        setFormData(prev => ({
            ...prev,
            subjects: prev.subjects.includes(sub)
                ? prev.subjects.filter(s => s !== sub)
                : [...prev.subjects, sub]
        }));
    };

    const handleHelp = async () => {
        if (!helplineQuery.trim()) return;
        setIsLoadingHelp(true);
        try {
            const context = `Step ${step}: Questions ${step * 2 - 1} and ${step * 2}`;
            const res = await TeacherAssistantService.getOnboardingHelp(context, helplineQuery);
            setHelplineResponse(res);
        } catch (e) {
            setHelplineResponse("क्षમા કરશો, અત્યારે મદદ મળી શકે તેમ નથી.");
        } finally {
            setIsLoadingHelp(false);
        }
    };

    const handleSubmit = async () => {
        if (!formData.name.trim()) {
            alert("તમારું નામ લખવું જરૂરી છે.");
            setStep(1);
            return;
        }
        setIsSubmitting(true);
        try {
            const answers = [
                { q: "1. Full Name", a: formData.name },
                { q: "2. Current Grade", a: formData.grade },
                { q: "3. Learning Style Preference", a: formData.style },
                { q: "4. Comfortable Language", a: formData.language },
                { q: "5. Preferred Teacher Tone", a: formData.tone },
                { q: "6. Primary Study Difficulty", a: formData.difficulty },
                { q: "7. Strategy When Stuck", a: formData.stuckStrategy },
                { q: "8. Most Helpful Study Format", a: formData.helpfulFormat },
                { q: "9. Main Help Wanted from AI", a: formData.aiGoal },
                { q: "10. Subjects for Help", a: formData.subjects.join(", ") }
            ];

            const profile = await TeacherAssistantService.completeOnboarding(uid, answers, { name: formData.name, grade: formData.grade });
            onComplete(profile);
        } catch (error) {
            console.error("Onboarding failed", error);
            alert("Something went wrong. Please try again.");
            setIsSubmitting(false);
        }
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <div className="space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                        <div>
                            <label className="block text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-3 sm:mb-4">૧. તમારું પૂરું નામ લખો (Full Name)</label>
                            <input
                                type="text"
                                className="w-full bg-slate-50 dark:bg-charcoal-800 border-2 border-slate-100 dark:border-white/5 rounded-2xl p-4 sm:p-5 text-base sm:text-lg font-bold text-slate-900 dark:text-white focus:border-indigo-500 transition-all outline-none"
                                placeholder="Enter your full name..."
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-3 sm:mb-4">૨. તમે હાલમાં કયા ધોરણમાં ભણી રહ્યા છો?</label>
                            <div className="grid grid-cols-3 gap-2 sm:gap-3">
                                {GRADES.map(g => (
                                    <button
                                        key={g}
                                        onClick={() => setFormData({ ...formData, grade: g })}
                                        className={`p-3 sm:p-4 rounded-xl text-xs sm:text-sm font-bold border-2 transition-all ${formData.grade === g ? 'bg-indigo-500 border-indigo-500 text-white shadow-lg' : 'bg-white dark:bg-charcoal-800 border-slate-100 dark:border-white/5 text-slate-600 dark:text-slate-400 hover:border-indigo-200'}`}
                                    >
                                        Std {g}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                );
            case 2:
                return (
                    <div className="space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                        <div>
                            <label className="block text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-3 sm:mb-4">૩. જો કોઈ નવો વિષય સમજાવવો હોય, તો તમને કઈ રીત વધારે સમજાય? (Learning Style)</label>
                            <div className="grid gap-3">
                                {STYLES.map(s => (
                                    <button
                                        key={s.id}
                                        onClick={() => setFormData({ ...formData, style: s.id })}
                                        className={`p-4 sm:p-5 rounded-2xl text-left border-2 transition-all flex items-center group ${formData.style === s.id ? 'bg-indigo-500 border-indigo-500 text-white shadow-xl md:scale-[1.02]' : 'bg-white dark:bg-charcoal-800 border-slate-100 dark:border-white/5 text-slate-600 dark:text-slate-400 hover:border-indigo-200'}`}
                                    >
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center mr-4 transition-colors ${formData.style === s.id ? 'bg-white/20' : 'bg-indigo-50 dark:bg-charcoal-700'}`}>
                                            <span className="text-lg">{s.id === 'EXAMPLE' ? '💡' : s.id === 'STEP_BY_STEP' ? '🪜' : s.id === 'SHORT' ? '⚡' : '📚'}</span>
                                        </div>
                                        <div className="font-bold">{s.label}</div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div className="space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                        <div>
                            <label className="block text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-3 sm:mb-4">૪. તમે કઈ ભાષામાં વધારે આરામથી ભણી શકો છો?</label>
                            <div className="grid grid-cols-2 gap-3">
                                {LANGUAGES.map(l => (
                                    <button
                                        key={l.id}
                                        onClick={() => setFormData({ ...formData, language: l.id })}
                                        className={`p-4 rounded-xl font-bold border-2 transition-all ${formData.language === l.id ? 'bg-indigo-500 border-indigo-500 text-white shadow-lg' : 'bg-white dark:bg-charcoal-800 border-slate-100 dark:border-white/5 text-slate-600 dark:text-slate-400 hover:border-indigo-200'}`}
                                    >
                                        {l.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="block text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-3 sm:mb-4">૫. શિક્ષકનો સ્વભાવ કેવો હોવો જોઈએ? (Teacher's Tone)</label>
                            <div className="grid gap-3">
                                {TONES.map(t => (
                                    <button
                                        key={t.id}
                                        onClick={() => setFormData({ ...formData, tone: t.id })}
                                        className={`p-4 rounded-xl font-bold border-2 transition-all ${formData.tone === t.id ? 'bg-indigo-500 border-indigo-500 text-white shadow-lg' : 'bg-white dark:bg-charcoal-800 border-slate-100 dark:border-white/5 text-slate-600 dark:text-slate-400'}`}
                                    >
                                        {t.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                );
            case 4:
                return (
                    <div className="space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-right-4 duration-500 overflow-y-auto max-h-[500px] pr-2 custom-scrollbar">
                        <div>
                            <label className="block text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-3 sm:mb-4">૬. ભણતી વખતે તમને સામાન્ય રીતે કઈ મુશ્કેલી વધારે આવે છે?</label>
                            <div className="grid gap-2">
                                {DIFFICULTIES.map(d => (
                                    <button
                                        key={d.id}
                                        onClick={() => setFormData({ ...formData, difficulty: d.id })}
                                        className={`p-4 rounded-xl text-left border-2 transition-all text-xs sm:text-sm font-bold ${formData.difficulty === d.id ? 'bg-indigo-500 border-indigo-500 text-white' : 'bg-white dark:bg-charcoal-800 border-slate-100 dark:border-white/5 text-slate-600 dark:text-slate-400'}`}
                                    >
                                        {d.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="block text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-3 sm:mb-4">૭. જો કોઈ topic સમજવામાં અટકો, તો તમે સામાન્ય રીતે શું કરો છો?</label>
                            <div className="grid grid-cols-2 gap-2">
                                {STRATEGIES.map(s => (
                                    <button
                                        key={s.id}
                                        onClick={() => setFormData({ ...formData, stuckStrategy: s.id })}
                                        className={`p-3 rounded-xl border-2 text-[10px] sm:text-xs font-bold transition-all ${formData.stuckStrategy === s.id ? 'bg-indigo-500 border-indigo-500 text-white' : 'bg-white dark:bg-charcoal-800 border-slate-100 dark:border-white/5 text-slate-600 dark:text-slate-400'}`}
                                    >
                                        {s.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="block text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-3 sm:mb-4">૮. ભણતી વખતે તમને સૌથી વધારે મદદ કઈ બાબતથી મળે છે?</label>
                            <div className="grid gap-2">
                                {HELPFUL_FORMATS.map(h => (
                                    <button
                                        key={h.id}
                                        onClick={() => setFormData({ ...formData, helpfulFormat: h.id })}
                                        className={`p-3 rounded-xl border-2 text-xs font-bold transition-all ${formData.helpfulFormat === h.id ? 'bg-indigo-500 border-indigo-500 text-white' : 'bg-white dark:bg-charcoal-800 border-slate-100 dark:border-white/5 text-slate-600 dark:text-slate-400'}`}
                                    >
                                        {h.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                );
            case 5:
                return (
                    <div className="space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                        <div>
                            <label className="block text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-3 sm:mb-4">૯. આ AI પાસેથી તમે મુખ્યત્વે કઈ મદદ ઈચ્છો છો?</label>
                            <div className="grid grid-cols-2 gap-3">
                                {AI_GOALS.map(g => (
                                    <button
                                        key={g.id}
                                        onClick={() => setFormData({ ...formData, aiGoal: g.id })}
                                        className={`p-3 rounded-xl border-2 text-xs font-bold transition-all ${formData.aiGoal === g.id ? 'bg-indigo-500 border-indigo-500 text-white shadow-md' : 'bg-white dark:bg-charcoal-800 border-slate-100 dark:border-white/5 text-slate-600 dark:text-slate-400'}`}
                                    >
                                        {g.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="block text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-3 sm:mb-4">૧૦. તમે કયા વિષયોમાં વધારે મદદ ઈચ્છો છો? (Select multiple)</label>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                                {SUBJECT_LIST.map(sub => (
                                    <button
                                        key={sub}
                                        onClick={() => toggleSubject(sub)}
                                        className={`p-3 rounded-xl text-xs sm:text-sm font-bold border-2 transition-all ${formData.subjects.includes(sub) ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg' : 'bg-white dark:bg-charcoal-800 border-slate-100 dark:border-white/5 text-slate-600 dark:text-slate-400 hover:border-emerald-200'}`}
                                    >
                                        {formData.subjects.includes(sub) ? '✅ ' : ''}{sub}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="flex min-h-screen bg-white dark:bg-charcoal-950 overflow-x-hidden font-sans">
            <div className={`flex-1 flex flex-col items-center justify-start sm:justify-center p-4 sm:p-8 md:p-12 transition-all duration-500 ${showHelpline ? 'md:mr-[380px]' : ''}`}>
                <div className="max-w-2xl w-full py-8 sm:py-0">
                    <div className="mb-8 sm:mb-10 text-center">
                        <div className="inline-block p-2 sm:p-3 bg-indigo-500/10 rounded-2xl mb-3">
                            <span className="text-xl sm:text-2xl">✨</span>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mb-2">Build Your AI Study Profile</h1>
                        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-bold">Please answer these 10 simple questions</p>
                    </div>

                    <div className="mb-8 sm:mb-10 relative">
                        <div className="h-1.5 w-full bg-slate-100 dark:bg-charcoal-800 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-indigo-500 transition-all duration-700 ease-out"
                                style={{ width: `${(step / totalSteps) * 100}%` }}
                            />
                        </div>
                        <div className="flex justify-between mt-4">
                            {[1, 2, 3, 4, 5].map(s => (
                                <div key={s} className={`flex items-center space-x-1 ${step === s ? 'text-indigo-500' : 'text-slate-400'}`}>
                                    <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-[8px] sm:text-[10px] font-black border-2 transition-colors ${step >= s ? 'bg-indigo-500 border-indigo-500 text-white' : 'border-slate-200 dark:border-charcoal-700'}`}>
                                        {s}
                                    </div>
                                    <span className="hidden md:inline text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-nowrap">
                                        {s === 1 ? 'Basics' : s === 2 ? 'Style' : s === 3 ? 'Interaction' : s === 4 ? 'Habits' : 'AI Help'}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="min-h-[380px] sm:min-h-[420px]">
                        {renderStep()}
                    </div>

                    <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
                        <button
                            onClick={prevStep}
                            disabled={step === 1 || isSubmitting}
                            className={`px-6 sm:px-8 py-3 sm:py-4 rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all w-full sm:w-auto ${step === 1 ? 'opacity-0 pointer-events-none' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-charcoal-800'}`}
                        >
                            Back
                        </button>

                        <div className="flex items-center space-x-3 sm:space-x-4 w-full sm:w-auto">
                            <button
                                onClick={() => setShowHelpline(!showHelpline)}
                                className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center transition-all flex-shrink-0 ${showHelpline ? 'bg-indigo-500 text-white shadow-lg' : 'bg-slate-100 dark:bg-charcoal-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'}`}
                                title="Ask AI for help"
                            >
                                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </button>

                            {step < totalSteps ? (
                                <button
                                    onClick={nextStep}
                                    className="px-8 sm:px-12 py-3 sm:py-4 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl sm:rounded-2xl text-[10px] sm:text-xs font-black uppercase tracking-widest shadow-xl shadow-indigo-500/20 active:scale-95 transition-all flex-1 sm:flex-none"
                                >
                                    Next
                                </button>
                            ) : (
                                <button
                                    onClick={handleSubmit}
                                    disabled={isSubmitting}
                                    className="px-8 sm:px-12 py-3 sm:py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl sm:rounded-2xl text-[10px] sm:text-xs font-black uppercase tracking-widest shadow-xl shadow-emerald-500/20 active:scale-95 transition-all flex items-center justify-center flex-1 sm:flex-none"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2 sm:mr-3"></div>
                                            Analyzing...
                                        </>
                                    ) : 'Analyze My Profile'}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className={`fixed top-0 right-0 h-full w-full sm:w-[380px] bg-slate-50 dark:bg-charcoal-900 border-l border-slate-100 dark:border-white/5 shadow-2xl transition-transform duration-500 z-50 ${showHelpline ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="h-full flex flex-col">
                    <div className="p-6 sm:p-8 border-b border-slate-100 dark:border-white/5 flex items-center justify-between">
                        <div>
                            <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white uppercase tracking-tighter">AI Helpline</h3>
                            <p className="text-[8px] sm:text-[10px] font-bold text-indigo-500 uppercase tracking-widest">Guidance for Your Questions</p>
                        </div>
                        <button onClick={() => setShowHelpline(false)} className="p-2 hover:bg-slate-200 dark:hover:bg-charcoal-800 rounded-xl transition-colors">
                            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 custom-scrollbar pb-32">
                        {helplineResponse ? (
                            <div className="bg-white dark:bg-charcoal-800 p-5 sm:p-6 rounded-2xl border border-slate-100 dark:border-white/5 shadow-sm">
                                <p className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 leading-relaxed italic">
                                    "{helplineResponse}"
                                </p>
                            </div>
                        ) : (
                            <div className="text-center py-10 sm:py-20">
                                <div className="text-3xl sm:text-4xl mb-4 opacity-20">🤖</div>
                                <p className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest">How can I help you today?</p>
                            </div>
                        )}
                        {isLoadingHelp && (
                            <div className="flex justify-center py-4">
                                <div className="w-8 h-8 border-4 border-indigo-100 border-t-indigo-500 rounded-full animate-spin"></div>
                            </div>
                        )}
                    </div>

                    <div className="p-6 sm:p-8 bg-white dark:bg-charcoal-800 border-t border-slate-100 dark:border-white/5 fixed bottom-0 left-0 right-0 sm:relative">
                        <div className="relative">
                            <textarea
                                className="w-full bg-slate-50 dark:bg-charcoal-900 border-2 border-slate-100 dark:border-white/5 rounded-2xl p-4 pr-12 sm:pr-14 text-xs sm:text-sm font-bold text-slate-900 dark:text-white focus:border-indigo-500 outline-none h-24 sm:h-32 resize-none"
                                placeholder="E.g., Why do you need to know my study habits?"
                                value={helplineQuery}
                                onChange={e => setHelplineQuery(e.target.value)}
                                onKeyPress={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleHelp())}
                            />
                            <button
                                onClick={handleHelp}
                                disabled={isLoadingHelp || !helplineQuery.trim()}
                                className="absolute bottom-4 right-4 bg-indigo-500 text-white p-2 sm:p-3 rounded-xl hover:bg-indigo-600 transition-all shadow-lg active:scale-95 disabled:opacity-50"
                            >
                                <svg className="w-4 h-4 sm:w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OnboardingForm;
