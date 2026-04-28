/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  Grid, 
  createEmptyGrid, 
  canPlaceBlock, 
  placeBlock, 
  checkLines, 
  isGameOver 
} from '../game/gridLogic';
import { BlockTemplate, getRandomBlocks, Difficulty } from '../game/blockShapes';
import { Achievement, checkAchievements } from '../lib/achievements';
import { getTodayChallengeId } from '../lib/dailySeed';
import { CampaignLevel } from '../lib/campaignLevels';

export interface ScoreRecord {
  score: number;
  gridSize: number;
  difficulty: Difficulty;
  date: string;
}

interface HistorySnapshot {
  grid: Grid;
  availableBlocks: BlockTemplate[];
  score: number;
  combo: number;
  refreshCharges: number;
}

interface GameState {
  grid: Grid;
  gridSize: number;
  difficulty: Difficulty;
  score: number;
  highScore: number;
  availableBlocks: BlockTemplate[];
  isGameOver: boolean;
  isStageCleared: boolean;
  soundEnabled: boolean;
  soundVolume: number; // 0.0 – 1.0
  hapticEnabled: boolean;
  lastClearedLines: number;
  refreshCharges: number;
  noMovesLeft: boolean;
  combo: number;
  maxCombo: number;
  encouragementMessage: string | null;
  lastInvalidAction: { type: 'occupied' | 'out-of-bounds'; timestamp: number } | null;
  
  // Undo
  history: HistorySnapshot[];
  undoCharges: number;
  usedRefresh: boolean;

  // Stats (current session)
  blocksPlaced: number;
  totalLinesCleared: number;
  boardClears: number;

  // Achievements & Leaderboard
  unlockedAchievementIds: string[];
  newAchievements: Achievement[];
  leaderboard: ScoreRecord[];

  // Daily Challenge & Time Attack
  dailyChallengeId: string | null;
  dailyStreak: number;
  lastDailyDate: string | null;
  isDailyChallenge: boolean;
  timeLeft: number | null; // Null if endless mode, >0 if time attack
  journeyLevel: CampaignLevel | null; // Tracks current campaign stage constraints
  
  // Actions
  startGame: (size: number, difficulty: Difficulty, isDaily?: boolean) => void;
  placeBlock: (blockId: string, row: number, col: number, shape?: number[][]) => boolean;
  refreshBlocks: () => boolean;
  undoMove: () => boolean;
  toggleSound: () => void;
  setSoundVolume: (vol: number) => void;
  toggleHaptic: () => void;
  resetGame: () => void;
  setInvalidAction: (type: 'occupied' | 'out-of-bounds') => void;
  clearNewAchievements: () => void;
  completeDailyChallenge: () => void;
  resetProgress: () => void;
  setJourneyLevel: (level: CampaignLevel | null) => void;
  
  // Timer Actions
  decrementTime: () => void;
  addTime: (seconds: number) => void;
  removeCell: (row: number, col: number) => void;
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      grid: createEmptyGrid(8),
      gridSize: 8,
      difficulty: 'medium',
      score: 0,
      highScore: 0,
      availableBlocks: [],
      isGameOver: false,
      isStageCleared: false,
      soundEnabled: true,
      soundVolume: 0.6,
      hapticEnabled: true,
      lastClearedLines: 0,
      refreshCharges: 3,
      noMovesLeft: false,
      combo: 0,
      maxCombo: 0,
      encouragementMessage: null,
      lastInvalidAction: null,
      history: [],
      undoCharges: 3,
      usedRefresh: false,
      blocksPlaced: 0,
      totalLinesCleared: 0,
      boardClears: 0,
      unlockedAchievementIds: [],
      newAchievements: [],
      leaderboard: [],
      dailyChallengeId: null,
      dailyStreak: 0,
      lastDailyDate: null,
      isDailyChallenge: false,
      timeLeft: null,
      journeyLevel: null,

      startGame: (size, difficulty, isDaily = false) => {
        set({
          grid: createEmptyGrid(size),
          gridSize: size,
          difficulty,
          score: 0,
          availableBlocks: getRandomBlocks(3, difficulty),
          isGameOver: false,
          isStageCleared: false,
          lastClearedLines: 0,
          refreshCharges: 3,
          noMovesLeft: false,
          combo: 0,
          maxCombo: 0,
          encouragementMessage: null,
          lastInvalidAction: null,
          history: [],
          undoCharges: 3,
          usedRefresh: false,
          blocksPlaced: 0,
          totalLinesCleared: 0,
          boardClears: 0,
          newAchievements: [],
          isDailyChallenge: isDaily,
          dailyChallengeId: isDaily ? getTodayChallengeId() : null,
          timeLeft: isDaily ? 120 : null,
          journeyLevel: null,
        });
      },

      placeBlock: (blockId, row, col, shape) => {
        const state = get();
        const blockIndex = state.availableBlocks.findIndex((b) => b.id === blockId);
        if (blockIndex === -1) return false;

        const block = state.availableBlocks[blockIndex];
        const blockShape = shape || block.shape;
        if (!canPlaceBlock(state.grid, blockShape, row, col)) return false;

        // Save history snapshot before placing
        const snapshot: HistorySnapshot = {
          grid: state.grid.map(r => [...r]),
          availableBlocks: state.availableBlocks.map(b => ({ ...b, shape: b.shape.map(r => [...r]) })),
          score: state.score,
          combo: state.combo,
          refreshCharges: state.refreshCharges,
        };
        const newHistory = [snapshot, ...state.history].slice(0, 5); // keep 5

        // Place the block
        let newGrid = placeBlock(state.grid, blockShape, block.color, row, col);
        const newBlocksPlaced = state.blocksPlaced + 1;
        
        // Calculate points for placement
        const placementPoints = blockShape.flat().filter(v => v === 1).length * 10;
        
        // Check for cleared lines
        const { newGrid: clearedGrid, clearedLines } = checkLines(newGrid);
        const newTotalLinesCleared = state.totalLinesCleared + clearedLines;

        let newCombo = state.combo;
        let linePoints = 0;
        let encouragement = null;
        let newBoardClears = state.boardClears;
        
        if (clearedLines > 0) {
          newCombo += 1;
          linePoints = clearedLines * 100 * newCombo;
          
          if (clearedLines >= 3) encouragement = 'INCREDIBLE!';
          else if (clearedLines === 2) encouragement = 'AMAZING!';
          else if (clearedLines === 1) encouragement = 'GREAT!';
          
          // Check for total board clear
          const isBoardEmpty = clearedGrid.every(r => r.every(cell => cell === null));
          if (isBoardEmpty) {
            linePoints += 1000;
            newBoardClears += 1;
            encouragement = '🌟 BOARD CLEAR! +1000';
          }
        } else {
          newCombo = 0;
        }
        
        if (newCombo >= 3 && !encouragement) encouragement = 'UNSTOPPABLE!';

        const newScore = state.score + placementPoints + linePoints;
        const newHighScore = Math.max(newScore, state.highScore);
        const newMaxCombo = Math.max(newCombo, state.maxCombo);

        // Remove the used block
        const newAvailableBlocks = [...state.availableBlocks];
        newAvailableBlocks.splice(blockIndex, 1);

        // If no blocks left, get new ones
        const finalAvailableBlocks = newAvailableBlocks.length === 0
          ? getRandomBlocks(3, state.difficulty)
          : newAvailableBlocks;

        // Check for game over
        const noMoves = isGameOver(clearedGrid, finalAvailableBlocks);
        const gameOver = noMoves && state.refreshCharges === 0 && state.undoCharges === 0;

        // Check achievements
        const newlyEarned = checkAchievements({
          score: newScore,
          combo: newCombo,
          difficulty: state.difficulty,
          boardCleared: newBoardClears > state.boardClears,
          linesCleared: clearedLines,
          usedRefresh: state.usedRefresh,
          blocksPlaced: newBlocksPlaced,
          dailyStreak: state.dailyStreak,
          existingIds: state.unlockedAchievementIds,
        });

        // Save leaderboard record if game over
        let newLeaderboard = state.leaderboard;
        if (gameOver) {
          const record: ScoreRecord = {
            score: newScore,
            gridSize: state.gridSize,
            difficulty: state.difficulty,
            date: new Date().toLocaleDateString(),
          };
          newLeaderboard = [...state.leaderboard, record]
            .sort((a, b) => b.score - a.score)
            .slice(0, 10);
        }

        if (clearedLines > 0 && state.isDailyChallenge) {
          get().addTime(clearedLines * 5); // Time attack bonus!
        }

        // Check Journey Mode Victory
        let stageCleared = state.isStageCleared;
        if (state.journeyLevel && !stageCleared) {
          const jl = state.journeyLevel;
          if (jl.targetScore && newScore >= jl.targetScore) stageCleared = true;
          if (jl.targetLines && newTotalLinesCleared >= jl.targetLines) stageCleared = true;
          if (jl.targetBlocks && newBlocksPlaced >= jl.targetBlocks) stageCleared = true;
        }

        set({
          grid: clearedGrid,
          score: newScore,
          highScore: newHighScore,
          availableBlocks: finalAvailableBlocks,
          isGameOver: gameOver,
          isStageCleared: stageCleared,
          lastClearedLines: clearedLines,
          noMovesLeft: noMoves,
          combo: newCombo,
          maxCombo: newMaxCombo,
          encouragementMessage: encouragement,
          history: newHistory,
          blocksPlaced: newBlocksPlaced,
          totalLinesCleared: newTotalLinesCleared,
          boardClears: newBoardClears,
          unlockedAchievementIds: [
            ...state.unlockedAchievementIds,
            ...newlyEarned.map(a => a.id),
          ],
          newAchievements: newlyEarned,
          leaderboard: newLeaderboard,
        });

        if (encouragement) {
          setTimeout(() => set({ encouragementMessage: null }), 2000);
        }

        return true;
      },

      refreshBlocks: () => {
        const state = get();
        if (state.refreshCharges <= 0 || state.isGameOver) return false;

        const newBlocks = getRandomBlocks(3, state.difficulty);
        const noMoves = isGameOver(state.grid, newBlocks);
        const newCharges = state.refreshCharges - 1;
        const gameOver = noMoves && newCharges === 0 && state.undoCharges === 0;

        set({
          availableBlocks: newBlocks,
          refreshCharges: newCharges,
          isGameOver: gameOver,
          noMovesLeft: noMoves,
          usedRefresh: true,
        });
        return true;
      },

      undoMove: () => {
        const state = get();
        if (state.undoCharges <= 0 || state.history.length === 0 || state.isGameOver) return false;

        const [last, ...rest] = state.history;
        set({
          grid: last.grid,
          availableBlocks: last.availableBlocks,
          score: last.score,
          combo: last.combo,
          refreshCharges: last.refreshCharges,
          history: rest,
          undoCharges: state.undoCharges - 1,
          isGameOver: false,
          noMovesLeft: false,
        });
        return true;
      },

      toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled })),
      setSoundVolume: (vol) => set({ soundVolume: Math.max(0, Math.min(1, vol)) }),
      toggleHaptic: () => set((state) => ({ hapticEnabled: !state.hapticEnabled })),
      
      resetGame: () => {
        const state = get();
        set({
          grid: createEmptyGrid(state.gridSize),
          score: 0,
          availableBlocks: getRandomBlocks(3, state.difficulty),
          isGameOver: false,
          refreshCharges: 3,
          combo: 0,
          maxCombo: 0,
          encouragementMessage: null,
          lastInvalidAction: null,
          history: [],
          undoCharges: 3,
          usedRefresh: false,
          blocksPlaced: 0,
          totalLinesCleared: 0,
          boardClears: 0,
          newAchievements: [],
        });
      },

      setInvalidAction: (type) => {
        set({ lastInvalidAction: { type, timestamp: Date.now() } });
        setTimeout(() => {
          const state = get();
          if (state.lastInvalidAction?.type === type) {
            set({ lastInvalidAction: null });
          }
        }, 2000);
      },

      clearNewAchievements: () => set({ newAchievements: [] }),

      completeDailyChallenge: () => {
        const state = get();
        const todayId = getTodayChallengeId();
        if (state.dailyChallengeId === todayId && state.lastDailyDate !== todayId) {
          // Check if streak continues (was last played yesterday)
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const yesterdayId = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;
          const streak = state.lastDailyDate === yesterdayId ? state.dailyStreak + 1 : 1;
          set({ lastDailyDate: todayId, dailyStreak: streak });
        }
      },

      resetProgress: () => {
        set({
          highScore: 0,
          leaderboard: [],
          unlockedAchievementIds: [],
          dailyStreak: 0,
          lastDailyDate: null,
          score: 0,
        });
      },

      setJourneyLevel: (level) => set({ journeyLevel: level }),
      
      decrementTime: () => {
        const { timeLeft, isGameOver } = get();
        if (timeLeft !== null && timeLeft > 0 && !isGameOver) {
          const newTime = timeLeft - 1;
          set({ timeLeft: newTime, isGameOver: newTime <= 0 });
        }
      },

      addTime: (seconds) => {
        const { timeLeft, isGameOver } = get();
        if (timeLeft !== null && !isGameOver) {
          set({ timeLeft: Math.min(timeLeft + seconds, 120) }); // Cap at 120 secs max
        }
      },

      removeCell: (row, col) => {
        const state = get();
        if (state.isGameOver) return;

        const newGrid = state.grid.map((r, ri) => 
          r.map((c, ci) => (ri === row && ci === col ? null : c))
        );

        // Check for lines cleared after deletion (though usually only 1 cell changes, 
        // it might complete multiple lines if that was the last cell needed).
        const { newGrid: clearedGrid, clearedLines } = checkLines(newGrid);
        
        let newScore = state.score;
        let newTotalLines = state.totalLinesCleared;
        let newCombo = state.combo;

        if (clearedLines > 0) {
          newCombo += 1;
          newScore += clearedLines * 100 * newCombo;
          newTotalLines += clearedLines;
        }

        set({
          grid: clearedGrid,
          score: newScore,
          totalLinesCleared: newTotalLines,
          combo: newCombo,
          lastClearedLines: clearedLines,
        });

        if (clearedLines > 0) {
          setTimeout(() => set({ encouragementMessage: 'SMASH!' }), 100);
          setTimeout(() => set({ encouragementMessage: null }), 1600);
        }
      },
    }),
    {
      name: 'block-master-storage',
      partialize: (state) => ({ 
        highScore: state.highScore, 
        soundEnabled: state.soundEnabled,
        soundVolume: state.soundVolume,
        hapticEnabled: state.hapticEnabled,
        grid: state.grid,
        gridSize: state.gridSize,
        difficulty: state.difficulty,
        score: state.score,
        availableBlocks: state.availableBlocks,
        refreshCharges: state.refreshCharges,
        combo: state.combo,
        undoCharges: state.undoCharges,
        unlockedAchievementIds: state.unlockedAchievementIds,
        leaderboard: state.leaderboard,
        dailyStreak: state.dailyStreak,
        lastDailyDate: state.lastDailyDate,
        maxCombo: state.maxCombo,
        isStageCleared: state.isStageCleared,
        journeyLevel: state.journeyLevel,
      }),
    }
  )
);
