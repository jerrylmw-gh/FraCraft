// LocalStorage progress tracking
const KEY = "mc_fractions_progress_v1";

const defaultState = {
  xp: 0,
  level: 1,
  correctCount: 0,
  wrongCount: 0,
  streak: 0,
  bestStreak: 0,
  achievements: [], // ids of unlocked achievements
};

export const ACHIEVEMENTS = [
  { id: "first_block", name: "First Block", desc: "Answer your first question", icon: "stone", xp: 10 },
  { id: "iron_miner", name: "Iron Miner", desc: "Get 5 correct answers", icon: "iron", xp: 25 },
  { id: "gold_rush", name: "Gold Rush", desc: "Get 15 correct answers", icon: "gold", xp: 50 },
  { id: "diamond_pickaxe", name: "Diamond Pickaxe", desc: "Get 30 correct answers", icon: "diamond", xp: 100 },
  { id: "emerald_trader", name: "Emerald Trader", desc: "Reach a 5-question streak", icon: "emerald", xp: 50 },
  { id: "ender_dragon", name: "Ender Dragon Slayer", desc: "Reach a 10-question streak", icon: "redstone", xp: 150 },
  { id: "redstone_engineer", name: "Redstone Engineer", desc: "Complete an AI Quest problem", icon: "redstone", xp: 30 },
  { id: "creeper_calm", name: "Cool Under Pressure", desc: "Get 3 hard problems correct", icon: "emerald", xp: 75 },
];

export function loadProgress() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { ...defaultState };
    return { ...defaultState, ...JSON.parse(raw) };
  } catch {
    return { ...defaultState };
  }
}

export function saveProgress(state) {
  localStorage.setItem(KEY, JSON.stringify(state));
}

export function resetProgress() {
  localStorage.removeItem(KEY);
}

export function xpForLevel(level) {
  return 100 * level; // XP needed to advance from this level
}

export function applyResult(prev, { correct, difficulty = "easy", topic = "" }) {
  const base = difficulty === "easy" ? 10 : difficulty === "medium" ? 20 : 35;
  const gained = correct ? base : 0;
  const next = {
    ...prev,
    xp: prev.xp + gained,
    correctCount: prev.correctCount + (correct ? 1 : 0),
    wrongCount: prev.wrongCount + (correct ? 0 : 1),
    streak: correct ? prev.streak + 1 : 0,
  };
  next.bestStreak = Math.max(prev.bestStreak, next.streak);

  // Level up
  let level = prev.level;
  let xp = next.xp;
  while (xp >= xpForLevel(level)) {
    xp -= xpForLevel(level);
    level += 1;
  }
  next.level = level;
  next.xp = xp;

  // Achievements
  const unlocked = new Set(next.achievements);
  const check = (id, cond) => { if (cond && !unlocked.has(id)) unlocked.add(id); };
  check("first_block", next.correctCount >= 1);
  check("iron_miner", next.correctCount >= 5);
  check("gold_rush", next.correctCount >= 15);
  check("diamond_pickaxe", next.correctCount >= 30);
  check("emerald_trader", next.bestStreak >= 5);
  check("ender_dragon", next.bestStreak >= 10);
  if (topic === "ai") check("redstone_engineer", correct);
  if (difficulty === "hard" && correct) {
    const hardCount = (prev._hardCorrect || 0) + 1;
    next._hardCorrect = hardCount;
    check("creeper_calm", hardCount >= 3);
  } else {
    next._hardCorrect = prev._hardCorrect || 0;
  }
  next.achievements = Array.from(unlocked);
  return { state: next, gained, leveledUp: level > prev.level };
}
