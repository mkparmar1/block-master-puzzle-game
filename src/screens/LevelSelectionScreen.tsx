/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useGameStore } from '../store/useGameStore';
import { Difficulty } from '../game/blockShapes';
import { LayoutGrid, Settings2, Play, ChevronLeft } from 'lucide-react';

// Local utility for tailwind class merging
function cn(...classes: any[]) {
  return classes.filter(Boolean).filter(c => typeof c === 'string').join(' ');
}


interface LevelSelectionScreenProps {
  onBack: () => void;
  onStart: () => void;
}

export const LevelSelectionScreen: React.FC<LevelSelectionScreenProps> = ({ onBack, onStart }) => {
  const startGame = useGameStore((state) => state.startGame);
  const [selectedSize, setSelectedSize] = useState(8);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('medium');

  const sizes = [
    { value: 8, label: '8x8', desc: 'Classic' },
    { value: 10, label: '10x10', desc: 'Standard' },
    { value: 12, label: '12x12', desc: 'Expert' },
  ];

  const difficulties: { value: Difficulty; label: string; desc: string; color: string }[] = [
    { value: 'easy', label: 'Easy', desc: 'Simple shapes', color: 'bg-green-500' },
    { value: 'medium', label: 'Medium', desc: 'Balanced', color: 'bg-blue-500' },
    { value: 'hard', label: 'Hard', desc: 'Complex blocks', color: 'bg-red-500' },
  ];

  const handleStart = () => {
    startGame(selectedSize, selectedDifficulty);
    onStart();
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-full py-5 px-5 relative safe-area-inset">
      {/* Animated Background Blocks */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ x: `${Math.random() * 100}%`, y: '110%', rotate: Math.random() * 360 }}
            animate={{ y: '-10%', rotate: Math.random() * 360 + 360 }}
            transition={{ duration: 18 + Math.random() * 12, repeat: Infinity, ease: 'linear', delay: i * 1 }}
            className="absolute w-10 h-10 rounded-xl opacity-20"
            style={{ 
              background: `rgb(var(--color-primary) / 0.1)`, 
              border: `1px solid rgb(var(--color-primary) / 0.2)` 
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="flex items-center gap-4 mb-8">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onBack}
            className="p-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 shadow-lg"
          >
            <ChevronLeft size={24} />
          </motion.button>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">MISSION SETUP</h1>
        </div>

        {/* Grid Size Selection */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4 text-slate-400 dark:text-slate-500 font-bold uppercase text-[10px] tracking-[0.2em]">
            <LayoutGrid size={14} />
            GRID DIMENSIONS
          </div>
          <div className="grid grid-cols-3 gap-3">
            {sizes.map((size) => (
              <motion.button
                key={size.value}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedSize(size.value)}
                className={cn(
                  "p-5 rounded-3xl border-2 transition-all text-center",
                  selectedSize === size.value
                    ? "border-transparent text-white shadow-xl"
                    : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400"
                )}
                style={selectedSize === size.value ? { background: 'var(--gradient-button)' } : {}}
              >
                <div className="text-xl font-black">{size.label}</div>
                <div className="text-[9px] opacity-60 font-bold uppercase tracking-wider">{size.desc}</div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Difficulty Selection */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-4 text-slate-400 dark:text-slate-500 font-bold uppercase text-[10px] tracking-[0.2em]">
            <Settings2 size={14} />
            CHALLENGE LEVEL
          </div>
          <div className="flex flex-col gap-3">
            {difficulties.map((diff) => (
              <motion.button
                key={diff.value}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedDifficulty(diff.value)}
                className={cn(
                  "flex items-center justify-between p-5 rounded-[2rem] border-2 transition-all",
                  selectedDifficulty === diff.value
                    ? "bg-slate-900 dark:bg-white border-slate-900 dark:border-white text-white dark:text-slate-900 shadow-xl"
                    : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400"
                )}
              >
                <div className="flex items-center gap-4">
                  <div className={cn("w-5 h-5 rounded-lg shadow-sm border-2 border-white/20", diff.color)} />
                  <div className="text-left">
                    <div className="font-black text-lg tracking-tight">{diff.label}</div>
                    <div className="text-[10px] opacity-60 font-bold uppercase tracking-widest">{diff.desc}</div>
                  </div>
                </div>
                {selectedDifficulty === diff.value && (
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-10 h-10 rounded-full flex items-center justify-center shadow-lg"
                    style={{ background: 'var(--gradient-button)' }}
                  >
                    <Play size={16} fill="white" className="ml-1" />
                  </motion.div>
                )}
              </motion.button>
            ))}
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleStart}
          className="flex items-center justify-center gap-4 w-full py-6 text-white rounded-[2.5rem] font-black text-2xl shadow-2xl transition-all tracking-tight border border-white/10"
          style={{ background: 'var(--gradient-button)' }}
        >
          <Play size={28} fill="currentColor" />
          START MISSION
        </motion.button>
      </motion.div>

      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" 
        style={{ backgroundColor: `rgb(var(--color-primary) / 0.05)` }}
      />
    </div>
  );
};
