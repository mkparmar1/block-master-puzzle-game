/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

export const GlobalSvgDefs: React.FC = () => {
  return (
    <svg width="0" height="0" className="absolute pointer-events-none" style={{ position: 'fixed', left: -9999, top: -9999 }}>
      <defs>
        {/* ── Premium Chrome Gold Gradients (High-Contrast Metallic Reflection) ── */}
        <linearGradient id="gold-primary" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#451a03" />
          <stop offset="15%" stopColor="#b45309" />
          <stop offset="30%" stopColor="#d97706" />
          <stop offset="48%" stopColor="#ffffff" />
          <stop offset="52%" stopColor="#fef08a" />
          <stop offset="75%" stopColor="#eab308" />
          <stop offset="90%" stopColor="#9a6a12" />
          <stop offset="100%" stopColor="#3d2003" />
        </linearGradient>

        <linearGradient id="gold-bright" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="25%" stopColor="#fef08a" />
          <stop offset="60%" stopColor="#ca8a04" />
          <stop offset="100%" stopColor="#713f12" />
        </linearGradient>

        <linearGradient id="gold-trim-bevel" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
          <stop offset="20%" stopColor="#fef08a" />
          <stop offset="50%" stopColor="#eab308" />
          <stop offset="85%" stopColor="#854d0e" />
          <stop offset="100%" stopColor="#451a03" />
        </linearGradient>

        {/* ── Ancient Textured Stone Gradients ── */}
        <linearGradient id="stone-dark-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1e293b" />
          <stop offset="35%" stopColor="#111827" />
          <stop offset="75%" stopColor="#0f172a" />
          <stop offset="100%" stopColor="#020617" />
        </linearGradient>

        <linearGradient id="stone-light-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#64748b" />
          <stop offset="40%" stopColor="#475569" />
          <stop offset="100%" stopColor="#1e293b" />
        </linearGradient>

        <linearGradient id="stone-bevel-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#94a3b8" />
          <stop offset="20%" stopColor="#475569" />
          <stop offset="80%" stopColor="#1e293b" />
          <stop offset="100%" stopColor="#0f172a" />
        </linearGradient>

        {/* ── Volumetric Gemstone Core Glow Gradients (Top-Left Light Source) ── */}
        {/* Ruby */}
        <radialGradient id="gem-ruby" cx="30%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#fca5a5" />
          <stop offset="25%" stopColor="#ef4444" />
          <stop offset="70%" stopColor="#b91c1c" />
          <stop offset="100%" stopColor="#450a0a" />
        </radialGradient>
        
        {/* Emerald */}
        <radialGradient id="gem-emerald" cx="30%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#a7f3d0" />
          <stop offset="25%" stopColor="#10b981" />
          <stop offset="70%" stopColor="#047857" />
          <stop offset="100%" stopColor="#062f21" />
        </radialGradient>

        {/* Sapphire */}
        <radialGradient id="gem-sapphire" cx="30%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#bfdbfe" />
          <stop offset="25%" stopColor="#3b82f6" />
          <stop offset="70%" stopColor="#1d4ed8" />
          <stop offset="100%" stopColor="#172554" />
        </radialGradient>

        {/* Amethyst */}
        <radialGradient id="gem-amethyst" cx="30%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#e9d5ff" />
          <stop offset="25%" stopColor="#a855f7" />
          <stop offset="70%" stopColor="#7e22ce" />
          <stop offset="100%" stopColor="#3b0764" />
        </radialGradient>

        {/* Topaz */}
        <radialGradient id="gem-topaz" cx="30%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#fde047" />
          <stop offset="25%" stopColor="#f59e0b" />
          <stop offset="70%" stopColor="#b45309" />
          <stop offset="100%" stopColor="#451a03" />
        </radialGradient>

        {/* Aquamarine */}
        <radialGradient id="gem-aquamarine" cx="30%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#cffafe" />
          <stop offset="25%" stopColor="#06b6d4" />
          <stop offset="70%" stopColor="#0e7490" />
          <stop offset="100%" stopColor="#083344" />
        </radialGradient>

        {/* Amber */}
        <radialGradient id="gem-amber" cx="30%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#ffedd5" />
          <stop offset="25%" stopColor="#f97316" />
          <stop offset="70%" stopColor="#c2410c" />
          <stop offset="100%" stopColor="#431407" />
        </radialGradient>

        {/* Diamond */}
        <radialGradient id="gem-diamond" cx="30%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="35%" stopColor="#cbd5e1" />
          <stop offset="75%" stopColor="#64748b" />
          <stop offset="100%" stopColor="#1e293b" />
        </radialGradient>

        {/* Specular Glare overlay */}
        <linearGradient id="specular-glare" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.75" />
          <stop offset="50%" stopColor="#ffffff" stopOpacity="0.15" />
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
