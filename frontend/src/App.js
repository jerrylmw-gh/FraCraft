import React, { useEffect, useState } from "react";
import "@/App.css";
import { Toaster } from "sonner";
import { loadProgress, saveProgress, xpForLevel } from "./lib/storage";
import { MCPanel, NavTab, XPBar, Block } from "./components/MinecraftUI";
import { Steve } from "./components/PixelArt";
import { isMuted, setMuted, sfx } from "./lib/sounds";
import HomePage from "./pages/HomePage";
import VisualizePage from "./pages/VisualizePage";
import PracticePage from "./pages/PracticePage";
import BossPage from "./pages/BossPage";
import AchievementsPage from "./pages/AchievementsPage";

const TABS = [
  { id: "home", label: "HOME" },
  { id: "visualize", label: "BLOCK LAB" },
  { id: "practice", label: "PRACTICE" },
  { id: "boss", label: "BOSS" },
  { id: "achievements", label: "INVENTORY" },
];

function App() {
  const [view, setView] = useState("home");
  const [progress, setProgress] = useState(() => loadProgress());
  const [muted, setMutedState] = useState(() => isMuted());

  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  const toggleMute = () => {
    const next = !muted;
    setMuted(next);
    setMutedState(next);
    if (!next) sfx.click();
  };

  return (
    <div className="App mc-world-bg" data-testid="app-root">
      <Toaster
        position="top-right"
        duration={2500}
        toastOptions={{
          style: {
            fontFamily: "'VT323', monospace",
            fontSize: 20,
            background: "var(--mc-stone)",
            border: "3px solid #000",
            borderRadius: 0,
            color: "#000",
          },
        }}
      />

      {/* ============ Top Bar (status / hotbar) ============ */}
      <header
        className="sticky top-0 z-40 border-b-4 border-black"
        style={{ background: "rgba(0,0,0,0.85)", color: "#fff" }}
        data-testid="topbar"
      >
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="mc-slot" style={{ width: 44, height: 44 }} data-testid="steve-avatar">
              <Steve size={36} />
            </div>
            <div className="flex gap-1">
              <Block kind="grass" style={{ width: 36, height: 36 }} />
              <Block kind="diamond" style={{ width: 36, height: 36 }} />
            </div>
            <h1 className="text-white" style={{ fontSize: 14, margin: 0 }}>FRAC-CRAFT</h1>
          </div>
          <div className="flex-1 min-w-[220px]">
            <XPBar current={progress.xp} max={xpForLevel(progress.level)} level={progress.level} />
          </div>
          <div className="flex gap-2 items-center">
            <button
              onClick={toggleMute}
              className="mc-slot"
              style={{ width: 44, height: 44, fontSize: 18, cursor: "pointer" }}
              data-testid="mute-toggle"
              title={muted ? "Sound: OFF" : "Sound: ON"}
            >
              {muted ? "🔇" : "🔊"}
            </button>
            <div className="mc-slot" style={{ width: 44, height: 44, fontSize: 11 }}>
              <span style={{ color: "var(--mc-gold)" }}>{progress.streak}</span>
            </div>
            <p className="pixel-font pixel-font--xs" style={{ fontSize: 9 }}>STREAK</p>
          </div>
        </div>
      </header>

      {/* ============ Tab Nav ============ */}
      <nav className="max-w-6xl mx-auto px-4 pt-5" data-testid="nav">
        <div className="flex flex-wrap gap-2">
          {TABS.map((t) => (
            <NavTab
              key={t.id}
              active={view === t.id}
              onClick={() => setView(t.id)}
              testId={`nav-${t.id}`}
            >
              {t.label}
            </NavTab>
          ))}
        </div>
      </nav>

      {/* ============ Main ============ */}
      <main className="max-w-6xl mx-auto px-4 py-6 pb-24" data-testid="main">
        {view === "home" && <HomePage progress={progress} setView={setView} />}
        {view === "visualize" && <VisualizePage />}
        {view === "practice" && <PracticePage progress={progress} setProgress={setProgress} />}
        {view === "boss" && <BossPage progress={progress} setProgress={setProgress} setView={setView} />}
        {view === "achievements" && <AchievementsPage progress={progress} setProgress={setProgress} />}
      </main>

      {/* ============ Grass footer strip ============ */}
      <footer
        className="fixed bottom-0 left-0 right-0 pointer-events-none"
        style={{ height: 28, background: "var(--mc-grass)", borderTop: "4px solid #2D5318", zIndex: 30 }}
        data-testid="footer-grass"
      />
    </div>
  );
}

export default App;
