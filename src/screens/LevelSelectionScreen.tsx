/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useGameStore } from '../store/useGameStore';
import { Difficulty } from '../game/blockShapes';
import { SvgIcon } from '../components/SvgIcon';
import { SvgButton } from '../components/SvgButton';
import { SvgCard } from '../components/SvgCard';

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
      icon: <SvgIcon id="xp" size={20} />,
    },
    {
      value: 'medium', label: 'Medium', desc: 'Balanced Mix',
      accent: '#3b82f6', glow: 'rgba(59,130,246,0.45)',
      gradient: 'linear-gradient(135deg, #1e3a8a, #3b82f6)',
      icon: <SvgIcon id="zap" size={20} />,
    },
    {
      value: 'hard', label: 'Hard', desc: 'Complex Blocks',
      accent: '#ef4444', glow: 'rgba(239,68,68,0.35)',
      gradient: 'linear-gradient(135deg, #7f1d1d, #ef4444)',
      icon: <SvgIcon id="daily" size={20} />,
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
            className="ms-back-btn flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-2xl bg-slate-900/60 border border-slate-700 shadow-md"
          >
            <SvgIcon id="back" size={24} />
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
            <SvgIcon id="theme" size={13} />
            GRID DIMENSIONS
          </div>

          <div className="grid grid-cols-3 gap-3">
            {sizes.map((sz, idx) => {
              const active = selectedSize === sz.value;
              return (
                <motion.div
                  key={sz.value}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.07 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedSize(sz.value)}
                  id={`ms-size-${sz.value}`}
                  className="cursor-pointer"
                >
                  <SvgCard className="p-4 flex flex-col items-center justify-center gap-2" variant={active ? 'gold-border' : 'stone'}>
                    <GridIcon size={sz.value} active={active} />
                    <div className="text-center">
                      <div className={`font-black text-lg leading-none ${active ? 'text-amber-950' : 'text-slate-300'}`}>{sz.label}</div>
                      <div className={`text-[9px] font-bold uppercase tracking-widest mt-0.5 ${active ? 'text-amber-950/70' : 'text-slate-500'}`}>{sz.desc}</div>
                    </div>
                  </SvgCard>
                </motion.div>
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
                <motion.div
                  key={diff.value}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + idx * 0.08 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setSelectedDiff(diff.value)}
                  id={`ms-diff-${diff.value}`}
                  className="cursor-pointer"
                >
                  <SvgCard className="px-5 py-4 flex items-center justify-between" variant={active ? 'gold-border' : 'stone'}>
                    {/* Left: color dot + text */}
                    <div className="flex items-center gap-4">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 bg-slate-900/60 border border-slate-700"
                        style={{
                          boxShadow: active ? `0 0 14px ${diff.glow}` : 'none',
                        }}
                      >
                        {diff.icon}
                      </div>
                      <div className="text-left">
                        <div className={`font-black text-lg tracking-tight leading-tight ${active ? 'text-amber-950' : 'text-slate-300'}`}>
                          {diff.label}
                        </div>
                        <div className={`text-[10px] font-bold uppercase tracking-widest ${active ? 'text-amber-950/70' : 'text-slate-500'}`}>
                          {diff.desc}
                        </div>
                      </div>
                    </div>

                    {/* Right: play badge when active */}
                    {active && (
                      <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-amber-950/20">
                        <SvgIcon id="play" size={14} />
                      </div>
                    )}
                  </SvgCard>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* ── Start Mission Button ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <SvgButton
            onClick={handleStart}
            id="ms-start-btn"
            className="w-full py-5 rounded-[1.8rem]"
            variant="gold"
          >
            <SvgIcon id="play" size={24} />
            START MISSION
          </SvgButton>
        </motion.div>
      </motion.div>
    </div>
  );
};
