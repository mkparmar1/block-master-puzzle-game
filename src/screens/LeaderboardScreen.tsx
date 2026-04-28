/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, Trophy, Medal, Crown } from 'lucide-react';
import { useGameStore, ScoreRecord } from '../store/useGameStore';
import { cn } from '../lib/utils';

interface LeaderboardScreenProps {
  onBack: () => void;
}

const difficultyColors: Record<string, string> = {
  easy: 'text-green-500 bg-green-500/10',
  medium: 'text-blue-500 bg-blue-500/10',
  hard: 'text-red-500 bg-red-500/10',
};

const RankIcon: React.FC<{ rank: number }> = ({ rank }) => {
  if (rank === 1) return <Crown size={18} className="text-amber-400" />;
  if (rank === 2) return <Medal size={18} className="text-slate-400" />;
  if (rank === 3) return <Medal size={18} className="text-amber-600" />;
  return <span className="text-slate-400 dark:text-slate-500 font-black text-sm">{rank}</span>;
};

const ScoreRow: React.FC<{ record: ScoreRecord; rank: number }> = ({ record, rank }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: rank * 0.05 }}
    className={cn(
      "flex items-center gap-4 p-4 rounded-2xl border transition-all",
      rank <= 3
        ? "bg-white dark:bg-slate-900 border-amber-200/50 dark:border-amber-900/30 shadow-sm"
        : "bg-white/60 dark:bg-slate-900/60 border-slate-100 dark:border-slate-800"
    )}
  >
    <div className="w-8 flex items-center justify-center flex-shrink-0">
      <RankIcon rank={rank} />
    </div>

    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2 flex-wrap">
        <span
          className={cn(
            "text-[10px] font-black uppercase tracking-wide px-2 py-0.5 rounded-full",
            difficultyColors[record.difficulty] ?? 'text-slate-400 bg-slate-100'
          )}
        >
          {record.difficulty}
        </span>
        <span className="text-[10px] text-slate-400 font-semibold">
          {record.gridSize}×{record.gridSize}
        </span>
      </div>
      <p className="text-[10px] text-slate-400 mt-0.5">{record.date}</p>
    </div>

    <div className="text-right">
      <p className="font-black text-xl text-slate-900 dark:text-white tracking-tight">
        {record.score.toLocaleString()}
      </p>
      <p className="text-[10px] text-slate-400 uppercase tracking-widest">pts</p>
    </div>
  </motion.div>
);

export const LeaderboardScreen: React.FC<LeaderboardScreenProps> = ({ onBack }) => {
  const { leaderboard, highScore } = useGameStore();

  return (
    <div className="flex flex-col min-h-full py-5 px-5 relative safe-area-inset">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md mx-auto"
      >
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onBack}
            className="p-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 shadow-lg"
          >
            <ChevronLeft size={24} />
          </motion.button>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">RECORDS</h1>
        </div>

        {/* Personal Best Card */}
        <div
          className="p-5 rounded-3xl border border-white/20 mb-6 text-white shadow-xl animate-pulse-glow"
          style={{ background: 'var(--gradient-button)' }}
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
              <Trophy size={28} className="text-white" />
            </div>
            <div>
              <p className="text-white/70 text-[10px] font-black uppercase tracking-widest">Personal Best</p>
              <p className="text-4xl font-black tracking-tight">{highScore.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Score List */}
        {leaderboard.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Trophy size={48} className="text-slate-300 dark:text-slate-700 mb-4" />
            <p className="font-black text-slate-400 text-lg">No records yet!</p>
            <p className="text-slate-400 text-sm mt-1">Play a game to set your first score.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {leaderboard.map((record, i) => (
              <ScoreRow key={`record-${i}`} record={record} rank={i + 1} />
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};
