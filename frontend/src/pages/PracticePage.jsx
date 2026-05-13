import React, { useState, useMemo } from "react";
import { MCPanel, MCButton } from "../components/MinecraftUI";
import { OpWeapon, Creeper } from "../components/PixelArt";
import { generateLocalProblem } from "../lib/fractions";
import { applyResult } from "../lib/storage";
import { toast } from "sonner";

const OPS = [
  { id: "add", label: "ADD +", color: "var(--mc-grass)" },
  { id: "subtract", label: "SUB −", color: "#866043" },
  { id: "multiply", label: "MUL ×", color: "var(--mc-gold)" },
  { id: "divide", label: "DIV ÷", color: "var(--mc-diamond)" },
  { id: "compare", label: "COMPARE", color: "var(--mc-emerald)" },
];

const DIFFS = ["easy", "medium", "hard"];

export default function PracticePage({ progress, setProgress }) {
  const [op, setOp] = useState("add");
  const [difficulty, setDifficulty] = useState("easy");
  const [problem, setProblem] = useState(() => generateLocalProblem("add", "easy"));
  const [selected, setSelected] = useState(null);
  const [result, setResult] = useState(null); // 'correct' | 'wrong' | null
  const [shake, setShake] = useState(false);

  const newProblem = (newOp = op, newDiff = difficulty) => {
    setProblem(generateLocalProblem(newOp, newDiff));
    setSelected(null);
    setResult(null);
  };

  const submit = (idx) => {
    if (result) return;
    setSelected(idx);
    const correct = idx === problem.correct_index;
    setResult(correct ? "correct" : "wrong");
    const { state, gained, leveledUp } = applyResult(progress, {
      correct,
      difficulty,
      topic: op,
    });
    setProgress(state);
    if (correct) {
      toast.success(`+${gained} XP!`, { description: leveledUp ? "LEVEL UP!" : problem.explanation });
    } else {
      setShake(true);
      setTimeout(() => setShake(false), 400);
      toast.error("Not quite!", { description: problem.explanation });
    }
  };

  return (
    <div className="space-y-6" data-testid="practice-page">
      <MCPanel variant="dirt">
        <h2 className="text-white" style={{ fontSize: 20 }}>CRAFTING TABLE — PRACTICE</h2>
        <p className="text-white mt-2" style={{ fontSize: 22 }}>
          Pick an operation. Solve fraction problems. Earn XP and ores!
        </p>
      </MCPanel>

      <MCPanel testId="practice-controls">
        <div className="flex flex-wrap gap-3 items-center">
          <span className="pixel-font" style={{ fontSize: 11 }}>OP:</span>
          {OPS.map((o) => (
            <MCButton
              key={o.id}
              testId={`op-${o.id}`}
              variant={op === o.id ? "primary" : "default"}
              onClick={() => { setOp(o.id); newProblem(o.id, difficulty); }}
            >
              <OpWeapon op={o.id} size={22} />
              {o.label}
            </MCButton>
          ))}
        </div>
        <div className="flex flex-wrap gap-3 items-center mt-4">
          <span className="pixel-font" style={{ fontSize: 11 }}>LVL:</span>
          {DIFFS.map((d) => (
            <MCButton
              key={d}
              testId={`diff-${d}`}
              variant={difficulty === d ? "gold" : "default"}
              onClick={() => { setDifficulty(d); newProblem(op, d); }}
            >
              {d.toUpperCase()}
            </MCButton>
          ))}
        </div>
      </MCPanel>

      <MCPanel variant="dark" className={shake ? "mc-shake" : ""} testId="problem-card">
        <div className="text-center py-4">
          <div className="flex items-center justify-center gap-4 mb-2">
            <OpWeapon op={op} size={48} />
            <p className="pixel-font" style={{ fontSize: 12, color: "var(--mc-gold)" }}>PROBLEM</p>
            <Creeper size={48} />
          </div>
          <div className="mt-6 pixel-font text-white" style={{ fontSize: 28, lineHeight: 1.4, whiteSpace: "pre-line", textShadow: "3px 3px 0 #000" }}>
            {problem.question}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-6">
          {problem.choices.map((c, i) => {
            const isCorrect = result && i === problem.correct_index;
            const isWrong = result === "wrong" && i === selected;
            const bg = isCorrect ? "var(--mc-grass)" : isWrong ? "var(--mc-redstone)" : undefined;
            return (
              <button
                key={i}
                data-testid={`choice-${i}`}
                onClick={() => submit(i)}
                disabled={!!result}
                className="mc-btn"
                style={{
                  background: bg,
                  fontSize: 18,
                  padding: "20px 16px",
                  borderColor: isCorrect ? "#2D5318" : isWrong ? "#4A0000" : "#000",
                  cursor: result ? "default" : "pointer",
                }}
              >
                {c}
              </button>
            );
          })}
        </div>

        {result && (
          <div className="mt-6 flex justify-between items-center flex-wrap gap-3">
            <p className="text-white pixel-font" style={{ fontSize: 12 }}>
              {result === "correct" ? "★ CORRECT! ★" : "✖ TRY AGAIN!"}
            </p>
            <MCButton testId="next-problem" variant="primary" onClick={() => newProblem()}>
              NEXT BLOCK →
            </MCButton>
          </div>
        )}
      </MCPanel>
    </div>
  );
}
