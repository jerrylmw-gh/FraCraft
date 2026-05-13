import React from "react";
import { MCPanel, MCButton, Block } from "../components/MinecraftUI";
import { Steve, Creeper, Zombie, Skeleton, Enderman, Pig, DiamondSword, Pickaxe, Bow, Axe, Shield } from "../components/PixelArt";
import { WEAPONS } from "../lib/storage";

const WEAPON_ART = {
  pickaxe: Pickaxe,
  axe: Axe,
  bow: Bow,
  shield: Shield,
  sword: DiamondSword,
};

export default function HomePage({ progress, setView }) {
  const unlockedW = new Set(progress.weapons || []);
  const unlockedCount = WEAPONS.filter((w) => unlockedW.has(w.id)).length;
  return (
    <div className="space-y-6" data-testid="home-page">
      <MCPanel variant="dark" testId="hero">
        <div className="flex items-start gap-6 flex-wrap">
          <div className="flex flex-col gap-2">
            <div className="flex gap-1">
              <Block kind="grass" style={{ width: 56, height: 56 }} />
              <Block kind="diamond" style={{ width: 56, height: 56 }} />
              <Block kind="emerald" style={{ width: 56, height: 56 }} />
              <Block kind="gold" style={{ width: 56, height: 56 }} />
            </div>
            <div className="flex gap-1 items-center justify-center mt-2 mc-panel" style={{ padding: 6, background: "var(--mc-stone)" }}>
              <Steve size={44} />
              <DiamondSword size={44} />
            </div>
          </div>
          <div className="flex-1 min-w-[260px]">
            <h1 className="text-white" style={{ fontSize: 26 }}>MINECRAFT FRACTIONS</h1>
            <p className="text-white mt-3" style={{ fontSize: 22 }}>
              Welcome, Crafter! Learn 4th-grade fractions by mining blocks,
              crafting answers, and slaying creepers of confusion. ⛏
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <MCButton testId="cta-play" variant="primary" onClick={() => setView("practice")}>
                ▶ START MINING
              </MCButton>
              <MCButton testId="cta-visualize" onClick={() => setView("visualize")}>
                BLOCK LAB
              </MCButton>
              <MCButton testId="cta-ai" variant="gold" onClick={() => setView("ai")}>
                ✦ AI QUEST
              </MCButton>
            </div>
          </div>
        </div>
      </MCPanel>

      {/* ============ Mob & Weapon Showcase ============ */}
      <MCPanel testId="showcase">
        <h3 className="pixel-font" style={{ fontSize: 13 }}>YOUR ENEMIES & ARSENAL</h3>
        <div className="grid sm:grid-cols-2 gap-6 mt-5">
          <div>
            <p className="pixel-font pixel-font--xs" style={{ fontSize: 10, color: "var(--mc-redstone)" }}>HOSTILE MOBS</p>
            <div className="flex flex-wrap gap-3 mt-3" data-testid="mob-row">
              {[
                { C: Creeper, name: "CREEPER" },
                { C: Zombie, name: "ZOMBIE" },
                { C: Skeleton, name: "SKELETON" },
                { C: Enderman, name: "ENDER" },
                { C: Pig, name: "PIG" },
              ].map(({ C, name }) => (
                <div key={name} className="flex flex-col items-center gap-1">
                  <div className="mc-slot" style={{ width: 56, height: 56 }}>
                    <C size={44} />
                  </div>
                  <span className="pixel-font pixel-font--none" style={{ fontSize: 9, color: "#000" }}>{name}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <p className="pixel-font pixel-font--xs" style={{ fontSize: 10, color: "var(--mc-emerald)" }}>
              WEAPONS UNLOCKED ({unlockedCount}/{WEAPONS.length})
            </p>
            <div className="flex flex-wrap gap-3 mt-3" data-testid="weapon-row">
              {WEAPONS.map((w) => {
                const C = WEAPON_ART[w.id];
                const has = unlockedW.has(w.id);
                return (
                  <div
                    key={w.id}
                    className="flex flex-col items-center gap-1"
                    title={has ? `${w.name} — ${w.desc}` : `LOCKED — ${w.requirement}`}
                    data-testid={`weapon-${w.id}-${has ? "unlocked" : "locked"}`}
                  >
                    <div
                      className="mc-slot"
                      style={{
                        width: 56,
                        height: 56,
                        background: has ? "var(--mc-stone-dark)" : "#3a3a3a",
                        filter: has ? "none" : "grayscale(1) brightness(0.55)",
                        position: "relative",
                      }}
                    >
                      <C size={44} />
                      {!has && (
                        <span
                          style={{
                            position: "absolute",
                            inset: 0,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 22,
                            color: "#fff",
                            textShadow: "2px 2px 0 #000",
                          }}
                        >
                          🔒
                        </span>
                      )}
                    </div>
                    <span className="pixel-font pixel-font--none" style={{ fontSize: 9, color: has ? "#000" : "#666" }}>
                      {w.name.split(" ").slice(-1)[0].toUpperCase()}
                    </span>
                  </div>
                );
              })}
            </div>
            <p className="mt-3" style={{ fontSize: 16, color: "#222" }}>
              {unlockedCount < WEAPONS.length
                ? `⚒ Next reward: ${WEAPONS.find(w=>!unlockedW.has(w.id)).name} — ${WEAPONS.find(w=>!unlockedW.has(w.id)).requirement}`
                : "★ All weapons forged! You're a Master Crafter!"}
            </p>
          </div>
        </div>
      </MCPanel>

      <div className="grid md:grid-cols-3 gap-5">
        <FeatureCard
          icon="grass"
          title="BLOCK LAB"
          body="Drag sliders to split a world into blocks. See any fraction come alive as Minecraft tiles."
          onClick={() => setView("visualize")}
          testId="feat-visualize"
        />
        <FeatureCard
          icon="iron"
          title="CRAFT PRACTICE"
          body="Add, subtract, multiply, divide, and compare fractions across three difficulty levels."
          onClick={() => setView("practice")}
          testId="feat-practice"
        />
        <FeatureCard
          icon="emerald"
          title="AI STORY QUESTS"
          body="An AI Wizard generates fresh Minecraft word problems just for you, no two the same."
          onClick={() => setView("ai")}
          testId="feat-ai"
        />
      </div>

      <MCPanel testId="welcome-stats">
        <div className="grid sm:grid-cols-3 gap-4 text-center">
          <div>
            <p className="pixel-font" style={{ fontSize: 10 }}>YOUR LEVEL</p>
            <p className="pixel-font mt-3" style={{ fontSize: 24, color: "var(--mc-gold)", textShadow: "2px 2px 0 #000" }}>
              {progress.level}
            </p>
          </div>
          <div>
            <p className="pixel-font" style={{ fontSize: 10 }}>ORES MINED (CORRECT)</p>
            <p className="pixel-font mt-3" style={{ fontSize: 24, color: "var(--mc-diamond)", textShadow: "2px 2px 0 #000" }}>
              {progress.correctCount}
            </p>
          </div>
          <div>
            <p className="pixel-font" style={{ fontSize: 10 }}>BEST STREAK</p>
            <p className="pixel-font mt-3" style={{ fontSize: 24, color: "var(--mc-emerald)", textShadow: "2px 2px 0 #000" }}>
              {progress.bestStreak}
            </p>
          </div>
        </div>
      </MCPanel>
    </div>
  );
}

const FeatureCard = ({ icon, title, body, onClick, testId }) => (
  <button
    onClick={onClick}
    data-testid={testId}
    className="mc-panel text-left"
    style={{ cursor: "pointer" }}
  >
    <div className="flex items-center gap-3 mb-3">
      <Block kind={icon} style={{ width: 48, height: 48 }} />
      <h3 className="pixel-font" style={{ fontSize: 13 }}>{title}</h3>
    </div>
    <p style={{ fontSize: 20, lineHeight: 1.35 }}>{body}</p>
    <div className="pixel-font pixel-font--xs mt-4" style={{ fontSize: 10, color: "var(--mc-redstone)" }}>
      ENTER →
    </div>
  </button>
);
