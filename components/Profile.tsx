import React from 'react';
import { UserState } from '../types';
import { PROBLEMS } from '../constants';
import { translations } from '../translations';
import { PieChart, Activity, Zap, Code, Star, Flame, Award } from 'lucide-react';

interface ProfileProps {
  userState: UserState;
  onBack: () => void;
}

const Profile: React.FC<ProfileProps> = ({ userState, onBack }) => {
  const t = translations[userState.language];
  const solvedSet = new Set(userState.solvedProblemIds);
  
  const stats = {
    Easy: PROBLEMS.filter(p => p.difficulty === 'Easy').length,
    Medium: PROBLEMS.filter(p => p.difficulty === 'Medium').length,
    Hard: PROBLEMS.filter(p => p.difficulty === 'Hard').length,
  };

  const solved = {
    Easy: PROBLEMS.filter(p => p.difficulty === 'Easy' && solvedSet.has(p.id)).length,
    Medium: PROBLEMS.filter(p => p.difficulty === 'Medium' && solvedSet.has(p.id)).length,
    Hard: PROBLEMS.filter(p => p.difficulty === 'Hard' && solvedSet.has(p.id)).length,
  };

  const totalSolved = solved.Easy + solved.Medium + solved.Hard;
  const totalProblems = stats.Easy + stats.Medium + stats.Hard;
  const percentage = Math.round((totalSolved / totalProblems) * 100) || 0;

  // Mock Heatmap Data
  const heatmapData = Array.from({ length: 52 * 7 }, (_, i) => Math.random() > 0.7 ? Math.floor(Math.random() * 4) : 0);

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* User Card */}
        <div className="bg-white shadow-sm border border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center text-center relative overflow-hidden">
          <div className="absolute top-0 w-full h-24 bg-gradient-to-r from-kazakh-sky to-blue-500 opacity-10"></div>
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-kazakh-sky to-blue-600 mb-4 flex items-center justify-center text-3xl font-bold text-white shadow-lg z-10 border-4 border-white">
            AI
          </div>
          <h2 className="text-2xl font-bold text-slate-800">Coder</h2>
          <p className="text-slate-500 mb-2">Rank: <span className="text-kazakh-sky font-medium">Nomad</span></p>
          
          <div className="flex gap-2">
            <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-bold flex items-center gap-1">
                <Flame className="w-3 h-3" /> 12 {t.streak}
            </span>
          </div>
        </div>

        {/* Total Progress */}
        <div className="bg-white shadow-sm border border-slate-200 rounded-2xl p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-700 flex items-center gap-2">
              <Activity className="w-5 h-5 text-green-500" />
              {t.totalSolved}
            </h3>
            <span className="text-3xl font-bold text-slate-800">{totalSolved}</span>
          </div>
          <div className="relative h-4 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-kazakh-sky to-green-400 transition-all duration-1000"
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
          <p className="text-right text-sm text-slate-400 mt-2">{percentage}% Complete</p>
        </div>

        {/* Badges */}
        <div className="bg-gradient-to-br from-kazakh-sky to-blue-600 rounded-2xl p-6 text-white relative overflow-hidden">
             <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
             <h3 className="font-semibold text-white/90 mb-4 flex items-center gap-2">
                <Award className="w-5 h-5" /> {t.badges}
            </h3>
            <div className="flex gap-4">
                <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-2xl border border-white/30 backdrop-blur-sm" title="Tulpar: Speed Coding">🦄</div>
                    <span className="text-xs mt-1 font-medium text-white/80">Tulpar</span>
                </div>
                <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-2xl border border-white/30 backdrop-blur-sm" title="Barys: Hard Problems">🐯</div>
                    <span className="text-xs mt-1 font-medium text-white/80">Barys</span>
                </div>
                <div className="flex flex-col items-center opacity-50">
                    <div className="w-12 h-12 bg-black/10 rounded-full flex items-center justify-center text-xl border border-white/10" title="Locked">🔒</div>
                    <span className="text-xs mt-1 font-medium text-white/60">Berkut</span>
                </div>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Difficulty Breakdown */}
        <div className="bg-white shadow-sm border border-slate-200 rounded-2xl p-6 lg:col-span-1">
          <h3 className="text-lg font-semibold text-slate-700 mb-6 flex items-center gap-2">
            <PieChart className="w-5 h-5 text-purple-500" />
            {t.stats}
          </h3>
          <div className="space-y-4">
            {[
              { label: t.easy, val: solved.Easy, total: stats.Easy, color: 'bg-green-500', bg: 'bg-green-100' },
              { label: t.medium, val: solved.Medium, total: stats.Medium, color: 'bg-yellow-500', bg: 'bg-yellow-100' },
              { label: t.hard, val: solved.Hard, total: stats.Hard, color: 'bg-red-500', bg: 'bg-red-100' }
            ].map(item => (
              <div key={item.label}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-600 font-medium">{item.label}</span>
                  <span className="text-slate-400">{item.val} / {item.total}</span>
                </div>
                <div className={`h-2.5 ${item.bg} rounded-full overflow-hidden`}>
                  <div 
                    className={`h-full ${item.color}`} 
                    style={{ width: `${(item.val / item.total) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Heatmap & History */}
        <div className="bg-white shadow-sm border border-slate-200 rounded-2xl p-6 lg:col-span-2 flex flex-col">
            <h3 className="text-lg font-semibold text-slate-700 mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-500" />
                {t.contribution}
            </h3>
            
            {/* Heatmap Grid */}
            <div className="flex gap-1 mb-8 overflow-x-auto pb-2">
                {Array.from({length: 30}).map((_, col) => (
                    <div key={col} className="flex flex-col gap-1">
                        {Array.from({length: 7}).map((_, row) => {
                            const level = Math.random();
                            let color = 'bg-slate-100';
                            if (level > 0.8) color = 'bg-kazakh-sky';
                            else if (level > 0.6) color = 'bg-sky-300';
                            else if (level > 0.3) color = 'bg-sky-100';
                            
                            return <div key={row} className={`w-3 h-3 rounded-sm ${color}`}></div>
                        })}
                    </div>
                ))}
            </div>

            <h3 className="text-md font-semibold text-slate-700 mb-3 flex items-center gap-2">
                <Code className="w-4 h-4 text-slate-400" />
                {t.recentActivity}
            </h3>
            <div className="space-y-3">
                {userState.solvedProblemIds.slice(-3).reverse().map(id => {
                const p = PROBLEMS.find(pr => pr.id === id);
                if (!p) return null;
                return (
                    <div key={id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                        <span className="text-slate-700 font-medium">{p.title}</span>
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                            p.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                            p.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                        }`}>{p.difficulty}</span>
                    </div>
                );
                })}
                {userState.solvedProblemIds.length === 0 && (
                    <p className="text-slate-400 italic text-sm">No problems solved yet.</p>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;