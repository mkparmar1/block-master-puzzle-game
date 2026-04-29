/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { motion, animate } from 'motion/react';
import { ChevronLeft, Trophy, Medal, Crown, Play, Target, Zap, LayoutGrid, Layers, Award, Star } from 'lucide-react';
import { useGameStore, ScoreRecord } from '../store/useGameStore';
import { usePlayerStore } from '../store/usePlayerStore';
import { cn } from '../lib/utils';

interface LeaderboardScreenProps {
  onBack: () => void;
}

const CountUp: React.FC<{ to: number; duration?: number; delay?: number }> = ({ to, duration = 2, delay = 0 }) => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    timeoutId = setTimeout(() => {
      const controls = animate(0, to, {
        duration,
        onUpdate: (v) => setCount(Math.floor(v)),
        ease: "easeOut"
      });
      return controls.stop;
    }, delay * 1000);
    
    return () => clearTimeout(timeoutId);
  }, [to, duration, delay]);
  
  return <>{count.toLocaleString()}</>;
};

const StatCard: React.FC<{ icon: React.ReactNode; label: string; value: number | string; delay: number; color?: string }> = ({ icon, label, value, delay, color = 'text-blue-400' }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5, ease: "easeOut" }}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className="flex flex-col items-center justify-center p-4 rounded-2xl border backdrop-blur-md transition-all duration-300 bg-slate-800/40 border-slate-700/50 shadow-[0_4px_15px_rgba(0,0,0,0.1)] hover:bg-slate-800/60 hover:shadow-[0_8px_25px_rgba(0,0,0,0.2)]"
  >
    <div className={cn("mb-2 drop-shadow-md", color)}>{icon}</div>
    <p className="font-black text-xl text-white tracking-tight drop-shadow-sm">{value}</p>
    <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mt-1 text-center">{label}</p>
  </motion.div>
);

const difficultyColors: Record<string, string> = {
  easy: 'text-green-400 bg-green-500/20 border border-green-500/30',
  medium: 'text-blue-400 bg-blue-500/20 border border-blue-500/30',
  hard: 'text-purple-400 bg-purple-500/20 border border-purple-500/30',
};

const RankIcon: React.FC<{ rank: number }> = ({ rank }) => {
  if (rank === 1) return <Crown size={18} className="text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]" />;
  if (rank === 2) return <Medal size={18} className="text-slate-300 drop-shadow-[0_0_8px_rgba(203,213,225,0.6)]" />;
  if (rank === 3) return <Medal size={18} className="text-amber-700 drop-shadow-[0_0_8px_rgba(180,83,9,0.6)]" />;
  return <span className="text-slate-400 font-black text-sm">{rank}</span>;
};

const ScoreRow: React.FC<{ record: ScoreRecord; rank: number }> = ({ record, rank }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: 0.4 + rank * 0.05 }}
    className={cn(
      "flex items-center gap-4 p-4 rounded-2xl border backdrop-blur-sm transition-all",
      rank <= 3
        ? "bg-slate-800/60 border-amber-500/30 shadow-[0_4px_15px_rgba(245,158,11,0.1)]"
        : "bg-slate-900/40 border-slate-700/50"
    )}
  >
    <div className="w-8 flex items-center justify-center flex-shrink-0">
      <RankIcon rank={rank} />
    </div>

    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2 flex-wrap mb-1">
        <span
          className={cn(
            "text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full shadow-sm",
            difficultyColors[record.difficulty] ?? 'text-slate-400 bg-slate-800 border border-slate-700'
          )}
        >
          {record.difficulty}
        </span>
        <span className="text-[10px] text-slate-300 font-bold bg-slate-800/80 px-2 py-0.5 rounded-full border border-slate-700/50">
          {record.gridSize}×{record.gridSize}
        </span>
      </div>
      <p className="text-[10px] text-slate-500 font-semibold">{record.date}</p>
    </div>

    <div className="text-right">
      <p className="font-black text-xl text-white tracking-tight drop-shadow-sm">
        {record.score.toLocaleString()}
      </p>
      <p className="text-[9px] text-slate-400 uppercase tracking-widest font-bold">pts</p>
    </div>
  </motion.div>
);

export const LeaderboardScreen: React.FC<LeaderboardScreenProps> = ({ onBack }) => {
  const { leaderboard, highScore, maxCombo } = useGameStore();
  const { gamesPlayed, totalBlocks, xp } = usePlayerStore();

  const hasPlayed = gamesPlayed > 0 || leaderboard.length > 0;
  
  // Estimate lines cleared (since it's not persisted globally right now)
  const estimatedLines = Math.floor(totalBlocks / 4);

  return (
    <div className="flex flex-col min-h-full py-5 px-5 relative safe-area-inset overflow-y-auto overflow-x-hidden no-scrollbar" style={{ background: 'linear-gradient(160deg, #0F172A 0%, #0d1f5c 50%, #1E3A8A 100%)', isolation: 'isolate' }}>
      {/* Ambient orbs */}
      <div className="absolute top-[10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/15 blur-[100px] pointer-events-none z-[-1]" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-purple-500/20 blur-[80px] pointer-events-none z-[-1]" />
      
      {/* Glowing dots background */}
      <div className="absolute inset-0 pointer-events-none opacity-20 z-[-1]" style={{
        backgroundImage: 'radial-gradient(circle at 20px 20px, rgba(255,255,255,0.15) 2px, transparent 0)',
        backgroundSize: '80px 80px'
      }} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md mx-auto relative z-10 pb-10"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8 mt-2 w-full">
           <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onBack}
            className="p-3 rounded-full flex items-center justify-center"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
            }}
          >
            <ChevronLeft size={24} className="text-white drop-shadow-md" />
          </motion.button>
          <h1 className="text-3xl font-black text-white tracking-tighter" style={{ textShadow: '0 0 24px rgba(59,130,246,0.8)' }}>RECORDS</h1>
          <div className="w-12 h-12" /> {/* Spacer to center title */}
        </div>

        {!hasPlayed ? (
          /* Engaging Empty State */
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col items-center justify-center mt-12 p-8 rounded-[2rem] border backdrop-blur-xl bg-slate-800/40 border-slate-600/40 shadow-[0_8px_32px_rgba(0,0,0,0.3)] text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 pointer-events-none mix-blend-overlay" />
            
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-amber-400/30 blur-2xl rounded-full scale-150 animate-pulse" />
              <Trophy size={80} className="text-amber-400 drop-shadow-[0_0_15px_rgba(251,191,36,0.8)] relative z-10" />
            </div>
            
            <h2 className="text-2xl font-black text-white mb-2 tracking-tight drop-shadow-md">No records yet!</h2>
            <p className="text-slate-300 text-sm mb-8 px-4 font-medium leading-relaxed">
              The leaderboard is waiting. Play your first game and start breaking records!
            </p>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onBack}
              className="flex items-center gap-2 px-8 py-4 rounded-full font-black text-white shadow-[0_0_20px_rgba(59,130,246,0.5)] overflow-hidden relative group"
              style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)' }}
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              <Play size={18} className="fill-white" />
              PLAY NOW
            </motion.button>
          </motion.div>
        ) : (
          /* Stats View */
          <>
            {/* Personal Best Card */}
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="relative p-6 rounded-[2rem] border backdrop-blur-xl bg-slate-800/60 border-slate-600/50 shadow-[0_8px_32px_rgba(0,0,0,0.4)] mb-6 overflow-hidden group"
              style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.4) 0%, rgba(147,51,234,0.4) 100%)' }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-400/20 pointer-events-none mix-blend-overlay" />
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent mix-blend-overlay pointer-events-none" />
              
              {/* Shine Animation */}
              <div className="absolute inset-0 w-[200%] h-full pointer-events-none" style={{
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                transform: 'skewX(-20deg) translateX(-150%)',
                animation: 'glow-sweep 3s infinite ease-in-out'
              }} />

              <div className="flex items-center gap-5 relative z-10">
                <div className="w-16 h-16 bg-slate-900/60 rounded-2xl flex items-center justify-center border border-white/10 shadow-inner relative">
                  <div className="absolute inset-0 bg-amber-400/30 blur-xl rounded-full" />
                  <Trophy size={32} className="text-amber-400 drop-shadow-[0_0_12px_rgba(251,191,36,0.8)] relative z-10" />
                </div>
                <div>
                  <p className="text-blue-200 text-[10px] font-black uppercase tracking-[0.2em] mb-1 drop-shadow-sm">Personal Best</p>
                  <p className="text-5xl font-black tracking-tighter text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">
                    <CountUp to={highScore} duration={1.5} delay={0.2} />
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Lifetime Stats Grid */}
            <div className="mb-8">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 flex items-center gap-2 drop-shadow-md px-2">
                <Target size={12} /> Lifetime Stats
              </p>
              <div className="grid grid-cols-2 gap-3">
                <StatCard 
                  icon={<Play size={24} />} 
                  label="Games Played" 
                  value={gamesPlayed} 
                  delay={0.2} 
                  color="text-emerald-400"
                />
                <StatCard 
                  icon={<Zap size={24} />} 
                  label="Highest Combo" 
                  value={maxCombo > 0 ? `x${maxCombo}` : '0'} 
                  delay={0.25} 
                  color="text-amber-400"
                />
                <StatCard 
                  icon={<LayoutGrid size={24} />} 
                  label="Blocks Placed" 
                  value={totalBlocks} 
                  delay={0.3} 
                  color="text-blue-400"
                />
                <StatCard 
                  icon={<Layers size={24} />} 
                  label="Lines Cleared" 
                  value={estimatedLines} 
                  delay={0.35} 
                  color="text-purple-400"
                />
              </div>
            </div>

            {/* Top Scores List */}
            {leaderboard.length > 0 && (
              <div className="mb-6">
                <div className="flex justify-between items-end mb-3 px-2">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2 drop-shadow-md">
                    <Award size={12} /> Top Scores
                  </p>
                  <p className="text-[9px] font-bold text-slate-500 uppercase">Top {leaderboard.length}</p>
                </div>
                <div className="flex flex-col gap-2">
                  {leaderboard.slice(0, 5).map((record, i) => (
                    <ScoreRow key={`record-${i}`} record={record} rank={i + 1} />
                  ))}
                </div>
              </div>
            )}
            
            {/* Achievements Preview (Optional extra) */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-6 flex items-center justify-between p-4 rounded-2xl bg-slate-800/40 border border-slate-700/50 backdrop-blur-sm"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center border border-purple-500/30">
                  <Star size={20} className="text-purple-400" />
                </div>
                <div>
                  <p className="font-bold text-white text-sm">Achievements</p>
                  <p className="text-xs text-slate-400 mt-0.5">Unlock badges & rewards</p>
                </div>
              </div>
              <ChevronLeft size={16} className="text-slate-500 rotate-180" />
            </motion.div>
          </>
        )}
      </motion.div>
    </div>
  );
};

