import { generateResult, HOUSE_EDGE } from "@/lib/fairness/rng";

export type AviatorState = "waiting" | "flying" | "flownAway";

export interface BetSlot {
  id: number;
  amount: number;
  cashedOut: boolean;
  cashOutMultiplier: number;
  autoCashOut: number | null;
}

export interface RoundHistoryEntry {
  multiplier: number;
  timestamp: number;
}

export class AviatorEngine {
  state: AviatorState = "waiting";
  crashPoint = 1;
  currentMultiplier = 1;
  elapsed = 0;
  bet1: BetSlot = { id: 1, amount: 0, cashedOut: false, cashOutMultiplier: 0, autoCashOut: null };
  bet2: BetSlot = { id: 2, amount: 0, cashedOut: false, cashOutMultiplier: 0, autoCashOut: null };
  roundHistory: RoundHistoryEntry[] = [];

  setCrashPoint(serverSeed: string, clientSeed: string, nonce: number) {
    const rand = generateResult(serverSeed, clientSeed, nonce);
    this.crashPoint = getCrashPoint(rand);
  }

  startRound() {
    this.state = "flying";
    this.currentMultiplier = 1;
    this.elapsed = 0;
    this.bet1 = { id: 1, amount: 0, cashedOut: false, cashOutMultiplier: 0, autoCashOut: null };
    this.bet2 = { id: 2, amount: 0, cashedOut: false, cashOutMultiplier: 0, autoCashOut: null };
  }

  tick(deltaTime: number): number {
    if (this.state !== "flying") return this.currentMultiplier;
    this.elapsed += deltaTime;
    this.currentMultiplier = Math.pow(1.0024, this.elapsed / 25);
    this.currentMultiplier = Math.round(this.currentMultiplier * 100) / 100;
    return this.currentMultiplier;
  }

  checkCrash(): boolean {
    if (this.state !== "flying") return false;
    if (this.currentMultiplier >= this.crashPoint) {
      this.state = "flownAway";
      this.roundHistory.unshift({ multiplier: this.crashPoint, timestamp: Date.now() });
      if (this.roundHistory.length > 50) this.roundHistory.pop();
      return true;
    }
    return false;
  }

  cashOut(betSlot: BetSlot): number {
    if (betSlot.cashedOut) return 0;
    betSlot.cashedOut = true;
    betSlot.cashOutMultiplier = this.currentMultiplier;
    return betSlot.amount * this.currentMultiplier;
  }

  checkAutoCashOut(betSlot: BetSlot): boolean {
    if (betSlot.cashedOut || betSlot.autoCashOut === null) return false;
    return this.currentMultiplier >= betSlot.autoCashOut;
  }
}

function getCrashPoint(rand: number): number {
  if (rand === 0) return 1.00;
  const point = Math.floor((100 / (1 - rand)) * (1 - HOUSE_EDGE)) / 100;
  return Math.max(1.00, point);
}
