/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { motion, animate } from 'motion/react';
import { useGameStore, ScoreRecord } from '../store/useGameStore';
import { usePlayerStore } from '../store/usePlayerStore';
import { SvgIcon, SvgIconId } from '../components/SvgIcon';
import { SvgButton } from '../components/SvgButton';
import { SvgCard } from '../components/SvgCard';

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

const StatCard: React.FC<{ iconId: SvgIconId; label: string; value: number | string; delay: number }> = ({ iconId, label, value, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5, ease: "easeOut" }}
    className="cursor-pointer"
  >
    <SvgCard className="p-4" variant="stone">
      <div className="flex flex-col items-center justify-center text-center">
        <SvgIcon id={iconId} size={24} />
        <p className="font-black text-xl text-white tracking-tight drop-shadow-sm mt-2">{value}</p>
        <p className="text-[9px] text-slate-500 uppercase tracking-widest font-black mt-1">{label}</p>
      </div>
    </SvgCard>
  </motion.div>
);

const RankIcon: React.FC<{ rank: number }> = ({ rank }) => {
  if (rank === 1) return <SvgIcon id="rank" size={18} />;
  if (rank === 2) return <SvgIcon id="leaderboard" size={18} />;
  if (rank === 3) return <SvgIcon id="journey" size={18} />;
  return <span className="text-slate-400 font-black text-sm">{rank}</span>;
};

const ScoreRow: React.FC<{ record: ScoreRecord; rank: number }> = ({ record, rank }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: 0.4 + rank * 0.05 }}
  >
    <SvgCard className="p-4" variant={rank <= 3 ? 'gold-border' : 'stone'}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-8 flex items-center justify-center flex-shrink-0">
            <RankIcon rank={rank} />
          </div>

          <div className="flex-1 min-w-0 text-left">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-slate-950/40 border border-slate-800 text-slate-400">
                {record.difficulty}
              </span>
              <span className="text-[10px] text-slate-400 font-bold bg-slate-950/60 px-2 py-0.5 rounded-full border border-slate-850">
                {record.gridSize}×{record.gridSize}
              </span>
            </div>
            <p className="text-[10px] text-slate-500 font-semibold">{record.date}</p>
          </div>
        </div>

        <div className="text-right">
          <p className="font-black text-xl text-white tracking-tight drop-shadow-sm">
            {record.score.toLocaleString()}
          </p>
          <p className="text-[9px] text-slate-400 uppercase tracking-widest font-bold">pts</p>
        </div>
      </div>
    </SvgCard>
  </motion.div>
);

export const LeaderboardScreen: React.FC<LeaderboardScreenProps> = ({ onBack }) => {
  const { leaderboard, highScore, maxCombo } = useGameStore();
  const { gamesPlayed, totalBlocks } = usePlayerStore();

  const hasPlayed = gamesPlayed > 0 || leaderboard.length > 0;
  const estimatedLines = Math.floor(totalBlocks / 4);

  return (
    <div className="flex flex-col h-full py-5 px-5 relative safe-area-inset overflow-y-auto bg-slate-950">
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
            className="p-3 rounded-2xl flex items-center justify-center bg-slate-900/60 border border-slate-700 shadow-md"
          >
            <SvgIcon id="back" size={24} />
          </motion.button>
          <h1 className="text-3xl font-black text-white tracking-tighter" style={{ textShadow: '0 0 24px rgba(59,130,246,0.8)' }}>RECORDS</h1>
          <div className="w-12 h-12" />
        </div>

        {!hasPlayed ? (
          /* Engaging Empty State */
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <SvgCard className="p-8 text-center" variant="stone">
              <div className="flex flex-col items-center justify-center">
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-amber-400/30 blur-2xl rounded-full scale-150 animate-pulse" />
                  <SvgIcon id="leaderboard" size={80} />
                </div>
                
                <h2 className="text-2xl font-black text-white mb-2 tracking-tight drop-shadow-md">No records yet!</h2>
                <p className="text-slate-300 text-sm mb-8 px-4 font-medium leading-relaxed">
                  The leaderboard is waiting. Play your first game and start breaking records!
                </p>
                
                <SvgButton
                  onClick={onBack}
                  className="w-full py-4 rounded-full"
                  variant="gold"
                >
                  <SvgIcon id="play" size={18} />
                  PLAY NOW
                </SvgButton>
              </div>
            </SvgCard>
          </motion.div>
        ) : (
          /* Stats View */
          <>
            {/* Personal Best Card */}
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.5 }}
            >
              <SvgCard className="p-6 mb-6" variant="gold-border">
                <div className="flex items-center gap-5 relative z-10 text-left">
                  <div className="w-16 h-16 bg-slate-950/60 rounded-2xl flex items-center justify-center border border-slate-800 shadow-inner relative">
                    <SvgIcon id="leaderboard" size={32} />
                  </div>
                  <div>
                    <p className="text-amber-950 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Personal Best</p>
                    <p className="text-5xl font-black tracking-tighter text-amber-950">
                      <CountUp to={highScore} duration={1.5} delay={0.2} />
                    </p>
                  </div>
                </div>
              </SvgCard>
            </motion.div>

            {/* Lifetime Stats Grid */}
            <div className="mb-8">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 flex items-center gap-2 drop-shadow-md px-2 text-left">
                <SvgIcon id="mission" size={12} /> Lifetime Stats
              </p>
              <div className="grid grid-cols-2 gap-3">
                <StatCard 
                  iconId="play" 
                  label="Games Played" 
                  value={gamesPlayed} 
                  delay={0.2} 
                />
                <StatCard 
                  iconId="zap" 
                  label="Highest Combo" 
                  value={maxCombo > 0 ? `x${maxCombo}` : '0'} 
                  delay={0.25} 
                />
                <StatCard 
                  iconId="theme" 
                  label="Blocks Placed" 
                  value={totalBlocks} 
                  delay={0.3} 
                />
                <StatCard 
                  iconId="journey" 
                  label="Lines Cleared" 
                  value={estimatedLines} 
                  delay={0.35} 
                />
              </div>
            </div>

            {/* Top Scores List */}
            {leaderboard.length > 0 && (
              <div className="mb-6">
                <div className="flex justify-between items-end mb-3 px-2">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2 drop-shadow-md">
                    <SvgIcon id="records" size={12} /> Top Scores
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
            
            {/* Achievements Preview */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-6 cursor-pointer"
            >
              <SvgCard className="p-4" variant="stone">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-950/40 border border-slate-800 flex items-center justify-center">
                      <SvgIcon id="stars" size={20} />
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-white text-sm">Achievements</p>
                      <p className="text-xs text-slate-400 mt-0.5">Unlock badges & rewards</p>
                    </div>
                  </div>
                  <div className="rotate-180">
                    <SvgIcon id="back" size={16} />
                  </div>
                </div>
              </SvgCard>
            </motion.div>
          </>
        )}
      </motion.div>
    </div>
  );
};
