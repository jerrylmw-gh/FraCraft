// 8-bit chiptune sounds via Web Audio API. No external files = no asset cost.
let _ctx = null;
const getCtx = () => {
  if (!_ctx) {
    try { _ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch { _ctx = null; }
  }
  return _ctx;
};

const MUTE_KEY = "mc_fractions_mute_v1";
export const isMuted = () => localStorage.getItem(MUTE_KEY) === "1";
export const setMuted = (b) => localStorage.setItem(MUTE_KEY, b ? "1" : "0");

function blip(freq, duration = 0.1, type = "square", volume = 0.12, delay = 0) {
  if (isMuted()) return;
  const ctx = getCtx();
  if (!ctx) return;
  if (ctx.state === "suspended") ctx.resume().catch(() => {});
  const t0 = ctx.currentTime + delay;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  gain.gain.setValueAtTime(volume, t0);
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
  osc.connect(gain).connect(ctx.destination);
  osc.start(t0);
  osc.stop(t0 + duration + 0.02);
}

function noise(duration = 0.15, volume = 0.12, delay = 0) {
  if (isMuted()) return;
  const ctx = getCtx();
  if (!ctx) return;
  if (ctx.state === "suspended") ctx.resume().catch(() => {});
  const t0 = ctx.currentTime + delay;
  const len = Math.max(1, Math.floor(ctx.sampleRate * duration));
  const buf = ctx.createBuffer(1, len, ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / len);
  const src = ctx.createBufferSource();
  src.buffer = buf;
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(volume, t0);
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
  src.connect(gain).connect(ctx.destination);
  src.start(t0);
}

export const sfx = {
  click: () => blip(720, 0.05, "square", 0.07),
  hover: () => blip(900, 0.03, "square", 0.04),
  correct: () => {
    blip(523, 0.08, "square", 0.13, 0);
    blip(659, 0.08, "square", 0.13, 0.08);
    blip(784, 0.16, "square", 0.15, 0.16);
  },
  wrong: () => {
    blip(220, 0.12, "sawtooth", 0.12, 0);
    blip(165, 0.22, "sawtooth", 0.12, 0.1);
  },
  levelUp: () => {
    [523, 659, 784, 1046, 1318].forEach((f, i) =>
      blip(f, 0.12, "square", 0.16, i * 0.09)
    );
  },
  weaponUnlock: () => {
    blip(1047, 0.12, "triangle", 0.14, 0);
    blip(1568, 0.18, "triangle", 0.14, 0.1);
    blip(2093, 0.28, "triangle", 0.13, 0.22);
  },
  bossHit: () => {
    noise(0.08, 0.18);
    blip(120, 0.1, "sawtooth", 0.15, 0);
  },
  playerHit: () => {
    blip(180, 0.1, "sawtooth", 0.18, 0);
    blip(90, 0.2, "sawtooth", 0.18, 0.05);
  },
  bossRoar: () => {
    blip(80, 0.5, "sawtooth", 0.22, 0);
    blip(55, 0.6, "sawtooth", 0.18, 0.1);
    noise(0.4, 0.15, 0.05);
  },
  bossWin: () => {
    [523, 659, 784, 1046, 1318, 1568].forEach((f, i) =>
      blip(f, 0.18, "square", 0.2, i * 0.12)
    );
  },
  bossLose: () => {
    [440, 330, 220, 165, 110].forEach((f, i) =>
      blip(f, 0.25, "sawtooth", 0.18, i * 0.15)
    );
  },
};
