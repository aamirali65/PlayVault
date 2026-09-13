import { generateResult, HOUSE_EDGE } from "@/lib/fairness/rng";

export type CrashState = "betting" | "running" | "crashed";

export interface RoundResult {
  crashPoint: number;
  nonce: number;
  serverSeed: string;
  clientSeed: string;
}

export interface RoundHistory {
  crashPoint: number;
  timestamp: number;
}

export class CrashEngine {
  state: CrashState = "betting";
  currentMultiplier = 1;
  crashPoint = 1;
  elapsed = 0;
  roundHistory: RoundHistory[] = [];
  currentNonce = 0;
  currentServerSeed = "";
  currentClientSeed = "default";

  setSeeds(serverSeed: string, clientSeed: string, nonce: number) {
    this.currentServerSeed = serverSeed;
    this.currentClientSeed = clientSeed;
    this.currentNonce = nonce;
    const rand = generateResult(serverSeed, clientSeed, nonce);
    this.crashPoint = getCrashPoint(rand);
  }

  startRound() {
    this.state = "running";
    this.currentMultiplier = 1;
    this.elapsed = 0;
  }

  tick(deltaTime: number): number {
    if (this.state !== "running") return this.currentMultiplier;
    this.elapsed += deltaTime;
    this.currentMultiplier = Math.pow(1.0024, this.elapsed / 25);
    this.currentMultiplier = Math.round(this.currentMultiplier * 100) / 100;
    return this.currentMultiplier;
  }

  checkCrash(): boolean {
    if (this.state !== "running") return false;
    if (this.currentMultiplier >= this.crashPoint) {
      this.state = "crashed";
      this.roundHistory.unshift({
        crashPoint: this.crashPoint,
        timestamp: Date.now(),
      });
      if (this.roundHistory.length > 50) this.roundHistory.pop();
      return true;
    }
    return false;
  }

  cashOut(): number {
    const payout = this.currentMultiplier;
    this.roundHistory.unshift({
      crashPoint: payout,
      timestamp: Date.now(),
    });
    if (this.roundHistory.length > 50) this.roundHistory.pop();
    return payout;
  }
}

export function getCrashPoint(rand: number): number {
  if (rand === 0) return 1.00;
  const point = Math.floor((100 / (1 - rand)) * (1 - HOUSE_EDGE)) / 100;
  return Math.max(1.00, point);
}
