
export type Difficulty = 'Easy' | 'Medium' | 'Hard';
export type Language = 'en' | 'kk';
export type ProgrammingLanguage = 'python' | 'java' | 'cpp';

export interface Problem {
  id: string;
  title: string;
  difficulty: Difficulty;
  category: string;
  description: string;
  starterCode: string;
  testCases: string; // Description of hidden test cases for AI context
}

export interface UserState {
  solvedProblemIds: string[];
  currentProblemId: string | null;
  codeCache: Record<string, string>; // Map problemId -> code
  language: Language;
  viewMode: 'list' | 'profile' | 'leaderboard' | 'ai-tutor';
  aiTutorHistory: ChatMessage[];
}

export interface AIExecutionResult {
  passed: boolean;
  output: string;
  error?: string;
  feedback: string;
  executionTime?: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}
