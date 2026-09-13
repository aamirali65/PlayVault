import { generateResult, HOUSE_EDGE } from "@/lib/fairness/rng";

export interface DiceResult {
  result: number;
  target: number;
  mode: "over" | "under";
  won: boolean;
  payoutMultiplier: number;
  nonce: number;
}

export class DiceEngine {
  history: DiceResult[] = [];

  roll(target: number, mode: "over" | "under", bet: number, serverSeed: string, clientSeed: string, nonce: number): DiceResult {
    const rand = generateResult(serverSeed, clientSeed, nonce);
    const result = rollResult(rand);
    const won = isWin(result, target, mode);
    const payoutMul = payoutMultiplier(target, mode);

    const diceResult: DiceResult = {
      result,
      target,
      mode,
      won,
      payoutMultiplier: won ? payoutMul : 0,
      nonce,
    };

    this.history.unshift(diceResult);
    if (this.history.length > 50) this.history.pop();
    return diceResult;
  }

  calculateWinChance(target: number, mode: "over" | "under"): number {
    return winChance(target, mode);
  }

  calculatePayoutMultiplier(target: number, mode: "over" | "under"): number {
    return payoutMultiplier(target, mode);
  }
}

function rollResult(rand: number): number {
  return Math.floor(rand * 10000) / 100;
}

function isWin(roll: number, target: number, mode: "over" | "under"): boolean {
  return mode === "over" ? roll > target : roll < target;
}

function winChance(target: number, mode: "over" | "under"): number {
  return mode === "over" ? (99.99 - target) : target;
}

function payoutMultiplier(target: number, mode: "over" | "under"): number {
  const chance = winChance(target, mode);
  if (chance <= 0) return 1;
  return Math.round(((1 - HOUSE_EDGE) / (chance / 100)) * 100) / 100;
}
