/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { usePlayerStore } from '../store/usePlayerStore';
import confetti from 'canvas-confetti';
import { SvgIcon } from '../components/SvgIcon';
import { SvgCard } from '../components/SvgCard';
import { SvgProgressBar } from '../components/SvgProgressBar';

const getResetTime = () => {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setHours(24, 0, 0, 0);
  const diff = tomorrow.getTime() - now.getTime();
  const h = Math.floor(diff / (1000 * 60 * 60));
  const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  return `${h}h ${m}m`;
};

export const QuestsScreen: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { quests } = usePlayerStore();
  const [resetTime, setResetTime] = useState(getResetTime());

  useEffect(() => {
    const timer = setInterval(() => setResetTime(getResetTime()), 60000);
    return () => clearInterval(timer);
  }, []);

  const completedCount = quests.filter(q => q.completed).length;

  const triggerConfetti = (e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;
    confetti({
      particleCount: 40,
      spread: 70,
      origin: { x, y }
    });
  };

  return (
    <div className="flex flex-col h-full py-5 px-5 relative safe-area-inset overflow-hidden bg-slate-950">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md mx-auto relative z-10 flex flex-col h-full"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6 mt-2 flex-shrink-0">
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onBack}
              className="p-3 rounded-2xl flex items-center justify-center bg-slate-900/60 border border-slate-700 shadow-md"
            >
              <SvgIcon id="back" size={24} />
            </motion.button>
            <div className="text-left">
              <h1 className="text-3xl font-black text-white tracking-tighter" style={{ textShadow: '0 0 24px rgba(59,130,246,0.8)' }}>
                DAILY MISSION
              </h1>
              <p className="text-xs font-bold text-slate-400 mt-0.5 uppercase tracking-widest">
                RESET IN {resetTime}
              </p>
            </div>
          </div>
        </div>

        {/* Milestone Tracker Card */}
        <SvgCard className="p-5 mb-6 flex-shrink-0" variant="gold-border">
          <div className="text-left">
            <h2 className="text-lg font-black text-amber-950 uppercase tracking-wide">
              Daily Streak Chest
            </h2>
            <p className="text-xs text-amber-950/80 mt-1 leading-tight font-medium">
              Complete missions to unlock chest keys and advance daily progression.
            </p>
            <p className="text-sm font-bold mt-3 text-slate-800">
              <span className="text-blue-600 drop-shadow-[0_0_8px_rgba(59,130,246,0.3)]">{completedCount}</span> of {quests.length} Completed
            </p>
          </div>
        </SvgCard>

        {/* Quests List */}
        <div className="space-y-4 pb-10 flex-1 overflow-y-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          <AnimatePresence>
            {quests.map((quest, i) => {
              const isCompleted = quest.completed;
              const isNotStarted = !isCompleted && quest.current === 0;
              const isActive = !isCompleted && quest.current > 0;
              
              let cardVariant: 'stone' | 'gold-border' | 'alert' = 'stone';
              let titleColor = '';

              if (isCompleted) {
                cardVariant = 'gold-border';
                titleColor = 'text-green-700 drop-shadow-[0_0_8px_rgba(74,222,128,0.2)]';
              } else if (isActive) {
                cardVariant = 'gold-border';
                titleColor = 'text-white';
              } else {
                cardVariant = 'stone';
                titleColor = 'text-slate-400';
              }

              return (
                <motion.div
                  key={quest.id}
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  whileTap={isCompleted ? { scale: 0.96 } : { scale: 0.98 }}
                  onClick={isCompleted ? triggerConfetti : undefined}
                  transition={{ delay: i * 0.1, type: 'spring', stiffness: 300, damping: 24 }}
                  className="cursor-pointer"
                >
                  <SvgCard className="p-5" variant={cardVariant}>
                    <div className="flex justify-between items-start mb-5 relative z-10">
                      <div className="flex items-center gap-4">
                        <div className="p-3 rounded-2xl bg-slate-950/40 flex items-center justify-center border border-slate-800">
                          {isCompleted ? <SvgIcon id="mission" size={24} /> : 
                           isNotStarted ? <SvgIcon id="settings" size={24} /> : 
                           <SvgIcon id="journey" size={24} />}
                        </div>
                        <div className="text-left">
                          <h3 className={`font-black text-lg tracking-tight ${titleColor}`}>
                            {quest.description}
                          </h3>
                          <div className="flex items-center gap-1.5 mt-1">
                            <div className="flex items-center gap-1.5 bg-slate-950/40 px-2.5 py-1 rounded-full border border-amber-500/20 shadow-[0_2px_8px_rgba(0,0,0,0.2)]">
                              <SvgIcon id="stars" size={12} />
                              <span className="text-xs font-black text-amber-500">
                                +{quest.rewardXP} XP
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {isCompleted && (
                        <div className="px-3 py-1.5 rounded-full bg-green-500/20 border border-green-400/40 shadow-[0_0_10px_rgba(74,222,128,0.2)]">
                          <span className="text-[10px] font-black text-green-300 tracking-widest uppercase">Done</span>
                        </div>
                      )}
                    </div>

                    {/* Progress bar */}
                    <div className="relative z-10 text-left">
                      <div className="flex justify-between text-xs font-black mb-2 px-1">
                        <span className="uppercase tracking-wider text-[10px] text-slate-400">Progress</span>
                        <span className={isCompleted ? 'text-green-600' : isActive ? 'text-cyan-500' : 'text-slate-500'}>
                          {quest.current} / {quest.target}
                        </span>
                      </div>
                      <SvgProgressBar progress={Math.min(100, (quest.current / quest.target) * 100)} height={10} />
                    </div>
                  </SvgCard>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};
