/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Grid as GridType } from '../game/gridLogic';
import { Cell } from './Cell';
import { HintSparkle } from './ParticleEffect';

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
      className="gs-grid aspect-square w-full max-w-md relative overflow-hidden"
      style={{
        background: 'rgba(6,14,40,0.85)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(99,102,241,0.2)',
        borderRadius: '1.5rem',
        padding: '8px',
        boxShadow: `
          0 0 0 1px rgba(59,130,246,0.08),
          0 20px 60px rgba(0,0,0,0.6),
          inset 0 1px 0 rgba(255,255,255,0.05),
          0 0 40px rgba(99,102,241,0.08)
        `,
        display: 'grid',
        gridTemplateColumns: `repeat(${size}, 1fr)`,
        gridTemplateRows: `repeat(${size}, 1fr)`,
        gap: '3px',
      }}
    >
      {/* Grid inner ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none rounded-[1.4rem] opacity-30"
        style={{
          background: 'radial-gradient(ellipse at 50% 0%, rgba(59,130,246,0.12) 0%, transparent 60%)',
        }}
      />

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
            <div
              key={`${r}-${c}`}
              className="relative"
              style={{ borderRadius: '6px', overflow: 'hidden' }}
              onClick={() => onCellClick?.(r, c)}
            >
              <Cell color={color} isGhost={isGhost} isInvalid={isInvalid} />
              {isHint && !color && <HintSparkle show={true} />}
            </div>
          );
        })
      )}
    </div>
  );
};
