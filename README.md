# 🎮 Block Master Puzzle

> A premium, mobile-first block placement puzzle game built with React, TypeScript, and Capacitor. Features deep gamification, 8 unlockable themes, 5 block skins, a 50-level Journey Mode, Daily Challenges, and a full XP/Rank progression system.

---

## 📱 Screenshots & Overview

Block Master Puzzle takes the classic grid puzzle genre and elevates it with:
- **Glassmorphism UI** with dynamic backdrop blur and layered depth
- **Spring-physics drag & drop** with particle trail effects
- **Deep progression system** — XP, Ranks, Achievements, Quests, Stars
- **8 unlockable visual themes** with distinct color palettes and block colors
- **5 block skins** with unique render styles
- **50-level campaign** with scaling difficulty

---

## ⚙️ Technology Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | React 19 + TypeScript + Vite 6 |
| **Styling** | Tailwind CSS v4 (dark mode, glassmorphism, custom animations) |
| **Animation** | Framer Motion (`motion/react`) — spring physics, layout transitions, drag |
| **State** | Zustand with `persist` middleware (localStorage) |
| **Mobile** | Capacitor 8 — `@capacitor/android`, `@capacitor/app`, `@capacitor/share` |
| **PWA** | Service Worker + Web App Manifest (offline support) |
| **Effects** | `canvas-confetti` (new best score celebration) |
| **Audio** | Web Audio API — preloaded sound pool for instant playback |

---

## 🎯 Core Gameplay

### Grid Modes
| Mode | Grid Size | Description |
|------|-----------|-------------|
| Classic | 8×8 | Compact, fast-paced |
| Standard | 10×10 | Balanced challenge |
| Expert | 12×12 | Maximum complexity |

### Difficulty Levels
| Difficulty | Block Types | Best For |
|-----------|-------------|----------|
| Easy | Simple shapes (L, T, 1×2) | Beginners |
| Medium | Balanced mix | Regular play |
| Hard | Complex multi-cell blocks | Challenge seekers |

### How to Play
1. **Drag** any of the 3 blocks from the tray onto the grid
2. **Place** blocks to fill rows or columns
3. **Clear** complete rows/columns to score points and chain combos
4. **Use Refresh** (3 charges) to get new blocks when stuck
5. **Use Undo** (3 charges) to revert your last move
6. Game ends when no valid moves remain and all charges are used

### Scoring
| Action | Points |
|--------|--------|
| Block placement | 10× number of cells |
| Line cleared | 100 × combo multiplier |
| Multi-line clear | Scaled bonus |
| Full board clear | +1,000 bonus |
| Combo (3+) | Multiplier stacks with each consecutive clear |

---

## 🎨 Themes

All themes apply across: background gradients, UI buttons, block colors, glow effects, and dark mode variants.

| Theme | Emoji | Colors | Unlock Condition |
|-------|-------|--------|-----------------|
| **Ocean Deep** | 🌊 | Blue + Indigo | ✅ Default — always available |
| **Sunset Blaze** | 🌅 | Orange + Crimson | Score **500+ points** in any game |
| **Forest Zen** | 🌲 | Sage Green + Emerald | **7-day** daily challenge streak |
| **Galaxy** | 🌌 | Purple + Pink nebula | Reach a **10× combo** |
| **Arctic** | ❄️ | Ice Cyan + Pearl | Score **3,000+ points** on Hard mode |
| **Inferno** | 🔥 | Red + Molten Gold | **Board clear** 3 times total |
| **Liquid Glass** | 💎 | Translucent Sky Blue | Reach **Journey Level 15** |
| **Cyber Matrix** | 📟 | Neon Green + Black | Reach **Journey Level 30** |

> Themes are unlocked permanently and persist across sessions. Select them in **Settings → Appearance**.

---

## 🧊 Block Skins

Block skins change the **visual render style** of every block on the board.

| Skin | Preview | Style | Unlock |
|------|---------|-------|--------|
| **Classic** | 🧊 | Bevel & shine with shadow | Default |
| **Neon** | ⚡ | Glowing pulse borders | Default |
| **Crystal** | 💎 | Frosted ice translucent | Journey Level 5 |
| **Matrix** | 📟 | Code rain digital grid | Journey Level 15 |
| **Gold** | 👑 | Liquid metallic shimmer | Journey Level 30 |

> Change your skin in **Settings → Block Style**.

---

## 🗺️ Journey Mode

A 50-level campaign with progressively harder objectives.

### Level Types
| Icon | Type | Description |
|------|------|-------------|
| ⚡ | Score Target | Reach a points threshold |
| 🎯 | Lines Target | Clear a set number of lines |
| ▦ | Blocks Target | Place a set number of blocks |

### Structure
- **Levels 1–10**: Easy difficulty, 8×8 grid, introductory targets
- **Levels 11–30**: Medium difficulty, 10×10 grid, scaling targets
- **Levels 31–50**: Hard difficulty, complex blocks, high targets
- **Every 10th level**: Boss stage with a bonus challenge
- **Stars**: Earn ⭐ for each stage completed

### Visual Path
The Journey screen shows levels as a **zigzag winding trail** (left → center → right → center) with:
- 🔵 Completed stages (blue)
- 🟡 Current stage (amber glow pulse)
- 🔒 Locked stages (greyed out)
- 👑 Boss stage crowns on levels 10, 20, 30, 40, 50
- Overall **progress bar** showing your campaign completion %

---

## 📅 Daily Challenge

A special time-limited mode:
- Same puzzle seed for **all players worldwide** each day
- **8×8 grid, Medium difficulty**, 2-minute time limit
- Clearing lines **adds +5 seconds** per line
- Build your **daily streak** for bonus rewards
- **7-day streak** unlocks the Forest Zen theme permanently

---

## 🏆 XP, Ranks & Progression

### XP Formula
```
XP = (score ÷ 10 + combo × 5) × difficulty_multiplier
```
- Easy: `×1` | Medium: `×2` | Hard: `×3`

### Rank Ladder
| Rank | Emoji | XP Required |
|------|-------|-------------|
| Novice | 🌱 | 0 |
| Apprentice | 🔨 | 500 |
| Pro | ⚔️ | 2,000 |
| Expert | 🔥 | 5,000 |
| Master | 👑 | 10,000 |
| Grandmaster | 🌟 | 25,000 |

---

## 🎖️ Achievements

| Achievement | Icon | How to Earn |
|-------------|------|-------------|
| First Steps | 🎯 | Place your first block |
| Clearing the Way | 🧹 | Clear your first line |
| Combo Master | 🔥 | Get a 3× combo |
| Board Clearer | 🌟 | Clear the entire board at once |
| High Scorer | 🏆 | Reach 1,000 points in one game |
| Daily Player | 📅 | Complete a daily challenge |

---

## 📋 Daily Missions (Quests)

Three fresh quests reset **every 24 hours**:

| Quest | Target | Reward |
|-------|--------|--------|
| Clear lines | 20 lines | +100 XP |
| Place blocks | 50 blocks | +50 XP |
| Score points | 2,000 pts | +250 XP |

---

## ⭐ Stars & Star Shop

- Stars are earned through gameplay and completing quests
- Starting bonus: **50 stars**
- Spend stars in the **Star Shop** (home screen ⭐ button) for power-ups

### Power-ups
| Item | Cost | Effect |
|------|------|--------|
| Hammer | Stars | Remove a single cell from the board |

---

## 🔧 Settings

| Setting | Description |
|---------|-------------|
| Sound Effects | Toggle on/off |
| Volume | Slider 0–100% (persisted) |
| Haptic Feedback | Vibration on placement & clears |
| Dark Mode | Light/dark toggle |
| Theme | Pick from 8 unlockable themes |
| Block Skin | Pick from 5 unlockable skins |
| Reset Progress | Wipe all scores, XP, and unlocks |

---

## 🚀 Development & Build

### Prerequisites
- Node.js v22+
- Android Studio (for native Android build)

### Install
```bash
npm install
```

### Dev Server
```bash
npm run dev
# Opens at http://localhost:3000
```

### Production Build
```bash
npm run build
```

### Android Deployment
```bash
# 1. Build web assets
npm run build

# 2. Sync into Capacitor Android project
npx cap sync android

# 3. Open in Android Studio
npx cap open android
# Then: Build → Generate Signed APK / Run on Device
```

### Type Check
```bash
npx tsc --noEmit
```

---

## 📁 Project Structure

```
src/
├── App.tsx                    # Root router — screen state machine
├── index.css                  # Global styles, CSS variables, animations
├── screens/
│   ├── HomeScreen.tsx         # Main menu with rank bar, quick actions
│   ├── GameScreen.tsx         # Core game loop, drag-and-drop, grid
│   ├── GameOverScreen.tsx     # End screen with stats, XP, share
│   ├── LevelSelectionScreen.tsx # Grid size + difficulty picker
│   ├── JourneyScreen.tsx      # 50-level campaign map
│   ├── DailyChallengeScreen.tsx # Daily time-attack mode
│   ├── QuestsScreen.tsx       # Daily mission tracker
│   ├── LeaderboardScreen.tsx  # Personal score history
│   ├── SettingsScreen.tsx     # All preferences + theme/skin picker
│   └── TutorialScreen.tsx     # First-launch interactive guide
├── components/
│   ├── DraggableBlock.tsx     # Spring-physics drag block with particles
│   ├── Cell.tsx               # Individual grid cell with skin rendering
│   ├── ScoreBoard.tsx         # Animated score + best display
│   ├── ThemePicker.tsx        # Theme selection grid with lock states
│   └── StarShop.tsx           # In-game store modal
├── store/
│   ├── useGameStore.ts        # Game state (grid, score, blocks, timer)
│   ├── useThemeStore.ts       # Theme + dark mode state
│   └── usePlayerStore.ts      # XP, rank, quests, inventory
├── game/
│   ├── gridLogic.ts           # Place/check/clear grid operations
│   └── blockShapes.ts         # Block shape definitions by difficulty
└── lib/
    ├── themes.ts              # All 8 theme definitions + CSS applicator
    ├── achievements.ts        # Achievement definitions + check logic
    ├── campaignLevels.ts      # 50 Journey Mode level definitions
    ├── dailySeed.ts           # Daily challenge seeding
    └── shareCard.ts           # Canvas-based score share card
```

---

## 📱 Mobile Optimization

- **`position: fixed` body** — prevents WebView scroll bounce on Android
- **`100dvh`** — dynamic viewport height (respects Android/iOS browser chrome)
- **Safe area insets** — `env(safe-area-inset-*)` for iPhone notch and Android navigation bar
- **`overscroll-behavior: none`** — disables rubber-band scroll on all platforms
- **`-webkit-overflow-scrolling: touch`** — smooth scroll in iOS WebView
- **Hardware acceleration** — `will-change` and GPU-composited transforms on animated elements
- **Preloaded audio pool** — sounds loaded at mount, cloned on play for zero-latency audio

---

## 📄 License

Apache-2.0 — See individual file headers for details.
