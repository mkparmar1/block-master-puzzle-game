/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, Star, Lock, Crown, Target, Zap, LayoutGrid } from 'lucide-react';
import { usePlayerStore } from '../store/usePlayerStore';
import { CAMPAIGN_LEVELS, CampaignLevel } from '../lib/campaignLevels';

interface JourneyScreenProps {
  onBack: () => void;
  onSelectLevel: (level: CampaignLevel) => void;
}

// Zigzag column positions: 0=left, 1=center, 2=right, 1=center, repeat
const ZIGZAG = [0, 1, 2, 1];

const getTypeIcon = (lvl: CampaignLevel) => {
  if (lvl.targetScore) return <Zap size={10} className="text-amber-400" />;
  if (lvl.targetLines) return <Target size={10} className="text-blue-400" />;
  return <LayoutGrid size={10} className="text-green-400" />;
};

const getTypeLabel = (lvl: CampaignLevel) => {
  if (lvl.targetScore) return `${(lvl.targetScore / 1000).toFixed(0)}k pts`;
  if (lvl.targetLines) return `${lvl.targetLines} lines`;
  return `${lvl.targetBlocks} blks`;
};

export const JourneyScreen: React.FC<JourneyScreenProps> = ({ onBack, onSelectLevel }) => {
  const { highestLevel = 1, stars = 0 } = usePlayerStore();
  const completedCount = Math.max(0, highestLevel - 1);
  const progress = Math.round((completedCount / CAMPAIGN_LEVELS.length) * 100);

  const positionClass = ['justify-start', 'justify-center', 'justify-end'];

  return (
    <div className="flex flex-col h-full p-4 sm:p-6 relative safe-area-inset">
      {/* Animated Background */}
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          background:
            'linear-gradient(45deg, rgb(var(--color-primary) / 0.1) 25%, transparent 25%, transparent 75%, rgb(var(--color-primary) / 0.1) 75%, rgb(var(--color-primary) / 0.1)), linear-gradient(45deg, rgb(var(--color-primary) / 0.1) 25%, transparent 25%, transparent 75%, rgb(var(--color-primary) / 0.1) 75%, rgb(var(--color-primary) / 0.1))',
          backgroundSize: '40px 40px',
          backgroundPosition: '0 0, 20px 20px',
        }}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md mx-auto relative z-10 flex flex-col h-full"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4 flex-shrink-0">
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onBack}
              className="p-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 shadow-lg"
            >
              <ChevronLeft size={24} />
            </motion.button>
            <div>
              <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">JOURNEY</h1>
              <p className="text-xs text-slate-400 font-semibold">
                {completedCount} / {CAMPAIGN_LEVELS.length} Stages
              </p>
            </div>
          </div>

          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="flex items-center gap-2 bg-amber-50 dark:bg-amber-500/10 px-4 py-2 rounded-2xl border border-amber-200 dark:border-amber-500/30"
          >
            <Star size={18} fill="#f59e0b" className="text-amber-500" />
            <span className="text-xl font-black text-amber-600 dark:text-amber-500">{stars}</span>
          </motion.div>
        </div>

        {/* Overall Progress Bar */}
        <div className="mb-4 flex-shrink-0">
          <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">
            <span>Overall Progress</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
              className="h-full rounded-full"
              style={{ background: 'var(--gradient-button)' }}
            />
          </div>
        </div>

        {/* Zigzag Path */}
        <div className="flex-1 overflow-y-auto pb-6 pr-1">
          <div className="flex flex-col gap-3">
            {CAMPAIGN_LEVELS.map((lvl, idx) => {
              const isUnlocked = lvl.id <= highestLevel;
              const isCompleted = lvl.id < highestLevel;
              const isCurrent = lvl.id === highestLevel;
              const isBoss = lvl.id % 10 === 0;
              const zigPos = ZIGZAG[idx % 4];

              return (
                <div key={lvl.id} className={`flex ${positionClass[zigPos]}`}>
                  <motion.button
                    whileHover={isUnlocked ? { scale: 1.08 } : {}}
                    whileTap={isUnlocked ? { scale: 0.94 } : {}}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(idx * 0.02, 0.5) }}
                    onClick={() => isUnlocked && onSelectLevel(lvl)}
                    disabled={!isUnlocked}
                    className={`relative flex flex-col items-center justify-center rounded-2xl border-2 transition-all w-20 sm:w-24 aspect-square ${
                      isCompleted
                        ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-400 dark:border-blue-600'
                        : isCurrent
                        ? 'bg-white dark:bg-slate-800 border-amber-400 shadow-[0_0_18px_rgba(251,191,36,0.45)] animate-pulse-glow'
                        : isUnlocked
                        ? 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600'
                        : 'bg-slate-100 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 opacity-50'
                    } overflow-hidden`}
                  >
                    {/* Boss crown badge */}
                    {isBoss && isUnlocked && (
                      <Crown
                        size={11}
                        className={`mb-0.5 ${isCompleted ? 'text-blue-400' : 'text-amber-400'}`}
                      />
                    )}

                    {isUnlocked ? (
                      <>
                        <span
                          className={`text-lg font-black leading-none ${
                            isCompleted
                              ? 'text-blue-500 dark:text-blue-400'
                              : isCurrent
                              ? 'text-slate-900 dark:text-white'
                              : 'text-slate-600 dark:text-slate-300'
                          }`}
                        >
                          {lvl.id}
                        </span>
                        <div className="flex items-center gap-0.5 mt-1">
                          {getTypeIcon(lvl)}
                          <span className="text-[8px] font-bold text-slate-400">{getTypeLabel(lvl)}</span>
                        </div>
                        {isCompleted && (
                          <Star
                            size={9}
                            fill="#fbbf24"
                            className="text-amber-400 absolute top-1 right-1"
                          />
                        )}
                      </>
                    ) : (
                      <Lock size={18} className="text-slate-400" />
                    )}
                  </motion.button>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
