/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Grid as GridType } from '../game/gridLogic';
import { Cell } from './Cell';
import { HintSparkle } from './ParticleEffect';

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
    <div className="relative aspect-square w-full max-w-md p-[10px]">
      {/* Background Board Frame (Carved Stone with Gold Trims) */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <svg width="100%" height="100%" preserveAspectRatio="none" viewBox="0 0 100 100" style={{ overflow: 'visible' }}>
          {/* Base Drop Shadow */}
          <rect x="-0.8" y="2.5" width="101.6" height="100" rx="8" fill="rgba(0,0,0,0.7)" />
          {/* Weathered Stone Plate */}
          <rect x="0" y="0" width="100" height="100" rx="8" fill="url(#stone-bevel-grad)" stroke="#090d16" strokeWidth="1.2" />
          {/* Inner Inset Shadow Panel */}
          <rect x="2" y="2" width="96" height="96" rx="7" fill="url(#stone-dark-grad)" filter="url(#inset-shadow)" />
          {/* Gold Filigree border */}
          <rect x="3.5" y="3.5" width="93" height="93" rx="6" fill="none" stroke="url(#gold-primary)" strokeWidth="1.3" />
          {/* Decorative Corner Ornaments */}
          {/* Top-Left */}
          <path d="M2 10V2h8" fill="none" stroke="url(#gold-primary)" strokeWidth="2" strokeLinecap="round" />
          {/* Top-Right */}
          <path d="M98 10V2h-8" fill="none" stroke="url(#gold-primary)" strokeWidth="2" strokeLinecap="round" />
          {/* Bottom-Left */}
          <path d="M2 90v8h8" fill="none" stroke="url(#gold-primary)" strokeWidth="2" strokeLinecap="round" />
          {/* Bottom-Right */}
          <path d="M98 90v8h-8" fill="none" stroke="url(#gold-primary)" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>

      {/* Grid container */}
      <div
        className="gs-grid w-full h-full relative"
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${size}, 1fr)`,
          gridTemplateRows: `repeat(${size}, 1fr)`,
          gap: '4px',
          padding: '6px',
        }}
      >
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
    </div>
  );
};
