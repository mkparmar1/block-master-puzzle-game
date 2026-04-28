/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Shape = number[][];

export interface BlockTemplate {
  id: string;
  shape: Shape;
  color: string;
  rotationIndex?: number; // tracks how many times rotated (0-3)
}

export type Difficulty = 'easy' | 'medium' | 'hard';

/**
 * Rotate a shape 90° clockwise.
 * [[1,0],[1,1]] → [[1,1],[0,1]]
 */
export function rotateShape(shape: Shape): Shape {
  const rows = shape.length;
  const cols = shape[0].length;
  const rotated: Shape = Array.from({ length: cols }, () => Array(rows).fill(0));
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      rotated[c][rows - 1 - r] = shape[r][c];
    }
  }
  return rotated;
}

/** Get all 4 rotations of a shape (deduped) */
export function getRotations(shape: Shape): Shape[] {
  const rotations: Shape[] = [shape];
  let current = shape;
  for (let i = 0; i < 3; i++) {
    current = rotateShape(current);
    // Check if this rotation is a duplicate
    const isDuplicate = rotations.some(r =>
      JSON.stringify(r) === JSON.stringify(current)
    );
    if (!isDuplicate) rotations.push(current);
  }
  return rotations;
}

export const SHAPES: Record<Difficulty, BlockTemplate[]> = {
  easy: [
    { id: 'single', shape: [[1]], color: '#FF5252' },
    { id: 'line-2-h', shape: [[1, 1]], color: '#448AFF' },
    { id: 'line-2-v', shape: [[1], [1]], color: '#448AFF' },
    { id: 'square-2', shape: [[1, 1], [1, 1]], color: '#69F0AE' },
    { id: 'l-shape-small', shape: [[1, 0], [1, 1]], color: '#E040FB' },
  ],
  medium: [
    { id: 'single', shape: [[1]], color: '#FF5252' },
    { id: 'line-2-h', shape: [[1, 1]], color: '#448AFF' },
    { id: 'line-2-v', shape: [[1], [1]], color: '#448AFF' },
    { id: 'line-3-h', shape: [[1, 1, 1]], color: '#FFD740' },
    { id: 'line-3-v', shape: [[1], [1], [1]], color: '#FFD740' },
    { id: 'square-2', shape: [[1, 1], [1, 1]], color: '#69F0AE' },
    { id: 'l-shape-1', shape: [[1, 0], [1, 1]], color: '#E040FB' },
    { id: 'l-shape-2', shape: [[0, 1], [1, 1]], color: '#E040FB' },
    { id: 't-shape', shape: [[1, 1, 1], [0, 1, 0]], color: '#40C4FF' },
    { id: 'z-shape', shape: [[1, 1, 0], [0, 1, 1]], color: '#FFAB40' },
  ],
  hard: [
    { id: 'line-3-h', shape: [[1, 1, 1]], color: '#FFD740' },
    { id: 'line-3-v', shape: [[1], [1], [1]], color: '#FFD740' },
    { id: 'line-4-h', shape: [[1, 1, 1, 1]], color: '#FF5252' },
    { id: 'line-4-v', shape: [[1], [1], [1], [1]], color: '#FF5252' },
    { id: 'square-3', shape: [[1, 1, 1], [1, 1, 1], [1, 1, 1]], color: '#69F0AE' },
    { id: 'l-shape-big', shape: [[1, 0, 0], [1, 0, 0], [1, 1, 1]], color: '#E040FB' },
    { id: 'plus-shape', shape: [[0, 1, 0], [1, 1, 1], [0, 1, 0]], color: '#40C4FF' },
    { id: 'u-shape', shape: [[1, 0, 1], [1, 1, 1]], color: '#FFAB40' },
    { id: 't-shape-big', shape: [[1, 1, 1], [0, 1, 0], [0, 1, 0]], color: '#40C4FF' },
    { id: 'stair-shape', shape: [[1, 1, 0], [0, 1, 1], [0, 0, 1]], color: '#FF5252' },
    { id: 's-shape', shape: [[0, 1, 1], [1, 1, 0]], color: '#FFAB40' },
    { id: 'j-shape', shape: [[0, 1], [0, 1], [1, 1]], color: '#448AFF' },
  ]
};

export const getRandomBlocks = (count: number, difficulty: Difficulty = 'medium'): BlockTemplate[] => {
  const result: BlockTemplate[] = [];
  const pool = SHAPES[difficulty];
  for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * pool.length);
    result.push({
      ...pool[randomIndex],
      id: `${pool[randomIndex].id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      rotationIndex: 0,
    });
  }
  return result;
};

/** Given a block, return it with its shape rotated 90° clockwise */
export function rotateBlock(block: BlockTemplate): BlockTemplate {
  return {
    ...block,
    shape: rotateShape(block.shape),
    rotationIndex: ((block.rotationIndex ?? 0) + 1) % 4,
  };
}
