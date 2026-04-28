/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type BlockSkin = 'classic' | 'neon' | 'crystal' | 'matrix' | 'gold';

export const getSkinUnlockLevel = (skin: BlockSkin): number => {
  switch (skin) {
    case 'crystal': return 5;
    case 'matrix': return 15;
    case 'gold': return 30;
    default: return 1;
  }
};

export interface RankDef {
  id: string;
  title: string;
  minXP: number;
  emoji: string;
}

export interface Quest {
  id: string;
  description: string;
  target: number;
  current: number;
  rewardXP: number;
  type: 'score' | 'lines' | 'blocks';
  completed: boolean;
}

export const RANKS: RankDef[] = [
  { id: 'novice', title: 'Novice', minXP: 0, emoji: '🌱' },
  { id: 'apprentice', title: 'Apprentice', minXP: 500, emoji: '🔨' },
  { id: 'pro', title: 'Pro', minXP: 2000, emoji: '⚔️' },
  { id: 'expert', title: 'Expert', minXP: 5000, emoji: '🔥' },
  { id: 'master', title: 'Master', minXP: 10000, emoji: '👑' },
  { id: 'grandmaster', title: 'Grandmaster', minXP: 25000, emoji: '🌟' }
];

export const getRankForXP = (xp: number): RankDef => {
  for (let i = RANKS.length - 1; i >= 0; i--) {
    if (xp >= RANKS[i].minXP) return RANKS[i];
  }
  return RANKS[0];
};

export const getNextRank = (xp: number): RankDef | null => {
  for (let i = 0; i < RANKS.length; i++) {
    if (xp < RANKS[i].minXP) return RANKS[i];
  }
  return null; // Max rank achieved
};

interface PlayerState {
  xp: number;
  level: number;
  rank: string;
  gamesPlayed: number;
  totalBlocks: number;
  blockSkin: BlockSkin;
  hasSeenTutorial: boolean;
  highestLevel: number;
  quests: Quest[];
  lastQuestDate: string | null;
  stars: number;
  inventory: {
    hammer: number;
  };
  addStars: (amount: number) => void;
  purchaseItem: (id: 'hammer', cost: number) => boolean;
  consumeItem: (id: 'hammer') => boolean;
  addXP: (amount: number) => void;
  addStats: (blocks: number, games: number) => void;
  syncRank: () => string | null;
  setBlockSkin: (skin: BlockSkin) => void;
  markTutorialSeen: () => void;
  unlockLevel: (levelIndex: number) => void;
  syncQuests: () => void;
  advanceQuest: (type: 'score' | 'lines' | 'blocks', amount: number) => string | null;
  resetPlayer: () => void;
}

export const xpForScore = (score: number, combo: number, difficulty: string): number => {
  const mult = difficulty === 'hard' ? 3 : difficulty === 'medium' ? 2 : 1;
  return Math.floor((score / 10 + combo * 5) * mult);
};

export const usePlayerStore = create<PlayerState>()(
  persist(
    (set, get) => ({
      xp: 0,
      level: 1,
      rank: RANKS[0].title,
      gamesPlayed: 0,
      totalBlocks: 0,
      blockSkin: 'classic',
      hasSeenTutorial: false,
      highestLevel: 1,
      quests: [],
      lastQuestDate: null,
      stars: 50, // Starting bonus
      inventory: { hammer: 1 }, // Starting bonus
      addStars: (amount) => set((s) => ({ stars: s.stars + amount })),
      purchaseItem: (id, cost) => {
        if (get().stars < cost) return false;
        set((s) => ({
          stars: s.stars - cost,
          inventory: { ...s.inventory, [id]: s.inventory[id] + 1 }
        }));
        return true;
      },
      consumeItem: (id) => {
        if (get().inventory[id] <= 0) return false;
        set((s) => ({
          inventory: { ...s.inventory, [id]: s.inventory[id] - 1 }
        }));
        return true;
      },
      addXP: (amount) => {
        const newXP = get().xp + amount;
        const newLevel = Math.floor(Math.sqrt(newXP / 100)) + 1;
        set({ xp: newXP, level: newLevel });
      },
      addStats: (blocks, games) => {
        set((state) => ({
          totalBlocks: state.totalBlocks + blocks,
          gamesPlayed: state.gamesPlayed + games
        }));
      },
      syncRank: () => {
        const currentXP = get().xp;
        const newRank = getRankForXP(currentXP).title;

        if (newRank !== get().rank) {
          set({ rank: newRank });
          return newRank;
        }
        return null;
      },
      setBlockSkin: (skin) => set({ blockSkin: skin }),
      markTutorialSeen: () => set({ hasSeenTutorial: true }),
      unlockLevel: (newLevel) => set((state) => ({ highestLevel: Math.max(state.highestLevel, newLevel) })),
      syncQuests: () => {
        const today = new Date().toISOString().split('T')[0];
        if (get().lastQuestDate !== today) {
          // Generate 3 fresh quests
          set({
            quests: [
              { id: 'q1', type: 'lines', target: 20, current: 0, rewardXP: 100, description: 'Clear 20 lines', completed: false },
              { id: 'q2', type: 'blocks', target: 50, current: 0, rewardXP: 50, description: 'Place 50 blocks', completed: false },
              { id: 'q3', type: 'score', target: 2000, current: 0, rewardXP: 250, description: 'Score 2000 points', completed: false }
            ],
            lastQuestDate: today
          });
        }
      },
      advanceQuest: (type, amount) => {
        let completedQuest = null;
        set((state) => {
          const updatedQuests = state.quests.map((q) => {
            if (!q.completed && q.type === type) {
              const newCurrent = Math.min(q.current + amount, q.target);
              if (newCurrent >= q.target) {
                completedQuest = q.description; // Capture the message
                return { ...q, current: newCurrent, completed: true };
              }
              return { ...q, current: newCurrent };
            }
            return q;
          });
          return { quests: updatedQuests };
        });
        
        // If a quest was actually completed just now, add the XP automatically
        if (completedQuest) {
          const finished: Quest = get().quests.find(q => q.description === completedQuest) as Quest;
          if (finished) get().addXP(finished.rewardXP);
        }
        
        return completedQuest;
      },
      resetPlayer: () => set({ 
        xp: 0, 
        level: 1, 
        rank: RANKS[0].title, 
        gamesPlayed: 0, 
        totalBlocks: 0,
        blockSkin: 'classic',
        hasSeenTutorial: false,
        quests: [],
        lastQuestDate: null
      })
    }),
    { 
      name: 'block-master-player',
      partialize: (state) => ({
        xp: state.xp,
        level: state.level,
        rank: state.rank,
        gamesPlayed: state.gamesPlayed,
        totalBlocks: state.totalBlocks,
        blockSkin: state.blockSkin,
        hasSeenTutorial: state.hasSeenTutorial,
        highestLevel: state.highestLevel,
        quests: state.quests,
        lastQuestDate: state.lastQuestDate,
        stars: state.stars,
        inventory: state.inventory,
      })
    }
  )
);
