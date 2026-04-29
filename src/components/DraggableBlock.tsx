/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BlockTemplate, rotateBlock } from '../game/blockShapes';
import { canPlaceBlock } from '../game/gridLogic';
import { useGameStore } from '../store/useGameStore';
import { Cell } from './Cell';
import { RotateCw } from 'lucide-react';

// Local utility for tailwind class merging
function cn(...classes: any[]) {
  return classes.filter(Boolean).filter(c => typeof c === 'string').join(' ');
}


interface TrailParticle {
  id: number;
  x: number;
  y: number;
}

interface DraggableBlockProps {
  block: BlockTemplate;
  gridRef: React.RefObject<HTMLDivElement | null>;
  cellSize: number;
  onDrop: (row: number, col: number) => void;
  onDrag: (ghost: { row: number; col: number; shape: number[][]; color: string; isValid: boolean } | null) => void;
  onRotate: (blockId: string, rotated: BlockTemplate) => void;
  onError?: () => void;
}

export const DraggableBlock: React.FC<DraggableBlockProps> = ({ 
  block, 
  gridRef, 
  cellSize,
  onDrop,
  onDrag,
  onRotate,
  onError
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isInvalidDrop, setIsInvalidDrop] = useState(false);
  const [showRotate, setShowRotate] = useState(false);
  const dragRef = useRef<HTMLDivElement>(null);
  const pressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastDragPos = useRef<{ row: number; col: number; isValid: boolean } | null>(null);
  const [trailParticles, setTrailParticles] = useState<TrailParticle[]>([]);
  const lastParticlePos = useRef<{ x: number, y: number } | null>(null);
  const { grid, setInvalidAction } = useGameStore();

  const handleDragStart = () => {
    setIsDragging(true);
    setIsInvalidDrop(false);
    setShowRotate(false);
    lastDragPos.current = null;
    if (pressTimer.current) clearTimeout(pressTimer.current);
  };

  const getGridDropCoordinates = (blockRect: DOMRect, gridRect: DOMRect) => {
    let firstActiveRow = 0;
    let firstActiveCol = 0;
    let found = false;
    for (let r = 0; r < block.shape.length; r++) {
      for (let c = 0; c < block.shape[r].length; c++) {
        if (block.shape[r][c] === 1) {
          firstActiveRow = r;
          firstActiveCol = c;
          found = true;
          break;
        }
      }
      if (found) break;
    }

    const size = grid.length;
    // Grid Padding (approximation based on responsive design tailwind classes used in Grid.tsx)
    const gridPadding = (gridRect.width < 400) ? 6 : 8;
    const gap = (cellSize < 50 ? 4 : 6); // Visual gap between cells
    
    // Compute exact internal cell width on the grid surface
    const exactCellWidth = (gridRect.width - (2 * gridPadding) - ((size - 1) * gap)) / size;
    const effectiveCellSpan = exactCellWidth + gap;

    // The center of the first active cell inside the block visual element
    const cellOffsetX = firstActiveCol * exactCellWidth + firstActiveCol * gap + exactCellWidth / 2;
    const cellOffsetY = firstActiveRow * exactCellWidth + firstActiveRow * gap + exactCellWidth / 2;

    const currentCellCenterX = blockRect.left + cellOffsetX;
    const currentCellCenterY = blockRect.top + cellOffsetY;

    // Remove grid borders and padding before division
    const relX = currentCellCenterX - gridRect.left - gridPadding;
    const relY = currentCellCenterY - gridRect.top - gridPadding;

    const col = Math.floor(relX / effectiveCellSpan);
    const row = Math.floor(relY / effectiveCellSpan);

    const originRow = row - firstActiveRow;
    const originCol = col - firstActiveCol;

    return { originRow, originCol };
  };

  const handleDrag = () => {
    if (!gridRef.current || !dragRef.current || cellSize === 0) return;

    const gridRect = gridRef.current.getBoundingClientRect();
    const blockRect = dragRef.current.getBoundingClientRect();
    
    const { originRow, originCol } = getGridDropCoordinates(blockRect, gridRect);
    const size = grid.length;

    const inBounds =
      originRow >= -1 &&
      originRow <= size - 1 &&
      originCol >= -1 &&
      originCol <= size - 1;

    let newEventObj = null;

    if (inBounds) {
      const isValid =
        originRow >= 0 &&
        originRow <= size - block.shape.length &&
        originCol >= 0 &&
        originCol <= size - block.shape[0].length &&
        canPlaceBlock(grid, block.shape, originRow, originCol);

      if (originRow >= 0 && originRow <= size - block.shape.length && originCol >= 0 && originCol <= size - block.shape[0].length) {
        newEventObj = { row: originRow, col: originCol, shape: block.shape, color: block.color, isValid };
      }
    }

    if (newEventObj) {
      if (!lastDragPos.current || lastDragPos.current.row !== newEventObj.row || lastDragPos.current.col !== newEventObj.col || lastDragPos.current.isValid !== newEventObj.isValid) {
        lastDragPos.current = newEventObj;
        onDrag(newEventObj);
      }
    } else if (lastDragPos.current !== null) {
      lastDragPos.current = null;
      onDrag(null);
    }

    // Spawn Trail Particles
    const centerX = blockRect.left + blockRect.width / 2;
    const centerY = blockRect.top + blockRect.height / 2;
    
    if (!lastParticlePos.current || Math.hypot(centerX - lastParticlePos.current.x, centerY - lastParticlePos.current.y) > 20) {
      const newParticle: TrailParticle = { id: Date.now(), x: centerX, y: centerY };
      setTrailParticles(prev => [...prev.slice(-5), newParticle]); // Max 5 particles for performance
      lastParticlePos.current = { x: centerX, y: centerY };
      
      // Auto-cleanup
      setTimeout(() => {
        setTrailParticles(prev => prev.filter(p => p.id !== newParticle.id));
      }, 300);
    }
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    onDrag(null);
    lastDragPos.current = null;

    if (!gridRef.current || !dragRef.current || cellSize === 0) return;

    const gridRect = gridRef.current.getBoundingClientRect();
    const blockRect = dragRef.current.getBoundingClientRect();

    const { originRow, originCol } = getGridDropCoordinates(blockRect, gridRect);
    const size = grid.length;

    const inBounds = 
      originRow >= 0 &&
      originRow <= size - block.shape.length &&
      originCol >= 0 &&
      originCol <= size - block.shape[0].length;

    if (inBounds && canPlaceBlock(grid, block.shape, originRow, originCol)) {
      onDrop(originRow, originCol);
    } else {
      if (inBounds) {
        setIsInvalidDrop(true);
        setInvalidAction('occupied');
        onError?.();
        setTimeout(() => setIsInvalidDrop(false), 500);
      } else {
        const relX = blockRect.left - gridRect.left;
        const relY = blockRect.top - gridRect.top;
        const isNearGrid =
          relX > -cellSize * 2 &&
          relX < (size + 1) * cellSize &&
          relY > -cellSize * 2 &&
          relY < (size + 1) * cellSize;

        if (isNearGrid) {
          setInvalidAction('out-of-bounds');
          onError?.();
        }
      }
    }
  };

  const handleRotate = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    const rotated = rotateBlock(block);
    onRotate(block.id, rotated);
  }, [block, onRotate]);

  // Long-press to show rotate button on mobile
  const handleTouchStart = () => {
    pressTimer.current = setTimeout(() => {
      setShowRotate(true);
      if ('vibrate' in navigator) navigator.vibrate(30);
    }, 400);
  };

  const handleTouchEnd = () => {
    if (pressTimer.current) clearTimeout(pressTimer.current);
  };

  return (
    <div className="relative flex items-center justify-center w-full h-full">
      {/* Particle Trail */}
      <AnimatePresence mode="popLayout">
        {trailParticles.map(p => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0.85, scale: 0.6, filter: 'blur(1px)' }}
            animate={{ opacity: 0, scale: 2.2, filter: 'blur(8px)' }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45 }}
            className="fixed pointer-events-none rounded-full z-[40]"
            style={{
              left: p.x,
              top: p.y,
              width: 14,
              height: 14,
              backgroundColor: block.color,
              transform: 'translate(-50%, -50%)',
              boxShadow: `0 0 16px 4px ${block.color}aa, 0 0 30px ${block.color}55`,
            }}
          />
        ))}
      </AnimatePresence>

      {/* Rotate button (appears on long press or hover) */}
      <AnimatePresence>
        {showRotate && !isDragging && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={handleRotate}
            onTouchEnd={(e) => { e.stopPropagation(); handleRotate(e); }}
            className="absolute -top-8 left-1/2 -translate-x-1/2 z-50 rounded-full p-2"
            style={{
              background: 'rgba(59,130,246,0.25)',
              border: '1px solid rgba(59,130,246,0.55)',
              boxShadow: '0 0 14px rgba(59,130,246,0.45)',
              backdropFilter: 'blur(8px)',
              color: '#93c5fd',
            }}
          >
            <RotateCw size={14} />
          </motion.button>
        )}
      </AnimatePresence>

      <motion.div
        ref={dragRef}
        drag
        dragSnapToOrigin
        dragElastic={0.05}
        dragTransition={{ bounceStiffness: 1200, bounceDamping: 40 }}
        onDragStart={handleDragStart}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        whileDrag={{
          scale: 1.12,
          zIndex: 100,
          filter: `drop-shadow(0px 16px 28px rgba(0,0,0,0.55)) drop-shadow(0px 0px 12px ${block.color}88)`,
        }}
        animate={isDragging ? undefined : { scale: 0.65 }}
        transition={!isDragging ? {} : { type: 'spring', stiffness: 800, damping: 35 }}
        style={{ touchAction: 'none' }}
        className={cn(
          'cursor-grab active:cursor-grabbing z-50 flex items-center justify-center relative',
          isDragging ? 'opacity-100' : 'transition-colors'
        )}
        onDoubleClick={handleRotate}
        onHoverStart={() => setShowRotate(true)}
        onHoverEnd={() => setShowRotate(false)}
      >
        {/* Neon glow aura — visible while dragging */}
        {isDragging && (
          <div
            className="absolute inset-[-6px] rounded-xl pointer-events-none"
            style={{
              boxShadow: `0 0 20px 6px ${block.color}66, 0 0 40px 10px ${block.color}33`,
              animation: 'dragger-pulse 0.8s ease-in-out infinite alternate',
            }}
          />
        )}
        <motion.div 
          className="grid"
          animate={isInvalidDrop ? {
            x: [0, -10, 10, -10, 10, 0],
            transition: { duration: 0.4 }
          } : { x: 0 }}
          style={{
            gridTemplateColumns: `repeat(${block.shape[0].length}, 1fr)`,
            gap: cellSize > 0 ? (cellSize < 50 ? '4px' : '6px') : '4px'
          }}
        >
          {block.shape.map((row, r) =>
            row.map((cell, c) => (
              <div
                key={`${r}-${c}`}
                style={{
                  width: isDragging ? cellSize - (cellSize < 50 ? 4 : 6) : (cellSize < 50 ? 32 : 40),
                  height: isDragging ? cellSize - (cellSize < 50 ? 4 : 6) : (cellSize < 50 ? 32 : 40),
                  visibility: cell === 1 ? 'visible' : 'hidden'
                }}
              >
                {cell === 1 && <Cell color={block.color} />}
              </div>
            ))
          )}
        </motion.div>
      </motion.div>

      {/* Rotate hint badge */}
      {!isDragging && (
        <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[9px] text-slate-400 dark:text-slate-600 font-bold whitespace-nowrap opacity-0 group-hover:opacity-100">
          double-tap to rotate
        </div>
      )}
    </div>
  );
};
