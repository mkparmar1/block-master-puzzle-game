/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { useGameStore } from '../store/useGameStore';
import { getTodayLabel, getTodayChallengeId } from '../lib/dailySeed';
import { SvgIcon, SvgIconId } from '../components/SvgIcon';
import { SvgButton } from '../components/SvgButton';
import { SvgCard } from '../components/SvgCard';

interface DailyChallengeScreenProps {
  onBack: () => void;
  onStart: () => void;
}

export const DailyChallengeScreen: React.FC<DailyChallengeScreenProps> = ({ onBack, onStart }) => {
  const { startGame, dailyStreak, lastDailyDate } = useGameStore();

  const todayLabel = getTodayLabel();
  const todayDateId = getTodayChallengeId();
  const alreadyPlayed = lastDailyDate === todayDateId;

  const handleStart = () => {
    startGame(8, 'medium', true);
    onStart();
  };

  return (
    <div className="flex flex-col h-full py-5 px-5 relative safe-area-inset overflow-y-auto overflow-x-hidden no-scrollbar bg-slate-950">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md mx-auto relative z-10 flex flex-col pb-6"
      >
        {/* Header */}
        <div className="flex flex-col mb-6 mt-2">
          <div className="flex items-center gap-4 w-full mb-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onBack}
              className="p-3 rounded-2xl flex items-center justify-center bg-slate-900/60 border border-slate-700 shadow-md"
            >
              <SvgIcon id="back" size={24} />
            </motion.button>
          </div>
          <div className="text-left mt-2">
            <h1 className="text-4xl font-black text-white tracking-tighter" style={{ textShadow: '0 0 24px rgba(59,130,246,0.8)' }}>
              DAILY CHALLENGE
            </h1>
            <p className="text-sm font-bold mt-1 text-blue-300">
              {todayLabel}
            </p>
          </div>
        </div>

        {/* Hero Card */}
        <SvgCard className="p-6 mb-6" variant="gold-border">
          <div className="flex items-start justify-between mb-8 relative z-10">
            <div>
              <div className="text-amber-950 text-[10px] font-black uppercase tracking-[0.2em] mb-1.5">
                TODAY'S PUZZLE
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-950/20 flex items-center justify-center border border-amber-950/20">
                  <SvgIcon id="daily" size={18} />
                </div>
                <span className="font-black text-xl tracking-tight text-amber-950">{todayLabel}</span>
              </div>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-2 relative z-10">
            <div className="flex flex-col items-center justify-center py-2 bg-slate-950/40 rounded-xl border border-slate-800">
              <SvgIcon id="daily" size={18} className="mb-1" />
              <p className="text-2xl font-black text-white">{dailyStreak}</p>
              <p className="text-slate-500 text-[9px] font-black uppercase tracking-widest mt-0.5">Streak</p>
            </div>
            
            <div className="flex flex-col items-center justify-center py-2 bg-slate-950/40 rounded-xl border border-slate-800">
              <SvgIcon id="theme" size={18} className="mb-1" />
              <p className="text-2xl font-black text-white">8×8</p>
              <p className="text-slate-500 text-[9px] font-black uppercase tracking-widest mt-0.5">Grid</p>
            </div>
            
            <div className="flex flex-col items-center justify-center py-2 bg-slate-950/40 rounded-xl border border-slate-800">
              <SvgIcon id="zap" size={18} className="mb-1" />
              <p className="text-2xl font-black text-white">Med</p>
              <p className="text-slate-500 text-[9px] font-black uppercase tracking-widest mt-0.5">Difficulty</p>
            </div>
          </div>
        </SvgCard>

        {/* Already played banner */}
        {alreadyPlayed && (
          <SvgCard className="p-4 mb-6" variant="stone">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/10 rounded-full border border-green-500/20">
                <SvgIcon id="leaderboard" size={20} />
              </div>
              <p className="text-green-100 font-bold text-sm leading-tight">
                Challenge completed!<br/><span className="text-slate-400 text-xs font-medium">Come back tomorrow for a new puzzle.</span>
              </p>
            </div>
          </SvgCard>
        )}

        {/* Today's Reward */}
        {!alreadyPlayed && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3 px-1">
              <SvgIcon id="records" size={16} />
              <span className="text-xs font-black uppercase tracking-widest text-slate-300">Today's Reward</span>
            </div>
            <SvgCard className="p-4" variant="stone">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex flex-col items-center justify-center relative overflow-hidden flex-shrink-0">
                  <span className="text-lg font-black text-amber-400 relative z-10">+50</span>
                  <span className="text-[8px] font-black uppercase text-amber-500 relative z-10">XP</span>
                </div>
                <div className="flex-1 text-left">
                  <h4 className="text-sm font-black text-white">Daily Bonus XP</h4>
                  <p className="text-xs text-slate-400 font-medium leading-tight mt-0.5">Complete today's puzzle to earn bonus XP and build your streak!</p>
                </div>
              </div>
            </SvgCard>
          </div>
        )}

        {/* How it works */}
        <div className="mb-8">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 px-1 text-left">How it works</p>
          <div className="space-y-2.5">
            {[
              { iconId: 'journey' as SvgIconId, text: "Same exact puzzle for all players globally." },
              { iconId: 'mission' as SvgIconId, text: "Score as high as possible on the daily board." },
              { iconId: 'daily' as SvgIconId, text: "Play consecutive days to build your streak." },
              { iconId: 'records' as SvgIconId, text: "Unlock Forest Zen theme at 7-day streak." }
            ].map((item, i) => (
              <SvgCard key={i} className="p-3" variant="stone">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-slate-950/40 border border-slate-800">
                    <SvgIcon id={item.iconId} size={16} />
                  </div>
                  <span className="text-xs text-slate-300 font-semibold leading-tight text-left">{item.text}</span>
                </div>
              </SvgCard>
            ))}
          </div>
        </div>

        {/* Start Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="relative z-10 w-full mb-4"
        >
          <SvgButton
            onClick={handleStart}
            className="w-full py-5 rounded-full"
            variant="gold"
          >
            <SvgIcon id="play" size={22} />
            {alreadyPlayed ? 'PLAY AGAIN' : "START TODAY'S CHALLENGE"}
          </SvgButton>
        </motion.div>
      </motion.div>
    </div>
  );
};
