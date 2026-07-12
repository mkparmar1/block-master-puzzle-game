/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Grid } from '../components/Grid';
import { DraggableBlock } from '../components/DraggableBlock';
import { canPlaceBlock, placeBlock as applyPlacement, checkLines } from '../game/gridLogic';
import { getRandomBlocks, BlockTemplate } from '../game/blockShapes';
import { createEmptyGrid } from '../game/gridLogic';
import { SvgIcon } from '../components/SvgIcon';
import { SvgButton } from '../components/SvgButton';
import { SvgCard } from '../components/SvgCard';
import { SvgProgressBar } from '../components/SvgProgressBar';

interface TutorialScreenProps {
  onComplete: () => void;
}

interface TutorialStep {
  id: number;
  title: string;
  description: string;
  emoji: string;
  hint: string;
}

const STEPS: TutorialStep[] = [
  {
    id: 1,
    title: 'Drag blocks onto the grid',
    description: 'Pick up a block and drop it anywhere it fits. Watch the ghost preview to see where it will land.',
    emoji: '🧱',
    hint: 'Try dragging a block to the grid below!',
  },
  {
    id: 2,
    title: 'Fill rows & columns to clear them',
    description: 'When a full row or column is filled, it vanishes and earns you points. Clear multiple at once for a bonus!',
    emoji: '💥',
    hint: 'Fill the highlighted row to see the clear!',
  },
  {
    id: 3,
    title: 'Chain combos for massive points',
    description: 'Clear lines back-to-back without stopping to build a combo multiplier. The higher the combo, the more points you earn!',
    emoji: '⚡',
    hint: 'Great job! You\'re ready to play.',
  },
];

const TUTORIAL_GRID_SIZE = 5;

export const TutorialScreen: React.FC<TutorialScreenProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [grid, setGrid] = useState(createEmptyGrid(TUTORIAL_GRID_SIZE));
  const [blocks, setBlocks] = useState<BlockTemplate[]>([]);
  const [ghostBlock, setGhostBlock] = useState<{
    row: number; col: number; shape: number[][]; color: string; isValid: boolean;
  } | null>(null);
  const [localBlocks, setLocalBlocks] = useState<BlockTemplate[]>([]);
  const [cellSize, setCellSize] = useState(0);
  const [cleared, setCleared] = useState(false);
  const [stepDone, setStepDone] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);

  const setupStep = useCallback((s: number) => {
    setCleared(false);
    setStepDone(false);
    if (s === 0) {
      const g = createEmptyGrid(TUTORIAL_GRID_SIZE);
      const b = getRandomBlocks(1, 'easy');
      setGrid(g);
      setBlocks(b);
      setLocalBlocks(b);
    } else if (s === 1) {
      const g = createEmptyGrid(TUTORIAL_GRID_SIZE);
      for (let c = 0; c < 4; c++) g[4][c] = '#448AFF';
      const b = [{ id: 'tut-single', shape: [[1]], color: '#FF5252', rotationIndex: 0 }];
      setGrid(g);
      setBlocks(b);
      setLocalBlocks(b);
    } else {
      setGrid(createEmptyGrid(TUTORIAL_GRID_SIZE));
      setBlocks([]);
      setLocalBlocks([]);
      setStepDone(true);
    }
  }, []);

  useEffect(() => setupStep(step), [step, setupStep]);

  useEffect(() => {
    const update = () => {
      if (gridRef.current) setCellSize(gridRef.current.offsetWidth / TUTORIAL_GRID_SIZE);
    };
    update();
    const obs = new ResizeObserver(update);
    if (gridRef.current) obs.observe(gridRef.current);
    return () => obs.disconnect();
  }, []);

  const handleDrop = (blockId: string, row: number, col: number) => {
    const block = localBlocks.find(b => b.id === blockId);
    if (!block || !canPlaceBlock(grid, block.shape, row, col)) return;

    let newGrid = applyPlacement(grid, block.shape, block.color, row, col);
    const { newGrid: clearedGrid, clearedLines } = checkLines(newGrid);

    if (clearedLines > 0) {
      setCleared(true);
      newGrid = clearedGrid;
    }

    setGrid(newGrid);
    const remaining = localBlocks.filter(b => b.id !== blockId);
    setBlocks(remaining);
    setLocalBlocks(remaining);

    if (step === 0 || (step === 1 && clearedLines > 0)) {
      setTimeout(() => setStepDone(true), 600);
    }
  };

  const handleNext = () => {
    if (step < STEPS.length - 1) {
      setStep(s => s + 1);
    } else {
      onComplete();
    }
  };

  const current = STEPS[step];
  const progress = ((step + 1) / STEPS.length) * 100;

  return (
    <div className="flex flex-col items-center min-h-screen p-6 safe-area-inset relative overflow-hidden bg-slate-950">
      <div className="w-full max-w-sm mx-auto relative z-10 flex flex-col items-center">

        {/* Progress bar */}
        <div className="w-full mb-8 mt-2 text-left">
          <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
            <span>Tutorial</span>
            <span>{step + 1} / {STEPS.length}</span>
          </div>
          <SvgProgressBar progress={progress} height={8} />
        </div>

        {/* Step card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            className="w-full text-center mb-6"
          >
            <motion.div
              animate={{ scale: [1, 1.15, 1], rotate: [0, -5, 5, 0] }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-5xl mb-4"
            >
              {current.emoji}
            </motion.div>
            <h2 className="text-2xl font-black text-white tracking-tight mb-2">
              {current.title}
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              {current.description}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Interactive Mini Grid */}
        {step < 2 && (
          <div className="w-full mb-6 relative">
            {/* Hint tooltip */}
            <AnimatePresence>
              {!stepDone && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center justify-center gap-2 mb-3 text-xs font-bold text-center text-amber-400"
                >
                  <SvgIcon id="stars" size={14} className="animate-spin-slow" />
                  {current.hint}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Clear flash */}
            <AnimatePresence>
              {cleared && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none"
                >
                  <div className="text-4xl font-black text-amber-950 px-6 py-3 rounded-2xl"
                    style={{ background: 'var(--gradient-gold)' }}>
                    💥 CLEARED!
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div ref={gridRef} className="w-full max-w-[220px] mx-auto">
              <Grid grid={grid} ghostBlock={ghostBlock} />
            </div>

            {/* Block tray */}
            {localBlocks.length > 0 && (
              <div className="flex justify-center gap-4 mt-4 h-20">
                {localBlocks.map(block => (
                  <DraggableBlock
                    key={block.id}
                    block={block}
                    gridRef={gridRef}
                    cellSize={cellSize}
                    onDrop={(row, col) => handleDrop(block.id, row, col)}
                    onDrag={setGhostBlock}
                    onRotate={(id, rotated) =>
                      setLocalBlocks(prev => prev.map(b => b.id === id ? rotated : b))
                    }
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Step 3: Combo illustration */}
        {step === 2 && (
          <div className="w-full mb-6">
            <SvgCard className="p-5" variant="gold-border">
              <div className="text-5xl font-black mb-2 text-amber-950">3x COMBO!</div>
              <div className="flex justify-center gap-3 mt-3">
                {[100, 200, 300].map((pts, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: i * 0.2, type: 'spring' }}
                    className="bg-amber-950/20 rounded-xl px-3 py-2 text-sm font-black text-amber-950"
                  >
                    +{pts}
                  </motion.div>
                ))}
              </div>
              <p className="text-amber-950/80 text-xs mt-3 font-semibold">Each clear in a row multiplies your score!</p>
            </SvgCard>
          </div>
        )}

        {/* Next / Start button */}
        <SvgButton
          onClick={handleNext}
          disabled={step < 2 && !stepDone}
          className="w-full py-5 rounded-[2rem]"
          variant={stepDone || step === 2 ? 'gold' : 'stone'}
        >
          {step === STEPS.length - 1 ? (
            <><SvgIcon id="play" size={22} /> START PLAYING!</>
          ) : (
            <><SvgIcon id="play" size={22} /> NEXT</>
          )}
        </SvgButton>

        {/* Skip link */}
        <button
          onClick={onComplete}
          className="mt-4 text-xs text-slate-500 font-bold underline underline-offset-2"
        >
          Skip tutorial
        </button>
      </div>
    </div>
  );
};
