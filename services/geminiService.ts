
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

export const solveProblem = async (
  prompt: string,
  history: Message[],
  image?: string,
  grade?: string
): Promise<{ text: string, sources?: any[], tokensUsed: number, metadata?: any }> => {
  try {
    const result = await callGeminiFunction({
      action: 'solveProblem',
      payload: { prompt, history, image, grade }
    });

    // cast result.data to expected type
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
      text: "Sorry, I encountered an error connecting to the server.",
      tokensUsed: 0,
      sources: []
    }
  }
};

export const generateGlobalReport = async (data: string): Promise<string> => {
  try {
    const result = await callGeminiFunction({
      action: 'generateGlobalReport',
      payload: { data }
    });
    return (result.data as any).text;
  } catch (error) {
    console.error("Error generating report:", error);
    return "Report failed.";
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
    const result = await callGeminiFunction({
      action: 'generateExamPaper',
      payload: params
    });
    return (result.data as any).text;
  } catch (error) {
    console.error("Error generating exam paper:", error);
    return "Failed to generate exam paper.";
  }
};

export const generateStudyPlanner = async (params: {
  examDate: string,
  subjects: string,
  targetGrade: string,
  dailyHours: string
}): Promise<string> => {
  try {
    const result = await callGeminiFunction({
      action: 'generateStudyPlanner',
      payload: params
    });
    return (result.data as any).text;
  } catch (error) {
    console.error("Error generating study planner:", error);
    return "Failed to generate study planner.";
  }
};

export const analyzeLearningInsights = async (history: string): Promise<string> => {
  try {
    const result = await callGeminiFunction({
      action: 'analyzeLearningInsights',
      payload: { history }
    });
    return (result.data as any).text;
  } catch (error) {
    console.error("Error analyzing insights:", error);
    return "Not enough data or server error.";
  }
};

