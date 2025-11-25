import { GoogleGenAI, Type } from "@google/genai";
import { AIExecutionResult, Problem, Language, ProgrammingLanguage } from "../types";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("API_KEY not set. Please enable the Google Gemini API.");
  return new GoogleGenAI({ apiKey });
};

export const runCodeWithAI = async (
  problem: Problem,
  userCode: string,
  language: ProgrammingLanguage = 'python'
): Promise<AIExecutionResult> => {
  const modelId = "gemini-2.5-flash"; 

  let langContext = "";
  if (language === 'python') langContext = "Python 3 Interpreter";
  else if (language === 'java') langContext = "Java Compiler & Executor";
  else if (language === 'cpp') langContext = "C++ Compiler & Executor";

  // We use thinking config to ensure the model actually "executes" the logic step-by-step
  // rather than just guessing.
  const prompt = `
    Role: You are a ${langContext} and an Algorithm Judge.
    
    Problem: "${problem.title}"
    Description: ${problem.description}
    
    Test Cases to Validate:
    ${problem.testCases}
    
    User Code (${language}):
    \`\`\`${language}
    ${userCode}
    \`\`\`
    
    Instructions:
    1. Check for syntax errors specific to ${language}. If any, fail immediately.
    2. Mentally execute the code against the Test Cases provided.
    3. Be strict. Edge cases (empty inputs, negative numbers) must work if applicable.
    4. If the code is just "pass", empty, or incomplete, it fails.
    
    Output Format (JSON Only):
    {
      "passed": boolean,
      "output": string (Show the user the actual output of their function for the first failed test case, or a success message showing inputs/outputs),
      "error": string (Runtime error message, Compiler Error, or Logic Error description),
      "feedback": string (Constructive advice in English. If it passed, congratulate them and mention complexity.)
    }
  `;

  try {
    const ai = getClient();
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 1024 }, // Enable thinking for better logic verification
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            passed: { type: Type.BOOLEAN },
            output: { type: Type.STRING },
            error: { type: Type.STRING },
            feedback: { type: Type.STRING },
          },
          required: ["passed", "output", "feedback"]
        }
      }
    });

    let text = response.text || "{}";
    
    // Clean up markdown code blocks if the model includes them despite MIME type
    text = text.replace(/^```json\s*/, '').replace(/^```\s*/, '').replace(/```$/, '');

    return JSON.parse(text) as AIExecutionResult;
  } catch (err: any) {
    console.error("AI execution failed:", err);
    return {
      passed: false,
      output: "",
      error: "System Error",
      feedback: err.message || "Failed to connect to AI Judge. Please try again."
    };
  }
};

export const getAIHint = async (
  problem: Problem,
  userCode: string,
  chatHistory: string[],
  language: Language
): Promise<string> => {
  try {
    const ai = getClient();
    
    const prompt = `
      You are a helpful coding tutor. Language: ${language === 'kk' ? 'Kazakh' : 'English'}.
      The user is stuck on "${problem.title}".
      
      User's current code:
      ${userCode}
      
      Recent Chat Context:
      ${chatHistory.join('\n')}
      
      Provide a small, guiding hint without giving away the full solution. 
      Focus on the next logical step. Keep it short.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return response.text || "I couldn't generate a hint right now.";
  } catch (e) {
    console.error(e);
    return "Could not connect to AI service.";
  }
};

export const translateText = async (text: string, targetLang: Language): Promise<string> => {
  if (targetLang === 'en') return text; // Assuming source is EN
  
  try {
    const ai = getClient();
    const prompt = `Translate the following coding problem text to Kazakh. Keep code blocks, variable names (like 'nums', 'target'), and technical terms intact. \n\nText: ${text}`;
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    return response.text || text;
  } catch (e) {
    return text;
  }
};

export const chatWithTutor = async (
  message: string,
  history: string[],
  language: Language
): Promise<string> => {
  try {
    const ai = getClient();
    const prompt = `
      System Instruction: You are an expert Computer Science Professor and friendly AI Tutor.
      Your Goal: Explain algorithms, data structures, and coding concepts clearly.
      Language: Respond in ${language === 'kk' ? 'Kazakh' : 'English'}.
      Tone: Encouraging, academic but accessible, using analogies.
      Format: Use Markdown for code blocks or bold text.
      
      Chat History:
      ${history.join('\n')}
      
      User Question: "${message}"
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    return response.text || "I am thinking...";
  } catch (e) {
    return "AI Service Error. Please try again.";
  }
};

export const getRecommendedProblem = async (
  solvedIds: string[],
  allProblems: Problem[],
  language: Language
): Promise<string | null> => {
  if (solvedIds.length === 0) return allProblems[0].id;

  const unsolvedProblems = allProblems.filter(p => !solvedIds.includes(p.id));
  if (unsolvedProblems.length === 0) return null;

  try {
    const ai = getClient();
    const solvedProblems = allProblems.filter(p => solvedIds.includes(p.id));

    const prompt = `
      Act as a recommendation engine.
      Solved: ${solvedProblems.map(p => p.title).join(', ')}
      Available: ${unsolvedProblems.map(p => `${p.id}:${p.title}(${p.difficulty})`).join(', ')}
      
      Pick the best next problem ID based on difficulty progression. Return ONLY the ID.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    const recommendedId = response.text?.trim();
    return unsolvedProblems.find(p => p.id === recommendedId)?.id || unsolvedProblems[0].id;
  } catch (e) {
    return unsolvedProblems[0].id;
  }
};