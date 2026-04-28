/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Difficulty } from '../game/blockShapes';

export interface CampaignLevel {
  id: number;
  difficulty: Difficulty;
  gridSize: number;
  targetScore?: number;
  targetLines?: number;
  targetBlocks?: number;
}

export const CAMPAIGN_LEVELS: CampaignLevel[] = Array.from({ length: 50 }, (_, i) => {
  const levelNum = i + 1;
  const isBossLevel = levelNum % 10 === 0;
  const isHard = levelNum % 5 === 0 && !isBossLevel;

  let difficulty: Difficulty = 'easy';
  if (levelNum > 10) difficulty = 'medium';
  if (levelNum > 30) difficulty = 'hard';
  if (isHard) difficulty = 'hard';
  if (isBossLevel) difficulty = 'hard';

  // Base generator logic to scale goals continuously and cleanly
  const targetTypeRoll = levelNum % 3;
  let targetScore: number | undefined;
  let targetLines: number | undefined;
  let targetBlocks: number | undefined;

  if (targetTypeRoll === 0) {
    targetScore = levelNum * 500 + (isBossLevel ? 5000 : 0);
  } else if (targetTypeRoll === 1) {
    targetLines = levelNum * 2 + (isBossLevel ? 10 : 0);
  } else {
    targetBlocks = levelNum * 10 + (isBossLevel ? 30 : 0);
  }

  // Force level 1, 2, 3 as easy introductions
  if (levelNum === 1) { targetScore = 500; targetLines = undefined; targetBlocks = undefined; difficulty = 'easy'; }
  if (levelNum === 2) { targetLines = 3; targetScore = undefined; targetBlocks = undefined; difficulty = 'easy'; }
  if (levelNum === 3) { targetBlocks = 15; targetScore = undefined; targetLines = undefined; difficulty = 'easy'; }

  return {
    id: levelNum,
    difficulty,
    gridSize: levelNum < 5 ? 8 : 10,
    targetScore,
    targetLines,
    targetBlocks
  };
});
