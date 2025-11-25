import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { Problem, ChatMessage, Language, ProgrammingLanguage } from '../types';
import CodeEditor from './CodeEditor';
import Button from './Button';
import { runCodeWithAI, getAIHint, translateText } from '../services/geminiService';
import { Play, AlertCircle, CheckCircle2, RotateCcw, Bot, Terminal, Globe, Brain, ChevronDown } from 'lucide-react';
import { translations } from '../translations';

interface ProblemWorkspaceProps {
  problem: Problem;
  initialCode: string;
  onSuccess: (code: string) => void;
  language: Language;
}

const ProblemWorkspace: React.FC<ProblemWorkspaceProps> = ({ problem, initialCode, onSuccess, language }) => {
  const [code, setCode] = useState(initialCode);
  const [progLang, setProgLang] = useState<ProgrammingLanguage>('python');
  const [activeTab, setActiveTab] = useState<'console' | 'chat'>('console');
  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState<{ type: 'success' | 'error' | 'neutral', message: string, detail?: string } | null>(null);
  const t = translations[language];

  const [translatedDesc, setTranslatedDesc] = useState<string | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);
  
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Dropdown state
  const [isLangOpen, setIsLangOpen] = useState(false);

  useEffect(() => {
    setChatMessages([
      { role: 'model', text: language === 'kk' 
          ? `Сәлем! Мен сіздің AI көмекшіңізбін. "${problem.title}" есебімен қиындық туындады ма?`
          : `Hi! I'm your AI coding assistant. Stuck on "${problem.title}"? Ask me for a hint!`, 
        timestamp: Date.now() 
      }
    ]);
  }, [problem.id, language]);

  const handleTranslate = async () => {
    if (translatedDesc) {
      setTranslatedDesc(null); 
      return;
    }
    setIsTranslating(true);
    const translated = await translateText(problem.description, 'kk');
    setTranslatedDesc(translated);
    setIsTranslating(false);
  };

  const handleLanguageChange = (newLang: ProgrammingLanguage) => {
    setProgLang(newLang);
    setIsLangOpen(false);
    
    // Switch template if needed
    if (newLang === 'python') {
        setCode(problem.starterCode);
    } else if (newLang === 'java') {
        setCode(`class Solution {\n    public void solve() {\n        // Write your solution for "${problem.title}" here\n    }\n}`);
    } else if (newLang === 'cpp') {
        setCode(`#include <iostream>\n#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Write your solution for "${problem.title}" here\n};`);
    }
  };

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, activeTab]);

  const handleRun = async () => {
    setIsRunning(true);
    setActiveTab('console');
    setOutput({ type: 'neutral', message: t.aiThinking });

    try {
        const result = await runCodeWithAI(problem, code, progLang);

        if (result.passed) {
        setOutput({ 
            type: 'success', 
            message: `${t.success}\n${result.feedback}`,
            detail: result.output 
        });
        onSuccess(code);
        } else {
        setOutput({ 
            type: 'error', 
            message: `${t.failed}.\n${result.feedback}`,
            detail: `${result.error ? `Error: ${result.error}\n` : ''}Output: ${result.output}` 
        });
        }
    } catch (e) {
        setOutput({ type: 'error', message: 'An unexpected error occurred.', detail: String(e) });
    } finally {
        setIsRunning(false);
    }
  };

  const handleGetHint = async () => {
    if (isChatLoading) return;
    setActiveTab('chat');
    setIsChatLoading(true);
    
    const userMsg: ChatMessage = { role: 'user', text: t.askHint, timestamp: Date.now() };
    setChatMessages(prev => [...prev, userMsg]);

    const hint = await getAIHint(problem, code, chatMessages.map(m => `${m.role}: ${m.text}`), language);
    
    setChatMessages(prev => [...prev, { role: 'model', text: hint, timestamp: Date.now() }]);
    setIsChatLoading(false);
  };

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-6rem)] bg-slate-50 border border-slate-200 rounded-xl shadow-lg relative">
      
      {/* Left Panel: Description */}
      <div className="w-full lg:w-2/5 flex flex-col border-r border-slate-200 bg-white rounded-l-xl overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex justify-between items-start bg-slate-50">
          <div>
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              {problem.id}. {problem.title}
            </h2>
            <div className="flex gap-2 mt-2">
                <span className={`text-xs font-medium px-2 py-0.5 rounded inline-block ${
                problem.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                problem.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                'bg-red-100 text-red-700'
                }`}>
                {problem.difficulty}
                </span>
                <span className="text-xs font-medium px-2 py-0.5 rounded bg-slate-200 text-slate-600">
                    {problem.category}
                </span>
            </div>
          </div>
          {language === 'kk' && (
              <Button size="sm" variant="secondary" onClick={handleTranslate} isLoading={isTranslating} className="text-xs h-8 bg-white border border-slate-300 text-slate-600 hover:bg-slate-50">
                  <Globe className="w-3 h-3 mr-1" />
                  {translatedDesc ? t.original : t.translate}
              </Button>
          )}
        </div>
        <div className="flex-1 overflow-y-auto p-6 text-slate-700 prose prose-slate prose-sm max-w-none custom-scrollbar">
          <ReactMarkdown>{translatedDesc || problem.description}</ReactMarkdown>
          
          <div className="mt-8">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-2">Examples</h3>
            <div className="bg-slate-100 p-4 rounded-lg font-mono text-sm text-slate-600 border border-slate-200">
              {problem.testCases}
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel: Code & Output */}
      <div className="w-full lg:w-3/5 flex flex-col min-h-0 bg-slate-50 rounded-r-xl relative">
        
        {/* Toolbar */}
        <div className="h-12 border-b border-slate-200 bg-white flex items-center justify-between px-4 rounded-tr-xl relative z-30">
          <div className="flex items-center gap-2 relative">
             {/* Language Dropdown */}
             <div className="relative">
                <button 
                  onClick={() => setIsLangOpen(!isLangOpen)}
                  className="flex items-center gap-2 text-sm font-medium text-slate-700 hover:bg-slate-100 px-3 py-1.5 rounded-lg transition-colors border border-transparent hover:border-slate-200"
                >
                    {progLang === 'python' && <span className="text-blue-600">Python</span>}
                    {progLang === 'java' && <span className="text-red-600">Java</span>}
                    {progLang === 'cpp' && <span className="text-blue-800">C++</span>}
                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isLangOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {isLangOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsLangOpen(false)}></div>
                    <div className="absolute top-full left-0 mt-2 w-40 bg-white rounded-lg shadow-xl border border-slate-100 overflow-hidden z-20 animate-in fade-in zoom-in-95 duration-100">
                        <button onClick={() => handleLanguageChange('python')} className="block w-full text-left px-4 py-3 text-sm hover:bg-sky-50 text-slate-700 border-b border-slate-50 transition-colors">Python 3</button>
                        <button onClick={() => handleLanguageChange('java')} className="block w-full text-left px-4 py-3 text-sm hover:bg-sky-50 text-slate-700 border-b border-slate-50 transition-colors">Java</button>
                        <button onClick={() => handleLanguageChange('cpp')} className="block w-full text-left px-4 py-3 text-sm hover:bg-sky-50 text-slate-700 transition-colors">C++</button>
                    </div>
                  </>
                )}
             </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => handleLanguageChange(progLang)} className="text-slate-500 hover:text-slate-800 hover:bg-slate-100">
              <RotateCcw className="w-4 h-4 mr-1" /> {t.reset}
            </Button>
            <Button size="sm" onClick={handleRun} isLoading={isRunning} className="bg-green-600 hover:bg-green-500 text-white">
              <Play className="w-4 h-4 mr-1 fill-current" /> {t.runCode}
            </Button>
          </div>
        </div>

        {/* Editor */}
        <div className="flex-1 min-h-0 relative z-0">
          <CodeEditor code={code} onChange={setCode} />
        </div>

        {/* Bottom Panel (Console/Chat) */}
        <div className="h-72 flex flex-col border-t border-slate-200 bg-white shadow-[0_-5px_20px_rgba(0,0,0,0.05)] z-10 rounded-br-xl overflow-hidden">
          <div className="flex border-b border-slate-200 bg-slate-50">
            <button 
              className={`px-4 py-2 text-sm font-medium flex items-center gap-2 border-b-2 transition-colors ${activeTab === 'console' ? 'border-kazakh-sky text-kazakh-sky bg-white' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
              onClick={() => setActiveTab('console')}
            >
              <Terminal className="w-4 h-4" /> {t.console}
            </button>
            <button 
              className={`px-4 py-2 text-sm font-medium flex items-center gap-2 border-b-2 transition-colors ${activeTab === 'chat' ? 'border-kazakh-sky text-kazakh-sky bg-white' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
              onClick={() => setActiveTab('chat')}
            >
              <Brain className="w-4 h-4" /> {t.aiAssistant}
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 font-mono text-sm relative custom-scrollbar bg-white">
            
            {activeTab === 'console' && (
              <>
                {!output && <div className="text-slate-400 italic mt-4 ml-2">Run your code to see output...</div>}
                {output && (
                  <div className="animate-in fade-in duration-300">
                    <div className={`mb-3 pb-3 border-b border-slate-100 whitespace-pre-wrap font-sans ${
                      output.type === 'success' ? 'text-green-600' : 
                      output.type === 'error' ? 'text-red-600' : 'text-slate-600'
                    }`}>
                      {output.type === 'success' && <div className="flex items-center gap-2 mb-1 font-bold"><CheckCircle2 className="w-5 h-5" /> Accepted</div>}
                      {output.type === 'error' && <div className="flex items-center gap-2 mb-1 font-bold"><AlertCircle className="w-5 h-5" /> Execution Error</div>}
                      {output.message}
                    </div>
                    {output.detail && (
                        <div className="bg-slate-50 p-3 rounded border border-slate-200 text-slate-700 font-mono text-xs">
                            <div className="text-slate-400 mb-1 uppercase text-[10px] tracking-wider">StdOut / Returns</div>
                            {output.detail}
                        </div>
                    )}
                  </div>
                )}
              </>
            )}

            {activeTab === 'chat' && (
              <div className="flex flex-col gap-4 pb-10">
                {chatMessages.map((msg, i) => (
                  <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'model' ? 'bg-kazakh-sky text-white' : 'bg-slate-200 text-slate-600'}`}>
                      {msg.role === 'model' ? <Bot className="w-5 h-5" /> : <div className="w-3 h-3 bg-slate-500 rounded-full" />}
                    </div>
                    <div className={`p-3 rounded-lg max-w-[85%] text-sm leading-relaxed ${msg.role === 'model' ? 'bg-slate-100 text-slate-800' : 'bg-sky-50 text-sky-900 border border-sky-100'}`}>
                      <ReactMarkdown>{msg.text}</ReactMarkdown>
                    </div>
                  </div>
                ))}
                {isChatLoading && (
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-kazakh-sky/50 flex items-center justify-center flex-shrink-0 animate-pulse">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                    <div className="p-3 rounded-lg bg-slate-50 text-slate-400 italic text-sm">
                      Thinking...
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>
            )}
            
            {activeTab === 'chat' && !isChatLoading && (
              <div className="sticky bottom-0 left-0 right-0 pt-4 flex justify-center bg-gradient-to-t from-white via-white to-transparent">
                 <Button size="sm" variant="secondary" onClick={handleGetHint} className="shadow-sm border border-slate-300 bg-white hover:bg-slate-50 text-kazakh-sky">
                   {t.askHint}
                 </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemWorkspace;