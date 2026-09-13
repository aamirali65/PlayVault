import { generateResult, HOUSE_EDGE } from "@/lib/fairness/rng";

export type RiskLevel = "low" | "medium" | "high";
export type RowCount = 8 | 12 | 16;

export interface PlinkoDropResult {
  binIndex: number;
  multiplier: number;
  path: number[];
}

export interface PlinkoHistory {
  multiplier: number;
  payout: number;
  timestamp: number;
}

const MULTIPLIER_TABLE: Record<RowCount, Record<RiskLevel, number[]>> = {
  8: {
    low:    [5.6, 2.1, 1.1, 0.5, 0.3, 0.5, 1.1, 2.1, 5.6],
    medium: [13, 3, 1.3, 0.7, 0.4, 0.7, 1.3, 3, 13],
    high:   [29, 4, 1.5, 0.3, 0.2, 0.3, 1.5, 4, 29],
  },
  12: {
    low:    [10, 3, 1.6, 1.4, 1.1, 0.6, 0.3, 0.6, 1.1, 1.4, 1.6, 3, 10],
    medium: [33, 11, 4, 2, 1.1, 0.6, 0.3, 0.6, 1.1, 2, 4, 11, 33],
    high:   [170, 24, 8.1, 2, 0.7, 0.2, 0.2, 0.2, 0.7, 2, 8.1, 24, 170],
  },
  16: {
    low:    [16, 9, 2, 1.4, 1.4, 1.2, 1.1, 0.5, 0.5, 1.1, 1.2, 1.4, 1.4, 2, 9, 16],
    medium: [110, 41, 10, 5, 3, 1.5, 1, 0.5, 0.5, 1, 1.5, 3, 5, 10, 41, 110],
    high:   [1000, 130, 26, 9, 4, 2, 0.2, 0.2, 0.2, 0.2, 2, 4, 9, 26, 130, 1000],
  },
};

export class PlinkoEngine {
  bins: number[];
  rows: RowCount;
  risk: RiskLevel;
  history: PlinkoHistory[] = [];

  constructor(rows: RowCount = 12, risk: RiskLevel = "medium") {
    this.rows = rows;
    this.risk = risk;
    this.bins = MULTIPLIER_TABLE[rows][risk];
  }

  dropBall(serverSeed: string, clientSeed: string, nonce: number): PlinkoDropResult {
    const path: number[] = [];
    let position = 0;

    for (let row = 0; row < this.rows; row++) {
      const rand = generateResult(serverSeed, clientSeed, nonce + row);
      const goRight = rand >= 0.5;
      position += goRight ? 1 : 0;
      path.push(goRight ? 1 : 0);
    }

    const binIndex = Math.min(position, this.bins.length - 1);
    const multiplier = this.bins[binIndex];

    return { binIndex, multiplier, path };
  }

  calculatePayout(bet: number, multiplier: number): number {
    return Math.floor(bet * multiplier * (1 - HOUSE_EDGE));
  }

  addHistory(multiplier: number, payout: number) {
    this.history.unshift({ multiplier, payout, timestamp: Date.now() });
    if (this.history.length > 50) this.history.pop();
  }

  setConfig(rows: RowCount, risk: RiskLevel) {
    this.rows = rows;
    this.risk = risk;
    this.bins = MULTIPLIER_TABLE[rows][risk];
  }
}
