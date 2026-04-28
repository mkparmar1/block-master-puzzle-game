/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Shape } from './blockShapes';

export type Grid = (string | null)[][];

export const createEmptyGrid = (size: number): Grid => {
  return Array(size)
    .fill(null)
    .map(() => Array(size).fill(null));
};

export const canPlaceBlock = (
  grid: Grid,
  shape: Shape,
  row: number,
  col: number
): boolean => {
  const size = grid.length;
  for (let r = 0; r < shape.length; r++) {
    for (let c = 0; c < shape[r].length; c++) {
      if (shape[r][c] === 1) {
        const targetRow = row + r;
        const targetCol = col + c;

        if (
          targetRow < 0 ||
          targetRow >= size ||
          targetCol < 0 ||
          targetCol >= size ||
          grid[targetRow][targetCol] !== null
        ) {
          return false;
        }
      }
    }
  }
  return true;
};

export const placeBlock = (
  grid: Grid,
  shape: Shape,
  color: string,
  row: number,
  col: number
): Grid => {
  const newGrid = grid.map((r) => [...r]);
  for (let r = 0; r < shape.length; r++) {
    for (let c = 0; c < shape[r].length; c++) {
      if (shape[r][c] === 1) {
        newGrid[row + r][col + c] = color;
      }
    }
  }
  return newGrid;
};

export const checkLines = (grid: Grid): { newGrid: Grid; clearedLines: number } => {
  const size = grid.length;
  const newGrid = grid.map((r) => [...r]);
  const rowsToClear: number[] = [];
  const colsToClear: number[] = [];

  // Check rows
  for (let r = 0; r < size; r++) {
    if (newGrid[r].every((cell) => cell !== null)) {
      rowsToClear.push(r);
    }
  }

  // Check columns
  for (let c = 0; c < size; c++) {
    let full = true;
    for (let r = 0; r < size; r++) {
      if (newGrid[r][c] === null) {
        full = false;
        break;
      }
    }
    if (full) {
      colsToClear.push(c);
    }
  }

  // Clear rows
  rowsToClear.forEach((r) => {
    for (let c = 0; c < size; c++) {
      newGrid[r][c] = null;
    }
  });

  // Clear columns
  colsToClear.forEach((c) => {
    for (let r = 0; r < size; r++) {
      newGrid[r][c] = null;
    }
  });

  return {
    newGrid,
    clearedLines: rowsToClear.length + colsToClear.length,
  };
};

export const isGameOver = (grid: Grid, availableBlocks: { shape: Shape }[]): boolean => {
  if (availableBlocks.length === 0) return false;
  const size = grid.length;

  for (const block of availableBlocks) {
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (canPlaceBlock(grid, block.shape, r, c)) {
          return false;
        }
      }
    }
  }
  return true;
};
