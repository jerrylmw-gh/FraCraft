import React from "react";

// ============================================================
// Pixel Art SVG components — Minecraft characters & weapons
// ============================================================
// Each piece is rendered as an SVG with `shapeRendering="crispEdges"`
// so it stays perfectly pixelated at any size.
// ============================================================

const PixelGrid = ({ map, palette, size = 48, grid }) => {
  const rows = map.length;
  const cols = grid || map[0].length;
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${cols} ${rows}`}
      shapeRendering="crispEdges"
      style={{ display: "block", imageRendering: "pixelated" }}
    >
      {map.map((row, y) =>
        row.split("").map((ch, x) => {
          const color = palette[ch];
          if (!color) return null;
          return <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill={color} />;
        })
      )}
    </svg>
  );
};

// ---------- CHARACTERS (10x10) ----------
const STEVE_PAL = { ".": null, h: "#3e2a17", s: "#f9c49b", c: "#36b1f2", k: "#000", m: "#724b22", w: "#fff" };
const STEVE = [
  "..hhhhhh..",
  ".hhhhhhhh.",
  ".hssssssh.",
  ".scwckcwcs",
  ".ssssssss.",
  ".ssmmmmss.",
  ".ssssssss.",
  ".sshhhhss.",
  ".hhhhhhhh.",
  "..hhhhhh..",
];

const CREEPER_PAL = { ".": null, g: "#5e9e3a", d: "#4a7a2e", k: "#0a0a0a" };
const CREEPER = [
  "..gggggg..",
  ".gggggggg.",
  ".gdgggggdg",
  ".gkkggkkg.",
  ".gkkggkkg.",
  ".gggkkggg.",
  ".gkkkkkkg.",
  ".gkgkkgkg.",
  ".gkggggkg.",
  "..gggggg..",
];

const ZOMBIE_PAL = { ".": null, g: "#4d8a32", d: "#356824", k: "#000", w: "#fff", r: "#a14a52" };
const ZOMBIE = [
  "..gggggg..",
  ".gdddddgd.",
  ".gggdggdg.",
  ".gkwgkkwgg",
  ".gggggggg.",
  ".grrrgrrg.",
  ".ggkkkkgg.",
  ".gkggggkg.",
  ".dggggggd.",
  "..dddddd..",
];

const SKELETON_PAL = { ".": null, w: "#dcdcdc", s: "#9a9a9a", k: "#000" };
const SKELETON = [
  "..wwwwww..",
  ".swwwwwws.",
  ".wsssssws.",
  ".wkwwwwkw.",
  ".wkkwwkkw.",
  ".wswwwwsw.",
  ".wkwwwwkw.",
  ".wkwkkwkw.",
  ".swssssws.",
  "..ssssss..",
];

const ENDERMAN_PAL = { ".": null, k: "#0a0a16", d: "#1a1a2a", p: "#c576f6", m: "#9148d8" };
const ENDERMAN = [
  "..kkkkkk..",
  ".kkdkkdkk.",
  ".kkkkkkkk.",
  ".kppkkppk.",
  ".kppkkppk.",
  ".kkkmmkkk.",
  ".kkmmmmkk.",
  ".kkdkkdkk.",
  ".kkkkkkkk.",
  "..kkkkkk..",
];

const PIG_PAL = { ".": null, p: "#f0a6a8", d: "#c47c7e", s: "#a14a52", k: "#1a1a1a" };
const PIG = [
  "..pppppp..",
  ".pppppppp.",
  ".pddppddpp",
  ".pkdppdkpd",  // eyes
  ".pppppppp.",
  ".ppssssppp",
  ".pkssssskp",
  ".ppssssppp",
  ".pppppppp.",
  "..pppppp..",
];

// ---------- WEAPONS (12x12) ----------
const D_SWORD_PAL = { ".": null, d: "#47e5c3", l: "#a8f5e2", w: "#724b22", b: "#3e2a17", g: "#fee227" };
const DIAMOND_SWORD = [
  "..........dl",
  ".........dld",
  "........dldd",
  ".......dlddd",
  "......dldddd",
  ".....dldddd.",
  "....dldddd..",
  "...dldddd...",
  "..dgddg.....",
  ".bwwwwb.....",
  "bwwwwwwb....",
  ".bwwwwb.....",
];

const PICKAXE_PAL = { ".": null, s: "#8b8b8b", l: "#c6c6c6", d: "#555", w: "#724b22", b: "#3e2a17" };
const PICKAXE = [
  "ssssssssss..",
  "slllllllls..",
  "ssssssssss..",
  "....bw......",
  "....bw......",
  "....bw......",
  "....bw......",
  "....bw......",
  "....bw......",
  "....bw......",
  "....bw......",
  "....bb......",
];

const BOW_PAL = { ".": null, w: "#866043", b: "#3e2a17", s: "#dcdcdc", l: "#f0f0f0" };
const BOW = [
  "..wwww......",
  ".bwwwwb.....",
  "bwww..b.....",
  "bww....b....",
  "bw.....s....",
  "b......s....",
  "b......s....",
  "bw.....s....",
  "bww....b....",
  "bwww..b.....",
  ".bwwwwb.....",
  "..wwww......",
];

const AXE_PAL = { ".": null, s: "#8b8b8b", l: "#c6c6c6", w: "#724b22", b: "#3e2a17" };
const AXE = [
  "ssss........",
  "slllls......",
  "slllllss....",
  "sllllllls...",
  "ssllllls....",
  "...sssbw....",
  "......bw....",
  "......bw....",
  "......bw....",
  "......bw....",
  "......bw....",
  "......bb....",
];

const SHIELD_PAL = { ".": null, w: "#866043", b: "#3e2a17", r: "#aa0000", l: "#fee227", g: "#dcdcdc" };
const SHIELD = [
  ".bbbbbbbbbb.",
  "bwwwwwwwwwwb",
  "bwwgggggwwwb",
  "bwgggggggwwb",
  "bwgggrrgggwb",
  "bwggrrrrggwb",
  "bwgrrrrrrgwb",
  "bwggrrrrggwb",
  "bwgggrrgggwb",
  "bwwgggggwwwb",
  ".bwwwwwwwwb.",
  "..bbbbbbbb..",
];

const TNT_PAL = { ".": null, r: "#c82626", d: "#7a1818", w: "#fff", k: "#000", y: "#fee227", T: "#fff", N: "#000" };
const TNT_MAP = [
  "............",
  ".rrrrrrrrrr.",
  ".rwwwwwwwwr.",
  ".rwTNTNTNwr.",
  ".rrrrrrrrrr.",
  ".rdrdrdrdrdr",
  ".rdrdrdrdrdr",
  ".rdrdrdrdrdr",
  ".rrrrrrrrrr.",
  "..yk........",
  "...yk.......",
  "....y.......",
];

// ---------- Exposed components ----------
export const Steve = (p) => <PixelGrid map={STEVE} palette={STEVE_PAL} {...p} />;
export const Creeper = (p) => <PixelGrid map={CREEPER} palette={CREEPER_PAL} {...p} />;
export const Zombie = (p) => <PixelGrid map={ZOMBIE} palette={ZOMBIE_PAL} {...p} />;
export const Skeleton = (p) => <PixelGrid map={SKELETON} palette={SKELETON_PAL} {...p} />;
export const Enderman = (p) => <PixelGrid map={ENDERMAN} palette={ENDERMAN_PAL} {...p} />;
export const Pig = (p) => <PixelGrid map={PIG} palette={PIG_PAL} {...p} />;

export const DiamondSword = (p) => <PixelGrid map={DIAMOND_SWORD} palette={D_SWORD_PAL} {...p} />;
export const Pickaxe = (p) => <PixelGrid map={PICKAXE} palette={PICKAXE_PAL} {...p} />;
export const Bow = (p) => <PixelGrid map={BOW} palette={BOW_PAL} {...p} />;
export const Axe = (p) => <PixelGrid map={AXE} palette={AXE_PAL} {...p} />;
export const Shield = (p) => <PixelGrid map={SHIELD} palette={SHIELD_PAL} {...p} />;
export const TNT = (p) => <PixelGrid map={TNT_MAP} palette={TNT_PAL} {...p} />;

// Helper: weapon for a math operation
export const OpWeapon = ({ op, size = 32 }) => {
  const map = {
    add: <Pickaxe size={size} />,
    subtract: <DiamondSword size={size} />,
    multiply: <Axe size={size} />,
    divide: <Bow size={size} />,
    compare: <Shield size={size} />,
  };
  return map[op] || null;
};

// Helper: mob for AI Quest difficulty
export const DifficultyMob = ({ difficulty, size = 40 }) => {
  const map = {
    easy: <Pig size={size} />,
    medium: <Zombie size={size} />,
    hard: <Enderman size={size} />,
  };
  return map[difficulty] || <Pig size={size} />;
};
