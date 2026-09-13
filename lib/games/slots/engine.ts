import { generateResult, HOUSE_EDGE } from "@/lib/fairness/rng";

export interface SymbolDef {
  id: string;
  weight: number;
  payout3: number;
}

export const SYMBOLS: SymbolDef[] = [
  { id: "\uD83C\uDF52", weight: 30, payout3: 2 },
  { id: "\uD83C\uDF4B", weight: 25, payout3: 3 },
  { id: "\u2B50", weight: 18, payout3: 5 },
  { id: "\uD83D\uDC8E", weight: 12, payout3: 10 },
  { id: "7", weight: 8, payout3: 25 },
  { id: "BAR", weight: 7, payout3: 50 },
];

const TOTAL_WEIGHT = SYMBOLS.reduce((sum, s) => sum + s.weight, 0);

export interface SpinResult {
  symbols: [string, string, string];
  payout: number;
  multiplier: number;
}

function weightedRandom(rand: number): string {
  let cumulative = 0;
  for (const sym of SYMBOLS) {
    cumulative += sym.weight;
    if (rand * TOTAL_WEIGHT < cumulative) {
      return sym.id;
    }
  }
  return SYMBOLS[SYMBOLS.length - 1].id;
}

export function spinReels(serverSeed: string, clientSeed: string, nonce: number): [string, string, string] {
  const r1 = generateResult(serverSeed, clientSeed, nonce);
  const r2 = generateResult(serverSeed, clientSeed, nonce + 1);
  const r3 = generateResult(serverSeed, clientSeed, nonce + 2);
  return [weightedRandom(r1), weightedRandom(r2), weightedRandom(r3)];
}

export function calculatePayout(symbols: [string, string, string], betAmount: number): SpinResult {
  const [a, b, c] = symbols;

  let multiplier = 0;

  if (a === b && b === c) {
    const sym = SYMBOLS.find(s => s.id === a);
    multiplier = sym ? sym.payout3 : 10;
  } else if (a === b || b === c || a === c) {
    multiplier = 2;
  }

  return {
    symbols,
    payout: Math.floor(betAmount * multiplier * (1 - HOUSE_EDGE)),
    multiplier,
  };
}
