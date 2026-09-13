import { generateResult, HOUSE_EDGE } from "@/lib/fairness/rng";

export interface LimboRound {
  target: number;
  result: number;
  won: boolean;
  payout: number;
  timestamp: number;
  nonce: number;
}

export class LimboEngine {
  history: LimboRound[] = [];

  play(targetMultiplier: number, bet: number, serverSeed: string, clientSeed: string, nonce: number): { result: number; won: boolean; payout: number } {
    const rand = generateResult(serverSeed, clientSeed, nonce);
    const result = getLimboResult(rand);
    const won = checkWin(targetMultiplier, result);
    const payout = won ? Math.floor(bet * payoutMultiplier(targetMultiplier)) : 0;

    this.history.unshift({
      target: targetMultiplier,
      result,
      won,
      payout,
      timestamp: Date.now(),
      nonce,
    });
    if (this.history.length > 50) this.history.pop();

    return { result, won, payout };
  }

  calculateWinChance(target: number): number {
    return ((1 - HOUSE_EDGE) / target) * 100;
  }

  calculatePayoutPreview(target: number, bet: number): number {
    return Math.floor(bet * payoutMultiplier(target));
  }
}

function getLimboResult(rand: number): number {
  if (rand === 0) return 1.00;
  const point = Math.floor((100 / (1 - rand)) * (1 - HOUSE_EDGE)) / 100;
  return Math.max(1.00, point);
}

function checkWin(target: number, result: number): boolean {
  return result >= target;
}

function payoutMultiplier(target: number): number {
  return target;
}
