import { generateResult } from "@/lib/fairness/rng";

export type Suit = "hearts" | "diamonds" | "clubs" | "spades";
export type Card = { suit: Suit; rank: number };
export type GameResult = "win" | "loss" | "push" | "blackjack" | "bust";

const SUITS: Suit[] = ["hearts", "diamonds", "clubs", "spades"];
const DECK_COUNT = 6;

export function createShoe(serverSeed: string, nonce: number): Card[] {
  const deck: Card[] = [];
  for (let d = 0; d < DECK_COUNT; d++) {
    for (const suit of SUITS) {
      for (let rank = 1; rank <= 13; rank++) {
        deck.push({ suit, rank });
      }
    }
  }
  for (let i = deck.length - 1; i > 0; i--) {
    const rand = generateResult(serverSeed, "shuffle", nonce + i);
    const j = Math.floor(rand * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

export function dealCard(deck: Card[]): Card {
  const card = deck.pop();
  if (!card) throw new Error("Empty shoe");
  return card;
}

export function handScore(hand: Card[]): number {
  let score = 0;
  let aces = 0;
  for (const card of hand) {
    if (card.rank === 1) {
      aces++;
      score += 11;
    } else if (card.rank >= 10) {
      score += 10;
    } else {
      score += card.rank;
    }
  }
  while (score > 21 && aces > 0) {
    score -= 10;
    aces--;
  }
  return score;
}

export function isSoft(hand: Card[]): boolean {
  let score = 0;
  let aces = 0;
  for (const card of hand) {
    if (card.rank === 1) { aces++; score += 11; }
    else if (card.rank >= 10) score += 10;
    else score += card.rank;
  }
  while (score > 21 && aces > 0) { score -= 10; aces--; }
  return aces > 0 && score <= 21;
}

export function isNaturalBlackjack(hand: Card[]): boolean {
  return hand.length === 2 && handScore(hand) === 21;
}

export function dealerPlay(dealerHand: Card[], deck: Card[]): Card[] {
  while (handScore(dealerHand) < 17) {
    dealerHand.push(dealCard(deck));
  }
  if (handScore(dealerHand) === 17 && isSoft(dealerHand)) {
    dealerHand.push(dealCard(deck));
  }
  return dealerHand;
}

export function checkResult(playerScore: number, dealerScore: number, playerHasNatural: boolean): GameResult {
  if (playerScore > 21) return "bust";
  if (dealerScore > 21) return "win";
  if (playerHasNatural && dealerScore !== 21) return "blackjack";
  if (playerScore > dealerScore) return "win";
  if (playerScore < dealerScore) return "loss";
  return "push";
}

export function rankLabel(rank: number): string {
  if (rank === 1) return "A";
  if (rank === 11) return "J";
  if (rank === 12) return "Q";
  if (rank === 13) return "K";
  return String(rank);
}

export function suitSymbol(suit: Suit): string {
  if (suit === "hearts") return "\u2665";
  if (suit === "diamonds") return "\u2666";
  if (suit === "clubs") return "\u2663";
  return "\u2660";
}

export function suitColor(suit: Suit): string {
  return suit === "hearts" || suit === "diamonds" ? "#FF5C5C" : "#F5F5F0";
}
