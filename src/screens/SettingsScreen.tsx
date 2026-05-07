/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, Volume2, VolumeX, Vibrate, Moon, Sun, RotateCcw, Info, Palette, Layers, Lock, Star, Volume1, Zap } from 'lucide-react';
import { useGameStore } from '../store/useGameStore';
import { useThemeStore } from '../store/useThemeStore';
import { usePlayerStore, getRankForXP, getNextRank, BlockSkin, RANKS, getSkinUnlockLevel } from '../store/usePlayerStore';
import { ThemePicker } from '../components/ThemePicker';

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
}> = ({ icon, label, sublabel, checked, onChange, color = 'text-blue-400' }) => (
  <motion.div
    whileTap={{ scale: 0.98 }}
    className="flex items-center justify-between p-4 rounded-2xl border backdrop-blur-md transition-all duration-300 bg-slate-800/40 border-slate-700/50 shadow-[0_4px_15px_rgba(0,0,0,0.1)]"
  >
    <div className="flex items-center gap-4">
      <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center bg-slate-900/60 shadow-inner border border-white/5', color)}>
        {icon}
      </div>
      <div>
        <p className="font-bold text-white text-sm tracking-wide">{label}</p>
        {sublabel && <p className="text-xs text-slate-400 mt-0.5">{sublabel}</p>}
      </div>
    </div>
    <button
      onClick={onChange}
      className={cn(
        "relative w-12 h-6 rounded-full transition-all duration-300 focus:outline-none border",
        checked ? "border-transparent shadow-[0_0_12px_rgba(59,130,246,0.6)]" : "bg-slate-900 border-slate-700 shadow-inner"
      )}
      style={checked ? { background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)' } : {}}
    >
      <motion.div
        animate={{ x: checked ? 24 : 2 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        className={cn("absolute top-1 w-4 h-4 rounded-full shadow-sm", checked ? "bg-white" : "bg-slate-500")}
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
    <div className="screen-scroll safe-area-inset" style={{ background: 'linear-gradient(160deg, #0F172A 0%, #0d1f5c 50%, #1E3A8A 100%)', isolation: 'isolate' }}>
      {/* Ambient orbs (fixed so they don't scroll) */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/20 blur-[80px] pointer-events-none z-0" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-500/15 blur-[100px] pointer-events-none z-0" />

      {/* Glowing dots background */}
      <div className="fixed inset-0 pointer-events-none opacity-20 z-0" style={{
        backgroundImage: 'radial-gradient(circle at 20px 20px, rgba(255,255,255,0.15) 2px, transparent 0)',
        backgroundSize: '80px 80px'
      }} />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md mx-auto relative z-10 px-5 pt-5 pb-safe">

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
          <h1 className="text-3xl font-black text-white tracking-tighter" style={{ textShadow: '0 0 24px rgba(59,130,246,0.8)' }}>SETTINGS</h1>
          <div className="w-12 h-12" /> {/* Spacer to center title */}
        </div>

        {/* Player Progression Card */}
        <div className="relative p-5 rounded-[2rem] border backdrop-blur-xl bg-slate-800/40 border-slate-600/40 shadow-[0_8px_32px_rgba(0,0,0,0.3)] mb-8 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 pointer-events-none mix-blend-overlay" />
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mix-blend-overlay pointer-events-none" />
          
          <div className="flex items-center gap-4 mb-5 relative z-10">
            <div className="w-16 h-16 rounded-2xl bg-slate-900/60 border border-slate-700 shadow-inner flex items-center justify-center relative">
              <span className="text-4xl drop-shadow-md relative z-10">{rank.emoji}</span>
              <div className="absolute inset-0 bg-amber-400/20 blur-xl rounded-full" />
            </div>
            <div>
              <p className="font-black text-2xl tracking-tight text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]">{rank.title}</p>
              <div className="flex items-center gap-1.5 mt-1">
                <Star size={12} className="text-amber-400 fill-amber-400" />
                <p className="text-amber-400 font-bold text-xs tracking-wider" style={{ textShadow: '0 0 8px rgba(251,191,36,0.6)' }}>
                  {xp.toLocaleString()} XP
                </p>
              </div>
            </div>
          </div>

          <div className="relative z-10">
             <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 px-1">
                <span>Progress</span>
                <span className="text-blue-300 drop-shadow-[0_0_4px_rgba(147,197,253,0.5)]">
                  {nextRank ? `${(nextRank.minXP - xp).toLocaleString()} to next` : 'MAX RANK'}
                </span>
             </div>
            <div className="h-3.5 w-full bg-slate-900/80 rounded-full border border-slate-700/60 shadow-inner overflow-hidden relative">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: nextRank ? `${Math.min(100, ((xp - rank.minXP) / (nextRank.minXP - rank.minXP)) * 100)}%` : '100%' }}
                transition={{ duration: 1.5, ease: 'easeOut', delay: 0.2 }}
                className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500 relative shadow-[0_0_12px_rgba(168,85,247,0.6)]"
              >
                <div className="absolute inset-0 w-full h-full" style={{
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
                  animation: 'glow-sweep 2.5s infinite ease-in-out'
                }} />
              </motion.div>
            </div>
          </div>
        </div>

        {/* Audio & Feel Section */}
        <div className="mb-8">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 flex items-center gap-2 drop-shadow-md">
            <Volume2 size={12} /> Audio &amp; Feel
          </p>
          <div className="flex flex-col gap-3">
            <ToggleRow icon={soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />} label="Sound Effects"
              sublabel="Block place, clear, and UI sounds" checked={soundEnabled} onChange={toggleSound} color="text-purple-400" />
            
            <AnimatePresence>
              {soundEnabled && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="flex items-center gap-4 p-4 rounded-2xl border backdrop-blur-md transition-all duration-300 bg-slate-800/40 border-slate-700/50 shadow-[0_4px_15px_rgba(0,0,0,0.1)] mt-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-purple-400 bg-slate-900/60 shadow-inner border border-white/5 flex-shrink-0">
                      <Volume1 size={18} />
                    </div>
                    <div className="flex-1 pr-2">
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
                        style={{ background: `linear-gradient(to right, #a855f7 ${soundVolume * 100}%, #1e293b ${soundVolume * 100}%)`, accentColor: '#a855f7' }}
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <ToggleRow icon={<Vibrate size={18} />} label="Haptic Feedback"
              sublabel="Vibration on block place & clear" checked={hapticEnabled} onChange={toggleHaptic} color="text-emerald-400" />
          </div>
        </div>

        {/* Block Skin Section */}
        <div className="mb-8">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 flex items-center gap-2 drop-shadow-md">
            <Layers size={12} /> Block Style
          </p>
          <div className="grid grid-cols-3 gap-3">
            {SKINS.map((skin) => {
              const unlockLevel = getSkinUnlockLevel(skin.id);
              const isUnlocked = highestLevel >= unlockLevel;
              const active = blockSkin === skin.id;

              let cardStyle = '';
              if (active) {
                cardStyle = 'border-transparent shadow-[0_0_15px_rgba(59,130,246,0.5)] bg-slate-800/80';
              } else if (isUnlocked) {
                cardStyle = 'border-slate-700/50 bg-slate-900/60 shadow-lg';
              } else {
                cardStyle = 'border-slate-800/50 bg-slate-900/40 opacity-70 grayscale-[0.3]';
              }

              return (
                <motion.button
                  key={skin.id}
                  whileHover={isUnlocked ? { scale: 1.05 } : {}}
                  whileTap={isUnlocked ? { scale: 0.95 } : { x: [-2, 2, -2, 2, 0] }}
                  onClick={() => isUnlocked && setBlockSkin(skin.id)}
                  className={cn(
                    'relative flex flex-col items-center gap-1.5 p-3 rounded-2xl border transition-all overflow-hidden backdrop-blur-md',
                    cardStyle
                  )}
                  style={{
                    background: active ? 'linear-gradient(135deg, rgba(59,130,246,0.3) 0%, rgba(147,51,234,0.1) 100%)' : undefined,
                    borderColor: active ? 'rgba(59,130,246,0.6)' : undefined,
                  }}
                >
                  {active && (
                    <div className="absolute inset-0 pointer-events-none rounded-2xl border-[1.5px] border-blue-400/80 mix-blend-overlay" />
                  )}
                  
                  <span className="text-2xl mt-1 drop-shadow-md">{skin.preview}</span>
                  <span
                    className={cn(
                      'text-[10px] font-black uppercase tracking-widest text-center leading-tight mt-1',
                      active ? 'text-blue-200 drop-shadow-[0_0_4px_rgba(147,197,253,0.6)]' : 'text-slate-400'
                    )}
                  >
                    {skin.label}
                  </span>

                  {/* Lock overlay */}
                  <AnimatePresence>
                    {!isUnlocked && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/70 backdrop-blur-sm rounded-2xl gap-1.5 p-2 border border-slate-800"
                      >
                        <Lock size={16} className="text-slate-400 drop-shadow-lg" />
                        <span className="text-[9px] text-slate-300 text-center font-bold leading-tight tracking-wider">
                          Level {unlockLevel}
                        </span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Appearance Section */}
        <div className="mb-8">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 flex items-center gap-2 drop-shadow-md">
            <Palette size={12} /> Appearance
          </p>
          {/* <div className="flex flex-col gap-3 mb-4">
            <ToggleRow icon={isDark ? <Moon size={18} /> : <Sun size={18} />} label="Dark Mode"
              sublabel="Switch between light and dark" checked={isDark} onChange={toggleDark} color="text-indigo-400" />
          </div> */}
          <div className="mt-2">
            <ThemePicker />
          </div>
        </div>

        {/* Data Section */}
        <div className="mb-8">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 flex items-center gap-2 drop-shadow-md">
            <RotateCcw size={12} /> Danger Zone
          </p>
          <motion.button 
            whileTap={{ scale: 0.97 }} 
            onClick={handleReset}
            className={cn(
              'w-full p-4 rounded-2xl border font-black tracking-wide text-sm transition-all backdrop-blur-md',
              showResetConfirm
                ? 'bg-red-500/20 border-red-500/50 text-red-400 shadow-[0_0_20px_rgba(239,68,68,0.3)]'
                : 'bg-slate-900/40 border-slate-700/50 text-slate-400 hover:bg-slate-800/60 hover:text-slate-300'
            )}
          >
            {showResetConfirm ? '⚠️ Tap again to confirm reset' : 'RESET ALL PROGRESS'}
          </motion.button>
        </div>

        {/* About */}
        <div className="flex items-center justify-center gap-2 pt-2 opacity-50">
          <Info size={12} className="text-slate-300" />
          <p className="text-[10px] font-bold tracking-widest uppercase text-slate-300">
            Block Master v1.4.1
          </p>
        </div>

      </motion.div>
    </div>
  );
};

