import React from "react";
import { Block } from "./MinecraftUI";

// Render a fraction n/d as a row/grid of Minecraft blocks
// "filled" blocks use blockKind, "empty" use mc-block--empty
export const FractionVisualizer = ({ n, d, blockKind = "grass", label = true, size = 56 }) => {
  const cols = Math.min(d, 6);
  return (
    <div className="flex flex-col items-center gap-3" data-testid={`viz-${n}-${d}`}>
      <div
        className="grid gap-1"
        style={{ gridTemplateColumns: `repeat(${cols}, ${size}px)` }}
      >
        {Array.from({ length: d }).map((_, i) => (
          <Block key={i} kind={i < n ? blockKind : "empty"} style={{ width: size, height: size }} />
        ))}
      </div>
      {label && (
        <div className="pixel-font text-white" style={{ fontSize: 18, textShadow: "2px 2px 0 #000" }}>
          {n} / {d}
        </div>
      )}
    </div>
  );
};

// Stacked vertical fraction display: numerator above denominator
export const FractionBig = ({ n, d, color = "#000" }) => (
  <div className="inline-flex flex-col items-center" style={{ lineHeight: 1, color }}>
    <span className="pixel-font" style={{ fontSize: 28, padding: "0 8px" }}>{n}</span>
    <span style={{ background: color, height: 4, width: "100%", margin: "4px 0" }} />
    <span className="pixel-font" style={{ fontSize: 28, padding: "0 8px" }}>{d}</span>
  </div>
);
