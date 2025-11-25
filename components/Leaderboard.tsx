import React from 'react';
import { UserState } from '../types';
import { LEADERBOARD_DATA } from '../constants';
import { translations } from '../translations';
import { Medal, Trophy, Star } from 'lucide-react';

interface LeaderboardProps {
  userState: UserState;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ userState }) => {
  const t = translations[userState.language];

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Trophy className="w-6 h-6 text-yellow-500 fill-yellow-500" />;
      case 2: return <Medal className="w-6 h-6 text-gray-400 fill-gray-400" />;
      case 3: return <Medal className="w-6 h-6 text-amber-700 fill-amber-700" />;
      default: return <span className="text-gray-500 font-bold w-6 text-center">{rank}</span>;
    }
  };

  return (
    <div className="max-w-4xl mx-auto w-full">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">{t.leaderboard}</h1>
        <p className="text-slate-500">{t.yourRank}: <span className="font-bold text-kazakh-sky">#156</span></p>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-sm uppercase text-slate-500 font-semibold tracking-wider">
                <th className="p-5 w-20 text-center">{t.rank}</th>
                <th className="p-5">{t.user}</th>
                <th className="p-5 text-center">{t.badges}</th>
                <th className="p-5 text-right">{t.solved}</th>
                <th className="p-5 text-right">{t.points}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {LEADERBOARD_DATA.map((user) => (
                <tr key={user.rank} className="hover:bg-slate-50 transition-colors">
                  <td className="p-5 text-center flex justify-center items-center">
                    {getRankIcon(user.rank)}
                  </td>
                  <td className="p-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-kazakh-sky to-blue-400 text-white flex items-center justify-center font-bold text-sm">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-800">{user.name}</div>
                        <div className="text-xs text-slate-400">{user.country}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-5 text-center">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800 border border-amber-200">
                      <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                      {user.badge}
                    </span>
                  </td>
                  <td className="p-5 text-right font-mono text-slate-600">
                    {user.solved}
                  </td>
                  <td className="p-5 text-right font-bold text-kazakh-sky">
                    {user.points}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;