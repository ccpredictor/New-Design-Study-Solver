/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import { onCall, HttpsError } from "firebase-functions/v2/https";
import { GoogleGenAI } from "@google/genai";
import * as dotenv from 'dotenv';
dotenv.config();

// We can use process.env.GEMINI_API_KEY if we set it in .env for local dev
// For production, use defineString or just process.env if set via `firebase functions:secrets:set` or `functions:config:set` 
const API_KEY = process.env.GEMINI_API_KEY;

// Recreating the helper for system instructions
const getSystemInstruction = (grade?: string, complexity: 'EASY' | 'HARD' = 'HARD') => {
    const baseIdentity = `You are "AI Study Solver", a helpful and intelligent AI Assistant.`;
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

/**
 * Helper for exponential backoff retries on 429
 */
async function callWithRetry(fn: () => Promise<any>, maxRetries = 3, initialDelay = 1000) {
    let lastError;
    for (let i = 0; i < maxRetries; i++) {
        try {
            return await fn();
        } catch (error: any) {
            lastError = error;
            // 429 is Resource Exhausted / Rate Limit
            if (error.message?.includes('429') || error.status === 429 || error.code === 429) {
                const delay = initialDelay * Math.pow(2, i);
                console.warn(`Gemini 429 detected. Retrying in ${delay}ms... (Attempt ${i + 1}/${maxRetries})`);
                await new Promise(resolve => setTimeout(resolve, delay));
                continue;
            }
            throw error;
        }
    }
    throw lastError;
}

export const callGemini = onCall({ cors: true }, async (request) => {
    // 1. Authentication Check (Optional - highly recommended for production)
    // if (!request.auth) {
    //     throw new HttpsError('failed-precondition', 'The function must be called while authenticated.');
    // }

    const { action, payload } = request.data;

    // Check if API Key exists
    if (!API_KEY) {
        throw new HttpsError('failed-precondition', 'GEMINI_API_KEY is not set in environment variables.');
    }

    const ai = new GoogleGenAI({ apiKey: API_KEY });

    try {
        if (action === "solveProblem") {
            const { prompt, history, image, grade } = payload;
            let complexity: 'EASY' | 'HARD' = 'HARD';
            let selectedModel = 'gemini-2.0-flash'; // Fallback / Default
            let routerTriggered = false;

            // Router Logic
            if (!image) {
                routerTriggered = true;
                try {
                    const response = await callWithRetry(() => ai.models.generateContent({
                        model: 'gemini-2.0-flash',
                        contents: prompt,
                        config: {
                            systemInstruction: ROUTER_INSTRUCTION,
                            temperature: 0.1,
                        }
                    }));
                    const classification = response.text?.trim().toUpperCase();
                    complexity = classification === 'HARD' ? 'HARD' : 'EASY';
                } catch (e) {
                    console.error("Router error", e);
                    complexity = 'HARD'; // Default to hard
                }
                selectedModel = complexity === 'HARD' ? 'gemini-2.0-flash' : 'gemini-2.0-flash';
            }

            // Prepare Contents
            const contents: any[] = (history || []).slice(-15).map((msg: any) => ({
                role: msg.role === "user" ? 'user' : 'model',
                parts: [{ text: msg.text }]
            }));

            const userParts: any[] = [{ text: prompt }];
            if (image) {
                // Image is expected to be base64 string
                // payload.image should be "data:image/jpeg;base64,..." or just base64
                // The client sends full data URI usually.
                // We need to strip metadata if present or ensuring client sends raw base64?
                // Client side parsing usually sends full string.
                // Let's assume client sends the same string they used to, which might be "data:..."
                // The original code used `image.split(',')[1]`
                const base64Data = image.includes(',') ? image.split(',')[1] : image;

                userParts.push({
                    inlineData: {
                        data: base64Data,
                        mimeType: 'image/jpeg'
                    }
                });
            }

            contents.push({
                role: 'user',
                parts: userParts
            });

            const response = await callWithRetry(() => ai.models.generateContent({
                model: selectedModel,
                contents: contents,
                config: {
                    systemInstruction: getSystemInstruction(grade, complexity),
                    temperature: complexity === 'HARD' ? 0.7 : 0.4,
                    // tools: [{ googleSearch: {} }] // Note: googleSearch might require special handling or specific models
                }
            }));

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

        } else if (action === "generateGlobalReport") {
            const { data } = payload;
            const prompt = `As a Senior Administrator, analyze this data and generate a report in Markdown:\n${data}`;
            const response = await callWithRetry(() => ai.models.generateContent({
                model: 'gemini-2.0-flash',
                contents: prompt,
            }));
            return { text: response.text || "Report failed." };

        } else if (action === "generateExamPaper") {
            const { grade, subject, topic, marks, language, includeAnswers, pdfData, mimeType } = payload;
            const prompt = `Design an exam paper in ${language} for Grade ${grade}, Subject: ${subject}, Topic: ${topic}, Total Marks: ${marks}. ${includeAnswers ? "Include Answer Key." : ""}`;

            const userParts: any[] = [{ text: prompt }];
            if (pdfData) {
                const base64Data = pdfData.includes(',') ? pdfData.split(',')[1] : pdfData;
                userParts.push({
                    inlineData: {
                        data: base64Data,
                        mimeType: mimeType || 'application/pdf'
                    }
                });
            }

            const response = await callWithRetry(() => ai.models.generateContent({
                model: 'gemini-2.0-flash',
                contents: { parts: userParts },
                // Note: Thinking config might need specific models or beta flags
                config: {
                    maxOutputTokens: 4000,
                }
            }));
            return { text: response.text || "Failed." };

        } else if (action === "generateStudyPlanner") {
            const { examDate, subjects, targetGrade, dailyHours } = payload;
            const prompt = `Plan study roadmap. Exam: ${examDate}, Subjects: ${subjects}, Target: ${targetGrade}, Hours: ${dailyHours}.`;
            const response = await callWithRetry(() => ai.models.generateContent({
                model: 'gemini-2.0-flash',
                contents: prompt
            }));
            return { text: response.text || "Failed." };

        } else if (action === "analyzeLearningInsights") {
            const { history } = payload;
            const prompt = `As an expert Education Analyst, summarize the learning patterns from this student's history: ${history}. 
            
            Format the response in clean Markdown:
            - Use bullet points for STRENGTHS and WEAKNESSES.
            - USE SINGLE BOLD ONLY for headers.
            - DO NOT use triple stars.
            - Language: Mixed Hindi-English (Hinglish).
            - Keep sentences short.`;

            const response = await callWithRetry(() => ai.models.generateContent({
                model: 'gemini-2.0-flash',
                contents: prompt,
            }));
            return { text: response.text || "Not enough data." };

        } else if (action === "completeOnboarding") {
            const { answers, promptTemplate } = payload;
            const response = await callWithRetry(() => ai.models.generateContent({
                model: "gemini-2.0-flash",
                contents: [{ role: 'user', parts: [{ text: `${promptTemplate}\n\nSTUDENT RESPONSES:\n${JSON.stringify(answers)}` }] }],
                config: { responseMimeType: "application/json" }
            }));
            return { text: response.text || "{}" };

        } else if (action === "getTutoringResponse") {
            const { systemInstruction, history, message, docText } = payload;

            // 1. Classify Complexity
            let complexity: 'EASY' | 'HARD' = 'EASY';
            try {
                const classificationResponse = await callWithRetry(() => ai.models.generateContent({
                    model: 'gemini-2.0-flash',
                    contents: message,
                    config: {
                        systemInstruction: ROUTER_INSTRUCTION,
                        temperature: 0.1,
                    }
                }));
                const classification = classificationResponse.text?.trim().toUpperCase();
                complexity = classification === 'HARD' ? 'HARD' : 'EASY';
            } catch (e) {
                console.error("Tutoring Router error", e);
                complexity = 'HARD';
            }

            // Map history correctly
            const contents: any[] = (history || []).slice(-15).map((m: any) => ({
                role: m.role === 'user' ? 'user' : 'model',
                parts: [{ text: m.text }]
            }));

            // Add latest message
            contents.push({
                role: 'user',
                parts: [{ text: `${message}${docText ? `\n\nExtracted Doc Text:\n${docText}` : ""}` }]
            });

            const response = await callWithRetry(() => ai.models.generateContent({
                model: "gemini-2.0-flash",
                contents: contents,
                config: {
                    systemInstruction: systemInstruction,
                    temperature: complexity === 'HARD' ? 0.7 : 0.4
                }
            }));

            return {
                text: response.text || "Sorry, I couldn't generate a response.",
                metadata: { complexity }
            };

        } else if (action === "updateProfile") {
            const { promptTemplate } = payload;
            const response = await callWithRetry(() => ai.models.generateContent({
                model: "gemini-2.0-flash",
                contents: [{ role: 'user', parts: [{ text: promptTemplate }] }],
                config: { responseMimeType: "application/json" }
            }));
            return { text: response.text || "{}" };
        }

        throw new HttpsError('invalid-argument', `Unknown action: ${action}`);

    } catch (error: any) {
        console.error("Gemini API Error", error);
        throw new HttpsError('internal', error.message || 'Internal Server Error');
    }
});
