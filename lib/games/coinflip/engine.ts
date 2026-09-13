import { generateResult, HOUSE_EDGE } from "@/lib/fairness/rng";

export type CoinResult = "heads" | "tails";

export interface CoinflipHistory {
  choice: CoinResult;
  result: CoinResult;
  won: boolean;
  payout: number;
  nonce: number;
}

const PAYOUT_MULTIPLIER = 2 * (1 - HOUSE_EDGE);

export function flipCoin(serverSeed: string, clientSeed: string, nonce: number): CoinResult {
  const rand = generateResult(serverSeed, clientSeed, nonce);
  return rand < 0.5 ? "heads" : "tails";
}

export function calculatePayout(choice: CoinResult, result: CoinResult, betAmount: number): number {
  if (choice === result) {
    return Math.floor(betAmount * PAYOUT_MULTIPLIER);
  }
  return 0;
}

export function getPayoutMultiplier(): number {
  return PAYOUT_MULTIPLIER;
}
