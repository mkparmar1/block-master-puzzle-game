/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useGameStore } from '../store/useGameStore';
import { Difficulty } from '../game/blockShapes';
import { Play, ChevronLeft, Grid3x3, Zap, Shield, Flame } from 'lucide-react';

/* ── Mini particle canvas ─────────────────────────────── */
const MsParticles: React.FC = () => {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext('2d'); if (!ctx) return;
    let id: number;
    const pts = Array.from({ length: 40 }, () => ({
      x: Math.random() * 800, y: Math.random() * 900,
      vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35,
      r: Math.random() * 2 + 0.5,
      a: Math.random() * 0.55 + 0.1,
      col: ['#3b82f6','#6366f1','#06b6d4','#8b5cf6'][Math.floor(Math.random()*4)],
    }));
    const resize = () => { c.width = c.offsetWidth; c.height = c.offsetHeight; };
    resize(); window.addEventListener('resize', resize);
    const draw = () => {
      ctx.clearRect(0,0,c.width,c.height);
      pts.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = c.width; if (p.x > c.width) p.x = 0;
        if (p.y < 0) p.y = c.height; if (p.y > c.height) p.y = 0;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
        ctx.fillStyle = p.col + Math.floor(p.a*255).toString(16).padStart(2,'0');
        ctx.shadowBlur = 5; ctx.shadowColor = p.col;
        ctx.fill(); ctx.shadowBlur = 0;
      });
      id = requestAnimationFrame(draw);
    };
    draw();
    return () => { window.removeEventListener('resize', resize); cancelAnimationFrame(id); };
  }, []);
  return <canvas ref={ref} className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: 0.65 }} />;
};

/* ── Mini grid icon ───────────────────────────────────── */
const GridIcon: React.FC<{ size: number; active: boolean }> = ({ size, active }) => {
  const cols = size === 8 ? 3 : size === 10 ? 4 : 5;
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 2, width: 32, height: 32 }}>
      {Array.from({ length: cols * cols }).map((_, i) => (
        <div key={i} style={{
          borderRadius: 1.5,
          background: active ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.18)',
          transition: 'background 0.3s',
        }} />
      ))}
    </div>
  );
};

interface LevelSelectionScreenProps {
  onBack: () => void;
  onStart: () => void;
}

export const LevelSelectionScreen: React.FC<LevelSelectionScreenProps> = ({ onBack, onStart }) => {
  const startGame = useGameStore((s) => s.startGame);
  const [selectedSize, setSelectedSize] = useState(8);
  const [selectedDiff, setSelectedDiff] = useState<Difficulty>('medium');

  const sizes = [
    { value: 8,  label: '8×8',   desc: 'Classic'  },
    { value: 10, label: '10×10', desc: 'Standard' },
    { value: 12, label: '12×12', desc: 'Expert'   },
  ];

  const difficulties: {
    value: Difficulty; label: string; desc: string;
    accent: string; glow: string; icon: React.ReactNode;
    gradient: string;
  }[] = [
    {
      value: 'easy', label: 'Easy', desc: 'Simple Shapes',
      accent: '#22c55e', glow: 'rgba(34,197,94,0.35)',
      gradient: 'linear-gradient(135deg, #14532d, #16a34a)',
      icon: <Shield size={20} />,
    },
    {
      value: 'medium', label: 'Medium', desc: 'Balanced Mix',
      accent: '#3b82f6', glow: 'rgba(59,130,246,0.45)',
      gradient: 'linear-gradient(135deg, #1e3a8a, #3b82f6)',
      icon: <Zap size={20} />,
    },
    {
      value: 'hard', label: 'Hard', desc: 'Complex Blocks',
      accent: '#ef4444', glow: 'rgba(239,68,68,0.35)',
      gradient: 'linear-gradient(135deg, #7f1d1d, #ef4444)',
      icon: <Flame size={20} />,
    },
  ];

  const handleStart = () => { startGame(selectedSize, selectedDiff); onStart(); };

  return (
    <div
      className="ms-root flex flex-col items-center justify-start h-full px-4 pb-8 relative overflow-y-auto overflow-x-hidden"
      style={{ background: 'linear-gradient(160deg, #0F172A 0%, #0d1f5c 50%, #1E3A8A 100%)', isolation: 'isolate' }}
    >
      {/* Background layers */}
      <div className="ms-orb ms-orb-1 absolute pointer-events-none" />
      <div className="ms-orb ms-orb-2 absolute pointer-events-none" />
      <MsParticles />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className="w-full max-w-md relative z-10 pt-safe"
      >
        {/* ── Header ── */}
        <div className="flex items-center gap-4 mt-4 mb-8">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onBack}
            id="ms-back-btn"
            className="ms-back-btn flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-2xl"
          >
            <ChevronLeft size={24} className="text-slate-200" />
          </motion.button>

          <div>
            <h1 className="ms-title text-3xl sm:text-4xl font-black tracking-tight leading-none">
              MISSION SETUP
            </h1>
            <p className="ms-subtitle mt-0.5">Configure your challenge</p>
          </div>
        </div>

        {/* ── Grid Dimensions ── */}
        <section className="mb-7">
          <div className="ms-section-label flex items-center gap-2 mb-3">
            <Grid3x3 size={13} />
            GRID DIMENSIONS
          </div>

          <div className="grid grid-cols-3 gap-3">
            {sizes.map((sz, idx) => {
              const active = selectedSize === sz.value;
              return (
                <motion.button
                  key={sz.value}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.07 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedSize(sz.value)}
                  id={`ms-size-${sz.value}`}
                  className="ms-size-card relative flex flex-col items-center justify-center gap-2 py-4 rounded-2xl overflow-hidden"
                  style={active ? {
                    background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
                    boxShadow: '0 0 24px rgba(99,102,241,0.55), 0 8px 24px rgba(0,0,0,0.45)',
                    border: '1px solid rgba(255,255,255,0.18)',
                    transform: 'scale(1.04)',
                  } : {
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.09)',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
                  }}
                >
                  <GridIcon size={sz.value} active={active} />
                  <div className="text-center">
                    <div className={`font-black text-lg leading-none ${active ? 'text-white' : 'text-slate-300'}`}>{sz.label}</div>
                    <div className={`text-[9px] font-bold uppercase tracking-widest mt-0.5 ${active ? 'text-white/70' : 'text-slate-500'}`}>{sz.desc}</div>
                  </div>
                  {active && (
                    <div className="absolute inset-0 pointer-events-none" style={{
                      background: 'linear-gradient(135deg, rgba(255,255,255,0.12) 0%, transparent 60%)',
                    }} />
                  )}
                </motion.button>
              );
            })}
          </div>
        </section>

        {/* ── Challenge Level ── */}
        <section className="mb-8">
          <div className="ms-section-label flex items-center gap-2 mb-3">
            <Zap size={13} />
            CHALLENGE LEVEL
          </div>

          <div className="flex flex-col gap-3">
            {difficulties.map((diff, idx) => {
              const active = selectedDiff === diff.value;
              return (
                <motion.button
                  key={diff.value}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + idx * 0.08 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setSelectedDiff(diff.value)}
                  id={`ms-diff-${diff.value}`}
                  className="ms-diff-card relative flex items-center justify-between px-5 py-4 rounded-[1.4rem] overflow-hidden"
                  style={active ? {
                    background: diff.gradient,
                    border: `1px solid ${diff.accent}66`,
                    boxShadow: `0 0 28px ${diff.glow}, 0 8px 24px rgba(0,0,0,0.45)`,
                  } : {
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
                  }}
                >
                  {/* Left: color dot + text */}
                  <div className="flex items-center gap-4">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{
                        background: active ? 'rgba(255,255,255,0.18)' : `${diff.accent}22`,
                        border: `1.5px solid ${diff.accent}55`,
                        boxShadow: active ? `0 0 14px ${diff.glow}` : 'none',
                        color: active ? '#fff' : diff.accent,
                      }}
                    >
                      {diff.icon}
                    </div>
                    <div className="text-left">
                      <div className={`font-black text-lg tracking-tight leading-tight ${active ? 'text-white' : 'text-slate-300'}`}>
                        {diff.label}
                      </div>
                      <div className={`text-[10px] font-bold uppercase tracking-widest ${active ? 'text-white/65' : 'text-slate-500'}`}>
                        {diff.desc}
                      </div>
                    </div>
                  </div>

                  {/* Right: play badge when active */}
                  <AnimatePresence>
                    {active && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center"
                        style={{
                          background: 'rgba(255,255,255,0.22)',
                          boxShadow: '0 0 12px rgba(255,255,255,0.3)',
                        }}
                      >
                        <Play size={15} fill="white" className="ml-0.5 text-white" />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Shine overlay */}
                  {active && (
                    <div className="absolute inset-0 pointer-events-none" style={{
                      background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 55%)',
                    }} />
                  )}

                  {/* Glow pulse for selected */}
                  {active && (
                    <motion.div
                      className="absolute inset-0 rounded-[1.4rem] pointer-events-none"
                      animate={{ opacity: [0.4, 0.8, 0.4] }}
                      transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
                      style={{ boxShadow: `inset 0 0 20px ${diff.glow}` }}
                    />
                  )}
                </motion.button>
              );
            })}
          </div>
        </section>

        {/* ── Start Mission Button ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="relative"
        >
          {/* Pulsing outer glow */}
          <motion.div
            className="absolute -inset-2 rounded-[2rem] pointer-events-none"
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            style={{ background: 'linear-gradient(135deg, rgba(37,99,235,0.35), rgba(6,182,212,0.35))', filter: 'blur(8px)' }}
          />

          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.96 }}
            onClick={handleStart}
            id="ms-start-btn"
            className="ms-start-btn relative w-full flex items-center justify-center gap-3 py-5 rounded-[1.8rem] text-white font-black text-xl tracking-wide overflow-hidden"
          >
            <Play size={24} fill="white" />
            START MISSION
            {/* Shine sweep */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              animate={{ x: ['-100%', '150%'] }}
              transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut', repeatDelay: 1.5 }}
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.14), transparent)',
                width: '60%',
              }}
            />
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
};
