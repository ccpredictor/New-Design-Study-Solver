import { db } from "./firebase";
import { doc, getDoc, setDoc, updateDoc, addDoc, collection } from "firebase/firestore";
import { getFunctions, httpsCallable } from "firebase/functions";
import { getApp } from "firebase/app";

// Initialize Firebase Functions
const functions = getFunctions(getApp());
const callGeminiFunction = httpsCallable(functions, 'callGemini');

export interface StudentProfile {
    preferred_explanation_styles: ('EXAMPLE' | 'STEP_BY_STEP' | 'SHORT' | 'DETAILED')[];
    language_preference: 'GUJARATI' | 'HINDI' | 'ENGLISH' | 'MIX';
    confidence_level: number;
    question_hesitation_level: number;
    tone_preference: 'FRIENDLY' | 'STRICT_BUT_KIND' | 'VERY_SIMPLE';
    grade: string;
    name: string;
    difficulty_types?: ('MEMORY' | 'UNDERSTANDING' | 'QUESTION_FORMULATION' | 'PRACTICE')[];
    study_obstacles?: string[];
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
  "study_obstacles": string[],
  "stuck_strategy": "RE_READ" | "ASK" | "SKIP" | "SEARCH",
  "most_helpful_format": "ANALOGIES" | "QA" | "SUMMARY" | "RE_EXPLAIN",
  "ai_primary_goal": "RE_EXPLAIN" | "SIMPLIFY" | "DOUBT_CLEAR" | "HOMEWORK",
  "profile_evidence": string[] (max 3 items, no PII)
}

Output: Strict JSON ONLY. No markdown, no extra text.
`;

const TUTOR_SYSTEM_PROMPT = (profile: StudentProfile, summary: string) => `
You are a personalized AI Assistant.
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
10. Obstacles Awareness: If the student has specific obstacles like "${(profile.study_obstacles || []).join(', ')}", pay extra attention to those areas (e.g., if they struggle with MATH_SUMS, provide more worked examples).
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

export const AIAssistantService = {
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
        try {
            const result = await callGeminiFunction({
                action: 'completeOnboarding',
                payload: { answers, promptTemplate: ONBOARDING_ANALYZER_PROMPT }
            });

            const profileData = extractJson((result.data as any).text || "{}");
            if (!profileData) throw new Error("Could not parse learning profile.");

            const profile: StudentProfile = {
                preferred_explanation_styles: profileData.preferred_explanation_styles || ['STEP_BY_STEP'],
                language_preference: profileData.language_preference || 'GUJARATI',
                tone_preference: profileData.tone_preference || 'FRIENDLY',
                confidence_level: 70,
                question_hesitation_level: 30,
                ...profileData,
                name: explicitData.name || profileData.name || "Student",
                grade: explicitData.grade || profileData.grade || "Unknown",
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                version: 1
            };

            await setDoc(doc(db, "student_profiles", uid), profile);

            await addDoc(collection(db, "onboarding_sessions", uid, "responses"), {
                answers,
                timestamp: new Date().toISOString()
            });

            return profile;
        } catch (error) {
            console.error("Error in completeOnboarding:", error);
            throw error;
        }
    },

    /**
     * Get tutoring response
     */
    async getTutoringResponse(uid: string, message: string, history: any[], docText?: string) {
        const profile = await this.getProfile(uid);
        if (!profile) throw new Error("Profile not found");

        const summary = "";
        const systemInstruction = TUTOR_SYSTEM_PROMPT(profile, summary);

        try {
            const result = await callGeminiFunction({
                action: 'getTutoringResponse',
                payload: { systemInstruction, history, message, docText }
            });
            return (result.data as any).text || "";
        } catch (error) {
            console.error("Error in getTutoringResponse:", error);
            return "Sorry, I am having trouble connecting to my assistant tools.";
        }
    },

    /**
     * Update profile based on session
     */
    async updateProfile(uid: string, sessionId: string, summary: string) {
        const profile = await this.getProfile(uid);
        if (!profile) return;

        try {
            const result = await callGeminiFunction({
                action: 'updateProfile',
                payload: { promptTemplate: PROFILE_UPDATER_PROMPT(profile, summary) }
            });
            const patch = extractJson((result.data as any).text || "{}");

            if (patch) {
                await updateDoc(doc(db, "student_profiles", uid), {
                    ...patch,
                    updated_at: new Date().toISOString()
                });

                await addDoc(collection(db, "profile_updates", uid, "patches"), {
                    patch,
                    applied_at: new Date().toISOString(),
                    session_id: sessionId
                });
            }
        } catch (error) {
            console.error("Error in updateProfile:", error);
        }
    }
};

