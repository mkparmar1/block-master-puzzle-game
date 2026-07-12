/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';

interface SvgButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'gold' | 'stone' | 'danger' | 'success' | 'reward';
  className?: string;
  children: React.ReactNode;
}

export const SvgButton: React.FC<SvgButtonProps> = ({
  variant = 'gold',
  className = '',
  children,
  disabled,
  ...props
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  // Map theme variables
  let fillUrl = 'url(#gold-primary)';
  let borderUrl = 'url(#gold-trim-bevel)';
  let textColor = 'text-amber-950';

  if (variant === 'stone') {
    fillUrl = 'url(#stone-light-grad)';
    borderUrl = '#475569';
    textColor = 'text-slate-200';
  } else if (variant === 'danger') {
    fillUrl = 'url(#gem-ruby)';
    borderUrl = '#f87171';
    textColor = 'text-white';
  } else if (variant === 'success') {
    fillUrl = 'url(#gem-emerald)';
    borderUrl = '#34d399';
    textColor = 'text-white';
  } else if (variant === 'reward') {
    fillUrl = 'url(#gem-topaz)';
    borderUrl = '#fbbf24';
    textColor = 'text-amber-950';
  }

  if (disabled) {
    fillUrl = 'url(#stone-dark-grad)';
    borderUrl = '#1e293b';
    textColor = 'text-slate-500';
  }

  return (
    <motion.button
      whileHover={disabled ? {} : { scale: 1.03 }}
      whileTap={disabled ? {} : { scale: 0.96 }}
      onMouseEnter={() => !disabled && setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); setIsPressed(false); }}
      onMouseDown={() => !disabled && setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onTouchStart={() => !disabled && setIsPressed(true)}
      onTouchEnd={() => setIsPressed(false)}
      disabled={disabled}
      className={`relative select-none outline-none ${className}`}
      {...props}
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 200 56"
        preserveAspectRatio="none"
        style={{ display: 'block', overflow: 'visible' }}
      >
        {/* Outer Shadow */}
        <rect
          x="0"
          y="4"
          width="200"
          height="52"
          rx="16"
          fill="rgba(0,0,0,0.6)"
        />

        {/* Tactile Bevel Base (moves down 2px when pressed) */}
        <rect
          x="0"
          y={isPressed ? 4 : 0}
          width="200"
          height="52"
          rx="16"
          fill={fillUrl}
          stroke={borderUrl}
          strokeWidth="2"
          filter={!disabled && isHovered ? 'url(#bevel-emboss)' : undefined}
          style={{ transition: 'y 0.08s' }}
        />

        {/* Specular Glare Inner Arc (on top half) */}
        {!disabled && (
          <path
            d={isPressed ? "M3 22a13 13 0 0 1 13-13h168a13 13 0 0 1 13 13v2H3v-2z" : "M3 18a13 13 0 0 1 13-13h168a13 13 0 0 1 13 13v2H3v-2z"}
            fill="url(#specular-glare)"
            pointerEvents="none"
            style={{ transition: 'd 0.08s' }}
          />
        )}
      </svg>

      {/* Button Content Text/Icons Overlay */}
      <div
        className={`absolute inset-0 flex items-center justify-center font-black tracking-wide text-center uppercase text-sm px-4 gap-2 ${textColor}`}
        style={{
          transform: isPressed ? 'translateY(2px)' : 'translateY(0)',
          textShadow: variant === 'gold' || variant === 'reward' ? '0 1px 0 rgba(255,255,255,0.45)' : '0 -1px 0 rgba(0,0,0,0.5)',
          transition: 'transform 0.08s',
        }}
      >
        {children}
      </div>
    </motion.button>
  );
};
