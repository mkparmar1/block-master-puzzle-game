# Block Master Puzzle

A beautifully over-engineered, highly addictive grid-based puzzle game engineered natively for responsive mobile displays. 

## 🚀 Overview
Block Master Puzzle takes the classic 10x10 puzzle genre and elevates it with premium UI aesthetics, smooth Spring-based physics, dynamic particle effects, and deep gamification layers (XP, Ranks, Combos). It is fully configured as a Progressive Web App (PWA) and wrapped with Capacitor to drop seamlessly into native Android (and iOS) operating systems supporting immersive edge-to-edge hardware navigation!

## ⚙️ Technology Stack
* **Core:** React 18 (TypeScript) + Vite
* **Styling:** Tailwind CSS v4 (Custom dark mode configurations, glassmorphism)
* **Animation Engine:** Framer Motion (Spring Physics & Layout transitions)
* **Mobile Wrap:** Capacitor 8 (`@capacitor/android`, `@capacitor/app`, `@capacitor/share`)
* **State Management:** Zustand (Persistent Local Storage)
* **Sound & FX:** Canvas-Confetti, use-sound, global Web Audio API.

## 🎯 Current Core Features
- **Fluid Drag & Drop Mechanics:** Uses high-stiffness spring curves to ensure block drop placements snap violently and accurately into cells based on strict grid thresholds.
- **Dynamic Theming System:** Features an unlockable theme engine (Classic, Neon, Glass, Cyber) allowing independent modifications of board environments and tile layouts.
- **Ergonomic Display Controls:** Uniquely optimized for ultra-tall displays (e.g., Nothing Phone series, iPhone Pro Max). Action layers are cleanly bound to the bottom action chassis ensuring single-handed reachability.
- **Offline PWA Engine:** Service workers aggressively cache static web resources making the game perfectly playable inside subways, planes, or offline environments natively.
- **Level Scaling:** The internal game engine generates heavier weighted complex blocks based heavily on standard scoring curves preventing cheap endless scaling.

## 🔨 Development & Build Commands

Install all application dependencies:
```bash
npm install
```

Start the Vite development web-server for rapid testing:
```bash
npm run dev
```

Build the native Android integration to test hardware behaviors on your device:
```bash
# 1. Compile the production web assets
npm run build 

# 2. Sync the assets into the embedded Capacitor Android system
npx cap sync android

# 3. Compile and deploy via native Android Studio hooks to your plugged-in USB debugging phone
npx cap run android
```

## 🗺️ Roadmap & UX Improvements
The application is shifting from a standard high-score runner into an addictive habit-hooking engine. 

### Phase 1: Mechanics Polish
- [ ] Inject 2.5 second auto-wipers on `Combo` tracking text to prevent indefinite screen hanging.
- [ ] Advanced micro-interactions (Trails, Haptic localized feedback patterns).

### Phase 2: Retention Traps (Habit forming)
- [ ] **Daily Time-Challenge:** Integrate a strict 120-second active Time Attack mode replacing standard endless mode for dailies, forcing high-reflex gameplay behavior.
- [ ] **Quests & Streaks:** Introduce structured, 24-hr resetting objectives (e.g., "Destroy 50 red blocks"). 

### Phase 3: Campaign Progression
- [ ] **Journey Mode Build:** Overhaul the menu logic to include "Stages/Rounds" (Levels 1 to 50). Incorporate pre-filled grid structures blocking off space to design deliberate puzzles instead of purely randomized drops! 

## 📄 License
Custom built. All internal mechanics and code layers subject to project owner restrictions.
