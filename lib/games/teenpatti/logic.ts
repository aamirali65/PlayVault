import { generateResult } from "@/lib/fairness/rng";

export type Suit = "hearts" | "diamonds" | "clubs" | "spades";
export interface Card { suit: Suit; rank: number; }

export enum HandType {
  HIGH_CARD = 0,
  PAIR = 1,
  COLOR = 2,
  SEQUENCE = 3,
  PURE_SEQUENCE = 4,
  TRAIL = 5,
}

const SUITS: Suit[] = ["hearts", "diamonds", "clubs", "spades"];
const SUIT_SYMBOLS: Record<Suit, string> = {
  hearts: "\u2665", diamonds: "\u2666", clubs: "\u2663", spades: "\u2660",
};

export function suitSymbol(suit: Suit): string { return SUIT_SYMBOLS[suit]; }
export function rankName(rank: number): string {
  if (rank <= 10) return String(rank);
  if (rank === 11) return "J";
  if (rank === 12) return "Q";
  if (rank === 13) return "K";
  return "A";
}

export function createDeck(): Card[] {
  const deck: Card[] = [];
  for (const suit of SUITS) {
    for (let rank = 2; rank <= 14; rank++) {
      deck.push({ suit, rank });
    }
  }
  return deck;
}

export function shuffleDeck(deck: Card[], serverSeed: string, nonce: number): Card[] {
  const arr = [...deck];
  for (let i = arr.length - 1; i > 0; i--) {
    const rand = generateResult(serverSeed, "teenpatti", nonce + i);
    const j = Math.floor(rand * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function dealCards(numPlayers: number, serverSeed: string, nonce: number): Card[][] {
  const deck = shuffleDeck(createDeck(), serverSeed, nonce);
  const hands: Card[][] = [];
  for (let i = 0; i < numPlayers; i++) {
    hands.push([deck[i * 3], deck[i * 3 + 1], deck[i * 3 + 2]]);
  }
  return hands;
}

function isConsecutive(cards: Card[]): boolean {
  const sorted = [...cards].sort((a, b) => a.rank - b.rank);
  if (sorted[2].rank - sorted[1].rank === 1 && sorted[1].rank - sorted[0].rank === 1) return true;
  if (sorted[0].rank === 2 && sorted[1].rank === 3 && sorted[2].rank === 14) return true;
  return false;
}

function isSameSuit(cards: Card[]): boolean {
  return cards.every(c => c.suit === cards[0].suit);
}

function countRanks(cards: Card[]): Map<number, number> {
  const map = new Map<number, number>();
  for (const c of cards) map.set(c.rank, (map.get(c.rank) || 0) + 1);
  return map;
}

export function evaluateHand(cards: Card[]): { type: HandType; rank: number; cards: Card[] } {
  const sorted = [...cards].sort((a, b) => b.rank - a.rank);
  const rankCounts = countRanks(cards);
  const counts = Array.from(rankCounts.values()).sort((a, b) => b - a);

  const isTrail = counts[0] === 3;
  const isPureSequence = isConsecutive(cards) && isSameSuit(cards);
  const isSequence = isConsecutive(cards);
  const isColor = isSameSuit(cards);
  const isPair = counts[0] === 2;

  if (isTrail) return { type: HandType.TRAIL, rank: sorted[0].rank, cards: sorted };
  if (isPureSequence) return { type: HandType.PURE_SEQUENCE, rank: sorted[0].rank, cards: sorted };
  if (isSequence) return { type: HandType.SEQUENCE, rank: sorted[0].rank, cards: sorted };
  if (isColor) {
    const rv = sorted[0].rank * 100 + sorted[1].rank * 10 + sorted[2].rank;
    return { type: HandType.COLOR, rank: rv, cards: sorted };
  }
  if (isPair) {
    const pairRank = Array.from(rankCounts.entries()).find(([, c]) => c === 2)![0];
    const kicker = sorted.find(c => c.rank !== pairRank)!.rank;
    return { type: HandType.PAIR, rank: pairRank * 100 + kicker, cards: sorted };
  }
  return { type: HandType.HIGH_CARD, rank: sorted[0].rank * 100 + sorted[1].rank * 10 + sorted[2].rank, cards: sorted };
}

export function compareHands(
  hand1: ReturnType<typeof evaluateHand>,
  hand2: ReturnType<typeof evaluateHand>
): number {
  if (hand1.type !== hand2.type) return hand1.type - hand2.type;
  return hand1.rank - hand2.rank;
}

export function botDecision(hand: Card[], pot: number, stake: number, serverSeed: string, nonce: number): "chaal" | "pack" | "show" {
  const evaluated = evaluateHand(hand);
  const rand = generateResult(serverSeed, "bot", nonce);
  if (evaluated.type >= HandType.SEQUENCE) return "chaal";
  if (evaluated.type === HandType.PAIR && rand > 0.3) return "chaal";
  if (evaluated.type === HandType.HIGH_CARD && rand > 0.7) return "chaal";
  if (pot > stake * 10 && evaluated.type >= HandType.PAIR) return "show";
  if (rand > 0.6) return "chaal";
  return "pack";
}
