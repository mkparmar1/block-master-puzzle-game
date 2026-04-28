/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { useGameStore } from '../store/useGameStore';
import { motion } from 'motion/react';

export const SoundToggle: React.FC = () => {
  const { soundEnabled, toggleSound, hapticEnabled, toggleHaptic } = useGameStore();

  return (
    <div className="flex gap-4">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={toggleSound}
        className="p-4 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 shadow-xl"
        aria-label={soundEnabled ? 'Disable Sound' : 'Enable Sound'}
      >
        {soundEnabled ? (
          <Volume2 size={24} className="text-blue-400" />
        ) : (
          <VolumeX size={24} className="text-slate-500" />
        )}
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={toggleHaptic}
        className="p-4 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 shadow-xl"
        aria-label={hapticEnabled ? 'Disable Haptics' : 'Enable Haptics'}
      >
        <div className={hapticEnabled ? 'text-amber-400' : 'text-slate-500'}>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M7 2h10" />
            <path d="M5 5h14" />
            <rect width="18" height="11" x="3" y="11" rx="2" />
          </svg>
        </div>
      </motion.button>
    </div>
  );
};
