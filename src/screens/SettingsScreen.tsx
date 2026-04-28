/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, Volume2, VolumeX, Vibrate, Moon, Sun, RotateCcw, Info, Palette, Layers, Lock } from 'lucide-react';
import { useGameStore } from '../store/useGameStore';
import { useThemeStore } from '../store/useThemeStore';
import { usePlayerStore, getRankForXP, getNextRank, BlockSkin, RANKS, getSkinUnlockLevel } from '../store/usePlayerStore';
import { ThemePicker } from '../components/ThemePicker';
import { Volume1 } from 'lucide-react';

// Local utility for tailwind class merging
function cn(...classes: any[]) {
  return classes.filter(Boolean).filter(c => typeof c === 'string').join(' ');
}


interface SettingsScreenProps {
  onBack: () => void;
}

const ToggleRow: React.FC<{
  icon: React.ReactNode;
  label: string;
  sublabel?: string;
  checked: boolean;
  onChange: () => void;
  color?: string;
}> = ({ icon, label, sublabel, checked, onChange, color = 'bg-blue-500' }) => (
  <motion.div
    whileTap={{ scale: 0.98 }}
    className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm"
  >
    <div className="flex items-center gap-3">
      <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center text-white', color)}>
        {icon}
      </div>
      <div>
        <p className="font-bold text-slate-800 dark:text-slate-100 text-sm">{label}</p>
        {sublabel && <p className="text-xs text-slate-400 dark:text-slate-500">{sublabel}</p>}
      </div>
    </div>
    <button
      onClick={onChange}
      className={cn(
        "relative w-12 h-6 rounded-full transition-all duration-300 focus:outline-none",
        checked ? "shadow-inner" : "bg-slate-300 dark:bg-slate-600 shadow-inner"
      )}
      style={checked ? { background: 'var(--gradient-button)' } : {}}
    >
      <motion.div
        animate={{ x: checked ? 24 : 2 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm"
      />
    </button>
  </motion.div>
);

const SKINS: { id: BlockSkin; label: string; sublabel: string; preview: string }[] = [
  { id: 'classic', label: 'Classic', sublabel: 'Bevel & Shine', preview: '🧊' },
  { id: 'neon', label: 'Neon', sublabel: 'Glow Pulse', preview: '⚡' },
  { id: 'crystal', label: 'Crystal', sublabel: 'Frosted Ice', preview: '💎' },
  { id: 'matrix', label: 'Matrix', sublabel: 'Code Rain', preview: '📟' },
  { id: 'gold', label: 'Gold', sublabel: 'Liquid Metal', preview: '👑' },
];

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ onBack }) => {
  const { soundEnabled, hapticEnabled, toggleSound, toggleHaptic, resetProgress, soundVolume, setSoundVolume } = useGameStore();
  const { isDark, toggleDark } = useThemeStore();
  const { blockSkin, setBlockSkin, xp, resetPlayer, highestLevel } = usePlayerStore();
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const rank = getRankForXP(xp);
  const nextRank = getNextRank(xp);

  const handleReset = () => {
    if (showResetConfirm) {
      resetProgress();
      resetPlayer();
      setShowResetConfirm(false);
    } else {
      setShowResetConfirm(true);
      setTimeout(() => setShowResetConfirm(false), 8000);
    }
  };

  return (
    <div className="flex flex-col min-h-full py-5 px-5 relative safe-area-inset">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md mx-auto">

        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={onBack}
            className="p-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 shadow-lg">
            <ChevronLeft size={24} />
          </motion.button>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">SETTINGS</h1>
        </div>

        {/* Player Rank Card */}
        <div className="p-4 rounded-3xl border border-white/10 mb-6 text-white" style={{ background: 'var(--gradient-button)' }}>
          <div className="flex items-center gap-3 mb-3">
            <span className="text-3xl">{rank.emoji}</span>
            <div>
              <p className="font-black text-lg leading-tight">{rank.title}</p>
              <p className="text-white/70 text-xs">{xp.toLocaleString()} XP total</p>
            </div>
          </div>
          <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: nextRank ? `${Math.min(100, ((xp - rank.minXP) / (nextRank.minXP - rank.minXP)) * 100)}%` : '100%' }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="h-full rounded-full bg-white"
            />
          </div>
          {nextRank && (
            <p className="text-white/60 text-[10px] mt-1">{(nextRank.minXP - xp).toLocaleString()} XP to {nextRank.emoji} {nextRank.title}</p>
          )}
        </div>

        {/* Audio & Feel */}
        <div className="mb-7">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 flex items-center gap-2">
            <Volume2 size={12} /> Audio &amp; Feel
          </p>
          <div className="flex flex-col gap-3">
            <ToggleRow icon={soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />} label="Sound Effects"
              sublabel="Block place, clear, and error sounds" checked={soundEnabled} onChange={toggleSound} color="bg-purple-500" />
            {soundEnabled && (
              <div className="flex items-center gap-3 p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white bg-purple-400 flex-shrink-0">
                  <Volume1 size={18} />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-slate-800 dark:text-slate-100 text-sm mb-2">Volume</p>
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.05}
                    value={soundVolume}
                    onChange={(e) => setSoundVolume(parseFloat(e.target.value))}
                    className="w-full h-2 rounded-full appearance-none cursor-pointer"
                    style={{ accentColor: `rgb(var(--color-primary))`, background: `linear-gradient(to right, rgb(var(--color-primary)) ${soundVolume * 100}%, #e2e8f0 ${soundVolume * 100}%)` }}
                  />
                  <div className="flex justify-between text-[9px] text-slate-400 font-bold mt-1">
                    <span>0%</span>
                    <span>{Math.round(soundVolume * 100)}%</span>
                    <span>100%</span>
                  </div>
                </div>
              </div>
            )}
            <ToggleRow icon={<Vibrate size={18} />} label="Haptic Feedback"
              sublabel="Vibration on block place & clear" checked={hapticEnabled} onChange={toggleHaptic} color="bg-green-500" />
          </div>
        </div>

        {/* Block Skin */}
        <div className="mb-7">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 flex items-center gap-2">
            <Layers size={12} /> Block Style
          </p>
          <div className="grid grid-cols-3 gap-2">
            {SKINS.map((skin) => {
              const unlockLevel = getSkinUnlockLevel(skin.id);
              const isUnlocked = highestLevel >= unlockLevel;

              return (
                <motion.button
                  key={skin.id}
                  whileTap={isUnlocked ? { scale: 0.96 } : { x: [-2, 2, -2, 2, 0] }}
                  onClick={() => isUnlocked && setBlockSkin(skin.id)}
                  className={cn(
                    'flex flex-col items-center gap-2 p-3 rounded-2xl border-2 font-bold text-xs transition-all relative overflow-hidden',
                    blockSkin === skin.id
                      ? 'border-transparent text-white shadow-lg'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400',
                    !isUnlocked && 'opacity-60 grayscale-[0.5]'
                  )}
                  style={blockSkin === skin.id ? { background: 'var(--gradient-button)' } : {}}
                >
                  {!isUnlocked && (
                    <div className="absolute top-1 right-1">
                      <Lock size={10} className="text-slate-400" />
                    </div>
                  )}
                  <span className="text-2xl">{skin.preview}</span>
                  <span>{skin.label}</span>
                  <span className="text-[8px] opacity-70 font-normal text-center leading-tight">
                    {isUnlocked ? skin.sublabel : `Level ${unlockLevel} Req`}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Appearance */}
        <div className="mb-7">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 flex items-center gap-2">
            <Palette size={12} /> Appearance
          </p>
          <div className="flex flex-col gap-3">
            <ToggleRow icon={isDark ? <Moon size={18} /> : <Sun size={18} />} label="Dark Mode"
              sublabel="Switch between light and dark" checked={isDark} onChange={toggleDark} color="bg-indigo-500" />
          </div>
          <div className="mt-4">
            <ThemePicker />
          </div>
        </div>

        {/* Data */}
        <div className="mb-7">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 flex items-center gap-2">
            <RotateCcw size={12} /> Data
          </p>
          <motion.button whileTap={{ scale: 0.97 }} onClick={handleReset}
            className={cn(
              'w-full p-4 rounded-2xl border-2 font-bold text-sm transition-all',
              showResetConfirm
                ? 'bg-red-500 border-red-500 text-white shadow-[0_8px_20px_rgba(239,68,68,0.3)]'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-red-500'
            )}>
            {showResetConfirm ? '⚠️ Tap again to confirm reset' : 'Reset All Progress'}
          </motion.button>
        </div>

        {/* About */}
        <div className="flex items-center gap-3 p-4 bg-white/60 dark:bg-slate-900/60 rounded-2xl border border-slate-100 dark:border-slate-800">
          <Info size={18} className="text-slate-400 flex-shrink-0" />
          <div>
            <p className="font-bold text-slate-700 dark:text-slate-300 text-sm">Block Master Puzzle</p>
            <p className="text-xs text-slate-400">v1.4.1 · Built with ❤️</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
