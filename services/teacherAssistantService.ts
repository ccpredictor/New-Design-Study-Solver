import { GoogleGenAI } from "@google/genai";
import { db } from "./firebase";
import { doc, getDoc, setDoc, updateDoc, addDoc, collection, query, orderBy, limit, getDocs } from "firebase/firestore";

// The API Key is coming from environment variables
const genAI = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY || "" });

export interface StudentProfile {
    preferred_explanation_styles: ('EXAMPLE' | 'STEP_BY_STEP' | 'SHORT' | 'DETAILED')[];
    language_preference: 'GUJARATI' | 'HINDI' | 'ENGLISH' | 'MIX';
    confidence_level: number;
    question_hesitation_level: number;
    tone_preference: 'FRIENDLY' | 'STRICT_BUT_KIND' | 'VERY_SIMPLE';
    grade: string;
    name: string;
    difficulty_types?: ('MEMORY' | 'UNDERSTANDING' | 'QUESTION_FORMULATION' | 'PRACTICE')[];
    stuck_strategy?: 'RE_READ' | 'ASK' | 'SKIP' | 'SEARCH';
    most_helpful_format?: 'ANALOGIES' | 'QA' | 'SUMMARY' | 'RE_EXPLAIN';
    ai_primary_goal?: 'RE_EXPLAIN' | 'SIMPLIFY' | 'DOUBT_CLEAR' | 'HOMEWORK';
    created_at: string;
    updated_at: string;
    version: number;
    profile_evidence: string[];
}

const extractJson = (text: string) => {
    try {
        const start = text.indexOf('{');
        const end = text.lastIndexOf('}');
        if (start !== -1 && end !== -1) {
            return JSON.parse(text.substring(start, end + 1));
        }
    } catch (e) {
        console.error("JSON Extraction failed", e);
    }
    return null;
};

/**
 * Prompt Templates
 */
const ONBOARDING_ANALYZER_PROMPT = `
Analyze the following onboarding responses from a student and generate a learning profile JSON.
SCHEMA:
{
  "preferred_explanation_styles": ("EXAMPLE" | "STEP_BY_STEP" | "SHORT" | "DETAILED")[],
  "language_preference": "GUJARATI" | "HINDI" | "ENGLISH" | "MIX",
  "grade": string,
  "name": string,
  "difficulty_types": ("MEMORY" | "UNDERSTANDING" | "QUESTION_FORMULATION" | "PRACTICE")[],
  "stuck_strategy": "RE_READ" | "ASK" | "SKIP" | "SEARCH",
  "most_helpful_format": "ANALOGIES" | "QA" | "SUMMARY" | "RE_EXPLAIN",
  "ai_primary_goal": "RE_EXPLAIN" | "SIMPLIFY" | "DOUBT_CLEAR" | "HOMEWORK",
  "profile_evidence": string[] (max 3 items, no PII)
}

Output: Strict JSON ONLY. No markdown, no extra text.
`;

const TUTOR_SYSTEM_PROMPT = (profile: StudentProfile, summary: string) => `
You are a personalized AI Teacher.
STUDENT PROFILE: ${JSON.stringify(profile)}
SESSION SUMMARY: ${summary}

RULES:
1. Language: Default to Gujarati if preference is GUJARATI or MIX. Use simple terms.
2. Reassurance: If question_hesitation_level > 50, use lines like “અહીં ખોટું ચાલે છે, ફરી પૂછો.”
3. Style (Combine these if multiple are present):
   - EXAMPLE: Use daily-life analogies.
   - STEP_BY_STEP: Use numbered logic.
   - SHORT: Be concise (3-6 bullets).
   - DETAILED: Use headings and deep explanations.
4. Tone: Match ${profile.tone_preference}.
5. Constraints: Text-only. No voice/video.
6. Personal Awareness: You are the student's personal mentor. You KNOW their name ("${profile.name || 'Student'}") and grade ("${profile.grade || 'Unknown'}") from the STUDENT PROFILE. If they ask "Who am I?" or "What standard am I in?", answer correctly using this data.
7. Identity: Start your first response of a session with a personalized greeting. Example: "Jai Shree Krishna ${profile.name || ''}! How can I help you today?".
8. Language Preference: All responses must respect the student's language preference. If it's GUJARATI, use Gujarati for the greeting as well.
9. Avoid Generic Help: Never say "I don't know your grade" or "I don't know your name" if the data is present in the profile. If name is missing, simply omit it and address them as "Student".
`;

const PROFILE_UPDATER_PROMPT = (profile: StudentProfile, summary: string) => `
Review the latest session and update the student profile.
CURRENT PROFILE: ${JSON.stringify(profile)}
SESSION SUMMARY: ${summary}

RULES:
1. ONLY output a JSON patch of changed fields.
2. confidence_level: max +/- 10 change.
3. question_hesitation_level: max +/- 10 change.
4. preferred_explanation_styles: Update the list of styles if user shows new preferences.
5. difficulty_types: Update based on recent struggles.
6. No new fields. No extra text.

Example Output: {"confidence_level": 85, "profile_evidence": ["Showed strong grasp of quadratic formula."]}
`;

const ONBOARDING_HELPLINE_PROMPT = `
You are an AI Assistant helping a student complete their onboarding for an AI Study Solver app.
Your goal is to explain what each question means and WHY we are asking it.
Use a friendly, encouraging tone. Keep answers concise.
If they ask something unrelated to onboarding, politely guide them back to the form.
Language: Preferred Gujarati/Hindi/English mix as appropriate for the user.
`;

export const TeacherAssistantService = {
    /**
     * Check if profile exists
     */
    async getProfile(uid: string): Promise<StudentProfile | null> {
        const docRef = doc(db, "student_profiles", uid);
        const snap = await getDoc(docRef);
        return snap.exists() ? (snap.data() as StudentProfile) : null;
    },

    /**
     * Analyze onboarding responses and save profile
     */
    async completeOnboarding(uid: string, answers: { q: string, a: string }[], explicitData: { name: string, grade: string }) {
        // 1. Analyze with Gemini
        const result = await genAI.models.generateContent({
            model: "gemini-3-pro-preview",
            contents: [{ role: 'user', parts: [{ text: `${ONBOARDING_ANALYZER_PROMPT}\n\nSTUDENT RESPONSES:\n${JSON.stringify(answers)}` }] }],
            config: { responseMimeType: "application/json" }
        });
        const profileData = extractJson(result.text || "{}");
        if (!profileData) throw new Error("Could not parse learning profile.");

        // 2. Validate and Save (Prioritize explicit data for critical fields)
        const profile: StudentProfile = {
            preferred_explanation_styles: profileData.preferred_explanation_styles || ['STEP_BY_STEP'],
            language_preference: profileData.language_preference || 'GUJARATI',
            tone_preference: profileData.tone_preference || 'FRIENDLY',
            confidence_level: 70, // Default if not asked
            question_hesitation_level: 30, // Default if not asked
            ...profileData,
            name: explicitData.name || profileData.name || "Student",
            grade: explicitData.grade || profileData.grade || "Unknown",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            version: 1
        };

        await setDoc(doc(db, "student_profiles", uid), profile);

        // Store responses for history
        await addDoc(collection(db, "onboarding_sessions", uid, "responses"), {
            answers,
            timestamp: new Date().toISOString()
        });

        return profile;
    },

    /**
     * Get tutoring response
     */
    async getTutoringResponse(uid: string, message: string, history: any[], docText?: string) {
        const profile = await this.getProfile(uid);
        if (!profile) throw new Error("Profile not found");

        // Fetch last session summary (simplified: just use empty string for now or fetch from Firestore)
        const summary = ""; // Ideally fetched from tutoring_sessions/{uid}/sessions/{sessionId}

        const systemInstruction = TUTOR_SYSTEM_PROMPT(profile, summary);

        // Call Gemini
        const result = await genAI.models.generateContent({
            model: "gemini-3-pro-preview",
            contents: [
                { role: 'user', parts: [{ text: systemInstruction }] },
                ...history.map(m => ({
                    role: m.role === 'user' ? 'user' : 'model',
                    parts: [{ text: m.text }]
                })),
                { role: 'user', parts: [{ text: `${message}${docText ? `\n\nExtracted Doc Text:\n${docText}` : ""}` }] }
            ]
        });

        return result.text || "";
    },

    /**
     * Update profile based on session
     */
    async updateProfile(uid: string, sessionId: string, summary: string) {
        const profile = await this.getProfile(uid);
        if (!profile) return;

        const result = await genAI.models.generateContent({
            model: "gemini-3-pro-preview",
            contents: [{ role: 'user', parts: [{ text: PROFILE_UPDATER_PROMPT(profile, summary) }] }],
            config: { responseMimeType: "application/json" }
        });
        const patch = extractJson(result.text || "{}");

        if (patch) {
            // Update profile
            await updateDoc(doc(db, "student_profiles", uid), {
                ...patch,
                updated_at: new Date().toISOString()
            });

            // Save patch history
            await addDoc(collection(db, "profile_updates", uid, "patches"), {
                patch,
                applied_at: new Date().toISOString(),
                session_id: sessionId
            });
        }
    },

    /**
     * Get help during onboarding
     */
    async getOnboardingHelp(questionContext: string, userQuery: string) {
        const result = await genAI.models.generateContent({
            model: "gemini-3-pro-preview",
            contents: [
                { role: 'user', parts: [{ text: ONBOARDING_HELPLINE_PROMPT }] },
                { role: 'user', parts: [{ text: `CONTEXT: The student is looking at this part of the form: "${questionContext}"\nSTUDENT QUESTION: ${userQuery}` }] }
            ]
        });
        return result.text || "";
    }
};
