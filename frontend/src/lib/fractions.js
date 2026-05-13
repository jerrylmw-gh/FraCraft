// Fraction utility helpers
export function gcd(a, b) {
  a = Math.abs(a); b = Math.abs(b);
  while (b) { [a, b] = [b, a % b]; }
  return a || 1;
}

export function simplify(n, d) {
  if (d === 0) return { n: 0, d: 1 };
  const g = gcd(n, d);
  return { n: n / g, d: d / g };
}

export function addFractions(a, b) {
  return simplify(a.n * b.d + b.n * a.d, a.d * b.d);
}
export function subFractions(a, b) {
  return simplify(a.n * b.d - b.n * a.d, a.d * b.d);
}
export function mulFractions(a, b) {
  return simplify(a.n * b.n, a.d * b.d);
}
export function divFractions(a, b) {
  return simplify(a.n * b.d, a.d * b.n);
}

export function compareFractions(a, b) {
  // returns -1, 0, 1
  const left = a.n * b.d;
  const right = b.n * a.d;
  if (left < right) return -1;
  if (left > right) return 1;
  return 0;
}

export function fracToString(f) {
  if (f.d === 1) return `${f.n}`;
  return `${f.n}/${f.d}`;
}

export function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function randomFraction(maxDen = 8) {
  const d = randInt(2, maxDen);
  const n = randInt(1, d);
  return { n, d };
}

// Generate practice problems (local, no LLM)
export function generateLocalProblem(op, difficulty = "easy") {
  const maxDen = difficulty === "easy" ? 6 : difficulty === "medium" ? 8 : 12;
  const a = randomFraction(maxDen);
  let b = randomFraction(maxDen);

  let answer, symbol;
  if (op === "add") { answer = addFractions(a, b); symbol = "+"; }
  else if (op === "subtract") {
    // ensure a >= b
    if (compareFractions(a, b) < 0) [a.n, b.n] = [b.n, a.n], [a.d, b.d] = [b.d, a.d];
    if (compareFractions(a, b) < 0) {
      // swap properly
      const tmp = { ...a }; a.n = b.n; a.d = b.d; b.n = tmp.n; b.d = tmp.d;
    }
    answer = subFractions(a, b); symbol = "-";
  }
  else if (op === "multiply") { answer = mulFractions(a, b); symbol = "×"; }
  else if (op === "divide") { answer = divFractions(a, b); symbol = "÷"; }
  else if (op === "compare") {
    const cmp = compareFractions(a, b);
    const correct = cmp < 0 ? "<" : cmp > 0 ? ">" : "=";
    const choices = ["<", ">", "="];
    return {
      id: `local-${Date.now()}-${Math.random()}`,
      topic: "compare",
      difficulty,
      question: `Which sign makes this true?\n${fracToString(a)}  ?  ${fracToString(b)}`,
      a, b,
      choices,
      correct_index: choices.indexOf(correct),
      explanation: `Cross-multiply: ${a.n}×${b.d}=${a.n*b.d} and ${b.n}×${a.d}=${b.n*a.d}, so ${fracToString(a)} ${correct} ${fracToString(b)}.`,
    };
  }

  // Build choices for op problems
  const correctStr = fracToString(answer);
  const wrong = new Set();
  while (wrong.size < 3) {
    const w = simplify(answer.n + randInt(-2, 2), Math.max(1, answer.d + randInt(-1, 2)));
    const ws = fracToString(w);
    if (ws !== correctStr && !wrong.has(ws)) wrong.add(ws);
  }
  const choices = [correctStr, ...Array.from(wrong)].sort(() => Math.random() - 0.5);
  return {
    id: `local-${Date.now()}-${Math.random()}`,
    topic: op,
    difficulty,
    question: `${fracToString(a)}  ${symbol}  ${fracToString(b)}  =  ?`,
    a, b,
    choices,
    correct_index: choices.indexOf(correctStr),
    explanation: `${fracToString(a)} ${symbol} ${fracToString(b)} = ${correctStr}. Find a common denominator (or cross-multiply for ${symbol === "×" || symbol === "÷" ? "×/÷" : "+/-"}), then simplify.`,
  };
}
