
import { getFunctions, httpsCallable } from "firebase/functions";
import { getApp, getApps, initializeApp } from "firebase/app";
import { Message, Role } from "../types";

// Initialize Firebase if not already initialized
// You might want to move this to a dedicated firebaseConfig.ts file if you use Auth/Firestore elsewhere
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const functions = getFunctions(app);

// Use 'callGemini' as the function name
const callGeminiFunction = httpsCallable(functions, 'callGemini');

const callWithRetry = async (payload: any, maxRetries = 2) => {
  let lastError: any;
  for (let i = 0; i <= maxRetries; i++) {
    try {
      return await callGeminiFunction(payload);
    } catch (error: any) {
      lastError = error;
      if (error.message?.includes('429') && i < maxRetries) {
        const delay = 2000 * (i + 1);
        console.warn(`geminiService retry ${i + 1}/${maxRetries} after 429...`);
        await new Promise(r => setTimeout(r, delay));
        continue;
      }
      break;
    }
  }
  throw lastError;
};

const handle429 = (error: any, fallback: string) => {
  if (error?.message?.includes('429')) {
    return "I'm a bit overwhelmed right now. 😅 Please wait about 10-20 seconds and try again, I'll be ready for you then!";
  }
  return fallback;
};

export const solveProblem = async (
  prompt: string,
  history: Message[],
  image?: string,
  grade?: string
): Promise<{ text: string, sources?: any[], tokensUsed: number, metadata?: any }> => {
  try {
    const result = await callWithRetry({
      action: 'solveProblem',
      payload: { prompt, history, image, grade }
    });

    const data = result.data as any;
    return {
      text: data.text,
      sources: data.sources,
      tokensUsed: data.tokensUsed,
      metadata: data.metadata
    };
  } catch (error) {
    console.error("Error calling Gemini Cloud Function:", error);
    return {
      text: handle429(error, "Sorry, I encountered an error connecting to the server. Please try again in a moment."),
      tokensUsed: 0,
      sources: []
    }
  }
};

export const generateGlobalReport = async (data: string): Promise<string> => {
  try {
    const result = await callWithRetry({
      action: 'generateGlobalReport',
      payload: { data }
    });
    return (result.data as any).text;
  } catch (error) {
    console.error("Error generating report:", error);
    return handle429(error, "Report failed.");
  }
};

export const generateExamPaper = async (params: {
  grade: string,
  subject: string,
  topic: string,
  marks: string,
  language: string,
  includeAnswers: boolean,
  pdfData?: string,
  mimeType?: string
}): Promise<string> => {
  try {
    const result = await callWithRetry({
      action: 'generateExamPaper',
      payload: params
    });
    return (result.data as any).text;
  } catch (error) {
    console.error("Error generating exam paper:", error);
    return handle429(error, "Failed to generate exam paper.");
  }
};

export const generateStudyPlanner = async (params: {
  examDate: string,
  subjects: string,
  targetGrade: string,
  dailyHours: string
}): Promise<string> => {
  try {
    const result = await callWithRetry({
      action: 'generateStudyPlanner',
      payload: params
    });
    return (result.data as any).text;
  } catch (error) {
    console.error("Error generating study planner:", error);
    return handle429(error, "Failed to generate study planner.");
  }
};

export const analyzeLearningInsights = async (history: string): Promise<string> => {
  try {
    const result = await callWithRetry({
      action: 'analyzeLearningInsights',
      payload: { history }
    });
    return (result.data as any).text;
  } catch (error) {
    console.error("Error analyzing insights:", error);
    return handle429(error, "Not enough data or server error.");
  }
};

