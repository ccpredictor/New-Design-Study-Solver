
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { Message, Role } from "../types";

const getSystemInstruction = (grade?: string, complexity: 'EASY' | 'HARD' = 'HARD') => {
  const baseIdentity = `You are "AI Study Solver", a helpful and intelligent AI Teacher.`;

  const languageRule = `LANGUAGE RULE: Always respond in the SAME LANGUAGE that the user uses. If they ask in Gujarati, reply in Gujarati. If they ask in Hindi, reply in Hindi.`;

  if (complexity === 'EASY') {
    return `${baseIdentity}
    
    MODE: CONCISE & DIRECT.
    The user is asking a simple factual or conversational question. 
    1. Provide a direct, short, and accurate answer immediately.
    2. Do NOT use any step-by-step solution format.
    3. Do NOT use complex academic jargon unless necessary.
    4. Keep the tone friendly and helpful.
    
    ${languageRule}`;
  }

  return `${baseIdentity}
  CORE MISSION: Help students MASTER underlying concepts for complex academic problems.
  
  ${grade ? `STUDENT LEVEL: The student is in ${grade}. Tailor your vocabulary and depth for this level.` : ''}

  ${languageRule}

  STRUCTURE RULES (ONLY for complex problems):
  Follow this strict step-by-step solution mode:
  1. Problem Understanding
  2. Concept Used
  3. Step-by-Step Solution
  4. Final Answer
  5. Smart Tips & Shortcuts
  
  If Google Search is used, ensure accuracy.`;
};

const ROUTER_INSTRUCTION = `
You are a routing agent. Categorize the user input:
- 'EASY': Simple facts (e.g., "Capital of X"), greetings, translations, basic definitions, or short talk.
- 'HARD': Math problems, physics/chemistry calculations, long essays, coding, or complex reasoning.
ONLY output 'EASY' or 'HARD'.
`;

const classifyPrompt = async (prompt: string): Promise<'EASY' | 'HARD'> => {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: ROUTER_INSTRUCTION,
        temperature: 0.1,
      }
    });
    const classification = response.text?.trim().toUpperCase();
    return classification === 'HARD' ? 'HARD' : 'EASY';
  } catch (error) {
    return 'HARD';
  }
};

export const solveProblem = async (
  prompt: string,
  history: Message[],
  image?: string,
  grade?: string
): Promise<{ text: string, sources?: any[], tokensUsed: number, metadata?: any }> => {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  let complexity: 'EASY' | 'HARD' = 'HARD';
  let selectedModel = 'gemini-3-pro-preview';
  let routerTriggered = false;

  if (!image) {
    routerTriggered = true;
    complexity = await classifyPrompt(prompt);
    selectedModel = complexity === 'HARD' ? 'gemini-3-pro-preview' : 'gemini-3-flash-preview';
  }

  const contents: any[] = history.map(msg => ({
    role: msg.role === Role.USER ? 'user' : 'model',
    parts: [{ text: msg.text }]
  }));

  const userParts: any[] = [{ text: prompt }];
  if (image) {
    userParts.push({
      inlineData: {
        data: image.split(',')[1],
        mimeType: 'image/jpeg'
      }
    });
  }

  contents.push({
    role: 'user',
    parts: userParts
  });

  const response: GenerateContentResponse = await ai.models.generateContent({
    model: selectedModel,
    contents: contents,
    config: {
      systemInstruction: getSystemInstruction(grade, complexity),
      temperature: complexity === 'HARD' ? 0.7 : 0.4,
      tools: [{ googleSearch: {} }]
    }
  });

  const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
  const usage = (response as any).usageMetadata || {};

  return {
    text: response.text || "I'm sorry, I couldn't generate a solution.",
    sources: sources,
    tokensUsed: usage.totalTokenCount || 0,
    metadata: {
      modelUsed: selectedModel,
      complexity: complexity,
      routerTriggered: routerTriggered
    }
  };
};

export const generateGlobalReport = async (data: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const prompt = `As a Senior Administrator, analyze this data and generate a report in Markdown:\n${data}`;
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
  });
  return response.text || "Report failed.";
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
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const prompt = `Design an exam paper in ${params.language} for Grade ${params.grade}, Subject: ${params.subject}, Topic: ${params.topic}, Total Marks: ${params.marks}. ${params.includeAnswers ? "Include Answer Key." : ""}`;

  const userParts: any[] = [{ text: prompt }];
  if (params.pdfData) {
    userParts.push({
      inlineData: {
        data: params.pdfData.split(',')[1],
        mimeType: params.mimeType || 'application/pdf'
      }
    });
  }

  // Use both maxOutputTokens and thinkingBudget as per Gemini API guidelines for reserved token space
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: { parts: userParts },
    config: {
      maxOutputTokens: 4000,
      thinkingConfig: { thinkingBudget: 2000 }
    }
  });
  return response.text || "Failed.";
};

export const generateStudyPlanner = async (params: {
  examDate: string,
  subjects: string,
  targetGrade: string,
  dailyHours: string
}): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const prompt = `Plan study roadmap. Exam: ${params.examDate}, Subjects: ${params.subjects}, Target: ${params.targetGrade}, Hours: ${params.dailyHours}.`;
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: prompt
  });
  return response.text || "Failed.";
};

export const analyzeLearningInsights = async (history: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const prompt = `Summarize history patterns: ${history}. Format: STRENGTHS: ... | WEAKNESSES: ...`;
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
  });
  return response.text || "Not enough data.";
};
