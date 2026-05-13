import React from "react";
import { MCPanel, MCButton, Block } from "../components/MinecraftUI";
import { Steve, Creeper, Enderman, DiamondSword, Pickaxe, Shield } from "../components/PixelArt";
import { ACHIEVEMENTS, resetProgress } from "../lib/storage";

const ART_MAP = {
  steve: Steve,
  creeper: Creeper,
  enderman: Enderman,
  sword: DiamondSword,
  pickaxe: Pickaxe,
  shield: Shield,
};

export default function AchievementsPage({ progress, setProgress }) {
  const unlocked = new Set(progress.achievements);
  const handleReset = () => {
    if (window.confirm("Reset all progress? This cannot be undone.")) {
      resetProgress();
      setProgress({ xp: 0, level: 1, correctCount: 0, wrongCount: 0, streak: 0, bestStreak: 0, achievements: [] });
    }
  };

  const accuracy = progress.correctCount + progress.wrongCount > 0
    ? Math.round((progress.correctCount / (progress.correctCount + progress.wrongCount)) * 100)
    : 0;

  return (
    <div className="space-y-6" data-testid="achievements-page">
      <MCPanel variant="dirt">
        <h2 className="text-white" style={{ fontSize: 18 }}>INVENTORY & ACHIEVEMENTS</h2>
        <p className="text-white mt-2" style={{ fontSize: 22 }}>
          {unlocked.size} / {ACHIEVEMENTS.length} loot collected. Keep mining!
        </p>
      </MCPanel>

      <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "LEVEL", val: progress.level, color: "var(--mc-gold)" },
          { label: "XP", val: progress.xp, color: "var(--mc-emerald)" },
          { label: "CORRECT", val: progress.correctCount, color: "var(--mc-diamond)" },
          { label: "BEST STREAK", val: progress.bestStreak, color: "var(--mc-redstone)" },
        ].map((s) => (
          <MCPanel key={s.label} testId={`stat-${s.label}`}>
            <p className="pixel-font" style={{ fontSize: 10 }}>{s.label}</p>
            <p className="pixel-font mt-3" style={{ fontSize: 24, color: s.color, textShadow: "2px 2px 0 #000" }}>
              {s.val}
            </p>
          </MCPanel>
        ))}
      </div>

      <MCPanel testId="stats-extra">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <p className="pixel-font" style={{ fontSize: 10 }}>ACCURACY</p>
            <p className="pixel-font mt-2" style={{ fontSize: 18 }}>{accuracy}%</p>
          </div>
          <div>
            <p className="pixel-font" style={{ fontSize: 10 }}>TOTAL TRIES</p>
            <p className="pixel-font mt-2" style={{ fontSize: 18 }}>{progress.correctCount + progress.wrongCount}</p>
          </div>
        </div>
      </MCPanel>

      <div className="grid sm:grid-cols-2 gap-4">
        {ACHIEVEMENTS.map((a) => {
          const has = unlocked.has(a.id);
          const ArtComp = a.art ? ART_MAP[a.art] : null;
          return (
            <div
              key={a.id}
              className={`achievement ${has ? "" : "achievement--locked"}`}
              data-testid={`achievement-${a.id}`}
            >
              <div className="achievement__icon" style={{ background: `var(--mc-${a.icon === "iron" ? "iron" : a.icon === "gold" ? "gold" : a.icon === "diamond" ? "diamond" : a.icon === "emerald" ? "emerald" : a.icon === "redstone" ? "redstone" : "stone"})` }}>
                {ArtComp ? <ArtComp size={44} /> : <Block kind={a.icon} style={{ width: "100%", height: "100%" }} />}
              </div>
              <div className="flex-1">
                <p className="pixel-font" style={{ fontSize: 11, color: has ? "var(--mc-gold)" : "#000", textShadow: has ? "2px 2px 0 #000" : "none" }}>
                  {a.name}
                </p>
                <p className="mt-1" style={{ fontSize: 18 }}>{a.desc}</p>
                <p className="pixel-font mt-1" style={{ fontSize: 9, color: "#444" }}>+{a.xp} XP</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-end pt-2">
        <MCButton testId="reset-progress" variant="danger" onClick={handleReset}>
          ☠ RESET WORLD ☠
        </MCButton>
      </div>
    </div>
  );
}
