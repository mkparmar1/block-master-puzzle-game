/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, Target, CheckCircle, Lock, Star, Zap } from 'lucide-react';
import { usePlayerStore } from '../store/usePlayerStore';
import confetti from 'canvas-confetti';

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
      origin: { x, y },
      colors: ['#4ade80', '#22c55e', '#16a34a', '#facc15'],
      disableForReducedMotion: true
    });
  };

  return (
    <div className="flex flex-col min-h-full py-5 px-5 relative safe-area-inset overflow-hidden" style={{ background: 'linear-gradient(160deg, #0F172A 0%, #0d1f5c 50%, #1E3A8A 100%)', isolation: 'isolate' }}>
      {/* Ambient orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/20 blur-[80px] pointer-events-none z-[-1]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/20 blur-[100px] pointer-events-none z-[-1]" />
      
      {/* Glowing dots background */}
      <div className="absolute inset-0 pointer-events-none opacity-20 z-[-1]" style={{
        backgroundImage: 'radial-gradient(circle at 20px 20px, rgba(255,255,255,0.15) 2px, transparent 0)',
        backgroundSize: '80px 80px'
      }} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md mx-auto relative z-10 flex flex-col h-full"
      >
        {/* Header */}
        <div className="flex flex-col mb-8 mt-2">
          <div className="flex justify-between items-center w-full mb-4">
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
            <div className="px-4 py-2 rounded-full bg-slate-900/60 border border-slate-700/80 backdrop-blur-md flex items-center gap-2 shadow-[0_4px_12px_rgba(0,0,0,0.3)]">
              <Zap size={14} className="text-amber-400" />
              <span className="text-xs font-black tracking-wide text-slate-300">Resets in {resetTime}</span>
            </div>
          </div>
          
          <div className="text-center mt-2">
            <h1 className="text-4xl font-black text-white tracking-tighter" style={{ textShadow: '0 0 24px rgba(59,130,246,0.8)' }}>
              DAILY MISSIONS
            </h1>
            <p className="text-sm font-bold mt-2" style={{ color: 'rgba(148,163,184,0.9)' }}>
              <span className="text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.8)]">{completedCount}</span> of {quests.length} Completed
            </p>
          </div>
        </div>

        {/* Quests List */}
        <div className="space-y-5 pb-10 flex-1 overflow-y-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          <AnimatePresence>
            {quests.map((quest, i) => {
              const isCompleted = quest.completed;
              const isNotStarted = !isCompleted && quest.current === 0;
              const isActive = !isCompleted && quest.current > 0;
              
              let cardStyle = '';
              let progressBg = '';
              let progressFill = '';
              let iconBg = '';
              let iconColor = '';
              let titleColor = '';

              if (isCompleted) {
                cardStyle = 'bg-green-900/25 border-green-400/40 shadow-[0_8px_32px_rgba(34,197,94,0.2)]';
                progressBg = 'bg-green-950/60 border border-green-800/50';
                progressFill = 'bg-gradient-to-r from-green-500 to-lime-400 shadow-[0_0_12px_rgba(74,222,128,0.5)]';
                iconBg = 'bg-green-500/25 shadow-[0_0_20px_rgba(34,197,94,0.5)]';
                iconColor = 'text-green-300';
                titleColor = 'text-green-100 drop-shadow-[0_0_8px_rgba(134,239,172,0.4)]';
              } else if (isActive) {
                cardStyle = 'bg-slate-800/50 border-blue-400/30 shadow-[0_8px_32px_rgba(59,130,246,0.2)]';
                progressBg = 'bg-slate-900/80 border border-slate-700/60 shadow-inner';
                progressFill = 'bg-gradient-to-r from-blue-500 to-cyan-400 shadow-[0_0_12px_rgba(56,189,248,0.5)]';
                iconBg = 'bg-blue-500/20 shadow-[0_0_20px_rgba(59,130,246,0.4)]';
                iconColor = 'text-blue-400';
                titleColor = 'text-white';
              } else {
                cardStyle = 'bg-slate-900/60 border-slate-700/50 opacity-85';
                progressBg = 'bg-slate-900 border border-slate-800/80 shadow-inner';
                progressFill = 'bg-slate-700';
                iconBg = 'bg-slate-800/80';
                iconColor = 'text-slate-500';
                titleColor = 'text-slate-300';
              }

              return (
                <motion.div
                  key={quest.id}
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  whileTap={isCompleted ? { scale: 0.96 } : { scale: 0.98 }}
                  onClick={isCompleted ? triggerConfetti : undefined}
                  transition={{ delay: i * 0.1, type: 'spring', stiffness: 300, damping: 24 }}
                  className={`relative p-5 rounded-[2rem] border backdrop-blur-xl overflow-hidden ${cardStyle} transition-all duration-300`}
                >
                  {/* Subtle inner top highlight */}
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mix-blend-overlay" />

                  {/* Completed Badge overlay effect */}
                  {isCompleted && (
                    <div className="absolute -right-8 -top-8 w-32 h-32 bg-green-400/20 blur-3xl pointer-events-none rounded-full" />
                  )}

                  <div className="flex justify-between items-start mb-5 relative z-10">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-2xl ${iconBg} flex items-center justify-center border border-white/5`}>
                        {isCompleted ? <CheckCircle size={24} className={iconColor} /> : 
                         isNotStarted ? <Lock size={24} className={iconColor} /> : 
                         <Target size={24} className={iconColor} />}
                      </div>
                      <div>
                        <h3 className={`font-black text-lg tracking-tight ${titleColor}`}>
                          {quest.description}
                        </h3>
                        <div className="flex items-center gap-1.5 mt-1">
                          <div className="flex items-center gap-1.5 bg-slate-900/40 px-2.5 py-1 rounded-full border border-amber-500/20 shadow-[0_2px_8px_rgba(0,0,0,0.2)]">
                            <motion.div animate={{ scale: [1, 1.25, 1] }} transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}>
                              <Star size={12} className="text-amber-400 fill-amber-400" style={{ filter: 'drop-shadow(0 0 6px rgba(251,191,36,0.8))' }} />
                            </motion.div>
                            <span className="text-xs font-black text-amber-400" style={{ textShadow: '0 0 10px rgba(251,191,36,0.5)' }}>
                              +{quest.rewardXP} XP
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {isCompleted && (
                      <div className="px-3 py-1.5 rounded-full bg-green-500/20 border border-green-400/40 shadow-[0_0_10px_rgba(74,222,128,0.2)]">
                        <span className="text-[10px] font-black text-green-300 tracking-widest uppercase" style={{ textShadow: '0 0 8px rgba(74,222,128,0.6)' }}>Done</span>
                      </div>
                    )}
                  </div>

                  {/* Progress bar */}
                  <div className="relative z-10">
                    <div className="flex justify-between text-xs font-black mb-2 px-1">
                      <span className="uppercase tracking-wider text-[10px] text-slate-400">Progress</span>
                      <span className={isCompleted ? 'text-green-300 drop-shadow-[0_0_6px_rgba(74,222,128,0.6)]' : isActive ? 'text-cyan-300 drop-shadow-[0_0_6px_rgba(34,211,238,0.5)]' : 'text-slate-500'}>
                        {quest.current} / {quest.target}
                      </span>
                    </div>
                    <div className={`h-3.5 w-full rounded-full overflow-hidden relative ${progressBg}`}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(100, (quest.current / quest.target) * 100)}%` }}
                        transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 + (i * 0.1) }}
                        className={`h-full rounded-full relative ${progressFill}`}
                      >
                         {/* Shine effect on the filled portion */}
                         {(isActive || isCompleted) && (
                            <div className="absolute inset-0 w-full h-full" style={{
                              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)',
                              animation: 'glow-sweep 2.5s infinite ease-in-out'
                            }} />
                         )}
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};
