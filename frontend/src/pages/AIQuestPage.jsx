import React, { useState } from "react";
import axios from "axios";
import { MCPanel, MCButton } from "../components/MinecraftUI";
import { applyResult } from "../lib/storage";
import { toast } from "sonner";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const DIFFS = ["easy", "medium", "hard"];
const TOPICS = [
  { id: "word", label: "WORD STORY" },
  { id: "add", label: "ADD" },
  { id: "subtract", label: "SUB" },
  { id: "compare", label: "COMPARE" },
];

export default function AIQuestPage({ progress, setProgress }) {
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [topic, setTopic] = useState("word");
  const [difficulty, setDifficulty] = useState("easy");
  const [selected, setSelected] = useState(null);
  const [result, setResult] = useState(null);

  const fetchProblem = async () => {
    setLoading(true);
    setSelected(null);
    setResult(null);
    try {
      const res = await axios.post(`${API}/problems/generate`, { topic, difficulty });
      setProblem(res.data);
    } catch (e) {
      console.error(e);
      toast.error("Quest generator offline", { description: "The AI mob isn't responding. Try again!" });
    } finally {
      setLoading(false);
    }
  };

  const submit = (idx) => {
    if (result || !problem) return;
    setSelected(idx);
    const correct = idx === problem.correct_index;
    setResult(correct ? "correct" : "wrong");
    const { state, gained, leveledUp } = applyResult(progress, {
      correct,
      difficulty,
      topic: "ai",
    });
    setProgress(state);
    if (correct) {
      toast.success(`+${gained} XP from the AI Quest!`, { description: leveledUp ? "LEVEL UP!" : problem.explanation });
    } else {
      toast.error("Creeper sneaks in!", { description: problem.explanation });
    }
  };

  return (
    <div className="space-y-6" data-testid="ai-quest-page">
      <MCPanel variant="dirt">
        <h2 className="text-white" style={{ fontSize: 18 }}>AI QUEST — STORY PROBLEMS</h2>
        <p className="text-white mt-2" style={{ fontSize: 22 }}>
          A wizard NPC crafts a fresh Minecraft-themed fraction problem just for you!
        </p>
      </MCPanel>

      <MCPanel>
        <div className="flex flex-wrap gap-3 items-center">
          <span className="pixel-font" style={{ fontSize: 11 }}>TOPIC:</span>
          {TOPICS.map((t) => (
            <MCButton
              key={t.id}
              testId={`ai-topic-${t.id}`}
              variant={topic === t.id ? "primary" : "default"}
              onClick={() => setTopic(t.id)}
            >
              {t.label}
            </MCButton>
          ))}
        </div>
        <div className="flex flex-wrap gap-3 items-center mt-4">
          <span className="pixel-font" style={{ fontSize: 11 }}>LVL:</span>
          {DIFFS.map((d) => (
            <MCButton
              key={d}
              testId={`ai-diff-${d}`}
              variant={difficulty === d ? "gold" : "default"}
              onClick={() => setDifficulty(d)}
            >
              {d.toUpperCase()}
            </MCButton>
          ))}
          <div className="flex-1" />
          <MCButton testId="generate-quest" variant="primary" onClick={fetchProblem} disabled={loading}>
            {loading ? "SUMMONING…" : "✦ GENERATE QUEST ✦"}
          </MCButton>
        </div>
      </MCPanel>

      {loading && (
        <MCPanel variant="dark" testId="loading-card">
          <p className="text-white pixel-font text-center" style={{ fontSize: 14 }}>
            ⛏ THE AI IS MINING IDEAS… ⛏
          </p>
        </MCPanel>
      )}

      {problem && !loading && (
        <MCPanel variant="dark" testId="ai-problem">
          <div className="flex items-center gap-3 mb-3">
            <div className={`mc-block mc-block--${problem.minecraft_flavor.includes("diamond") ? "diamond" : problem.minecraft_flavor.includes("emerald") ? "emerald" : problem.minecraft_flavor.includes("gold") ? "gold" : problem.minecraft_flavor.includes("iron") ? "iron" : "grass"}`} style={{ width: 48, height: 48 }} />
            <p className="pixel-font" style={{ color: "var(--mc-gold)", fontSize: 11 }}>
              QUEST: {problem.minecraft_flavor.toUpperCase()}
            </p>
          </div>
          <p className="text-white" style={{ fontSize: 24, lineHeight: 1.5 }}>{problem.question}</p>

          <div className="grid grid-cols-2 gap-4 mt-6">
            {problem.choices.map((c, i) => {
              const isCorrect = result && i === problem.correct_index;
              const isWrong = result === "wrong" && i === selected;
              const bg = isCorrect ? "var(--mc-grass)" : isWrong ? "var(--mc-redstone)" : undefined;
              return (
                <button
                  key={i}
                  data-testid={`ai-choice-${i}`}
                  onClick={() => submit(i)}
                  disabled={!!result}
                  className="mc-btn"
                  style={{
                    background: bg,
                    fontSize: 16,
                    padding: "18px 14px",
                    borderColor: isCorrect ? "#2D5318" : isWrong ? "#4A0000" : "#000",
                  }}
                >
                  {c}
                </button>
              );
            })}
          </div>

          {result && (
            <div className="mt-6">
              <div className="mc-panel" style={{ padding: 14, background: "var(--mc-stone)" }}>
                <p className="pixel-font" style={{ fontSize: 11 }}>NPC HINT:</p>
                <p className="mt-2" style={{ fontSize: 20 }}>{problem.explanation}</p>
              </div>
              <div className="flex justify-end mt-4">
                <MCButton testId="ai-next" variant="primary" onClick={fetchProblem}>
                  ANOTHER QUEST →
                </MCButton>
              </div>
            </div>
          )}
        </MCPanel>
      )}

      {!problem && !loading && (
        <MCPanel variant="dark" testId="ai-empty">
          <p className="text-white text-center" style={{ fontSize: 22 }}>
            Press "GENERATE QUEST" to summon a Minecraft fraction problem!
          </p>
        </MCPanel>
      )}
    </div>
  );
}
