import React, { useState, useEffect } from 'react';
import { TeacherAssistantService, StudentProfile } from '../services/teacherAssistantService';

interface OnboardingFormProps {
    uid: string;
    onComplete: (profile: StudentProfile) => void;
}

const TRANSLATIONS = {
    GUJARATI: {
        welcome: "તમારી AI અભ્યાસ પ્રોફાઇલ બનાવો",
        sub: "તમારા પર્સનલ AI ટીચર બનાવવા માટે આ ૧૦ પ્રશ્નોના જવાબ આપો",
        next: "આગળ",
        back: "પાછળ",
        analyze: "મારી પ્રોફાઇલ બનાવો",
        stepLabels: ["પાયાની વિગત", "શૈલી", "ભાષા/રીત", "આદતો", "ધ્યેય"],
        q1: "૧. તમારું પૂરું નામ લખો (Full Name)",
        q2: "૨. તમે હાલમાં કયા ધોરણમાં ભણી રહ્યા છો?",
        q3: "૩. જો કોઈ નવો વિષય સમજાવવો હોય, તો તમને કઈ રીત વધારે સમજાય? (Learning Style)",
        q4: "૪. તમે કઈ ભાષામાં વધારે આરામથી ભણી શકો છો?",
        q5: "૫. શિક્ષકનો સ્વભાવ કેવો હોવો જોઈએ? (Teacher's Tone)",
        q6: "૬. ભણતી વખતે તમને સામાન્ય રીતે કઈ મુશ્કેલી વધારે આવે છે?",
        q7: "૭. જો કોઈ topic સમજવામાં અટકો, તો તમે સામાન્ય રીતે શું કરો છો?",
        q8: "૮. ભણતી વખતે તમને સૌથી વધારે મદદ કઈ બાબતથી મળે છે?",
        q9: "૯. આ AI પાસેથી તમે મુખ્યત્વે કઈ મદદ ઈચ્છો છો?",
        q10: "૧૦. તમે કયા વિષયોમાં વધારે મદદ ઈચ્છો છો?",
        name_placeholder: "તમારું નામ લખો...",
        subject_placeholder: "ગણિત, વિજ્ઞાન, વગેરે...",
        analyzing: "વિશ્લેષણ કરી રહ્યા છીએ...",
        helpline: "AI હેલ્પલાઇન",
        helpline_sub: "સવાલો વિશે પૂછો",
        helpline_placeholder: "દા.ત., આ સવાલનો અર્થ શું છે?",
        styles: { EXAMPLE: 'ઉદાહરણ સાથે', STEP_BY_STEP: 'સ્ટેપ-બાય-સ્ટેપ', SHORT: 'ટૂંકમાં (ઝડપથી)', DETAILED: 'ઊંડાણમાં' },
        tones: { FRIENDLY: 'મિત્ર જેવો', STRICT_BUT_KIND: 'શાંત અને ગંભીર', VERY_SIMPLE: 'બહુ સરળ શબ્દોમાં' },
        diffs: { MEMORY: 'સમજાય છે પણ યાદ નથી રહેતું', UNDERSTANDING: 'શરૂઆતમાં સમજાતું નથી', QUESTION: 'પ્રશ્નો ક્યાંથી પૂછવા તે સમજાતું નથી', PRACTICE: 'બસ પ્રેક્ટિસ ઓછી છે' },
        strats: { RE_READ: 'ફરી વાંચું છું', ASK: 'કોઈને પૂછું છું', SKIP: 'છોડીને આગળ વધું છું', SEARCH: 'ઇન્ટરનેટ પર શોધું છું' },
        formats: { ANALOGIES: 'રોજિંદા ઉદાહરણો', QA: 'પ્રશ્ન–જવાબ', SUMMARY: 'ટૂંકા સમરી', RE_EXPLAIN: 'અલગ રીતે સમજાવવું' },
        goals: { RE_EXPLAIN: 'ફરી સમજાવવી', SIMPLIFY: 'સરળ શબ્દોમાં', DOUBT: 'ડાઉટ ક્લિયર કરવો', HOMEWORK: 'હોમવર્કમાં મદદ' }
    },
    HINDI: {
        welcome: "अपनी AI स्टडी प्रोफाइल बनाएं",
        sub: "अपने पर्सनल AI टीचर के लिए इन 10 सवालों के जवाब दें",
        next: "आगे",
        back: "पीछे",
        analyze: "मेरी प्रोफाइल बनाएं",
        stepLabels: ["बेसिक", "शैली", "भाषा", "आदतें", "लक्ष्य"],
        q1: "1. अपना पूरा नाम लिखें (Full Name)",
        q2: "2. आप अभी किस कक्षा में पढ़ रहे हैं?",
        q3: "3. नया विषय समझाने के लिए आपको कौन सा तरीका ज्यादा पसंद है? (Learning Style)",
        q4: "4. आप किस भाषा में ज्यादा आराम से पढ़ सकते हैं?",
        q5: "5. शिक्षक का स्वभाव कैसा होना चाहिए? (Teacher's Tone)",
        q6: "6. पढ़ते समय आपको आमतौर पर क्या समस्या आती है?",
        q7: "7. यदि आप किसी टॉपिक में अटक जाते हैं, तो आप क्या करते हैं?",
        q8: "8. पढ़ते समय आपको सबसे ज्यादा मदद किससे मिलती है?",
        q9: "9. आप इस AI से मुख्य रूप से क्या मदद चाहते हैं?",
        q10: "10. आप किन विषयों में मदद चाहते हैं?",
        name_placeholder: "अपना नाम लिखें...",
        subject_placeholder: "गणित, विज्ञान, आदि...",
        analyzing: "विश्लेषण कर रहे हैं...",
        helpline: "AI हेल्पलाइन",
        helpline_sub: "सवालों के बारे में पूछें",
        helpline_placeholder: "जैसे, इस सवाल का क्या मतलब है?",
        styles: { EXAMPLE: 'उदाहरण के साथ', STEP_BY_STEP: 'स्टेप-बाय-स्टेप', SHORT: 'संक्षेप में (Fast)', DETAILED: 'विस्तार में' },
        tones: { FRIENDLY: 'दोस्त जैसा', STRICT_BUT_KIND: 'शांत और गंभीर', VERY_SIMPLE: 'बहुत सरल शब्दों में' },
        diffs: { MEMORY: 'समझ आता है पर याद नहीं रहता', UNDERSTANDING: 'शुरुआत में समझ नहीं आता', QUESTION: 'सवाल कहाँ से पूछें समझ नहीं आता', PRACTICE: 'बस प्रैक्टिस कम है' },
        strats: { RE_READ: 'फिर से पढ़ता हूँ', ASK: 'किसी से पूछता हूँ', SKIP: 'छोड़कर आगे बढ़ता हूँ', SEARCH: 'इंटरनेट पर खोजता हूँ' },
        formats: { ANALOGIES: 'दैनिक उदाहरण', QA: 'सवाल-जवाब', SUMMARY: 'शॉर्ट समरी', RE_EXPLAIN: 'अलग तरह से समझाना' },
        goals: { RE_EXPLAIN: 'शांति से समझाना', SIMPLIFY: 'सरल शब्दों में', DOUBT: 'डाउट क्लियर करना', HOMEWORK: 'होमवर्क में मदद' }
    },
    ENGLISH: {
        welcome: "Build Your AI Study Profile",
        sub: "Answer these 10 questions to build your personal AI Teacher",
        next: "Next",
        back: "Back",
        analyze: "Analyze My Profile",
        stepLabels: ["Basics", "Style", "Interaction", "Habits", "AI Help"],
        q1: "1. Enter your full name",
        q2: "2. Which grade are you in?",
        q3: "3. How do you like to learn new topics? (Learning Style)",
        q4: "4. Which language is most comfortable for you?",
        q5: "5. What should the teacher's tone be?",
        q6: "6. What difficulty do you face while studying?",
        q7: "7. What do you do when you get stuck?",
        q8: "8. What helps you the most while studying?",
        q9: "9. What help do you expect from this AI?",
        q10: "10. Which subjects do you need help with?",
        name_placeholder: "Enter your name...",
        subject_placeholder: "Maths, Science, etc...",
        analyzing: "Analyzing...",
        helpline: "AI Helpline",
        helpline_sub: "Ask about these questions",
        helpline_placeholder: "E.g., What does learning style mean?",
        styles: { EXAMPLE: 'With Examples', STEP_BY_STEP: 'Step-by-Step', SHORT: 'Quick / Concise', DETAILED: 'Deep Dive / Theory' },
        tones: { FRIENDLY: 'Friendly / Peer', STRICT_BUT_KIND: 'Calm and Serious', VERY_SIMPLE: 'Very Simple Words' },
        diffs: { MEMORY: 'I understand but forget', UNDERSTANDING: 'Hard to understand at first', QUESTION: 'Not sure what to ask', PRACTICE: 'Everything is fine, just need practice' },
        strats: { RE_READ: 'Re-read the topic', ASK: 'Ask someone for help', SKIP: 'Skip it for now', SEARCH: 'Search on Google/Net' },
        formats: { ANALOGIES: 'Real-life analogies', QA: 'Question-Answer', SUMMARY: 'Short summaries', RE_EXPLAIN: 'Different explanations' },
        goals: { RE_EXPLAIN: 'Re-explaining clearly', SIMPLIFY: 'Simplify topics', DOUBT: 'Doubt clearing', HOMEWORK: 'Homework assistance' }
    }
};

const UI_LANGUAGES = [
    { id: 'GUJARATI', label: 'ગુજરાતી', emoji: '🇮🇳' },
    { id: 'HINDI', label: 'हिन्दी', emoji: '🇮🇳' },
    { id: 'ENGLISH', label: 'English', emoji: '🇬🇧' },
    { id: 'MIX', label: 'Mix (Guj+Eng)', emoji: '✨' }
];

const GRADES = ["5", "6", "7", "8", "9", "10", "11", "12", "Other"];
const SUBJECT_LIST = ["ગણિત", "વિજ્ઞાન", "ગુજરાતી", "અંગ્રેજી", "સામાજિક વિજ્ઞાન", "અન્ય"];

const OnboardingForm: React.FC<OnboardingFormProps> = ({ uid, onComplete }) => {
    const [step, setStep] = useState(0);
    const [uiLanguage, setUiLanguage] = useState<'GUJARATI' | 'HINDI' | 'ENGLISH'>('GUJARATI');
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

    const t = TRANSLATIONS[uiLanguage] || TRANSLATIONS.GUJARATI;
    const totalSteps = 5;

    const nextStep = () => setStep(s => Math.min(s + 1, totalSteps));
    const prevStep = () => setStep(s => Math.max(s - 1, 0));

    const selectUiLanguage = (lang: string) => {
        const actualLang = lang === 'MIX' ? 'GUJARATI' : lang as any;
        setUiLanguage(actualLang);
        setFormData(prev => ({ ...prev, language: lang }));
        setStep(1);
    };

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
            const context = `User UI Language: ${uiLanguage}. Step ${step}.`;
            const res = await TeacherAssistantService.getOnboardingHelp(context, helplineQuery);
            setHelplineResponse(res);
        } catch (e) {
            setHelplineResponse(uiLanguage === 'ENGLISH' ? "Sorry, help is unavailable right now." : "ક્ષમા કરશો, અત્યારે મદદ મળી શકે તેમ નથી.");
        } finally {
            setIsLoadingHelp(false);
        }
    };

    const handleSubmit = async () => {
        if (!formData.name.trim()) {
            alert(uiLanguage === 'ENGLISH' ? "Please enter your name." : "તમારું નામ લખવું જરૂરી છે.");
            setStep(1);
            return;
        }
        setIsSubmitting(true);
        try {
            const answers = [
                { q: "Preferred UI Language", a: uiLanguage },
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
        if (step === 0) {
            return (
                <div className="space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="text-center mb-8">
                        <h2 className="text-xl sm:text-3xl font-black text-slate-900 dark:text-white mb-2">Select Your Language</h2>
                        <p className="text-base font-bold text-slate-500 dark:text-slate-400">તમારી મનપસંદ ભાષા પસંદ કરો</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {UI_LANGUAGES.map(l => (
                            <button
                                key={l.id}
                                onClick={() => selectUiLanguage(l.id)}
                                className="p-6 bg-white dark:bg-charcoal-800 border-2 border-slate-100 dark:border-white/5 rounded-3xl hover:border-indigo-500 transition-all flex flex-col items-center group shadow-sm hover:shadow-xl hover:scale-[1.02]"
                            >
                                <span className="text-4xl mb-3 group-hover:scale-110 transition-transform">{l.emoji}</span>
                                <span className="text-lg font-black text-slate-900 dark:text-white">{l.label}</span>
                            </button>
                        ))}
                    </div>
                </div>
            );
        }

        switch (step) {
            case 1:
                return (
                    <div className="space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                        <div>
                            <label className="block text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-3 sm:mb-4">{t.q1}</label>
                            <input
                                type="text"
                                className="w-full bg-slate-50 dark:bg-charcoal-800 border-2 border-slate-100 dark:border-white/5 rounded-2xl p-4 sm:p-5 text-base sm:text-lg font-bold text-slate-900 dark:text-white focus:border-indigo-500 transition-all outline-none"
                                placeholder={t.name_placeholder}
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-3 sm:mb-4">{t.q2}</label>
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
                            <label className="block text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-3 sm:mb-4">{t.q3}</label>
                            <div className="grid gap-3">
                                {Object.entries(t.styles).map(([id, label]) => (
                                    <button
                                        key={id}
                                        onClick={() => setFormData({ ...formData, style: id })}
                                        className={`p-4 sm:p-5 rounded-2xl text-left border-2 transition-all flex items-center group ${formData.style === id ? 'bg-indigo-500 border-indigo-500 text-white shadow-xl md:scale-[1.02]' : 'bg-white dark:bg-charcoal-800 border-slate-100 dark:border-white/5 text-slate-600 dark:text-slate-400 hover:border-indigo-200'}`}
                                    >
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center mr-4 transition-colors ${formData.style === id ? 'bg-white/20' : 'bg-indigo-50 dark:bg-charcoal-700'}`}>
                                            <span className="text-lg">{id === 'EXAMPLE' ? '💡' : id === 'STEP_BY_STEP' ? '🪜' : id === 'SHORT' ? '⚡' : '📚'}</span>
                                        </div>
                                        <div className="font-bold">{label}</div>
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
                            <label className="block text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-3 sm:mb-4">{t.q4}</label>
                            <div className="grid grid-cols-2 gap-3">
                                {UI_LANGUAGES.map(l => (
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
                            <label className="block text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-3 sm:mb-4">{t.q5}</label>
                            <div className="grid gap-3">
                                {Object.entries(t.tones).map(([id, label]) => (
                                    <button
                                        key={id}
                                        onClick={() => setFormData({ ...formData, tone: id })}
                                        className={`p-4 rounded-xl font-bold border-2 transition-all ${formData.tone === id ? 'bg-indigo-500 border-indigo-500 text-white shadow-lg' : 'bg-white dark:bg-charcoal-800 border-slate-100 dark:border-white/5 text-slate-600 dark:text-slate-400'}`}
                                    >
                                        {label}
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
                            <label className="block text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-3 sm:mb-4">{t.q6}</label>
                            <div className="grid gap-2">
                                {Object.entries(t.diffs).map(([id, label]) => (
                                    <button
                                        key={id}
                                        onClick={() => setFormData({ ...formData, difficulty: id })}
                                        className={`p-4 rounded-xl text-left border-2 transition-all text-xs sm:text-sm font-bold ${formData.difficulty === id ? 'bg-indigo-500 border-indigo-500 text-white' : 'bg-white dark:bg-charcoal-800 border-slate-100 dark:border-white/5 text-slate-600 dark:text-slate-400'}`}
                                    >
                                        {label}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="block text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-3 sm:mb-4">{t.q7}</label>
                            <div className="grid grid-cols-2 gap-2">
                                {Object.entries(t.strats).map(([id, label]) => (
                                    <button
                                        key={id}
                                        onClick={() => setFormData({ ...formData, stuckStrategy: id })}
                                        className={`p-3 rounded-xl border-2 text-[10px] sm:text-xs font-bold transition-all ${formData.stuckStrategy === id ? 'bg-indigo-500 border-indigo-500 text-white' : 'bg-white dark:bg-charcoal-800 border-slate-100 dark:border-white/5 text-slate-600 dark:text-slate-400'}`}
                                    >
                                        {label}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="block text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-3 sm:mb-4">{t.q8}</label>
                            <div className="grid gap-2">
                                {Object.entries(t.formats).map(([id, label]) => (
                                    <button
                                        key={id}
                                        onClick={() => setFormData({ ...formData, helpfulFormat: id })}
                                        className={`p-3 rounded-xl border-2 text-xs font-bold transition-all ${formData.helpfulFormat === id ? 'bg-indigo-500 border-indigo-500 text-white' : 'bg-white dark:bg-charcoal-800 border-slate-100 dark:border-white/5 text-slate-600 dark:text-slate-400'}`}
                                    >
                                        {label}
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
                            <label className="block text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-3 sm:mb-4">{t.q9}</label>
                            <div className="grid grid-cols-2 gap-3">
                                {Object.entries(t.goals).map(([id, label]) => (
                                    <button
                                        key={id}
                                        onClick={() => setFormData({ ...formData, aiGoal: id })}
                                        className={`p-3 rounded-xl border-2 text-xs font-bold transition-all ${formData.aiGoal === id ? 'bg-indigo-500 border-indigo-500 text-white shadow-md' : 'bg-white dark:bg-charcoal-800 border-slate-100 dark:border-white/5 text-slate-600 dark:text-slate-400'}`}
                                    >
                                        {label}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="block text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-3 sm:mb-4">{t.q10}</label>
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
                    {step > 0 && (
                        <div className="mb-8 sm:mb-10 text-center">
                            <div className="inline-block p-2 sm:p-3 bg-indigo-500/10 rounded-2xl mb-3">
                                <span className="text-xl sm:text-2xl">✨</span>
                            </div>
                            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mb-2">{t.welcome}</h1>
                            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-bold">{t.sub}</p>
                        </div>
                    )}

                    {step > 0 && (
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
                                            {t.stepLabels[s - 1]}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className={step === 0 ? "w-full" : "min-h-[380px] sm:min-h-[420px]"}>
                        {renderStep()}
                    </div>

                    {step > 0 && (
                        <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
                            <button
                                onClick={prevStep}
                                className={`px-6 sm:px-8 py-3 sm:py-4 rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all w-full sm:w-auto text-slate-500 hover:bg-slate-50 dark:hover:bg-charcoal-800`}
                            >
                                {t.back}
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
                                        {t.next}
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
                                                {t.analyzing}
                                            </>
                                        ) : t.analyze}
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {step > 0 && (
                <div className={`fixed top-0 right-0 h-full w-full sm:w-[380px] bg-slate-50 dark:bg-charcoal-900 border-l border-slate-100 dark:border-white/5 shadow-2xl transition-transform duration-500 z-50 ${showHelpline ? 'translate-x-0' : 'translate-x-full'}`}>
                    <div className="h-full flex flex-col">
                        <div className="p-6 sm:p-8 border-b border-slate-100 dark:border-white/5 flex items-center justify-between">
                            <div>
                                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white uppercase tracking-tighter">{t.helpline}</h3>
                                <p className="text-[8px] sm:text-[10px] font-bold text-indigo-500 uppercase tracking-widest">{t.helpline_sub}</p>
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
                                    <p className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest">How can I help you?</p>
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
                                    placeholder={t.helpline_placeholder}
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
            )}
        </div>
    );
};

export default OnboardingForm;
