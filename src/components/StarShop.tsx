import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Hammer, Zap, ShoppingBag, Star } from 'lucide-react';
import { usePlayerStore } from '../store/usePlayerStore';
import { cn } from '../lib/utils';

interface StarShopProps {
  isOpen: boolean;
  onClose: () => void;
}

const ShopItem: React.FC<{
  id: 'hammer';
  icon: React.ReactNode;
  name: string;
  description: string;
  stars: number;
  inventoryCount: number;
  onBuy: (id: 'hammer', cost: number) => void;
  canAfford: boolean;
}> = ({ id, icon, name, description, stars, inventoryCount, onBuy, canAfford }) => (
  <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/40 rounded-3xl border border-slate-100 dark:border-slate-800/60 shadow-sm transition-all hover:border-blue-500/30">
    <div className="flex items-center gap-4">
      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg">
        {icon}
      </div>
      <div>
        <p className="font-black text-slate-900 dark:text-white text-lg tracking-tight">{name}</p>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-1">{description}</p>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-black uppercase text-blue-500 bg-blue-50 dark:bg-blue-500/10 px-2 py-0.5 rounded-full">
            In Storage: {inventoryCount}
          </span>
        </div>
      </div>
    </div>
    <motion.button
      whileHover={canAfford ? { scale: 1.05 } : { x: [-2, 2, -2, 2, 0] }}
      whileTap={canAfford ? { scale: 0.95 } : {}}
      onClick={() => canAfford && onBuy(id, stars)}
      className={cn(
        "flex flex-col items-center justify-center gap-1 min-w-[80px] p-3 rounded-2xl font-black text-xs transition-all shadow-md",
        canAfford 
          ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900" 
          : "bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed shadow-none"
      )}
    >
      <div className="flex items-center gap-1">
        <Star size={12} fill={canAfford ? "currentColor" : "none"} />
        <span>{stars}</span>
      </div>
      <span className="text-[9px] uppercase tracking-tighter opacity-70">Buy</span>
    </motion.button>
  </div>
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

          {/* Drawer */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-[201] bg-white dark:bg-slate-900 rounded-t-[3rem] shadow-2xl p-6 border-t border-white/20"
          >
            {/* Grab Handle */}
            <div className="w-12 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full mx-auto mb-6" />

            <div className="max-w-md mx-auto">
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-500 rounded-2xl text-white">
                    <ShoppingBag size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">STAR SHOP</h2>
                    <p className="text-xs text-slate-500 uppercase font-black tracking-widest">Premium Tools</p>
                  </div>
                </div>
                
                {/* Balance */}
                <div className="px-4 py-2 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 rounded-full flex items-center gap-2">
                  <Star size={18} fill="#f59e0b" className="text-amber-500" />
                  <span className="font-black text-amber-600 dark:text-amber-500 text-lg">{stars}</span>
                </div>
              </div>

              {/* Items List */}
              <div className="flex flex-col gap-4 mb-8">
                <ShopItem
                  id="hammer"
                  name="Sledgehammer"
                  description="Smashes any single cell on the board"
                  icon={<Hammer size={24} />}
                  stars={50}
                  inventoryCount={inventory.hammer}
                  onBuy={purchaseItem}
                  canAfford={stars >= 50}
                />
                
                {/* More items can be added here */}
                <div className="p-4 bg-slate-100 dark:bg-slate-800/30 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 text-center">
                  <p className="text-xs font-bold text-slate-400">More Tools Coming Soon!</p>
                </div>
              </div>

              {/* Close Button */}
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="w-full py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-black rounded-2xl transition-colors hover:bg-slate-200"
              >
                CLOSE
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
