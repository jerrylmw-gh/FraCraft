import React, { useState, useEffect, useRef } from "react";
import { MCPanel, MCButton } from "../components/MinecraftUI";
import { EnderDragon, Steve, DiamondSword } from "../components/PixelArt";
import { generateLocalProblem } from "../lib/fractions";
import { applyResult, bossUnlocked } from "../lib/storage";
import { sfx } from "../lib/sounds";
import { toast } from "sonner";

const TIMER_SECONDS = 60;
const DRAGON_MAX_HP = 200;
const PLAYER_MAX_HP = 100;
const DAMAGE_PER_HIT = 25;
const DAMAGE_TO_PLAYER = 20;

const TOPICS = ["add", "subtract", "multiply", "compare"];

function newBattleProblem() {
  const topic = TOPICS[Math.floor(Math.random() * TOPICS.length)];
  return generateLocalProblem(topic, "medium");
}

export default function BossPage({ progress, setProgress, setView }) {
  const unlocked = bossUnlocked(progress);

  const [phase, setPhase] = useState("intro"); // intro | fight | win | lose
  const [dragonHp, setDragonHp] = useState(DRAGON_MAX_HP);
  const [playerHp, setPlayerHp] = useState(PLAYER_MAX_HP);
  const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS);
  const [problem, setProblem] = useState(() => newBattleProblem());
  const [feedback, setFeedback] = useState(null); // 'hit' | 'miss'
  const [shake, setShake] = useState(null); // 'dragon' | 'player'
  const intervalRef = useRef(null);
  const finishedRef = useRef(false);

  // --- Battle logic ---
  const startBattle = () => {
    setPhase("fight");
    setDragonHp(DRAGON_MAX_HP);
    setPlayerHp(PLAYER_MAX_HP);
    setTimeLeft(TIMER_SECONDS);
    setProblem(newBattleProblem());
    setFeedback(null);
    finishedRef.current = false;
    sfx.bossRoar();
  };

  useEffect(() => {
    if (phase !== "fight") return;
    intervalRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(intervalRef.current);
          endBattle("lose");
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const endBattle = (outcome) => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    clearInterval(intervalRef.current);
    setPhase(outcome);
    if (outcome === "win") {
      sfx.bossWin();
      // Reward: 200 XP + dragon_slayer achievement via applyResult
      const { state, newWeapons } = applyResult(progress, {
        correct: true,
        difficulty: "hard",
        topic: "boss_win",
      });
      // Bonus XP boost
      const bonus = { ...state, xp: state.xp + 200 };
      // Re-level if XP overflows (simple loop)
      let lv = bonus.level;
      let xp = bonus.xp;
      while (xp >= 100 * lv) { xp -= 100 * lv; lv += 1; }
      bonus.level = lv; bonus.xp = xp;
      setProgress(bonus);
      toast.success("🐉 DRAGON SLAIN!", { description: "+200 bonus XP + Dragon Slayer achievement!" });
      if (newWeapons && newWeapons.length) {
        newWeapons.forEach((w) =>
          toast(`⚔ NEW WEAPON: ${w.name.toUpperCase()}`, { description: w.desc, duration: 4000 })
        );
      }
    } else {
      sfx.bossLose();
      toast.error("💀 You were slain by the Ender Dragon", { description: "Train more in Practice and try again!" });
    }
  };

  const answer = (idx) => {
    if (phase !== "fight" || feedback) return;
    const correct = idx === problem.correct_index;
    if (correct) {
      sfx.bossHit();
      setFeedback("hit");
      setShake("dragon");
      const newDragonHp = Math.max(0, dragonHp - DAMAGE_PER_HIT);
      setDragonHp(newDragonHp);
      setTimeout(() => {
        setShake(null);
        setFeedback(null);
        if (newDragonHp <= 0) {
          endBattle("win");
        } else {
          setProblem(newBattleProblem());
        }
      }, 500);
    } else {
      sfx.playerHit();
      setFeedback("miss");
      setShake("player");
      const newPlayerHp = Math.max(0, playerHp - DAMAGE_TO_PLAYER);
      setPlayerHp(newPlayerHp);
      setTimeout(() => {
        setShake(null);
        setFeedback(null);
        if (newPlayerHp <= 0) {
          endBattle("lose");
        } else {
          setProblem(newBattleProblem());
        }
      }, 600);
    }
  };

  // --- Render ---
  // Locked screen — placed after all hooks so React hook order is preserved
  if (!unlocked) {
    return (
      <div className="space-y-6" data-testid="boss-locked-page">
        <MCPanel variant="dirt">
          <h2 className="text-white" style={{ fontSize: 20 }}>⛨ BOSS BATTLE ⛨</h2>
          <p className="text-white mt-2" style={{ fontSize: 22 }}>
            The End portal is sealed. Forge the IRON SHIELD first!
          </p>
        </MCPanel>
        <MCPanel variant="dark" testId="boss-lock">
          <div className="flex flex-col items-center gap-5 py-6">
            <div style={{ filter: "grayscale(1) brightness(0.5)" }}>
              <EnderDragon size={220} />
            </div>
            <p className="text-white text-center" style={{ fontSize: 22 }}>
              🔒 Unlock by answering <b>12 questions</b> correctly to earn the Iron Shield.
            </p>
            <p className="pixel-font pixel-font--xs" style={{ fontSize: 11, color: "var(--mc-gold)" }}>
              YOUR PROGRESS: {progress.correctCount} / 12 CORRECT
            </p>
            <MCButton variant="primary" onClick={() => setView("practice")} testId="boss-go-practice">
              ▶ TRAIN IN PRACTICE
            </MCButton>
          </div>
        </MCPanel>
      </div>
    );
  }

  const dragonPct = (dragonHp / DRAGON_MAX_HP) * 100;
  const playerPct = (playerHp / PLAYER_MAX_HP) * 100;

  return (
    <div className="space-y-5" data-testid="boss-page">
      <MCPanel variant="dirt">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h2 className="text-white" style={{ fontSize: 18 }}>⛨ ENDER DRAGON FIGHT ⛨</h2>
          {phase === "fight" && (
            <div className="pixel-font" style={{ fontSize: 16, color: timeLeft <= 10 ? "var(--mc-redstone)" : "var(--mc-gold)" }}>
              ⏱ {timeLeft}s
            </div>
          )}
        </div>
      </MCPanel>

      {phase === "intro" && (
        <MCPanel variant="dark" testId="boss-intro">
          <div className="flex flex-col items-center gap-5 py-6">
            <EnderDragon size={260} />
            <p className="text-white text-center" style={{ fontSize: 24 }}>
              The Ender Dragon roars! You have <b>{TIMER_SECONDS} seconds</b>.<br />
              Each correct fraction answer deals <b>{DAMAGE_PER_HIT} damage</b>.<br />
              Each wrong answer costs you <b>{DAMAGE_TO_PLAYER} HP</b>.
            </p>
            <MCButton testId="boss-start" variant="danger" onClick={startBattle}>
              ⚔ ENTER THE END ⚔
            </MCButton>
          </div>
        </MCPanel>
      )}

      {phase === "fight" && (
        <>
          {/* Dragon */}
          <MCPanel variant="dark" className={shake === "dragon" ? "mc-shake" : ""} testId="boss-dragon">
            <div className="flex items-center gap-5 flex-wrap">
              <EnderDragon size={120} />
              <div className="flex-1 min-w-[200px]">
                <p className="pixel-font" style={{ fontSize: 12, color: "var(--mc-redstone)", textShadow: "2px 2px 0 #000" }}>
                  ENDER DRAGON
                </p>
                <div className="xp-bar mt-2" style={{ height: 32 }}>
                  <div className="xp-bar__fill" style={{ width: `${dragonPct}%`, background: "var(--mc-redstone)", borderTop: "2px solid #ff7a7a", borderBottom: "2px solid #5a0000" }} />
                  <span className="xp-bar__label">{dragonHp} / {DRAGON_MAX_HP} HP</span>
                </div>
              </div>
              {feedback === "hit" && (
                <div className="mc-float pixel-font" style={{ fontSize: 22, color: "var(--mc-gold)", textShadow: "2px 2px 0 #000" }}>
                  -{DAMAGE_PER_HIT}!
                </div>
              )}
            </div>
          </MCPanel>

          {/* Problem */}
          <MCPanel testId="boss-problem">
            <p className="pixel-font text-center" style={{ fontSize: 11, color: "var(--mc-redstone)" }}>FRACTION ATTACK</p>
            <div className="mt-4 text-center pixel-font" style={{ fontSize: 26, whiteSpace: "pre-line", textShadow: "2px 2px 0 #000" }}>
              {problem.question}
            </div>
            <div className="grid grid-cols-2 gap-3 mt-5">
              {problem.choices.map((c, i) => (
                <button
                  key={i}
                  data-testid={`boss-choice-${i}`}
                  onClick={() => answer(i)}
                  disabled={!!feedback}
                  className="mc-btn"
                  style={{ fontSize: 16, padding: "16px 12px" }}
                >
                  {c}
                </button>
              ))}
            </div>
          </MCPanel>

          {/* Player */}
          <MCPanel variant="dark" className={shake === "player" ? "mc-shake" : ""} testId="boss-player">
            <div className="flex items-center gap-5 flex-wrap">
              <div className="mc-slot" style={{ width: 80, height: 80 }}>
                <Steve size={64} />
              </div>
              <DiamondSword size={56} />
              <div className="flex-1 min-w-[200px]">
                <p className="pixel-font" style={{ fontSize: 12, color: "var(--mc-emerald)", textShadow: "2px 2px 0 #000" }}>
                  {`STEVE (LVL ${progress.level})`}
                </p>
                <div className="xp-bar mt-2" style={{ height: 28 }}>
                  <div
                    className="xp-bar__fill"
                    style={{
                      width: `${playerPct}%`,
                      background: playerPct > 50 ? "var(--mc-emerald)" : playerPct > 25 ? "var(--mc-gold)" : "var(--mc-redstone)",
                    }}
                  />
                  <span className="xp-bar__label">{playerHp} / {PLAYER_MAX_HP} HP</span>
                </div>
              </div>
              {feedback === "miss" && (
                <div className="mc-float pixel-font" style={{ fontSize: 22, color: "var(--mc-redstone)", textShadow: "2px 2px 0 #000" }}>
                  -{DAMAGE_TO_PLAYER}!
                </div>
              )}
            </div>
          </MCPanel>
        </>
      )}

      {phase === "win" && (
        <MCPanel variant="dark" testId="boss-win">
          <div className="flex flex-col items-center gap-5 py-6 mc-pop">
            <div style={{ filter: "drop-shadow(0 0 12px gold)" }}>
              <EnderDragon size={200} />
            </div>
            <h2 className="text-center" style={{ fontSize: 22, color: "var(--mc-gold)" }}>★ VICTORY! ★</h2>
            <p className="text-white text-center" style={{ fontSize: 22 }}>
              You slayed the Ender Dragon and earned <b>+200 bonus XP</b> + the <b>Dragon Slayer</b> achievement!
            </p>
            <div className="flex gap-3">
              <MCButton variant="primary" onClick={startBattle} testId="boss-fight-again">⚔ FIGHT AGAIN</MCButton>
              <MCButton onClick={() => setView("achievements")} testId="boss-view-inventory">INVENTORY</MCButton>
            </div>
          </div>
        </MCPanel>
      )}

      {phase === "lose" && (
        <MCPanel variant="dark" testId="boss-lose">
          <div className="flex flex-col items-center gap-5 py-6">
            <div style={{ filter: "grayscale(0.5) brightness(0.7)" }}>
              <Steve size={140} />
            </div>
            <h2 className="text-center" style={{ fontSize: 22, color: "var(--mc-redstone)" }}>💀 DEFEATED 💀</h2>
            <p className="text-white text-center" style={{ fontSize: 22 }}>
              The Dragon won this round. Train more in Practice mode and try again!
            </p>
            <div className="flex gap-3">
              <MCButton variant="danger" onClick={startBattle} testId="boss-retry">↻ RETRY</MCButton>
              <MCButton variant="primary" onClick={() => setView("practice")} testId="boss-train">▶ TRAIN</MCButton>
            </div>
          </div>
        </MCPanel>
      )}
    </div>
  );
}
