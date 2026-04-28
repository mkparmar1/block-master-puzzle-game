/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Difficulty } from '../game/blockShapes';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'first-steps', title: 'First Steps', description: 'Place your first block', icon: '🎯' },
  { id: 'clearing-way', title: 'Clearing the Way', description: 'Clear your first line', icon: '🧹' },
  { id: 'combo-master', title: 'Combo Master', description: 'Get a 3x combo', icon: '🔥' },
  { id: 'board-clearer', title: 'Board Clearer', description: 'Clear the entire board', icon: '🌟' },
  { id: 'high-scorer', title: 'High Scorer', description: 'Reach 1000 points', icon: '🏆' },
  { id: 'daily-player', title: 'Daily Player', description: 'Complete a daily challenge', icon: '📅' },
];

interface CheckContext {
  score: number;
  combo: number;
  difficulty: Difficulty;
  boardCleared: boolean;
  linesCleared: number;
  usedRefresh: boolean;
  blocksPlaced: number;
  dailyStreak: number;
  existingIds: string[];
}

export const checkAchievements = (ctx: CheckContext): Achievement[] => {
  const newAchievements: Achievement[] = [];

  const addIfNew = (id: string) => {
    if (!ctx.existingIds.includes(id)) {
      const ach = ACHIEVEMENTS.find(a => a.id === id);
      if (ach) newAchievements.push(ach);
    }
  };

  if (ctx.blocksPlaced >= 1) addIfNew('first-steps');
  if (ctx.linesCleared >= 1) addIfNew('clearing-way');
  if (ctx.combo >= 3) addIfNew('combo-master');
  if (ctx.boardCleared) addIfNew('board-clearer');
  if (ctx.score >= 1000) addIfNew('high-scorer');
  if (ctx.dailyStreak >= 1) addIfNew('daily-player');

  return newAchievements;
};
