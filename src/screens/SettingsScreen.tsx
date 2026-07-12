/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useGameStore } from '../store/useGameStore';
import { useThemeStore } from '../store/useThemeStore';
import { usePlayerStore, getRankForXP, getNextRank, BlockSkin, getSkinUnlockLevel } from '../store/usePlayerStore';
import { ThemePicker } from '../components/ThemePicker';
import { SvgIcon, SvgIconId } from '../components/SvgIcon';
import { SvgButton } from '../components/SvgButton';
import { SvgCard } from '../components/SvgCard';
import { SvgProgressBar } from '../components/SvgProgressBar';

interface SettingsScreenProps {
  onBack: () => void;
}

const ToggleRow: React.FC<{
  iconId: SvgIconId;
  label: string;
  sublabel?: string;
  checked: boolean;
  onChange: () => void;
}> = ({ iconId, label, sublabel, checked, onChange }) => (
  <SvgCard className="p-4 mb-2" variant="stone">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-slate-950/40 border border-slate-800 flex-shrink-0">
          <SvgIcon id={iconId} size={18} />
        </div>
        <div className="text-left">
          <p className="font-bold text-white text-sm tracking-wide">{label}</p>
          {sublabel && <p className="text-xs text-slate-400 mt-0.5">{sublabel}</p>}
        </div>
      </div>
      <button
        onClick={onChange}
        className={`relative w-12 h-6 rounded-full transition-all duration-300 focus:outline-none border ${
          checked ? "border-amber-400" : "bg-slate-900 border-slate-700 shadow-inner"
        }`}
        style={checked ? { background: 'var(--gradient-gold)' } : {}}
      >
        <motion.div
          animate={{ x: checked ? 24 : 2 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className={`absolute top-1 w-4 h-4 rounded-full shadow-sm ${checked ? "bg-amber-950" : "bg-slate-500"}`}
        />
      </button>
    </div>
  </SvgCard>
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

  // Calculate rank XP progress percentage
  const progressPercent = nextRank ? Math.min(100, ((xp - rank.minXP) / (nextRank.minXP - rank.minXP)) * 100) : 100;

  return (
    <div className="screen-scroll safe-area-inset bg-slate-950 overflow-y-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md mx-auto relative z-10 px-5 pt-5 pb-safe">

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
          <h1 className="text-3xl font-black text-white tracking-tighter" style={{ textShadow: '0 0 24px rgba(59,130,246,0.8)' }}>SETTINGS</h1>
          <div className="w-12 h-12" />
        </div>

        {/* Player Progression Card */}
        <SvgCard className="p-5 mb-8" variant="gold-border">
          <div className="flex items-center gap-4 mb-5 relative z-10">
            <div className="w-16 h-16 rounded-2xl bg-slate-950/60 border border-slate-800 shadow-inner flex items-center justify-center relative">
              <span className="text-4xl drop-shadow-md relative z-10">{rank.emoji}</span>
            </div>
            <div className="text-left">
              <p className="font-black text-2xl tracking-tight text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]">{rank.title}</p>
              <div className="flex items-center gap-1.5 mt-1">
                <SvgIcon id="stars" size={12} />
                <p className="text-amber-400 font-bold text-xs tracking-wider">
                  {xp.toLocaleString()} XP
                </p>
              </div>
            </div>
          </div>

          <div className="relative z-10 text-left">
             <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 px-1">
                <span>Progress</span>
                <span className="text-amber-400">
                  {nextRank ? `${(nextRank.minXP - xp).toLocaleString()} to next` : 'MAX RANK'}
                </span>
             </div>
             <SvgProgressBar progress={progressPercent} height={10} />
          </div>
        </SvgCard>

        {/* Audio & Feel Section */}
        <div className="mb-8">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 flex items-center gap-2 text-left px-1">
            <SvgIcon id="sound" size={14} /> Audio &amp; Feel
          </p>
          <div className="flex flex-col">
            <ToggleRow iconId={soundEnabled ? 'sound' : 'haptic'} label="Sound Effects"
              sublabel="Block place, clear, and UI sounds" checked={soundEnabled} onChange={toggleSound} />
            
            <AnimatePresence>
              {soundEnabled && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <SvgCard className="p-4 mb-2" variant="stone">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-purple-400 bg-slate-950/40 shadow-inner border border-slate-850 flex-shrink-0">
                        <SvgIcon id="sound" size={18} />
                      </div>
                      <div className="flex-1 pr-2 text-left">
                        <div className="flex justify-between items-center mb-2">
                           <p className="font-bold text-white text-sm tracking-wide">Volume</p>
                           <p className="text-xs font-bold text-purple-300">{Math.round(soundVolume * 100)}%</p>
                        </div>
                        <input
                          type="range"
                          min={0}
                          max={1}
                          step={0.05}
                          value={soundVolume}
                          onChange={(e) => setSoundVolume(parseFloat(e.target.value))}
                          className="w-full h-1.5 rounded-full appearance-none cursor-pointer outline-none"
                          style={{ background: `linear-gradient(to right, #fbbf24 ${soundVolume * 100}%, #1e293b ${soundVolume * 100}%)`, accentColor: '#fbbf24' }}
                        />
                      </div>
                    </div>
                  </SvgCard>
                </motion.div>
              )}
            </AnimatePresence>

            <ToggleRow iconId="haptic" label="Haptic Feedback"
              sublabel="Vibration on block place & clear" checked={hapticEnabled} onChange={toggleHaptic} />
          </div>
        </div>

        {/* Block Skin Section */}
        <div className="mb-8">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 flex items-center gap-2 text-left px-1">
            <SvgIcon id="theme" size={14} /> Block Style
          </p>
          <div className="grid grid-cols-3 gap-3">
            {SKINS.map((skin) => {
              const unlockLevel = getSkinUnlockLevel(skin.id);
              const isUnlocked = highestLevel >= unlockLevel;
              const active = blockSkin === skin.id;

              return (
                <motion.div
                  key={skin.id}
                  whileHover={isUnlocked ? { scale: 1.05 } : {}}
                  whileTap={isUnlocked ? { scale: 0.95 } : { x: [-2, 2, -2, 2, 0] }}
                  onClick={() => isUnlocked && setBlockSkin(skin.id)}
                  className="cursor-pointer relative overflow-hidden"
                >
                  <SvgCard className="p-3" variant={active ? 'gold-border' : 'stone'}>
                    <div className="flex flex-col items-center justify-center text-center">
                      <span className="text-2xl mt-1 drop-shadow-md">{skin.preview}</span>
                      <span
                        className={`text-[9px] font-black uppercase tracking-widest text-center leading-tight mt-1 ${
                          active ? 'text-amber-950' : 'text-slate-400'
                        }`}
                      >
                        {skin.label}
                      </span>
                    </div>
                  </SvgCard>

                  {/* Lock overlay */}
                  <AnimatePresence>
                    {!isUnlocked && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/80 backdrop-blur-sm rounded-2xl gap-1.5 p-2"
                      >
                        <SvgIcon id="close" size={16} className="text-slate-500" />
                        <span className="text-[8px] text-slate-400 text-center font-bold leading-tight tracking-wider">
                          Lvl {unlockLevel}
                        </span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Appearance Section */}
        <div className="mb-8">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 flex items-center gap-2 text-left px-1">
            <SvgIcon id="theme" size={14} /> Appearance
          </p>
          <ThemePicker />
        </div>

        {/* Data Section */}
        <div className="mb-8">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 flex items-center gap-2 text-left px-1">
            <SvgIcon id="refresh" size={14} /> Danger Zone
          </p>
          <motion.div whileTap={{ scale: 0.97 }} onClick={handleReset} className="cursor-pointer">
            <SvgCard className="p-4" variant={showResetConfirm ? 'alert' : 'stone'}>
              <p className={`font-black text-center text-sm ${showResetConfirm ? 'text-red-600' : 'text-slate-400'}`}>
                {showResetConfirm ? '⚠️ Tap again to confirm reset' : 'RESET ALL PROGRESS'}
              </p>
            </SvgCard>
          </motion.div>
        </div>

        {/* About */}
        <div className="flex items-center justify-center gap-2 pt-2 opacity-50">
          <SvgIcon id="journey" size={12} />
          <p className="text-[9px] font-black tracking-widest uppercase text-slate-300">
            Block Master v1.4.1
          </p>
        </div>

      </motion.div>
    </div>
  );
};
