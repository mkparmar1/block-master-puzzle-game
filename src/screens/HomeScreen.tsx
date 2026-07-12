/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { SvgIcon } from '../components/SvgIcon';
import { SvgButton } from '../components/SvgButton';
import { SvgCard } from '../components/SvgCard';
import { SvgBadge } from '../components/SvgBadge';
import { SvgProgressBar } from '../components/SvgProgressBar';
import { useGameStore } from '../store/useGameStore';
import { usePlayerStore, getRankForXP, getNextRank } from '../store/usePlayerStore';
import { StarShop } from '../components/StarShop';

interface HomeScreenProps {
  onStart: () => void;
  onLeaderboard: () => void;
  onDaily: () => void;
  onQuests: () => void;
  onJourney: () => void;
  onSettings: () => void;
}

/* ── Particle Canvas Background ───────────────────────────────────── */
const ParticleCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const particles: Array<{
      x: number; y: number; r: number;
      vx: number; vy: number; alpha: number; color: string;
    }> = [];

    const colors = ['#3b82f6', '#6366f1', '#06b6d4', '#8b5cf6', '#60a5fa'];

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 2.5 + 0.5,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        alpha: Math.random() * 0.6 + 0.1,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color + Math.floor(p.alpha * 255).toString(16).padStart(2, '0');
        ctx.shadowBlur = 6;
        ctx.shadowColor = p.color;
        ctx.fill();
        ctx.shadowBlur = 0;
      });
      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.7 }}
    />
  );
};

/* ── Main HomeScreen ──────────────────────────────────────────────── */
export const HomeScreen: React.FC<HomeScreenProps> = ({
  onStart, onSettings, onLeaderboard, onDaily, onQuests, onJourney,
}) => {
  const { highScore, dailyStreak } = useGameStore();
  const { xp, stars } = usePlayerStore();
  const [showShop, setShowShop] = useState(false);

  const rank = getRankForXP(xp);
  const nextRank = getNextRank(xp);
  const progress = nextRank
    ? ((xp - rank.minXP) / (nextRank.minXP - rank.minXP)) * 100
    : 100;

  return (
    <div className="home-screen-root flex flex-col items-center justify-start h-full px-4 pb-6 relative overflow-y-auto overflow-x-hidden" style={{ background: 'linear-gradient(160deg, #0F172A 0%, #0d1f5c 45%, #1E3A8A 100%)', isolation: 'isolate' }}>

      {/* ── Deep Gradient Background ────────────────────────── */}
      <div className="home-bg-gradient absolute inset-0 pointer-events-none" />

      {/* ── Radial Orbs ─────────────────────────────────────── */}
      <div className="home-orb home-orb-1 absolute pointer-events-none" />
      <div className="home-orb home-orb-2 absolute pointer-events-none" />
      <div className="home-orb home-orb-3 absolute pointer-events-none" />

      {/* ── Particle Layer ──────────────────────────────────── */}
      <ParticleCanvas />

      {/* ── Floating Gemstone Deco ─────────────────────────────── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => {
          const size = 18 + (i % 3) * 10;
          const colors = ['#ff5252', '#69f0ae', '#ffd740', '#e040fb', '#448aff'];
          const color = colors[i % colors.length];
          const isDiamond = i % 2 === 0;
          return (
            <motion.div
              key={i}
              initial={{ x: `${10 + (i * 12)}%`, y: '115%', rotate: Math.random() * 360 }}
              animate={{ y: '-15%', rotate: Math.random() * 360 + 360 }}
              transition={{ duration: 20 + i * 4, repeat: Infinity, ease: 'linear', delay: i * 2 }}
              className="absolute opacity-15"
              style={{
                width: size,
                height: size,
                color: color,
              }}
            >
              <svg width="100%" height="100%" viewBox="0 0 10 10">
                <polygon 
                  points={isDiamond ? "5,0 10,5 5,10 0,5" : "5,0 10,3 8,10 2,10 0,3"} 
                  fill="currentColor" 
                  style={{ filter: `drop-shadow(0 0 4px ${color})` }}
                />
              </svg>
            </motion.div>
          );
        })}
      </div>

      {/* ══════════════════════════════════════════════════════
          TOP: Player Status Bar
      ══════════════════════════════════════════════════════ */}
      <motion.div
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', damping: 22, delay: 0.05 }}
        className="w-full max-w-sm flex items-stretch gap-3 mt-3 mb-4 z-10 flex-shrink-0 pt-safe"
      >
        {/* Rank + XP card */}
        <SvgCard className="flex-1 p-3.5" variant="stone">
          <div className="flex items-center gap-3">
            {/* Rank Badge */}
            <div className="relative flex-shrink-0">
              <div className="home-rank-badge w-12 h-12 rounded-2xl flex items-center justify-center text-2xl bg-slate-900/60 border border-slate-700">
                {rank.emoji}
              </div>
            </div>
            {/* XP Info */}
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-baseline mb-0.5">
                <p className="home-label-xs">CURRENT RANK</p>
                <p className="home-label-xs">{xp.toLocaleString()} XP</p>
              </div>
              <h3 className="text-sm font-black text-white leading-tight tracking-tight mb-1.5 truncate">
                {rank.title}
              </h3>
              {/* XP Progress Bar */}
              <SvgProgressBar progress={progress} height={8} />
            </div>
          </div>
        </SvgCard>

        {/* Stars / Currency */}
        <motion.div
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          className="flex items-center"
        >
          <SvgBadge
            type="star"
            value={stars}
            className="cursor-pointer py-3 h-full flex items-center"
            onClick={() => setShowShop(true)}
          />
        </motion.div>
      </motion.div>

      <StarShop isOpen={showShop} onClose={() => setShowShop(false)} />

      {/* ══════════════════════════════════════════════════════
          CENTER: Game Identity
      ══════════════════════════════════════════════════════ */}
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.15, type: 'spring', stiffness: 180 }}
        className="relative z-10 flex flex-col items-center mb-5 mt-1"
      >
        {/* Logo */}
        <div className="relative w-28 h-28 sm:w-36 sm:h-36 mb-3">
          <motion.div
            animate={{ scale: [1, 1.06, 1], rotate: [0, 1.5, -1.5, 0] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
            className="w-full h-full relative z-10"
          >
            <img
              src="/logos.png"
              alt="Block Master Logo"
              className="w-full h-full object-contain"
              style={{ filter: 'drop-shadow(0 0 28px rgba(59,130,246,0.7))' }}
            />
          </motion.div>
          <div className="home-logo-aura absolute inset-0 rounded-full pointer-events-none" />
        </div>

        {/* Title */}
        <div className="mb-1 select-none pointer-events-none">
          <svg width="320" height="60" viewBox="0 0 320 60" style={{ overflow: 'visible' }}>
            <text
              x="50%"
              y="45"
              textAnchor="middle"
              style={{
                fontFamily: "'Outfit', 'Inter', system-ui, sans-serif",
                fontSize: '40px',
                fontWeight: 950,
                fill: 'url(#gold-primary)',
                stroke: '#451a03',
                strokeWidth: '2.5px',
                filter: 'url(#bevel-emboss)',
                letterSpacing: '1px'
              }}
            >
              BLOCK MASTER
            </text>
          </svg>
        </div>
        <p className="home-subtitle tracking-[0.28em] text-[10px] font-bold uppercase mt-1">
          THE ULTIMATE CHALLENGE
        </p>
      </motion.div>

      {/* ══════════════════════════════════════════════════════
          PLAY BUTTON
      ══════════════════════════════════════════════════════ */}
      <motion.div
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.25, type: 'spring', stiffness: 220 }}
        className="relative z-10 mb-6 group"
      >
        {/* outer pulsing ring */}
        <div className="home-play-pulse absolute -inset-4 rounded-full pointer-events-none" />
        {/* mid glow ring */}
        <div className="home-play-glow-ring absolute -inset-2 rounded-full pointer-events-none" />

        <SvgButton
          onClick={onStart}
          id="home-play-btn"
          className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full"
          variant="gold"
        >
          <SvgIcon id="play" size={40} />
        </SvgButton>
      </motion.div>

      {/* ══════════════════════════════════════════════════════
          STATS: Best Score + Streak
      ══════════════════════════════════════════════════════ */}
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.32 }}
        className="w-full max-w-sm grid grid-cols-2 gap-3 mb-4 z-10"
      >
        {/* Best Score */}
        <SvgCard className="p-4 cursor-pointer" variant="stone">
          <div onClick={onLeaderboard}>
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 flex items-center justify-center mb-2">
              <SvgIcon id="leaderboard" size={17} />
            </div>
            <span className="home-label-xs mb-1 block">BEST SCORE</span>
            <span className="text-xl font-black text-white">{highScore.toLocaleString()}</span>
          </div>
        </SvgCard>

        {/* Daily Streak */}
        <SvgCard className="p-4 cursor-pointer" variant="stone">
          <div onClick={onDaily}>
            <div className="w-8 h-8 rounded-xl bg-orange-500/20 flex items-center justify-center mb-2">
              <SvgIcon id="daily" size={17} />
            </div>
            <span className="home-label-xs mb-1 block">STREAK</span>
            <span className="text-xl font-black text-white">{dailyStreak} Days</span>
          </div>
        </SvgCard>
      </motion.div>

      {/* ══════════════════════════════════════════════════════
          PRIMARY: Journey Mode
      ══════════════════════════════════════════════════════ */}
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.38 }}
        className="w-full max-w-sm mb-3 z-10"
      >
        <SvgButton
          onClick={onJourney}
          id="home-journey-btn"
          className="w-full py-4 rounded-[1.6rem]"
          variant="gold"
        >
          <SvgIcon id="journey" size={20} />
          JOURNEY MODE
        </SvgButton>
      </motion.div>

      {/* ══════════════════════════════════════════════════════
          SECONDARY: Daily + Missions
      ══════════════════════════════════════════════════════ */}
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.44 }}
        className="w-full max-w-sm grid grid-cols-2 gap-3 mb-4 z-10"
      >
        <SvgButton
          onClick={onDaily}
          id="home-daily-btn"
          className="w-full py-4 rounded-[1.4rem]"
          variant="stone"
        >
          <div className="flex flex-col items-center gap-1">
            <SvgIcon id="daily" size={18} />
            <span>DAILY</span>
          </div>
        </SvgButton>

        <SvgButton
          onClick={onQuests}
          id="home-missions-btn"
          className="w-full py-4 rounded-[1.4rem]"
          variant="stone"
        >
          <div className="flex flex-col items-center gap-1">
            <SvgIcon id="mission" size={18} />
            <span>MISSIONS</span>
          </div>
        </SvgButton>
      </motion.div>

      {/* ══════════════════════════════════════════════════════
          BOTTOM: Leaderboard + Settings icons
      ══════════════════════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.52 }}
        className="flex gap-4 z-10 mb-2"
      >
        <motion.button
          whileHover={{ scale: 1.12 }}
          whileTap={{ scale: 0.92 }}
          onClick={onLeaderboard}
          id="home-leaderboard-btn"
          className="home-icon-btn p-3 rounded-2xl flex items-center justify-center bg-slate-900/60 border border-slate-700 shadow-md"
        >
          <SvgIcon id="leaderboard" size={20} />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.12 }}
          whileTap={{ scale: 0.92 }}
          onClick={onSettings}
          id="home-settings-btn"
          className="home-icon-btn p-3 rounded-2xl flex items-center justify-center bg-slate-900/60 border border-slate-700 shadow-md"
        >
          <SvgIcon id="settings" size={20} />
        </motion.button>
      </motion.div>

      <div className="pb-safe home-footer mt-2 text-[9px] font-black tracking-[0.4em] uppercase text-slate-500 z-10">
        Premium Edition v1.4.1
      </div>
    </div>
  );
};
