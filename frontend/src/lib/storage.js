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
  weapons: [],      // ids of unlocked weapons
};

// Weapons are unlocked by hitting milestones during practice/AI quests.
// `check(state)` returns true when the weapon should be unlocked.
export const WEAPONS = [
  {
    id: "pickaxe",
    name: "Wooden Pickaxe",
    desc: "Mine your first block of knowledge",
    requirement: "Answer 1 question correctly",
    check: (s) => s.correctCount >= 1,
  },
  {
    id: "axe",
    name: "Stone Axe",
    desc: "Chop through tricky problems",
    requirement: "Answer 5 questions correctly",
    check: (s) => s.correctCount >= 5,
  },
  {
    id: "bow",
    name: "Hunter's Bow",
    desc: "Aim for accuracy",
    requirement: "Reach a 3-question streak",
    check: (s) => s.bestStreak >= 3,
  },
  {
    id: "shield",
    name: "Iron Shield",
    desc: "Block creepers of confusion",
    requirement: "Answer 12 questions correctly",
    check: (s) => s.correctCount >= 12,
  },
  {
    id: "sword",
    name: "Diamond Sword",
    desc: "The ultimate fraction-slayer",
    requirement: "Reach Level 3 OR 20 correct",
    check: (s) => s.level >= 3 || s.correctCount >= 20,
  },
];

export const ACHIEVEMENTS = [
  { id: "first_block", name: "First Block", desc: "Answer your first question", icon: "stone", art: null, xp: 10 },
  { id: "iron_miner", name: "Iron Miner", desc: "Get 5 correct answers", icon: "iron", art: "pickaxe", xp: 25 },
  { id: "gold_rush", name: "Gold Rush", desc: "Get 15 correct answers", icon: "gold", art: null, xp: 50 },
  { id: "diamond_pickaxe", name: "Diamond Pickaxe", desc: "Get 30 correct answers", icon: "diamond", art: "sword", xp: 100 },
  { id: "emerald_trader", name: "Emerald Trader", desc: "Reach a 5-question streak", icon: "emerald", art: "shield", xp: 50 },
  { id: "ender_dragon", name: "Ender Dragon Slayer", desc: "Reach a 10-question streak", icon: "redstone", art: "enderman", xp: 150 },
  { id: "dragon_slayer", name: "Dragon Slayer", desc: "Defeat the Ender Dragon in Boss mode", icon: "diamond", art: "sword", xp: 300 },
  { id: "creeper_calm", name: "Cool Under Pressure", desc: "Get 3 hard problems correct", icon: "emerald", art: "creeper", xp: 75 },
];

// Weapon-gated features
export const hasWeapon = (state, id) => (state.weapons || []).includes(id);
export const hardUnlocked = (state) => hasWeapon(state, "sword");
export const bossUnlocked = (state) => hasWeapon(state, "shield");

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
  if (topic === "boss_win") check("dragon_slayer", true);
  if (difficulty === "hard" && correct) {
    const hardCount = (prev._hardCorrect || 0) + 1;
    next._hardCorrect = hardCount;
    check("creeper_calm", hardCount >= 3);
  } else {
    next._hardCorrect = prev._hardCorrect || 0;
  }
  next.achievements = Array.from(unlocked);

  // Weapons (computed after level update so sword unlock check sees new level)
  const weaponsBefore = new Set(prev.weapons || []);
  const weaponsAfter = new Set(weaponsBefore);
  const newWeapons = [];
  for (const w of WEAPONS) {
    if (!weaponsAfter.has(w.id) && w.check(next)) {
      weaponsAfter.add(w.id);
      newWeapons.push(w);
    }
  }
  next.weapons = Array.from(weaponsAfter);

  return { state: next, gained, leveledUp: level > prev.level, newWeapons };
}
