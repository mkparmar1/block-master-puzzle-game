/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, Target, CheckCircle } from 'lucide-react';
import { usePlayerStore } from '../store/usePlayerStore';

export const QuestsScreen: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { quests } = usePlayerStore();

  const completedCount = quests.filter(q => q.completed).length;

  return (
    <div className="flex flex-col min-h-full py-5 px-5 relative safe-area-inset">
      {/* Animated Background */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, black 1px, transparent 0)', backgroundSize: '24px 24px' }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md mx-auto relative z-10"
      >
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onBack}
            className="p-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 shadow-lg"
          >
            <ChevronLeft size={24} />
          </motion.button>
          <div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">DAILY MISSIONS</h1>
            <p className="text-xs text-slate-400 font-semibold">{completedCount} of {quests.length} Completed</p>
          </div>
        </div>

        {/* Quests List */}
        <div className="space-y-4">
          {quests.map((quest, i) => (
            <motion.div
              key={quest.id}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: i * 0.1 }}
              className={`p-5 rounded-[2rem] border ${quest.completed ? 'bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800/30' : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 shadow-xl'}`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${quest.completed ? 'bg-green-100 text-green-600 dark:bg-green-800 dark:text-green-300' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                    {quest.completed ? <CheckCircle size={20} /> : <Target size={20} />}
                  </div>
                  <div>
                    <h3 className={`font-bold ${quest.completed ? 'text-green-700 dark:text-green-400' : 'text-slate-800 dark:text-slate-200'}`}>
                      {quest.description}
                    </h3>
                    <p className="text-[10px] uppercase font-black tracking-widest text-slate-400 mt-1">
                      Reward: <span className="text-blue-500">+{quest.rewardXP} XP</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Progress bar */}
              <div className="relative">
                <div className="flex justify-between text-xs font-bold text-slate-400 mb-1">
                  <span>Progress</span>
                  <span>{quest.current} / {quest.target}</span>
                </div>
                <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, (quest.current / quest.target) * 100)}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className={`h-full ${quest.completed ? 'bg-green-400' : 'bg-blue-400'}`}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};
