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
    <div
      className="flex flex-col h-full p-4 sm:p-6 relative safe-area-inset screen-scroll"
      style={{ background: 'linear-gradient(160deg, #0F172A 0%, #0d1f5c 50%, #1E3A8A 100%)', isolation: 'isolate' }}
    >
      {/* Ambient orbs */}
      <div className="fixed top-[10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/15 blur-[100px] pointer-events-none z-[-1]" />
      <div className="fixed bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-purple-500/20 blur-[80px] pointer-events-none z-[-1]" />

      {/* Animated grid background */}
      <div
        className="fixed inset-0 opacity-[0.03] pointer-events-none z-[-1]"
        style={{
          background:
            'linear-gradient(45deg, #ffffff 25%, transparent 25%, transparent 75%, #ffffff 75%, #ffffff), linear-gradient(45deg, #ffffff 25%, transparent 25%, transparent 75%, #ffffff 75%, #ffffff)',
          backgroundSize: '40px 40px',
          backgroundPosition: '0 0, 20px 20px',
        }}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md mx-auto relative z-10 flex flex-col"
        style={{ minHeight: '100%' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4 flex-shrink-0">
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onBack}
              className="p-3 rounded-2xl border border-slate-700 text-slate-300 shadow-lg"
              style={{ background: 'rgba(15,23,42,0.8)', backdropFilter: 'blur(12px)' }}
            >
              <ChevronLeft size={24} />
            </motion.button>
            <div>
              <h1 className="text-3xl font-black text-white tracking-tighter">JOURNEY</h1>
              <p className="text-xs text-slate-400 font-semibold">
                {completedCount} / {CAMPAIGN_LEVELS.length} Stages
              </p>
            </div>
          </div>

          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="flex items-center gap-2 px-4 py-2 rounded-2xl border border-amber-500/30"
            style={{ background: 'rgba(245,158,11,0.1)' }}
          >
            <Star size={18} fill="#f59e0b" className="text-amber-500" />
            <span className="text-xl font-black text-amber-500">{stars}</span>
          </motion.div>
        </div>

        {/* Overall Progress Bar */}
        <div className="mb-4 flex-shrink-0">
          <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">
            <span>Overall Progress</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
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
        <div className="flex flex-col gap-3 pb-8">
          {CAMPAIGN_LEVELS.map((lvl, idx) => {
            const isUnlocked = lvl.id <= highestLevel;
            const isCompleted = lvl.id < highestLevel;
            const isCurrent = lvl.id === highestLevel;
            const isBoss = lvl.id % 10 === 0;
            const zigPos = ZIGZAG[idx % 4];

            let cardBg = '';
            let cardBorder = '';
            let cardShadow = '';
            if (isCompleted) {
              cardBg = 'rgba(29,78,216,0.2)';
              cardBorder = '#2563eb';
            } else if (isCurrent) {
              cardBg = 'rgba(15,23,42,0.95)';
              cardBorder = '#fbbf24';
              cardShadow = '0 0 18px rgba(251,191,36,0.45)';
            } else if (isUnlocked) {
              cardBg = 'rgba(15,23,42,0.8)';
              cardBorder = '#334155';
            } else {
              cardBg = 'rgba(15,23,42,0.4)';
              cardBorder = '#1e293b';
            }

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
                  className={`relative flex flex-col items-center justify-center rounded-2xl border-2 transition-all w-20 sm:w-24 aspect-square overflow-hidden ${!isUnlocked ? 'opacity-50' : ''} ${isCurrent ? 'animate-pulse-glow' : ''}`}
                  style={{ background: cardBg, borderColor: cardBorder, boxShadow: cardShadow }}
                >
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
                            ? 'text-blue-400'
                            : isCurrent
                            ? 'text-white'
                            : 'text-slate-300'
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
                    <Lock size={18} className="text-slate-500" />
                  )}
                </motion.button>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};
