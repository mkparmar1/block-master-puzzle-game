/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { HomeScreen } from './screens/HomeScreen';
import { GameScreen } from './screens/GameScreen';
import { GameOverScreen } from './screens/GameOverScreen';
import { LevelSelectionScreen } from './screens/LevelSelectionScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { LeaderboardScreen } from './screens/LeaderboardScreen';
import { DailyChallengeScreen } from './screens/DailyChallengeScreen';
import { TutorialScreen } from './screens/TutorialScreen';
import { QuestsScreen } from './screens/QuestsScreen';
import { JourneyScreen } from './screens/JourneyScreen';
import { CampaignLevel } from './lib/campaignLevels';
import { useGameStore } from './store/useGameStore';
import { useThemeStore } from './store/useThemeStore';
import { usePlayerStore } from './store/usePlayerStore';
import { AnimatePresence, motion } from 'motion/react';
import { App as CapApp } from '@capacitor/app';

type Screen = 'tutorial' | 'home' | 'level-selection' | 'game' | 'settings' | 'leaderboard' | 'daily' | 'quests' | 'journey';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [isSplashVisible, setIsSplashVisible] = useState(true);
  const { isGameOver, resetGame } = useGameStore();
  const { applyCurrentTheme } = useThemeStore();
  const { hasSeenTutorial, markTutorialSeen } = usePlayerStore();

  // Handle Splash Screen Timer
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsSplashVisible(false);
    }, 2200); // 2.2 seconds for full animation
    return () => clearTimeout(timer);
  }, []);

  // Apply saved theme on mount
  useEffect(() => {
    applyCurrentTheme();
  }, [applyCurrentTheme]);

  // Show tutorial on first launch
  useEffect(() => {
    if (!hasSeenTutorial) {
      setCurrentScreen('tutorial');
    }
  }, [hasSeenTutorial]);

  // Prevent double-finger scroll on mobile
  useEffect(() => {
    const preventDefault = (e: TouchEvent) => {
      if (e.touches.length > 1) e.preventDefault();
    };
    document.addEventListener('touchstart', preventDefault, { passive: false });
    return () => document.removeEventListener('touchstart', preventDefault);
  }, []);

  // Hardware Back Button Handler (Android)
  useEffect(() => {
    let sub: any;
    
    const initListener = async () => {
      try {
        if (!CapApp) return;
        sub = await CapApp.addListener('backButton', () => {
          if (isGameOver) {
            resetGame();
            setCurrentScreen('home');
          } else if (currentScreen !== 'home') {
            setCurrentScreen('home');
          } else {
            CapApp.exitApp();
          }
        });
      } catch (e) {
        console.warn('Capacitor App listener failed:', e);
      }
    };

    initListener();

    return () => {
      if (sub && typeof sub.remove === 'function') {
        sub.remove();
      } else if (sub && sub.then) {
        sub.then((h: any) => h.remove());
      }
    };
  }, [currentScreen, isGameOver, resetGame]);

  const handleTutorialComplete = () => {
    markTutorialSeen();
    setCurrentScreen('home');
  };

  const handleGoToSelection = () => setCurrentScreen('level-selection');
  const handleStartGame = () => setCurrentScreen('game');
  const handleHome = () => setCurrentScreen('home');
  const handleSettings = () => setCurrentScreen('settings');
  const handleLeaderboard = () => setCurrentScreen('leaderboard');
  const handleDaily = () => setCurrentScreen('daily');
  const handleQuests = () => setCurrentScreen('quests');
  const handleJourney = () => setCurrentScreen('journey');
  const handleRestart = () => resetGame();

  const handleStartJourneyLevel = (level: CampaignLevel) => {
    useGameStore.getState().startGame(level.gridSize, level.difficulty, false);
    useGameStore.getState().setJourneyLevel(level); 
    setCurrentScreen('game');
  };

  return (
    <div className="h-full w-full overflow-hidden text-slate-100 selection:bg-blue-500/30 relative" style={{ background: '#0F172A' }}>
      <AnimatePresence>
        {currentScreen === 'tutorial' && (
          <motion.div key="tutorial" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0">
            <TutorialScreen onComplete={handleTutorialComplete} />
          </motion.div>
        )}
        {currentScreen === 'home' && (
          <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, x: -20 }} className="absolute inset-0">
            <HomeScreen
              onStart={handleGoToSelection}
              onSettings={handleSettings}
              onLeaderboard={handleLeaderboard}
              onDaily={handleDaily}
              onQuests={handleQuests}
              onJourney={handleJourney}
            />
          </motion.div>
        )}
        {currentScreen === 'level-selection' && (
          <motion.div key="selection" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="absolute inset-0">
            <LevelSelectionScreen onBack={handleHome} onStart={handleStartGame} />
          </motion.div>
        )}
        {currentScreen === 'game' && (
          <motion.div key="game" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0">
            <GameScreen onHome={handleHome} />
          </motion.div>
        )}
        {currentScreen === 'settings' && (
          <motion.div key="settings" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="absolute inset-0">
            <SettingsScreen onBack={handleHome} />
          </motion.div>
        )}
        {currentScreen === 'leaderboard' && (
          <motion.div key="leaderboard" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="absolute inset-0">
            <LeaderboardScreen onBack={handleHome} />
          </motion.div>
        )}
        {currentScreen === 'daily' && (
          <motion.div key="daily" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="absolute inset-0">
            <DailyChallengeScreen onBack={handleHome} onStart={handleStartGame} />
          </motion.div>
        )}
        {currentScreen === 'quests' && (
          <motion.div key="quests" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="absolute inset-0">
            <QuestsScreen onBack={handleHome} />
          </motion.div>
        )}
        {currentScreen === 'journey' && (
          <motion.div key="journey" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="absolute inset-0">
            <JourneyScreen onBack={handleHome} onSelectLevel={handleStartJourneyLevel} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Splash Screen */}
      <AnimatePresence>
        {isSplashVisible && (
          <motion.div
            key="splash"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.6 }}
            className="fixed inset-0 z-[9999] bg-slate-900 flex flex-col items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: [0.5, 1.1, 1], opacity: 1 }}
              transition={{ duration: 1, times: [0, 0.7, 1], ease: "easeOut" }}
              className="w-48 h-48 sm:w-64 sm:h-64 relative"
            >
               <img src="/logos.png" alt="Logo" className="w-full h-full object-contain drop-shadow-[0_0_30px_rgba(59,130,246,0.6)]" />
               <motion.div
                 animate={{ opacity: [0.2, 0.5, 0.2] }}
                 transition={{ duration: 2, repeat: Infinity }}
                 className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full"
               />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="mt-8 text-center"
            >
               <h1 className="text-3xl font-black text-white tracking-[0.2em] mb-2 uppercase">Block Master</h1>
               <div className="w-12 h-1 bg-blue-500 mx-auto rounded-full animate-pulse" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
