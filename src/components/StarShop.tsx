/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { usePlayerStore } from '../store/usePlayerStore';
import { SvgIcon } from './SvgIcon';
import { SvgButton } from './SvgButton';
import { SvgCard } from './SvgCard';
import { SvgBadge } from './SvgBadge';

interface StarShopProps {
  isOpen: boolean;
  onClose: () => void;
}

const ShopItem: React.FC<{
  id: 'hammer';
  name: string;
  description: string;
  stars: number;
  inventoryCount: number;
  onBuy: (id: 'hammer', cost: number) => void;
  canAfford: boolean;
}> = ({ id, name, description, stars, inventoryCount, onBuy, canAfford }) => (
  <SvgCard className="p-4" variant="stone">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-slate-950/40 border border-slate-800 flex items-center justify-center text-amber-500 flex-shrink-0">
          <SvgIcon id="hammer" size={24} />
        </div>
        <div className="text-left">
          <p className="font-black text-white text-lg tracking-tight">{name}</p>
          <p className="text-xs text-slate-400 font-medium mb-1">{description}</p>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase text-amber-500 bg-amber-950/20 px-2 py-0.5 rounded-full">
              In Storage: {inventoryCount}
            </span>
          </div>
        </div>
      </div>
      <SvgButton
        onClick={() => canAfford && onBuy(id, stars)}
        disabled={!canAfford}
        className="min-w-[80px] py-2"
        variant={canAfford ? 'gold' : 'stone'}
      >
        <div className="flex flex-col items-center gap-0.5">
          <div className="flex items-center gap-1">
            <SvgIcon id="stars" size={12} />
            <span>{stars}</span>
          </div>
          <span className="text-[9px] uppercase tracking-tighter opacity-70">Buy</span>
        </div>
      </SvgButton>
    </div>
  </SvgCard>
);

export const StarShop: React.FC<StarShopProps> = ({ isOpen, onClose }) => {
  const { stars, inventory, purchaseItem } = usePlayerStore();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-[200]"
          />

          {/* Drawer Container */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-[201] max-w-md mx-auto"
          >
            <SvgCard className="p-6 rounded-t-[3rem]" variant="gold-border">
              {/* Grab Handle */}
              <div className="w-12 h-1.5 bg-slate-800 rounded-full mx-auto mb-6" />

              <div>
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-slate-950/40 border border-slate-800 flex items-center justify-center text-amber-500">
                      <SvgIcon id="theme" size={24} />
                    </div>
                    <div className="text-left">
                      <h2 className="text-2xl font-black text-white tracking-tighter">STAR SHOP</h2>
                      <p className="text-xs text-amber-500 uppercase font-black tracking-widest">Premium Tools</p>
                    </div>
                  </div>
                  
                  {/* Balance */}
                  <SvgBadge type="star" value={stars} />
                </div>

                {/* Items List */}
                <div className="flex flex-col gap-4 mb-8">
                  <ShopItem
                    id="hammer"
                    name="Sledgehammer"
                    description="Smashes any single cell on the board"
                    stars={50}
                    inventoryCount={inventory.hammer}
                    onBuy={purchaseItem}
                    canAfford={stars >= 50}
                  />
                  
                  <div className="p-4 bg-slate-950/40 rounded-3xl border border-dashed border-slate-800 text-center">
                    <p className="text-xs font-bold text-slate-500">More Tools Coming Soon!</p>
                  </div>
                </div>

                {/* Close Button */}
                <SvgButton
                  onClick={onClose}
                  className="w-full py-4 rounded-2xl"
                  variant="stone"
                >
                  CLOSE
                </SvgButton>
              </div>
            </SvgCard>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
