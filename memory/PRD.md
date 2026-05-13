# Minecraft Fractions — 4th Grade Math App (PRD)

## Original Problem Statement
做一個minecraft版本的小四數學分數fraction app
(Build a Minecraft-style 4th-grade math fractions app.)

## User Choices
- Features: All (visualize, practice, ops add/sub/mul/div, compare)
- Gamification: Minecraft achievement badges (diamond, emerald, gold, iron, etc.)
- UI Language: English
- Auth: None — localStorage progress only
- AI questions: Yes, via Emergent LLM Key (Claude Sonnet 4.5)

## Architecture
- Backend: FastAPI + Motor (Mongo, mostly unused in MVP) + emergentintegrations LlmChat with anthropic claude-sonnet-4-5-20250929
- Frontend: React 19 (tabbed SPA), Tailwind, custom Minecraft retro-voxel CSS theme (Press Start 2P + VT323 fonts)
- State: localStorage (xp, level, streak, achievements)

## Implemented (Feb 2026 — Iteration 1)
- Backend `/api/problems/generate` LLM-powered fraction word problems
- Block Lab: fraction visualizer with sliders, presets, 7 block types
- Practice: local generator for +, -, ×, ÷, comparison, 3 difficulties, choice feedback + XP
- AI Quest: LLM-generated Minecraft-themed problems with 4 choices + explanation
- Inventory/Achievements: 8 badges (First Block → Ender Dragon Slayer), stats panel, reset button
- XP/Level/Streak system with auto-leveling and 8 achievement unlocks
- Minecraft retro-voxel UI: pixel fonts, chunky bevel buttons, grass/dirt/stone/diamond/emerald/gold block textures via CSS, no border-radius

## Backlog (P1/P2)
- P1: Drag-and-drop fraction equivalence puzzles (drag blocks between chests)
- P1: Audio (Minecraft block click + level-up sound)
- P1: Boss-fight mode (timed streak vs Ender Dragon)
- P2: Multiplayer leaderboard
- P2: Parent dashboard / printable worksheets
- P2: More achievement badges (50+ correct, 25-streak, all-topics champion)

## Next Action Items
- (Optional) Persist AI-generated problems to MongoDB for analytics
- (Optional) Move logger init above route to satisfy code-review nit
