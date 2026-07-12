/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { usePlayerStore } from '../store/usePlayerStore';
import { CAMPAIGN_LEVELS, CampaignLevel } from '../lib/campaignLevels';
import { SvgIcon } from '../components/SvgIcon';
import { SvgCard } from '../components/SvgCard';
import { SvgProgressBar } from '../components/SvgProgressBar';
import { SvgBadge } from '../components/SvgBadge';

interface JourneyScreenProps {
  onBack: () => void;
  onSelectLevel: (level: CampaignLevel) => void;
}

// Zigzag column positions: 0=left, 1=center, 2=right, 1=center, repeat
const ZIGZAG = [0, 1, 2, 1];

const getTypeIconId = (lvl: CampaignLevel) => {
  if (lvl.targetScore) return 'zap';
  if (lvl.targetLines) return 'mission';
  return 'theme';
};

const getTypeLabel = (lvl: CampaignLevel) => {
  if (lvl.targetScore) return `${(lvl.targetScore / 1000).toFixed(0)}k`;
  if (lvl.targetLines) return `${lvl.targetLines} Ls`;
  return `${lvl.targetBlocks} Bs`;
};

export const JourneyScreen: React.FC<JourneyScreenProps> = ({ onBack, onSelectLevel }) => {
  const { highestLevel = 1, stars = 0 } = usePlayerStore();
  const completedCount = Math.max(0, highestLevel - 1);
  const progress = Math.round((completedCount / CAMPAIGN_LEVELS.length) * 100);

  const positionClass = ['justify-start', 'justify-center', 'justify-end'];

  return (
    <div className="flex flex-col h-full p-4 sm:p-6 relative safe-area-inset screen-scroll bg-slate-950 overflow-y-auto">
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
              className="p-3 rounded-2xl bg-slate-900/60 border border-slate-700 shadow-md"
            >
              <SvgIcon id="back" size={24} />
            </motion.button>
            <div className="text-left">
              <h1 className="text-3xl font-black text-white tracking-tighter">JOURNEY</h1>
              <p className="text-xs text-slate-400 font-semibold">
                {completedCount} / {CAMPAIGN_LEVELS.length} Stages
              </p>
            </div>
          </div>

          <SvgBadge type="star" value={stars} />
        </div>

        {/* Overall Progress Bar */}
        <div className="mb-6 flex-shrink-0 text-left">
          <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">
            <span>Overall Progress</span>
            <span>{progress}%</span>
          </div>
          <SvgProgressBar progress={progress} height={10} />
        </div>

        {/* Zigzag Path */}
        <div className="flex flex-col gap-4 pb-8">
          {CAMPAIGN_LEVELS.map((lvl, idx) => {
            const isUnlocked = lvl.id <= highestLevel;
            const isCompleted = lvl.id < highestLevel;
            const isCurrent = lvl.id === highestLevel;
            const isBoss = lvl.id % 10 === 0;
            const zigPos = ZIGZAG[idx % 4];

            let cardVariant: 'stone' | 'gold-border' = 'stone';
            let titleColor = 'text-slate-300';

            if (isCompleted) {
              cardVariant = 'stone';
              titleColor = 'text-blue-300';
            } else if (isCurrent) {
              cardVariant = 'gold-border';
              titleColor = 'text-amber-950';
            } else if (isUnlocked) {
              cardVariant = 'stone';
              titleColor = 'text-slate-200';
            } else {
              cardVariant = 'stone';
              titleColor = 'text-slate-600';
            }

            return (
              <div key={lvl.id} className={`flex ${positionClass[zigPos]}`}>
                <motion.div
                  whileHover={isUnlocked ? { scale: 1.08 } : {}}
                  whileTap={isUnlocked ? { scale: 0.94 } : {}}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(idx * 0.02, 0.5) }}
                  onClick={() => isUnlocked && onSelectLevel(lvl)}
                  className={`w-20 sm:w-24 aspect-square cursor-pointer relative ${!isUnlocked ? 'opacity-40' : ''}`}
                >
                  <SvgCard className="w-full h-full flex flex-col items-center justify-center relative" variant={cardVariant}>
                    {isBoss && isUnlocked && (
                      <div className="absolute -top-1">
                        <SvgIcon id="rank" size={12} />
                      </div>
                    )}

                    {isUnlocked ? (
                      <div className="flex flex-col items-center justify-center p-1 text-center">
                        <span className={`text-xl font-black leading-none ${titleColor}`}>
                          {lvl.id}
                        </span>
                        <div className="flex items-center gap-0.5 mt-1">
                          <SvgIcon id={getTypeIconId(lvl)} size={10} />
                          <span className={`text-[8px] font-black uppercase ${isCurrent ? 'text-amber-950/65' : 'text-slate-400'}`}>
                            {getTypeLabel(lvl)}
                          </span>
                        </div>
                        {isCompleted && (
                          <div className="absolute top-1 right-1">
                            <SvgIcon id="stars" size={10} />
                          </div>
                        )}
                      </div>
                    ) : (
                      <SvgIcon id="settings" size={18} className="text-slate-500" />
                    )}
                  </SvgCard>
                </motion.div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};
