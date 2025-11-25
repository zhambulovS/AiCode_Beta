import React, { useMemo, useState } from 'react';
import { PROBLEMS } from '../constants';
import { Problem, Language } from '../types';
import { CheckCircle, Circle, Search, BrainCircuit, Lock, Map, List, ChevronRight } from 'lucide-react';
import Button from './Button';
import { translations } from '../translations';

interface ProblemListProps {
  solvedIds: string[];
  onSelectProblem: (id: string) => void;
  recommendedId: string | null;
  language: Language;
}

const ProblemList: React.FC<ProblemListProps> = ({ solvedIds, onSelectProblem, recommendedId, language }) => {
  const [filter, setFilter] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'path'>('path'); 
  const t = translations[language];

  const filteredProblems = useMemo(() => {
    return PROBLEMS.filter(p => 
      p.title.toLowerCase().includes(filter.toLowerCase()) || 
      p.category.toLowerCase().includes(filter.toLowerCase())
    );
  }, [filter]);

  const recommendedProblem = useMemo(() => {
    return PROBLEMS.find(p => p.id === recommendedId);
  }, [recommendedId]);

  const learningModules = useMemo(() => {
    const modules: Record<string, Problem[]> = {
      'Basics': [],
      'Arrays & Strings': [],
      'Two Pointers': [],
      'Stack & Queue': [],
      'Linked List': [],
      'Trees': [],
      'Dynamic Programming': [],
      'Graphs': [],
      'Backtracking': []
    };

    const categoryMap: Record<string, string> = {
      'Array': 'Arrays & Strings',
      'String': 'Arrays & Strings',
      'Math': 'Basics',
      'Two Pointers': 'Two Pointers',
      'Stack': 'Stack & Queue',
      'Linked List': 'Linked List',
      'Tree': 'Trees',
      'Binary Search': 'Basics',
      'DP': 'Dynamic Programming',
      'Graph': 'Graphs',
      'Heap': 'Trees',
      'Backtracking': 'Backtracking'
    };

    PROBLEMS.forEach(p => {
      const modName = categoryMap[p.category] || 'Basics';
      if (modules[modName]) modules[modName].push(p);
    });

    return modules;
  }, []);

  const moduleKeys = Object.keys(learningModules);

  return (
    <div className="w-full">
      
      {/* Hero / Adaptive Recommendation */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">{t.welcome}</h1>
        <p className="text-slate-500 mb-8 max-w-2xl">
          {t.subtitle}
        </p>

        {recommendedProblem && !solvedIds.includes(recommendedProblem.id) && (
          <div className="bg-white border border-slate-200 rounded-2xl p-1 relative overflow-hidden shadow-lg group">
            {/* Ornament Top Border */}
            <div className="h-2 bg-gradient-to-r from-kazakh-sky to-blue-500 w-full rounded-t-xl"></div>
            
            <div className="p-6 relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <BrainCircuit className="w-5 h-5 text-kazakh-sky" />
                  <span className="text-xs font-bold text-kazakh-sky uppercase tracking-wider">{t.recommended}</span>
                </div>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">{recommendedProblem.title}</h2>
                <div className="flex gap-3 text-sm">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${recommendedProblem.difficulty === 'Easy' ? 'bg-green-100 text-green-700' : recommendedProblem.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                    {recommendedProblem.difficulty}
                  </span>
                  <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full text-xs font-medium">{recommendedProblem.category}</span>
                </div>
              </div>
              <Button onClick={() => onSelectProblem(recommendedProblem.id)} size="lg" className="bg-kazakh-sky hover:bg-sky-600 shadow-md shadow-sky-200 text-white cursor-pointer relative z-20">
                {t.solve}
              </Button>
            </div>
            
            {/* Background decoration */}
            <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-kazakh-sky/5 rounded-full blur-3xl group-hover:bg-kazakh-sky/10 transition-all duration-700 z-0"></div>
          </div>
        )}
      </div>

      {/* View Toggle & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        <div className="flex p-1 bg-slate-200 rounded-lg">
            <button 
                onClick={() => setViewMode('path')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${viewMode === 'path' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
                <Map className="w-4 h-4" /> {t.learningPath}
            </button>
            <button 
                onClick={() => setViewMode('list')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${viewMode === 'list' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
                <List className="w-4 h-4" /> {t.allProblems}
            </button>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder={t.search}
            className="w-full bg-white border border-slate-200 text-slate-800 pl-9 pr-4 py-2 rounded-lg focus:ring-2 focus:ring-kazakh-sky/50 focus:border-kazakh-sky outline-none text-sm placeholder-slate-400 transition-all shadow-sm"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>
      </div>

      {/* Adaptive Path View */}
      {viewMode === 'path' && (
        <div className="space-y-8 relative">
            {/* Line connector */}
            <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-slate-200 hidden md:block z-0"></div>
            
            {moduleKeys.map((moduleName, idx) => {
                const problems = learningModules[moduleName];
                if (problems.length === 0) return null;

                const prevModule = idx > 0 ? learningModules[moduleKeys[idx-1]] : null;
                const prevSolvedCount = prevModule ? prevModule.filter(p => solvedIds.includes(p.id)).length : 0;
                // Unlocking logic: 0th always open. Others open if previous has > 0 solved.
                const isLocked = idx > 0 && prevSolvedCount === 0;

                return (
                    <div key={moduleName} className={`relative pl-0 md:pl-16 transition-all duration-500 ${isLocked ? 'opacity-60 grayscale' : 'opacity-100'}`}>
                        {/* Timeline Node */}
                        <div className={`absolute left-4 top-6 w-5 h-5 rounded-full border-4 border-slate-50 hidden md:block z-10 ${isLocked ? 'bg-slate-300' : 'bg-kazakh-sky shadow-[0_0_0_4px_rgba(224,242,254,1)]'}`}></div>
                        
                        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm relative z-10">
                            <div className="p-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                                <h3 className="text-lg font-bold text-slate-800">{moduleName}</h3>
                                {isLocked ? (
                                    <span className="flex items-center gap-1 text-xs text-slate-500 bg-slate-200 px-2 py-1 rounded">
                                        <Lock className="w-3 h-3" /> {t.locked}
                                    </span>
                                ) : (
                                    <span className="text-xs text-slate-500 font-medium">{problems.filter(p => solvedIds.includes(p.id)).length}/{problems.length} {t.solved}</span>
                                )}
                            </div>
                            
                            {!isLocked ? (
                                <div className="divide-y divide-slate-100">
                                    {problems.map(problem => {
                                        const isSolved = solvedIds.includes(problem.id);
                                        return (
                                            <div key={problem.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors group">
                                                <div className="flex items-center gap-3">
                                                    {isSolved ? (
                                                        <CheckCircle className="w-5 h-5 text-green-500" />
                                                    ) : (
                                                        <Circle className="w-5 h-5 text-slate-300 group-hover:text-kazakh-sky" />
                                                    )}
                                                    <span className="font-medium text-slate-700 group-hover:text-kazakh-sky transition-colors">{problem.title}</span>
                                                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                                                        problem.difficulty === 'Easy' ? 'bg-green-100 text-green-600' :
                                                        problem.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-600' : 'bg-red-100 text-red-600'
                                                    }`}>{problem.difficulty}</span>
                                                </div>
                                                <Button 
                                                    size="sm" 
                                                    variant={isSolved ? 'secondary' : 'primary'}
                                                    className={`cursor-pointer ${isSolved ? "bg-slate-200 text-slate-600 hover:bg-slate-300" : "bg-kazakh-sky text-white hover:bg-sky-600"}`}
                                                    onClick={() => onSelectProblem(problem.id)}
                                                >
                                                    {isSolved ? t.review : t.start}
                                                </Button>
                                            </div>
                                        )
                                    })}
                                </div>
                            ) : (
                                <div className="p-8 text-center text-slate-400 italic bg-slate-50/50">
                                    {t.completePrevious}
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="p-4 font-semibold text-slate-500 text-sm w-16 text-center">{t.status}</th>
                <th className="p-4 font-semibold text-slate-500 text-sm">{t.title}</th>
                <th className="p-4 font-semibold text-slate-500 text-sm">{t.difficulty}</th>
                <th className="p-4 font-semibold text-slate-500 text-sm">{t.category}</th>
                <th className="p-4 font-semibold text-slate-500 text-sm text-right">{t.action}</th>
              </tr>
            </thead>
            <tbody>
              {filteredProblems.map((problem) => {
                const isSolved = solvedIds.includes(problem.id);
                return (
                  <tr 
                    key={problem.id} 
                    className="border-b border-slate-100 hover:bg-sky-50 transition-colors group"
                  >
                    <td className="p-4 text-center">
                      {isSolved ? (
                        <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-300 mx-auto group-hover:text-kazakh-sky" />
                      )}
                    </td>
                    <td className="p-4 font-medium text-slate-700">
                      {problem.title}
                    </td>
                    <td className="p-4">
                      <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                        problem.difficulty === 'Easy' ? 'bg-green-100 text-green-600' :
                        problem.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-600' :
                        'bg-red-100 text-red-600'
                      }`}>
                        {problem.difficulty}
                      </span>
                    </td>
                    <td className="p-4 text-slate-500 text-sm">
                      {problem.category}
                    </td>
                    <td className="p-4 text-right">
                      <Button 
                        size="sm"
                        className={isSolved ? "bg-slate-200 text-slate-600 hover:bg-slate-300" : "bg-kazakh-sky text-white hover:bg-sky-600"}
                        onClick={() => onSelectProblem(problem.id)}
                      >
                        {isSolved ? t.review : t.solve}
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      )}
    </div>
  );
};

export default ProblemList;