import React from "react";
import { MCPanel, MCButton, Block } from "../components/MinecraftUI";

export default function HomePage({ progress, setView }) {
  return (
    <div className="space-y-6" data-testid="home-page">
      <MCPanel variant="dark" testId="hero">
        <div className="flex items-start gap-6 flex-wrap">
          <div className="flex gap-1">
            <Block kind="grass" style={{ width: 64, height: 64 }} />
            <Block kind="diamond" style={{ width: 64, height: 64 }} />
            <Block kind="emerald" style={{ width: 64, height: 64 }} />
            <Block kind="gold" style={{ width: 64, height: 64 }} />
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
    <div className="pixel-font mt-4" style={{ fontSize: 10, color: "var(--mc-redstone)" }}>
      ENTER →
    </div>
  </button>
);
