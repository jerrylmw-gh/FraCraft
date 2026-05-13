# Minecraft Fractions — 4th Grade Math App (PRD)

## Original Problem Statement
做一個minecraft版本的小四數學分數fraction app
(Build a Minecraft-style 4th-grade math fractions app.)

## User Choices
- Features: All (visualize, practice, ops add/sub/mul/div, compare)
- Gamification: Minecraft achievement badges (diamond, emerald, gold, iron, etc.)
- UI Language: English
- Auth: None — localStorage progress only
- AI questions: Originally yes, **disabled in iteration 3 to save Universal Key credits**

## Architecture
- Backend: FastAPI + Motor (Mongo, mostly unused) + emergentintegrations (AI Quest endpoint kept but unused by frontend)
- Frontend: React 19 (tabbed SPA), Tailwind, custom Minecraft retro-voxel CSS theme (Press Start 2P + VT323 fonts)
- State: localStorage (xp, level, streak, achievements, weapons, mute)
- Audio: Web Audio API synthesized 8-bit SFX (zero external assets, zero cost)

## Iterations

### Feb 2026 — Iteration 1 (MVP)
- Backend `/api/problems/generate` LLM-powered fraction word problems
- Block Lab, Practice (+ - × ÷ compare, 3 difficulties), AI Quest, Inventory
- XP/Level/Streak, 8 achievements

### Feb 2026 — Iteration 2 (Pixel Art)
- 6 character SVG pixel art: Steve, Creeper, Zombie, Skeleton, Enderman, Pig
- 5 weapon SVG pixel art: Diamond Sword, Pickaxe, Bow, Axe, Shield
- Weapon unlock reward system with toast notifications
- Header Steve avatar, Home mob/weapon showcase
- Practice op buttons + AI Quest difficulty mobs use new sprites

### Feb 2026 — Iteration 3 (Game-Feel + Cost Optimisation)
- **Hidden AI Quest** — removed from nav, CTAs, feature cards (file retained for future re-enable). Cuts Universal Key usage to zero.
- **8-bit Sound Effects** — Web Audio synthesized: click, correct, wrong, level up, weapon unlock, boss hit/win/lose, player hit, dragon roar. Header mute toggle persists in localStorage.
- **Hard difficulty gating** — Diamond Sword required (level 3 OR 20 correct). Locked button shows 🔒 + greyed; click triggers toast.
- **Boss Battle Mode (Ender Dragon)** — gated behind Iron Shield (12 correct). 60s timer, 200 HP dragon vs 100 HP player, ±25/±20 damage per Q. Uses local generator, no LLM cost. Win awards Dragon Slayer achievement + 200 bonus XP. 12x16 EnderDragon pixel sprite added.
- Testing agent: 100% (12/12 frontend assertions), zero console errors.

## Backlog (P1/P2)
- P1: More weapon special uses (e.g., Bow = ranged comparison challenge, Axe = chop-the-fraction puzzle)
- P1: Difficulty scaling in Boss (medium → hard problems as dragon HP drops)
- P1: Multi-boss roster (Wither, Warden) with weapon-tier gating
- P2: Multiplayer leaderboard, parent dashboard, printable worksheets
- P2: Re-enable AI Quest as "Premium Quest" with daily limit / opt-in

## Next Action Items
- Add a quick win-path test for boss (deterministic correct answers) if testing is needed
- (Optional) Tighten boss balance: scale difficulty as dragon HP drops below 100
