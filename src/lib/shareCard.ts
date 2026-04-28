/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Theme } from './themes';

interface ShareCardOptions {
  score: number;
  highScore: number;
  stars: number;
  gridSize: number;
  difficulty: string;
  combo: number;
  theme: Theme;
}

/**
 * Renders a 600×340 canvas image as a data URL for sharing.
 * Uses gradients, rounded rects, and text effects.
 */
export async function generateShareCard(opts: ShareCardOptions): Promise<string> {
  const { score, highScore, stars, gridSize, difficulty, combo, theme } = opts;

  const W = 600;
  const H = 340;
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d')!;

  // ── Background gradient (parse CSS vars into a gradient) ──────────────
  const g = ctx.createLinearGradient(0, 0, W, H);
  // Use two colour stops derived from the theme button gradient
  const [c1, c2] = parseGradientColors(theme.vars['--gradient-button']);
  g.addColorStop(0, c1);
  g.addColorStop(1, c2);
  ctx.fillStyle = g;
  roundRect(ctx, 0, 0, W, H, 24, true, false);

  // ── Noise/texture overlay (subtle) ───────────────────────────────────
  ctx.fillStyle = 'rgba(0,0,0,0.08)';
  for (let i = 0; i < 2000; i++) {
    const x = Math.random() * W;
    const y = Math.random() * H;
    const s = Math.random() * 2;
    ctx.fillRect(x, y, s, s);
  }

  // ── White surface card ─────────────────────────────────────────────
  ctx.fillStyle = 'rgba(255,255,255,0.15)';
  roundRect(ctx, 24, 24, W - 48, H - 48, 16, true, false);

  // ── App name ─────────────────────────────────────────────────────────
  ctx.fillStyle = 'rgba(255,255,255,0.7)';
  ctx.font = 'bold 12px Inter, system-ui, sans-serif';
  ctx.letterSpacing = '3px';
  ctx.fillText('BLOCK MASTER PUZZLE', 48, 62);
  ctx.letterSpacing = '0px';

  // ── Stars ─────────────────────────────────────────────────────────────
  const starSize = 28;
  const starY = 82;
  const starX = 48;
  for (let i = 0; i < 3; i++) {
    ctx.font = `${starSize}px serif`;
    ctx.fillText(i < stars ? '⭐' : '☆', starX + i * (starSize + 4), starY + starSize);
  }

  // ── Score ─────────────────────────────────────────────────────────────
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 72px Inter, system-ui, sans-serif';
  ctx.fillText(score.toLocaleString(), 48, 196);

  ctx.fillStyle = 'rgba(255,255,255,0.6)';
  ctx.font = 'bold 14px Inter, system-ui, sans-serif';
  ctx.fillText('POINTS', 48, 218);

  // ── Divider ───────────────────────────────────────────────────────────
  ctx.strokeStyle = 'rgba(255,255,255,0.2)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(48, 234);
  ctx.lineTo(W - 48, 234);
  ctx.stroke();

  // ── Stats row ─────────────────────────────────────────────────────────
  const stats = [
    { label: 'BEST', value: highScore.toLocaleString() },
    { label: 'GRID', value: `${gridSize}×${gridSize}` },
    { label: 'MODE', value: difficulty.toUpperCase() },
    { label: 'MAX COMBO', value: `${combo}×` },
  ];

  stats.forEach((s, i) => {
    const x = 48 + i * 130;
    ctx.fillStyle = 'rgba(255,255,255,0.55)';
    ctx.font = 'bold 10px Inter, system-ui, sans-serif';
    ctx.fillText(s.label, x, 260);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 18px Inter, system-ui, sans-serif';
    ctx.fillText(s.value, x, 282);
  });

  // ── Watermark ─────────────────────────────────────────────────────────
  ctx.fillStyle = 'rgba(255,255,255,0.4)';
  ctx.font = '11px Inter, system-ui, sans-serif';
  ctx.textAlign = 'right';
  ctx.fillText('Can you beat me? 🎮', W - 48, H - 36);

  return canvas.toDataURL('image/png');
}

/* ── Helpers ──────────────────────────────────────────────────────────── */

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number,
  r: number, fill: boolean, stroke: boolean
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
  if (fill) ctx.fill();
  if (stroke) ctx.stroke();
}

/**
 * Extracts two hex colours from a CSS linear-gradient string like
 * "linear-gradient(135deg, #3b82f6, #6366f1)"
 */
function parseGradientColors(gradient: string): [string, string] {
  const hex = gradient.match(/#[0-9a-fA-F]{3,6}/g);
  if (hex && hex.length >= 2) return [hex[0], hex[1]];
  return ['#3b82f6', '#6366f1'];
}

/**
 * Attempt sharing as an image file; falls back to text share.
 */
export async function shareScore(opts: ShareCardOptions): Promise<void> {
  try {
    const dataUrl = await generateShareCard(opts);
    const blob = await (await fetch(dataUrl)).blob();
    const file = new File([blob], 'block-master-score.png', { type: 'image/png' });

    if (navigator.canShare?.({ files: [file] })) {
      await navigator.share({
        title: 'Block Master Puzzle',
        text: `I scored ${opts.score.toLocaleString()} pts! Can you beat me? 🎮`,
        files: [file],
      });
      return;
    }
  } catch {
    // fall through to text share
  }

  // Fallback: text only
  const starStr = '⭐'.repeat(opts.stars);
  if (navigator.share) {
    await navigator.share({
      title: 'Block Master Puzzle',
      text: `${starStr} I scored ${opts.score.toLocaleString()} pts in Block Master! Can you beat me?`,
    });
  }
}
