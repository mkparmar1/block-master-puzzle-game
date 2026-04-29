/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useGameStore } from '../store/useGameStore';
import { usePlayerStore, xpForScore } from '../store/usePlayerStore';
import { Grid } from '../components/Grid';
import { DraggableBlock } from '../components/DraggableBlock';
import { ScoreBoard } from '../components/ScoreBoard';
import { AchievementToast } from '../components/AchievementToast';
import { LineClearBurst, ComboFlash, BoardClearFlash, PlaceRipple, FloatingXP } from '../components/ParticleEffect';
import { useThemeStore } from '../store/useThemeStore';
import { canPlaceBlock } from '../game/gridLogic';
import { StarShop } from '../components/StarShop';
import { HammerSmash } from '../components/ParticleEffect';
import { Star, Hammer as HammerIcon, Home, Undo2, RefreshCw, RotateCcw, Volume2, VolumeX, Zap, Lightbulb } from 'lucide-react';
import confetti from 'canvas-confetti';
import { BlockTemplate } from '../game/blockShapes';

// Local utility for tailwind class merging
function cn(...classes: any[]) {
  return classes.filter(Boolean).filter(c => typeof c === 'string').join(' ');
}





interface GameScreenProps {
  onHome: () => void;
}

/** Find the best-scoring empty cell to hint at (top-left of best placement) */
function computeHint(
  grid: (string | null)[][],
  blocks: BlockTemplate[]
): { row: number; col: number } | null {
  const size = grid.length;
  let best: { row: number; col: number } | null = null;
  let bestFit = -1;

  for (const block of blocks) {
    for (let r = 0; r <= size - block.shape.length; r++) {
      for (let c = 0; c <= size - block.shape[0].length; c++) {
        if (canPlaceBlock(grid, block.shape, r, c)) {
          // Score by how many cells are filled adjacent (prefer filling gaps)
          const cells = block.shape.flat().filter(v => v === 1).length;
          if (cells > bestFit) {
            bestFit = cells;
            best = { row: r, col: c };
          }
        }
      }
    }
  }
  return best;
}

export const GameScreen: React.FC<GameScreenProps> = ({ onHome }) => {
  const {
    grid,
    gridSize,
    availableBlocks,
    placeBlock,
    resetGame,
    isGameOver,
    soundEnabled,
    hapticEnabled,
    lastClearedLines,
    refreshBlocks,
    refreshCharges,
    noMovesLeft,
    combo,
    boardClears,
    encouragementMessage,
    setInvalidAction,
    undoMove,
    undoCharges,
    newAchievements,
    clearNewAchievements,
    score,
    difficulty,
    maxCombo,
    toggleSound,
    timeLeft,
    decrementTime,
    isDailyChallenge,
    isStageCleared,
    journeyLevel,
    soundVolume
  } = useGameStore();

  const { currentTheme } = useThemeStore();
  const { addXP, addStats, syncRank, advanceQuest, syncQuests, unlockLevel, stars, addStars, consumeItem, inventory } = usePlayerStore();

  const [isHammerActive, setIsHammerActive] = useState(false);
  const [showShop, setShowShop] = useState(false);
  const [hammerSmashData, setHammerSmashData] = useState({ active: false, x: 0, y: 0 });

  useEffect(() => {
    syncQuests();
  }, [syncQuests]);

  const [rippleData, setRippleData] = useState({ show: false, x: 0, y: 0, color: '' });
  const [newRankCelebration, setNewRankCelebration] = useState<string | null>(null);
  // Floating XP chips — [{id, amount, x, y}]
  const [xpFloats, setXpFloats] = useState<{ id: number; amount: number; x: number; y: number }[]>([]);

  const [ghostBlock, setGhostBlock] = useState<{
    row: number; col: number; shape: number[][]; color: string; isValid: boolean;
  } | null>(null);

  const [cellSize, setCellSize] = useState(0);
  const gridRef = useRef<HTMLDivElement>(null);

  // Local block state to support rotation
  const [localBlocks, setLocalBlocks] = useState<BlockTemplate[]>([]);
  useEffect(() => { setLocalBlocks(availableBlocks); }, [availableBlocks]);

  // Hint system — show after 18s of no moves
  const [hintCell, setHintCell] = useState<{ row: number; col: number } | null>(null);
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [showHintButton, setShowHintButton] = useState(false);
  const lastMoveTime = useRef(Date.now());

  const resetIdleTimer = useCallback(() => {
    lastMoveTime.current = Date.now();
    setHintCell(null);
    setShowHintButton(false);
    if (idleTimer.current) clearTimeout(idleTimer.current);
    idleTimer.current = setTimeout(() => {
      setShowHintButton(true);
    }, 18000);
  }, []);

  useEffect(() => {
    resetIdleTimer();
    return () => { if (idleTimer.current) clearTimeout(idleTimer.current); };
  }, [availableBlocks, resetIdleTimer]);

  const handleShowHint = useCallback(() => {
    const hint = computeHint(grid, localBlocks);
    setHintCell(hint);
    setShowHintButton(false);
    // Auto-hide hint after 5s
    setTimeout(() => setHintCell(null), 5000);
  }, [grid, localBlocks]);

  // Particle effects state
  const [burstActive, setBurstActive] = useState(false);
  const [burstOrigin, setBurstOrigin] = useState({ x: 0, y: 0 });
  const [boardClearActive, setBoardClearActive] = useState(false);
  const [showComboBanner, setShowComboBanner] = useState(false);

  useEffect(() => {
    if (combo > 1) {
      setShowComboBanner(true);
      const timer = setTimeout(() => setShowComboBanner(false), 2500);
      return () => clearTimeout(timer);
    } else {
      setShowComboBanner(false);
    }
  }, [combo]);

  // Spawn floating XP on line clear
  useEffect(() => {
    if (lastClearedLines > 0 && gridRef.current) {
      const rect = gridRef.current.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const xpAmount = lastClearedLines * 15;
      const id = Date.now();
      setXpFloats(prev => [...prev, { id, amount: xpAmount, x: cx, y: cy }]);
    }
  }, [lastClearedLines]);

  // Master Clock for Time Attack
  useEffect(() => {
    if (isDailyChallenge && !isGameOver && timeLeft !== null && timeLeft > 0) {
      const clock = setInterval(() => {
        decrementTime();
      }, 1000);
      return () => clearInterval(clock);
    }
  }, [isDailyChallenge, isGameOver, timeLeft, decrementTime]);

  useEffect(() => {
    const updateSize = () => {
      if (gridRef.current) {
        setCellSize(gridRef.current.offsetWidth / gridSize);
      }
    };
    updateSize();
    const observer = new ResizeObserver(updateSize);
    if (gridRef.current) observer.observe(gridRef.current);
    window.addEventListener('resize', updateSize);
    return () => { observer.disconnect(); window.removeEventListener('resize', updateSize); };
  }, [gridSize]);

  // Preloaded audio pool — avoids CDN fetch delay on first play
  const audioPool = useRef<Record<string, HTMLAudioElement>>({});
  useEffect(() => {
    const urls: Record<string, string> = {
      place: 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3',
      clear: 'https://assets.mixkit.co/active_storage/sfx/2018/2018-preview.mp3',
      refresh: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3',
      error: 'https://assets.mixkit.co/active_storage/sfx/2572/2572-preview.mp3',
    };
    Object.entries(urls).forEach(([key, url]) => {
      const a = new Audio(url);
      a.preload = 'auto';
      audioPool.current[key] = a;
    });
  }, []);

  // Sounds — use preloaded instances, clone so overlapping is supported
  const playSound = useCallback((key: string, vol: number = soundVolume) => {
    if (!soundEnabled) return;
    const src = audioPool.current[key];
    if (!src) return;
    const clone = src.cloneNode() as HTMLAudioElement;
    clone.volume = vol;
    clone.play().catch(() => {});
  }, [soundEnabled, soundVolume]);

  const playPlace = useCallback(() => playSound('place'), [playSound]);
  const playClear = useCallback(() => playSound('clear'), [playSound]);
  const playRefresh = useCallback(() => playSound('refresh'), [playSound]);
  const playError = useCallback(() => playSound('error', soundVolume * 0.7), [playSound, soundVolume]);



  const vibrate = useCallback((pattern: number | number[]) => {
    if (hapticEnabled && 'vibrate' in navigator) navigator.vibrate(pattern);
  }, [hapticEnabled]);

  const hapticPatterns = {
    1: [40],
    2: [40, 40, 40],
    3: [60, 40, 60, 40, 60],
    4: [80, 40, 80, 40, 150],
    board: [150, 50, 150, 50, 300]
  };

  // Line clear effects
  useEffect(() => {
    if (lastClearedLines > 0) {
      playClear();
      const pattern = hapticPatterns[lastClearedLines as keyof typeof hapticPatterns] || hapticPatterns[1] || [50];
      vibrate(pattern);
      advanceQuest('lines', lastClearedLines);

      // Trigger burst from grid center
      if (gridRef.current) {
        const rect = gridRef.current.getBoundingClientRect();
        setBurstOrigin({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
        setBurstActive(false);
        setTimeout(() => setBurstActive(true), 50);
      }

      // Fancy confetti for multi-clear
      if (lastClearedLines >= 2) {
        confetti({
          particleCount: lastClearedLines * 60,
          spread: 80,
          origin: { y: 0.55 },
          colors: currentTheme.blockColors ?? ['#FF5252', '#448AFF', '#FFD740', '#69F0AE', '#E040FB'],
        });
      }
    }
  }, [lastClearedLines, playClear, vibrate, currentTheme]);

  // Board clear flash
  const prevBoardClears = useRef(0);
  useEffect(() => {
    if (boardClears > prevBoardClears.current) {
      setBoardClearActive(true);
      prevBoardClears.current = boardClears;
      setTimeout(() => setBoardClearActive(false), 900);
      vibrate(hapticPatterns.board);

      confetti({
        particleCount: 200,
        spread: 360,
        startVelocity: 40,
        origin: { y: 0.5 },
        colors: ['#FF5252', '#FFD740', '#69F0AE', '#448AFF', '#E040FB', '#FFAB40'],
      });
    }
  }, [boardClears]);

  const handleBlockDrop = useCallback((blockId: string, row: number, col: number) => {
    const localBlock = localBlocks.find(b => b.id === blockId);
    if (!localBlock) return;

    const success = placeBlock(blockId, row, col, localBlock.shape);
    if (success) {
      playPlace();
      vibrate(50);
      resetIdleTimer();

      // Trigger ripple at grid position
      if (gridRef.current) {
        const rect = gridRef.current.getBoundingClientRect();
        const gridX = rect.left + (col + 0.5) * cellSize;
        const gridY = rect.top + (row + 0.5) * cellSize;
        setRippleData({ show: true, x: gridX, y: gridY, color: localBlock.color });
        setTimeout(() => setRippleData(prev => ({ ...prev, show: false })), 500);
      }

      // Award XP & Quests
      advanceQuest('blocks', 1);
      
      const earned = xpForScore(score, combo, difficulty);
      if (earned > 0) {
        addXP(earned);
        // Check for rank up
        const upgraded = syncRank();
        if (upgraded) {
          setNewRankCelebration(upgraded);
          confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#FFD740', '#FF5252', '#448AFF']
          });
          setTimeout(() => setNewRankCelebration(null), 4000);
        }
      }
      addStats(1, 0);
    }
  }, [localBlocks, placeBlock, playPlace, vibrate, resetIdleTimer, score, combo, difficulty, addXP, addStats, syncRank, cellSize]);

  const handleGridClick = useCallback((row: number, col: number) => {
    if (isHammerActive && grid[row][col]) {
      const rect = gridRef.current?.getBoundingClientRect();
      if (rect) {
        const x = rect.left + (col + 0.5) * cellSize;
        const y = rect.top + (row + 0.5) * cellSize;
        setHammerSmashData({ active: true, x, y });
        setTimeout(() => setHammerSmashData(prev => ({ ...prev, active: false })), 600);
      }
      
      useGameStore.getState().removeCell(row, col);
      consumeItem('hammer');
      setIsHammerActive(false);
      vibrate([100, 50, 100]);
    }
  }, [isHammerActive, grid, cellSize, consumeItem, vibrate]);

  const handleRotate = useCallback((blockId: string, rotated: BlockTemplate) => {
    setLocalBlocks(prev => prev.map(b => b.id === blockId ? rotated : b));
    vibrate(20);
  }, [vibrate]);

  const handleRefresh = () => {
    if (refreshBlocks()) { playRefresh(); vibrate(100); resetIdleTimer(); }
  };

  const handleUndo = () => {
    if (undoMove()) { vibrate(60); resetIdleTimer(); }
  };

  return (
    <div className="gs-root flex flex-col items-center h-full px-3 pt-2 overflow-hidden safe-area-inset relative" style={{ background: 'linear-gradient(160deg, #0F172A 0%, #0d1f5c 50%, #1E3A8A 100%)', isolation: 'isolate' }}>
      {/* Ambient orbs */}
      <div className="gs-orb gs-orb-top absolute pointer-events-none" />
      <div className="gs-orb gs-orb-right absolute pointer-events-none" />
      {/* Achievement Toast */}
      <AchievementToast achievements={newAchievements} onDone={clearNewAchievements} />

      {/* Particle Effects (global) */}
      <LineClearBurst
        active={burstActive}
        originX={burstOrigin.x}
        originY={burstOrigin.y}
        colors={currentTheme.blockColors ?? ['#FF5252', '#448AFF', '#FFD740', '#69F0AE']}
        count={lastClearedLines * 10}
      />
      <ComboFlash combo={combo} />
      <BoardClearFlash active={boardClearActive} />
      <PlaceRipple {...rippleData} />

      {/* Floating XP numbers */}
      {xpFloats.map(f => (
        <FloatingXP
          key={f.id}
          amount={f.amount}
          x={f.x}
          y={f.y}
          onDone={() => setXpFloats(prev => prev.filter(p => p.id !== f.id))}
        />
      ))}

      {/* Rank Up Celebration */}
      <AnimatePresence>
        {newRankCelebration && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.2 }}
            transition={{ type: 'spring', damping: 15, stiffness: 300 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm pointer-events-none"
          >
            <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-8 text-center border-4 border-amber-400 shadow-[0_0_50px_rgba(251,191,36,0.4)]">
              <motion.div
                animate={{ rotate: [0, -10, 10, -10, 10, 0], scale: [0.9, 1.1, 1] }}
                transition={{ duration: 1, repeat: 3, ease: 'easeInOut' }}
                className="text-7xl mb-4"
              >
                🎉
              </motion.div>
              <h2 className="text-sm font-black text-amber-500 uppercase tracking-[0.3em] mb-1">Rank Promoted!</h2>
              <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter mb-4">
                {newRankCelebration}
              </p>
              <div className="h-1 w-24 mx-auto bg-amber-400 rounded-full" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Background Glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-64 blur-[100px] pointer-events-none opacity-30"
        style={{ background: `rgb(var(--color-primary) / 0.2)` }}
      />

      {/* Header - Isolate ScoreBoard at the top */}
      <div className="w-full relative z-10 flex flex-col items-center">
        <ScoreBoard />
        
        {/* Time Attack Massive Overlay */}
        {isDailyChallenge && timeLeft !== null && (
          <motion.div 
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={cn(
              "mt-2 mb-6 px-8 py-3 rounded-[2rem] border-2 shadow-2xl backdrop-blur-md text-center flex flex-col items-center",
              timeLeft <= 10 ? "border-red-500 bg-red-500/20 text-red-500 animate-pulse" : "border-amber-400 bg-black/40 text-amber-400 shadow-[0_0_30px_rgba(251,191,36,0.3)]"
            )}
          >
            <span className="text-[10px] uppercase font-black tracking-[0.3em] opacity-80">Time Attack</span>
            <span className="text-4xl font-black tabular-nums tracking-tighter">
              {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
            </span>
          </motion.div>
        )}
      </div>

      {/* Grid Area — takes all remaining space */}
      <div className="flex-1 min-h-0 flex items-center justify-center w-full max-w-md px-1 relative">
        <AnimatePresence>
          {showComboBanner && combo > 1 && (
            <motion.div key="combo" initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0 }}
              className="absolute -top-12 right-4 z-20 text-white px-4 py-1 rounded-full font-black italic shadow-lg border-2 border-white/20"
              style={{ background: 'linear-gradient(135deg, #f97316, #ef4444)' }}>
              {combo}x COMBO!
            </motion.div>
          )}

          {noMovesLeft && !isGameOver && (
            <motion.div key="no-moves" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              className="absolute top-0 z-20 bg-amber-500 text-white px-4 py-2 rounded-full font-bold shadow-lg flex items-center gap-2">
              <Zap size={16} fill="currentColor" />
              Stuck? Rotate or Refresh!
            </motion.div>
          )}

          {/* Hint button */}
          {showHintButton && !isGameOver && (
            <motion.button key="hint-btn" initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0 }}
              onClick={handleShowHint}
              className="absolute top-0 left-4 z-20 flex items-center gap-2 px-4 py-2 rounded-full font-bold text-white shadow-lg text-sm border border-white/20"
              style={{ background: 'var(--gradient-button)' }}>
              <Lightbulb size={14} fill="currentColor" />
              Show Hint
            </motion.button>
          )}

          {encouragementMessage && (
            <motion.div key={`enc-${encouragementMessage}`}
              initial={{ scale: 0, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 1.2, opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none px-4">
              <div className="px-6 py-3 rounded-2xl font-black text-2xl sm:text-4xl shadow-xl border border-white/20 tracking-tighter italic backdrop-blur-md text-center max-w-[80vw] text-white"
                style={{ background: 'var(--gradient-button)' }}>
                {encouragementMessage}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={gridRef} className={cn("w-full max-w-[88vw] sm:max-w-md", isHammerActive && "cursor-crosshair")}>
          <Grid grid={grid} ghostBlock={ghostBlock} hintCell={hintCell} onCellClick={handleGridClick} />
        </div>
      </div>

      {/* Block Tray */}
      <div className="gs-tray relative flex-shrink-0 w-full max-w-md flex justify-around items-center rounded-[1.6rem] mt-1.5 sm:mt-3 py-2 sm:py-3" style={{ minHeight: '4.5rem' }}>
        <AnimatePresence mode="sync">
          {localBlocks.map((block) => (
            <motion.div key={block.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="group flex items-center justify-center w-1/3 h-full p-1 sm:p-2">
              <DraggableBlock
                block={block}
                gridRef={gridRef}
                cellSize={cellSize}
                onDrop={(row, col) => handleBlockDrop(block.id, row, col)}
                onDrag={setGhostBlock}
                onRotate={handleRotate}
                onError={playError}
              />
            </motion.div>
          ))}
        </AnimatePresence>

      </div>

      {/* Ergonomic Bottom NavBar */}
      <div className="gs-navbar flex-shrink-0 flex justify-around items-center w-full max-w-md mt-1.5 sm:mt-3 mb-1 py-1.5 sm:py-2 px-3 sm:px-6 rounded-[1.6rem] relative z-10 pb-safe">
        
        {/* Menu/Home */}
        <motion.button whileHover={{ y: -3 }} whileTap={{ scale: 0.9 }} onClick={onHome}
          className="gs-nav-btn flex flex-col items-center gap-1">
          <div className="gs-nav-icon p-3 rounded-full">
            <Home size={22} className="text-slate-300" />
          </div>
          <span className="gs-nav-label">Menu</span>
        </motion.button>

        {/* Undo */}
        <motion.button whileHover={{ y: -3 }} whileTap={{ scale: 0.9 }}
          onClick={handleUndo} disabled={undoCharges <= 0}
          className={cn('gs-nav-btn relative flex flex-col items-center gap-1', undoCharges <= 0 && 'opacity-40 cursor-not-allowed')}>
          <div className="gs-nav-icon p-3 rounded-full relative">
            <Undo2 size={22} className="text-slate-300" />
            {undoCharges > 0 && (
              <span className="gs-badge absolute -top-1 -right-1">{undoCharges}</span>
            )}
          </div>
          <span className="gs-nav-label">Undo</span>
        </motion.button>

        {/* Refresh Tray */}
        <motion.button whileHover={{ y: -3 }} whileTap={{ scale: 0.9 }}
          onClick={handleRefresh} disabled={refreshCharges <= 0}
          className={cn('gs-nav-btn relative flex flex-col items-center gap-1', refreshCharges <= 0 && 'opacity-40 cursor-not-allowed')}>
          <div className={cn('p-3 rounded-full relative', refreshCharges > 0 ? 'gs-nav-icon-active' : 'gs-nav-icon')}>
            <RefreshCw size={22} className={cn('text-slate-300', refreshCharges > 0 && 'animate-spin-slow')} />
            {refreshCharges > 0 && (
              <span className="gs-badge absolute -top-1 -right-1">{refreshCharges}</span>
            )}
          </div>
          <span className="gs-nav-label">Refresh</span>
        </motion.button>

        {/* Restart Game */}
        <motion.button whileHover={{ y: -3, rotate: -45 }} whileTap={{ scale: 0.9 }} onClick={resetGame}
          className="gs-nav-btn flex flex-col items-center gap-1">
          <div className="gs-nav-icon p-3 rounded-full">
            <RotateCcw size={22} className="text-slate-300" />
          </div>
          <span className="gs-nav-label">Retry</span>
        </motion.button>

        {/* Hammer Tool */}
        <motion.button whileHover={inventory.hammer > 0 ? { y: -3 } : {}} whileTap={inventory.hammer > 0 ? { scale: 0.9 } : {}}
          onClick={() => inventory.hammer > 0 && setIsHammerActive(!isHammerActive)}
          disabled={inventory.hammer <= 0}
          className={cn('gs-nav-btn flex flex-col items-center gap-1', inventory.hammer <= 0 && 'opacity-30 cursor-not-allowed')}>
          <div className={cn('p-3 rounded-full relative', isHammerActive ? 'gs-nav-icon-hammer-active' : 'gs-nav-icon')}>
            <HammerIcon size={22} fill={isHammerActive ? '#3b82f6' : 'none'} className={isHammerActive ? 'text-blue-400' : 'text-slate-300'} />
            {inventory.hammer > 0 && (
              <span className="gs-badge-amber absolute -top-1 -right-1">{inventory.hammer}</span>
            )}
          </div>
          <span className="gs-nav-label">Hammer</span>
        </motion.button>

        {/* Sound Toggle */}
        <motion.button whileHover={{ y: -3 }} whileTap={{ scale: 0.9 }} onClick={toggleSound}
          className="gs-nav-btn flex flex-col items-center gap-1">
          <div className={cn('p-3 rounded-full', soundEnabled ? 'gs-nav-icon-active' : 'gs-nav-icon')}>
            {soundEnabled ? <Volume2 size={22} className="text-cyan-400" style={{ filter: 'drop-shadow(0 0 6px #06b6d4)' }} /> : <VolumeX size={22} className="text-slate-400" />}
          </div>
          <span className="gs-nav-label">Sound</span>
        </motion.button>
      </div>


      <AnimatePresence>
        {isStageCleared && journeyLevel && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="gs-stage-clear-modal w-full max-w-sm rounded-[2.5rem] p-8 text-center"
            >
              <motion.div 
                animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.2, 1] }} 
                transition={{ duration: 2, repeat: Infinity }}
                className="text-6xl mb-4"
              >
                🏆
              </motion.div>
              <h2 className="text-4xl font-black text-white mb-2 tracking-tighter" style={{ textShadow: '0 0 20px rgba(99,102,241,0.5)' }}>STAGE CLEAR!</h2>
              <p className="font-bold mb-8 uppercase tracking-widest text-xs" style={{ color: 'rgba(148,163,184,0.7)' }}>Level {journeyLevel.id} Complete</p>

              <div className="rounded-3xl p-4 mb-8" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
                 <div className="flex flex-col items-center gap-1">
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Stage Cleared!</p>
                  <div className="flex items-center gap-2 mb-4">
                    <Star size={20} fill="#FFD740" className="text-amber-400" />
                    <p className="text-2xl font-black text-slate-900 dark:text-white">+10 Stars</p>
                  </div>
                  <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                     <motion.div initial={{ width: 0 }} animate={{ width: '100%' }} className="h-full bg-blue-500" transition={{ delay: 0.5, duration: 1 }} />
                  </div>
               </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  addStars(10);
                  unlockLevel(journeyLevel!.id + 1);
                  onHome();
                  resetGame();
                }}
                className="w-full py-4 rounded-2xl bg-blue-500 text-white font-black text-lg shadow-xl shadow-blue-500/30"
              >
                CLAIM & CONTINUE
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <StarShop isOpen={showShop} onClose={() => setShowShop(false)} />
      <HammerSmash active={hammerSmashData.active} x={hammerSmashData.x} y={hammerSmashData.y} />
    </div>
  );
};
