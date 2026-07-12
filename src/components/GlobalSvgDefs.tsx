/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

export const GlobalSvgDefs: React.FC = () => {
  return (
    <svg width="0" height="0" className="absolute pointer-events-none" style={{ position: 'fixed', left: -9999, top: -9999 }}>
      <defs>
        {/* ── Gold Gradients ── */}
        <linearGradient id="gold-primary" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="50%" stopColor="#eab308" />
          <stop offset="100%" stopColor="#854d0e" />
        </linearGradient>

        <linearGradient id="gold-bright" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fffbeb" />
          <stop offset="40%" stopColor="#fef08a" />
          <stop offset="100%" stopColor="#ca8a04" />
        </linearGradient>

        <linearGradient id="gold-trim-bevel" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fef08a" stopOpacity="0.8" />
          <stop offset="30%" stopColor="#eab308" />
          <stop offset="100%" stopColor="#713f12" />
        </linearGradient>

        {/* ── Stone Gradients ── */}
        <linearGradient id="stone-dark-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1e293b" />
          <stop offset="50%" stopColor="#0f172a" />
          <stop offset="100%" stopColor="#020617" />
        </linearGradient>

        <linearGradient id="stone-light-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#475569" />
          <stop offset="100%" stopColor="#1e293b" />
        </linearGradient>

        <linearGradient id="stone-bevel-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#64748b" />
          <stop offset="10%" stopColor="#334155" />
          <stop offset="100%" stopColor="#0f172a" />
        </linearGradient>

        {/* ── Gemstone Gradients ── */}
        {/* Ruby (Red) */}
        <linearGradient id="gem-ruby" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f87171" />
          <stop offset="30%" stopColor="#ef4444" />
          <stop offset="100%" stopColor="#7f1d1d" />
        </linearGradient>
        
        {/* Emerald (Green) */}
        <linearGradient id="gem-emerald" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#34d399" />
          <stop offset="30%" stopColor="#10b981" />
          <stop offset="100%" stopColor="#064e3b" />
        </linearGradient>

        {/* Sapphire (Blue) */}
        <linearGradient id="gem-sapphire" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#60a5fa" />
          <stop offset="30%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#1e3a8a" />
        </linearGradient>

        {/* Amethyst (Purple) */}
        <linearGradient id="gem-amethyst" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#c084fc" />
          <stop offset="30%" stopColor="#a855f7" />
          <stop offset="100%" stopColor="#581c87" />
        </linearGradient>

        {/* Topaz (Yellow) */}
        <linearGradient id="gem-topaz" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="30%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#78350f" />
        </linearGradient>

        {/* Aquamarine / Cyan */}
        <linearGradient id="gem-aquamarine" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#22d3ee" />
          <stop offset="30%" stopColor="#06b6d4" />
          <stop offset="100%" stopColor="#155e75" />
        </linearGradient>

        {/* Amber (Orange) */}
        <linearGradient id="gem-amber" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fb923c" />
          <stop offset="30%" stopColor="#f97316" />
          <stop offset="100%" stopColor="#7c2d12" />
        </linearGradient>

        {/* Diamond (Slate/Silver) */}
        <linearGradient id="gem-diamond" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f1f5f9" />
          <stop offset="30%" stopColor="#cbd5e1" />
          <stop offset="100%" stopColor="#475569" />
        </linearGradient>

        {/* Specular Glare overlay */}
        <linearGradient id="specular-glare" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.65" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.0" />
        </linearGradient>

        {/* ── Filters ── */}
        {/* Inset shadow (Empty cell depth) */}
        <filter id="inset-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feOffset dx="3" dy="3" />
          <feGaussianBlur stdDeviation="3.5" result="offset-blur" />
          <feComposite operator="out" in="SourceGraphic" in2="offset-blur" result="inverse" />
          <feFlood floodColor="#000000" floodOpacity="0.9" result="color" />
          <feComposite operator="in" in="color" in2="inverse" result="shadow" />
          <feComposite operator="over" in="shadow" in2="SourceGraphic" />
        </filter>

        {/* Gold Outer Glow */}
        <filter id="gold-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="4.5" result="blur" />
          <feComponentTransfer in="blur" result="glow1">
            <feFuncA type="linear" slope="0.6" />
          </feComponentTransfer>
          <feFlood floodColor="#fbbf24" result="color" />
          <feComposite operator="in" in="color" in2="glow1" result="glow2" />
          <feMerge>
            <feMergeNode in="glow2" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* 3D Bevel Emboss filter */}
        <filter id="bevel-emboss" x="-10%" y="-10%" width="120%" height="120%">
          <feGaussianBlur stdDeviation="1" result="blur" />
          <feSpecularLighting in="blur" surfaceScale="3" specularConstant="1.2" specularExponent="12" lightingColor="#ffffff" result="spec">
            <feDistantLight azimuth="220" elevation="50" />
          </feSpecularLighting>
          <feComposite operator="in" in="spec" in2="SourceGraphic" result="spec-comp" />
          <feComposite operator="arithmetic" k2="1" k3="0.85" in="SourceGraphic" in2="spec-comp" />
        </filter>
      </defs>
    </svg>
  );
};
