import React, { useState } from "react";
import { MCPanel, MCButton, Block } from "../components/MinecraftUI";
import { FractionVisualizer, FractionBig } from "../components/FractionVisualizer";

const PRESETS = [
  { n: 1, d: 2, label: "Half" },
  { n: 1, d: 3, label: "One Third" },
  { n: 2, d: 3, label: "Two Thirds" },
  { n: 1, d: 4, label: "Quarter" },
  { n: 3, d: 4, label: "Three Quarters" },
  { n: 3, d: 5, label: "Three Fifths" },
  { n: 5, d: 6, label: "Five Sixths" },
];

const BLOCK_KINDS = ["grass", "diamond", "emerald", "gold", "iron", "redstone", "tnt"];

export default function VisualizePage() {
  const [n, setN] = useState(3);
  const [d, setD] = useState(8);
  const [kind, setKind] = useState("diamond");

  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

  return (
    <div className="space-y-6" data-testid="visualize-page">
      <MCPanel variant="dirt">
        <h2 className="text-white" style={{ fontSize: 20 }}>BLOCK FRACTION LAB</h2>
        <p className="mt-2 text-white" style={{ fontSize: 22 }}>
          Mine the blocks! Each whole is split into <b>{d}</b> equal blocks.
          You've collected <b>{n}</b> of them — that's <b>{n}/{d}</b>.
        </p>
      </MCPanel>

      <div className="grid md:grid-cols-2 gap-6">
        <MCPanel testId="viz-controls">
          <h3 style={{ fontSize: 16 }}>CONTROLS</h3>
          <div className="mt-5 space-y-5">
            <div>
              <label className="pixel-font" style={{ fontSize: 11 }}>NUMERATOR (filled): {n}</label>
              <div className="flex gap-2 mt-2 flex-wrap">
                <MCButton testId="dec-n" onClick={() => setN(clamp(n - 1, 0, d))}>-</MCButton>
                <MCButton testId="inc-n" variant="primary" onClick={() => setN(clamp(n + 1, 0, d))}>+</MCButton>
                <input
                  type="range" min="0" max={d} value={n}
                  onChange={(e) => setN(Number(e.target.value))}
                  className="flex-1"
                  data-testid="numerator-slider"
                />
              </div>
            </div>
            <div>
              <label className="pixel-font" style={{ fontSize: 11 }}>DENOMINATOR (total blocks): {d}</label>
              <div className="flex gap-2 mt-2 flex-wrap">
                <MCButton testId="dec-d" onClick={() => { const nd = clamp(d-1,1,12); setD(nd); setN(Math.min(n,nd));}}>-</MCButton>
                <MCButton testId="inc-d" variant="primary" onClick={() => setD(clamp(d + 1, 1, 12))}>+</MCButton>
                <input
                  type="range" min="1" max="12" value={d}
                  onChange={(e) => { const nd = Number(e.target.value); setD(nd); setN(Math.min(n, nd)); }}
                  className="flex-1"
                  data-testid="denominator-slider"
                />
              </div>
            </div>
            <div>
              <label className="pixel-font block mb-2" style={{ fontSize: 11 }}>BLOCK TYPE</label>
              <div className="flex flex-wrap gap-2">
                {BLOCK_KINDS.map((k) => (
                  <button
                    key={k}
                    onClick={() => setKind(k)}
                    data-testid={`block-${k}`}
                    className="mc-slot"
                    style={{ width: 48, height: 48, padding: 4, background: kind === k ? "var(--mc-gold)" : "var(--mc-stone-dark)" }}
                  >
                    <Block kind={k} style={{ width: "100%", height: "100%" }} />
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t-4 border-black">
              <p className="pixel-font" style={{ fontSize: 11 }}>QUICK PRESETS:</p>
              <div className="flex flex-wrap gap-2 mt-3">
                {PRESETS.map((p) => (
                  <MCButton
                    key={p.label}
                    testId={`preset-${p.n}-${p.d}`}
                    onClick={() => { setN(p.n); setD(p.d); }}
                  >
                    {p.n}/{p.d}
                  </MCButton>
                ))}
              </div>
            </div>
          </div>
        </MCPanel>

        <MCPanel variant="dark" testId="viz-display">
          <h3 className="text-white" style={{ fontSize: 16 }}>WORLD VIEW</h3>
          <div className="mt-6 flex flex-col items-center gap-6">
            <FractionVisualizer n={n} d={d} blockKind={kind} size={Math.min(56, 360 / Math.min(d, 6))} />
            <div className="flex items-center gap-6 mt-4 mc-panel" style={{ padding: 16, background: "var(--mc-stone)" }}>
              <span className="pixel-font" style={{ fontSize: 12 }}>FRACTION:</span>
              <FractionBig n={n} d={d} />
              <span className="pixel-font" style={{ fontSize: 12 }}>= {(n/d).toFixed(3)}</span>
            </div>
            {n === d && d > 0 && (
              <div className="mc-pop pixel-font" style={{ color: "var(--mc-gold)", fontSize: 14, textShadow: "2px 2px 0 #000" }}>
                ★ WHOLE BLOCK! ★
              </div>
            )}
          </div>
        </MCPanel>
      </div>
    </div>
  );
}
