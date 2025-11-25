
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import ProblemList from './components/ProblemList';
import ProblemWorkspace from './components/ProblemWorkspace';
import Profile from './components/Profile';
import Leaderboard from './components/Leaderboard';
import AITutor from './components/AITutor';
import { PROBLEMS } from './constants';
import { UserState, Language, ChatMessage } from './types';
import { getRecommendedProblem } from './services/geminiService';

const App: React.FC = () => {
  const [userState, setUserState] = useState<UserState>(() => {
    const saved = localStorage.getItem('aiCodeState');
    const defaultState: UserState = {
      solvedProblemIds: [],
      currentProblemId: null,
      codeCache: {},
      language: 'en',
      viewMode: 'list',
      aiTutorHistory: []
    };

    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Merge parsed state with default state to ensure new fields (like aiTutorHistory) exist
        return { 
          ...defaultState, 
          ...parsed,
          aiTutorHistory: Array.isArray(parsed.aiTutorHistory) ? parsed.aiTutorHistory : []
        };
      } catch (e) {
        console.error("Failed to parse saved state", e);
        return defaultState;
      }
    }
    return defaultState;
  });

  const [recommendedId, setRecommendedId] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('aiCodeState', JSON.stringify(userState));
  }, [userState]);

  useEffect(() => {
    const fetchRecommendation = async () => {
      const rec = await getRecommendedProblem(userState.solvedProblemIds, PROBLEMS, userState.language);
      setRecommendedId(rec);
    };
    fetchRecommendation();
  }, [userState.solvedProblemIds, userState.language]);

  const handleSelectProblem = (id: string) => {
    setUserState(prev => ({ ...prev, currentProblemId: id, viewMode: 'list' }));
  };

  const handleNavigateHome = () => {
    setUserState(prev => ({ ...prev, currentProblemId: null, viewMode: 'list' }));
  };

  const handleNavigateProfile = () => {
    setUserState(prev => ({ ...prev, currentProblemId: null, viewMode: 'profile' }));
  };

  const handleNavigateLeaderboard = () => {
    setUserState(prev => ({ ...prev, currentProblemId: null, viewMode: 'leaderboard' }));
  };

  const handleNavigateAITutor = () => {
    setUserState(prev => ({ ...prev, currentProblemId: null, viewMode: 'ai-tutor' }));
  };

  const setLanguage = (lang: Language) => {
    setUserState(prev => ({ ...prev, language: lang }));
  };

  const handleUpdateTutorHistory = (history: ChatMessage[]) => {
    setUserState(prev => ({ ...prev, aiTutorHistory: history }));
  };

  const handleSuccess = (code: string) => {
    setUserState(prev => {
      if (!prev.currentProblemId) return prev;
      const newSolved = prev.solvedProblemIds.includes(prev.currentProblemId) 
        ? prev.solvedProblemIds 
        : [...prev.solvedProblemIds, prev.currentProblemId];
        
      return {
        ...prev,
        solvedProblemIds: newSolved,
        codeCache: { ...prev.codeCache, [prev.currentProblemId]: code }
      };
    });
  };

  const currentProblem = PROBLEMS.find(p => p.id === userState.currentProblemId);

  // Router Logic
  let content;
  if (userState.viewMode === 'profile') {
    content = <Profile userState={userState} onBack={handleNavigateHome} />;
  } else if (userState.viewMode === 'leaderboard') {
    content = <Leaderboard userState={userState} />;
  } else if (userState.viewMode === 'ai-tutor') {
    content = <AITutor userState={userState} onUpdateHistory={handleUpdateTutorHistory} />;
  } else if (currentProblem) {
    content = (
      <ProblemWorkspace 
        problem={currentProblem}
        initialCode={userState.codeCache[currentProblem.id] || currentProblem.starterCode}
        onSuccess={handleSuccess}
        language={userState.language}
      />
    );
  } else {
    content = (
      <ProblemList 
        solvedIds={userState.solvedProblemIds}
        onSelectProblem={handleSelectProblem}
        recommendedId={recommendedId}
        language={userState.language}
      />
    );
  }

  return (
    <Layout 
      onNavigateHome={handleNavigateHome} 
      onNavigateProfile={handleNavigateProfile}
      onNavigateLeaderboard={handleNavigateLeaderboard}
      onNavigateAITutor={handleNavigateAITutor}
      solvedCount={userState.solvedProblemIds.length}
      language={userState.language}
      setLanguage={setLanguage}
      viewMode={userState.viewMode}
    >
      {content}
    </Layout>
  );
};

export default App;
