/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Grid as GridType } from '../game/gridLogic';
import { Cell } from './Cell';
import { HintSparkle } from './ParticleEffect';

// Local utility for tailwind class merging
function cn(...classes: any[]) {
  return classes.filter(Boolean).filter(c => typeof c === 'string').join(' ');
}


interface GridProps {
  grid: GridType;
  ghostBlock?: {
    row: number;
    col: number;
    shape: number[][];
    color: string;
    isValid: boolean;
  } | null;
  hintCell?: { row: number; col: number } | null;
  onCellClick?: (row: number, col: number) => void;
}

export const Grid: React.FC<GridProps> = ({ grid, ghostBlock, hintCell, onCellClick }) => {
  const size = grid.length;

  return (
    <div
      className="aspect-square w-full max-w-md bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-1.5 sm:p-2 rounded-3xl shadow-2xl grid gap-1 sm:gap-1.5 border border-white dark:border-slate-800 relative overflow-hidden"
      style={{
        gridTemplateColumns: `repeat(${size}, 1fr)`,
        gridTemplateRows: `repeat(${size}, 1fr)`,
      }}
    >
      {/* Checkerboard Pattern Background */}
      <div className="absolute inset-0 grid" style={{
        gridTemplateColumns: `repeat(${size}, 1fr)`,
        gridTemplateRows: `repeat(${size}, 1fr)`,
        padding: 'inherit',
        gap: 'inherit'
      }}>
        {Array.from({ length: size * size }).map((_, i) => {
          const r = Math.floor(i / size);
          const c = i % size;
          const isDark = (r + c) % 2 === 1;
          return (
            <div
              key={`bg-${i}`}
              className={cn(
                'w-full h-full rounded-lg',
                isDark ? 'bg-slate-500/[0.03] dark:bg-white/[0.02]' : 'bg-transparent'
              )}
              style={isDark ? { backgroundColor: 'rgb(var(--color-primary) / 0.03)' } : {}}
            />
          );
        })}
      </div>

      {/* Grid cells */}
      {grid.map((row, r) =>
        row.map((cell, c) => {
          let color = cell;
          let isGhost = false;
          let isInvalid = false;
          const isHint = hintCell?.row === r && hintCell?.col === c;

          if (ghostBlock) {
            const { row: gR, col: gC, shape, color: gColor, isValid } = ghostBlock;
            const shapeR = r - gR;
            const shapeC = c - gC;

            if (
              shapeR >= 0 &&
              shapeR < shape.length &&
              shapeC >= 0 &&
              shapeC < shape[0].length &&
              shape[shapeR][shapeC] === 1
            ) {
              color = isValid ? gColor : '#EF4444';
              isGhost = true;
              isInvalid = !isValid;
            }
          }

          return (
            <div key={`${r}-${c}`} className="relative" onClick={() => onCellClick?.(r, c)}>
              <Cell color={color} isGhost={isGhost} isInvalid={isInvalid} />
              {isHint && !color && <HintSparkle show={true} />}
            </div>
          );
        })
      )}
    </div>
  );
};
