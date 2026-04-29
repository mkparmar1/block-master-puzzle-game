/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';

/** A single floating particle emitted on events */
interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  vx: number;
  vy: number;
  life: number; // 0–1
}

/* ─── Place ripple ─────────────────────────────────────────────── */
export interface RippleProps {
  show: boolean;
  x: number;
  y: number;
  color: string;
}

export const PlaceRipple: React.FC<RippleProps> = ({ show, x, y, color }) => (
  <AnimatePresence>
    {show && (
      <motion.div
        key={`${x}-${y}-${Date.now()}`}
        initial={{ scale: 0, opacity: 0.8 }}
        animate={{ scale: 3, opacity: 0 }}
        exit={{}}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        style={{
          position: 'fixed',
          left: x,
          top: y,
          width: 40,
          height: 40,
          borderRadius: '50%',
          border: `3px solid ${color}`,
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
          zIndex: 9999,
        }}
      />
    )}
  </AnimatePresence>
);

/* ─── Line clear burst particles ──────────────────────────────── */
interface BurstParticle {
  id: number;
  x: number;
  y: number;
  angle: number;
  color: string;
  size: number;
  distance: number;
}

interface LineClearBurstProps {
  active: boolean;
  originX: number;
  originY: number;
  colors: string[];
  count?: number;
}

export const LineClearBurst: React.FC<LineClearBurstProps> = ({
  active,
  originX,
  originY,
  colors,
  count = 16,
}) => {
  const [particles, setParticles] = useState<BurstParticle[]>([]);

  useEffect(() => {
    if (!active) return;
    const newParticles: BurstParticle[] = Array.from({ length: count }, (_, i) => ({
      id: Date.now() + i,
      x: originX,
      y: originY,
      angle: (i / count) * 360,
      color: colors[i % colors.length],
      size: 6 + Math.random() * 8,
      distance: 60 + Math.random() * 80,
    }));
    setParticles(newParticles);
    const t = setTimeout(() => setParticles([]), 800);
    return () => clearTimeout(t);
  }, [active, originX, originY, colors, count]);

  return (
    <div className="fixed inset-0 pointer-events-none z-[9998]">
      <AnimatePresence>
        {particles.map((p) => {
          const rad = (p.angle * Math.PI) / 180;
          const tx = Math.cos(rad) * p.distance;
          const ty = Math.sin(rad) * p.distance;
          const isCircle = Math.random() > 0.5;
          return (
            <motion.div
              key={p.id}
              initial={{ x: p.x, y: p.y, scale: 1, opacity: 1 }}
              animate={{ x: p.x + tx, y: p.y + ty, scale: 0, opacity: 0 }}
              exit={{}}
              transition={{ duration: 0.75, ease: 'easeOut' }}
              style={{
                position: 'absolute',
                width: p.size,
                height: p.size,
                borderRadius: isCircle ? '50%' : '3px',
                backgroundColor: p.color,
                boxShadow: `0 0 ${p.size * 2}px ${p.color}, 0 0 ${p.size * 4}px ${p.color}66`,
                transform: 'translate(-50%, -50%)',
              }}
            />
          );
        })}
      </AnimatePresence>
    </div>
  );
};

/* ─── Floating XP text ─────────────────────────────────────────── */
interface FloatingXPProps {
  amount: number;
  x: number;
  y: number;
  onDone: () => void;
}

export const FloatingXP: React.FC<FloatingXPProps> = ({ amount, x, y, onDone }) => (
  <motion.div
    initial={{ opacity: 1, y: 0, scale: 0.8, x: '-50%' }}
    animate={{ opacity: 0, y: -70, scale: 1.2, x: '-50%' }}
    transition={{ duration: 1.2, ease: 'easeOut' }}
    onAnimationComplete={onDone}
    className="fixed pointer-events-none z-[9999] font-black text-sm"
    style={{
      left: x,
      top: y,
      color: '#fbbf24',
      textShadow: '0 0 12px #fbbf24, 0 0 24px #f59e0b',
      letterSpacing: '0.05em',
    }}
  >
    +{amount} XP
  </motion.div>
);

/* ─── Combo lightning flash ────────────────────────────────────── */
interface ComboFlashProps {
  combo: number; // only renders when > 1
}

export const ComboFlash: React.FC<ComboFlashProps> = ({ combo }) => {
  const [visible, setVisible] = useState(false);
  const prevCombo = useRef(0);

  useEffect(() => {
    if (combo > 1 && combo !== prevCombo.current) {
      setVisible(true);
      prevCombo.current = combo;
      const t = setTimeout(() => setVisible(false), 400);
      return () => clearTimeout(t);
    }
  }, [combo]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key={combo}
          initial={{ opacity: 0.85 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.45 }}
          className="fixed inset-0 pointer-events-none z-[50]"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(99,102,241,0.30) 0%, rgba(59,130,246,0.15) 40%, transparent 70%)',
          }}
        />
      )}
    </AnimatePresence>
  );
};

/* ─── Board clear rainbow flash ────────────────────────────────── */
interface BoardClearFlashProps {
  active: boolean;
}

export const BoardClearFlash: React.FC<BoardClearFlashProps> = ({ active }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (active) {
      setShow(true);
      const t = setTimeout(() => setShow(false), 800);
      return () => clearTimeout(t);
    }
  }, [active]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="board-clear"
          initial={{ opacity: 0.9 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="fixed inset-0 pointer-events-none z-[60]"
          style={{
            background:
              'linear-gradient(135deg, #FF5252 0%, #FFD740 25%, #69F0AE 50%, #448AFF 75%, #E040FB 100%)',
          }}
        />
      )}
    </AnimatePresence>
  );
};

/* ─── Hint sparkle cell highlight ─────────────────────────────── */
interface HintSparkleProps {
  show: boolean;
}

export const HintSparkle: React.FC<HintSparkleProps> = ({ show }) => (
  <AnimatePresence>
    {show && (
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: [0, 1.2, 1], opacity: [0, 1, 0.8] }}
        exit={{ scale: 0, opacity: 0 }}
        transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
        className="absolute inset-0 rounded-md z-20 pointer-events-none"
        style={{
          background: 'rgb(var(--color-primary) / 0.25)',
          boxShadow: '0 0 12px rgb(var(--color-primary) / 0.6)',
          border: '2px solid rgb(var(--color-primary) / 0.8)',
        }}
      />
    )}
  </AnimatePresence>
);

/* ─── Hammer smash effect ─────────────────────────────────────── */
interface HammerSmashProps {
  active: boolean;
  x: number;
  y: number;
}

export const HammerSmash: React.FC<HammerSmashProps> = ({ active, x, y }) => {
  const [particles, setParticles] = useState<BurstParticle[]>([]);

  useEffect(() => {
    if (active) {
      const count = 12;
      const newParticles = Array.from({ length: count }, (_, i) => ({
        id: Date.now() + i,
        x,
        y,
        angle: Math.random() * 360,
        color: '#ffffff',
        size: 4 + Math.random() * 6,
        distance: 40 + Math.random() * 50,
      }));
      setParticles(newParticles);
      const t = setTimeout(() => setParticles([]), 600);
      return () => clearTimeout(t);
    }
  }, [active, x, y]);

  return (
    <div className="fixed inset-0 pointer-events-none z-[10000]">
      <AnimatePresence>
        {particles.map((p) => {
          const rad = (p.angle * Math.PI) / 180;
          return (
            <motion.div
              key={p.id}
              initial={{ x: p.x, y: p.y, scale: 1, opacity: 1, rotate: 0 }}
              animate={{ 
                x: p.x + Math.cos(rad) * p.distance, 
                y: p.y + Math.sin(rad) * p.distance, 
                scale: 0, 
                opacity: 0,
                rotate: 180
              }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              style={{
                position: 'absolute',
                width: p.size,
                height: p.size,
                backgroundColor: '#ffffff',
                boxShadow: '0 0 10px #ffffff',
                transform: 'translate(-50%, -50%)',
              }}
            />
          );
        })}
      </AnimatePresence>
      {/* Shockwave ring */}
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ x, y, scale: 0, opacity: 1 }}
            animate={{ scale: 2, opacity: 0 }}
            transition={{ duration: 0.4 }}
            style={{
              position: 'absolute',
              width: 60,
              height: 60,
              borderRadius: '50%',
              border: '4px solid #ffffff',
              transform: 'translate(-50%, -50%)',
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
