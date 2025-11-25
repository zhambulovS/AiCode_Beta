
import React, { useState, useRef, useEffect } from 'react';
import { UserState, ChatMessage } from '../types';
import { chatWithTutor } from '../services/geminiService';
import { translations } from '../translations';
import { Bot, Send, User, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface AITutorProps {
  userState: UserState;
  onUpdateHistory: (history: ChatMessage[]) => void;
}

const AITutor: React.FC<AITutorProps> = ({ userState, onUpdateHistory }) => {
  const t = translations[userState.language];
  const messages = userState.aiTutorHistory;
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initial greeting if history is empty
    if (messages.length === 0) {
      onUpdateHistory([
        { role: 'model', text: t.tutorIntro, timestamp: Date.now() }
      ]);
    }
  }, [userState.language]);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  const handleSend = async (text: string = input) => {
    if (!text.trim() || isLoading) return;

    const userMsg: ChatMessage = { role: 'user', text, timestamp: Date.now() };
    const updatedWithUser = [...messages, userMsg];
    
    // Update global state immediately
    onUpdateHistory(updatedWithUser);
    setInput('');
    setIsLoading(true);

    const history = updatedWithUser.map(m => `${m.role}: ${m.text}`);
    const response = await chatWithTutor(text, history, userState.language);

    // Update global state with response
    onUpdateHistory([...updatedWithUser, { role: 'model', text: response, timestamp: Date.now() }]);
    setIsLoading(false);
  };

  const suggestions = [
    { label: t.topicRecursion, icon: '🔄' },
    { label: t.topicBigO, icon: '📊' },
    { label: t.topicDP, icon: '🧠' },
    { label: t.topicHash, icon: '⚡' },
  ];

  return (
    <div className="w-full h-[calc(100vh-6rem)] flex flex-col lg:flex-row gap-6">
      
      {/* Sidebar / Info Panel (Desktop) */}
      <div className="hidden lg:flex w-1/4 flex-col gap-6">
         <div className="bg-gradient-to-br from-kazakh-sky to-blue-600 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
             <Bot className="w-12 h-12 mb-4 text-white/90" />
             <h2 className="text-xl font-bold mb-2">{t.aiTutor}</h2>
             <p className="text-white/80 text-sm leading-relaxed">
               {t.tutorIntro}
             </p>
         </div>

         <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex-1">
            <h3 className="font-semibold text-slate-700 mb-4 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                {t.suggestedTopics}
            </h3>
            <div className="flex flex-col gap-3">
                {suggestions.map((s, i) => (
                    <button 
                        key={i}
                        onClick={() => handleSend(s.label)}
                        className="text-left p-3 rounded-xl bg-slate-50 hover:bg-sky-50 border border-slate-100 hover:border-sky-200 transition-all flex items-center gap-3 text-sm text-slate-700 hover:text-kazakh-sky group"
                    >
                        <span className="text-lg group-hover:scale-110 transition-transform">{s.icon}</span>
                        {s.label}
                    </button>
                ))}
            </div>
         </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-lg flex flex-col overflow-hidden relative">
        
        {/* Header (Mobile Only) */}
        <div className="lg:hidden p-4 border-b border-slate-100 bg-slate-50 flex items-center gap-3">
            <Bot className="w-6 h-6 text-kazakh-sky" />
            <span className="font-bold text-slate-800">{t.aiTutor}</span>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar bg-slate-50/50">
           {messages.map((msg, idx) => (
               <div key={idx} className={`flex gap-4 mb-6 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                   <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm ${msg.role === 'model' ? 'bg-white border border-slate-200 text-kazakh-sky' : 'bg-kazakh-sky text-white'}`}>
                       {msg.role === 'model' ? <Bot className="w-6 h-6" /> : <User className="w-6 h-6" />}
                   </div>
                   <div className={`max-w-[85%] lg:max-w-[70%] rounded-2xl p-4 shadow-sm text-sm leading-relaxed ${
                       msg.role === 'model' 
                       ? 'bg-white border border-slate-100 text-slate-800 rounded-tl-none' 
                       : 'bg-kazakh-sky text-white rounded-tr-none'
                   }`}>
                       <ReactMarkdown>{msg.text}</ReactMarkdown>
                   </div>
               </div>
           ))}
           
           {isLoading && (
               <div className="flex gap-4 mb-6">
                   <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center flex-shrink-0">
                       <Bot className="w-6 h-6 text-kazakh-sky animate-bounce" />
                   </div>
                   <div className="bg-white border border-slate-100 rounded-2xl rounded-tl-none p-4 shadow-sm flex gap-1 items-center">
                       <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></span>
                       <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-100"></span>
                       <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-200"></span>
                   </div>
               </div>
           )}
           <div ref={chatEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-slate-100">
             {/* Mobile suggestions quick bar */}
            <div className="lg:hidden flex gap-2 overflow-x-auto pb-3 mb-2 no-scrollbar">
                {suggestions.map((s, i) => (
                    <button key={i} onClick={() => handleSend(s.label)} className="whitespace-nowrap px-3 py-1 bg-slate-100 rounded-full text-xs text-slate-600 border border-slate-200">
                        {s.label}
                    </button>
                ))}
            </div>

            <div className="relative flex items-center gap-2">
                <input 
                    type="text" 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder={t.askQuestion}
                    className="flex-1 bg-slate-50 border border-slate-200 text-slate-800 pl-4 pr-12 py-3 rounded-xl focus:ring-2 focus:ring-kazakh-sky/50 focus:border-kazakh-sky outline-none transition-all shadow-inner"
                    disabled={isLoading}
                />
                <button 
                    onClick={() => handleSend()}
                    disabled={isLoading || !input.trim()}
                    className="absolute right-2 p-2 bg-kazakh-sky text-white rounded-lg hover:bg-sky-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md"
                >
                    <Send className="w-5 h-5" />
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default AITutor;
