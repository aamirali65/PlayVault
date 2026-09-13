import { generateResult, HOUSE_EDGE } from "@/lib/fairness/rng";

const TOTAL_TILES = 25;

export interface MinesRevealResult {
  isMine: boolean;
  multiplierSoFar: number;
}

export class MinesEngine {
  mines: boolean[] = [];
  revealedTiles: boolean[] = [];
  mineCount = 5;
  revealedCount = 0;

  init(mineCount: number, serverSeed: string, clientSeed: string, nonce: number) {
    this.mineCount = Math.max(1, Math.min(24, mineCount));
    this.mines = new Array(TOTAL_TILES).fill(false);
    this.revealedTiles = new Array(TOTAL_TILES).fill(false);
    this.revealedCount = 0;

    const indices = Array.from({ length: TOTAL_TILES }, (_, i) => i);
    for (let i = indices.length - 1; i > 0; i--) {
      const rand = generateResult(serverSeed, clientSeed, nonce + i);
      const j = Math.floor(rand * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }

    for (let i = 0; i < this.mineCount; i++) {
      this.mines[indices[i]] = true;
    }
  }

  calculateMultiplier(safeRevealed: number): number {
    if (safeRevealed === 0) return 1;
    const totalSafe = TOTAL_TILES - this.mineCount;
    let mult = 1;
    for (let i = 0; i < safeRevealed; i++) {
      mult *= (TOTAL_TILES - i) / (totalSafe - i);
    }
    return Math.round(mult * (1 - HOUSE_EDGE) * 100) / 100;
  }

  revealTile(index: number): MinesRevealResult {
    if (index < 0 || index >= TOTAL_TILES || this.revealedTiles[index]) {
      return { isMine: false, multiplierSoFar: 1 };
    }

    this.revealedTiles[index] = true;

    if (this.mines[index]) {
      return { isMine: true, multiplierSoFar: 0 };
    }

    this.revealedCount++;
    const multiplierSoFar = this.calculateMultiplier(this.revealedCount);
    return { isMine: false, multiplierSoFar };
  }

  cashOut(): number {
    return this.calculateMultiplier(this.revealedCount);
  }

  revealAll(): boolean[] {
    return [...this.mines];
  }

  get safeTilesLeft(): number {
    return TOTAL_TILES - this.mineCount - this.revealedCount;
  }
}
