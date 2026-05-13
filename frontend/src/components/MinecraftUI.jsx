import React from "react";
import { sfx } from "../lib/sounds";

export const MCButton = ({ children, variant = "default", className = "", testId, onClick, ...props }) => {
  const cls = `mc-btn ${variant === "primary" ? "mc-btn--primary" : variant === "gold" ? "mc-btn--gold" : variant === "danger" ? "mc-btn--danger" : ""} ${className}`;
  const handleClick = (e) => {
    sfx.click();
    if (onClick) onClick(e);
  };
  return (
    <button className={cls} data-testid={testId} onClick={handleClick} {...props}>
      {children}
    </button>
  );
};

export const MCPanel = ({ children, className = "", variant = "default", testId }) => {
  const cls = `mc-panel ${variant === "dark" ? "mc-panel--dark" : variant === "dirt" ? "mc-panel--dirt" : ""} ${className}`;
  return <div className={cls} data-testid={testId}>{children}</div>;
};

export const XPBar = ({ current, max, level }) => {
  const pct = Math.min(100, Math.round((current / max) * 100));
  return (
    <div className="flex items-center gap-3 w-full" data-testid="xp-bar">
      <div className="mc-slot" style={{ width: 48, height: 48 }} data-testid="player-level">
        <span style={{ color: "var(--mc-gold)", textShadow: "2px 2px 0 #000" }}>{level}</span>
      </div>
      <div className="flex-1">
        <div className="xp-bar">
          <div className="xp-bar__fill" style={{ width: `${pct}%` }} />
          <span className="xp-bar__label">{current} / {max} XP</span>
        </div>
      </div>
    </div>
  );
};

export const Block = ({ kind = "grass", className = "", style = {}, onClick }) => (
  <div
    className={`mc-block mc-block--${kind} ${className}`}
    style={style}
    onClick={onClick}
    role={onClick ? "button" : undefined}
  />
);

export const NavTab = ({ active, onClick, children, testId }) => (
  <button
    onClick={onClick}
    data-testid={testId}
    className="mc-btn"
    style={{
      background: active ? "var(--mc-grass)" : "var(--mc-stone-dark)",
      borderColor: active ? "#2D5318" : "#000",
      fontSize: 11,
    }}
  >
    {children}
  </button>
);
