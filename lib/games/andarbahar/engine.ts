import { generateResult } from "@/lib/fairness/rng";

export type ABSuit = "hearts" | "diamonds" | "clubs" | "spades";
export interface ABCard { suit: ABSuit; rank: number; }

const SUITS: ABSuit[] = ["hearts", "diamonds", "clubs", "spades"];
const SUIT_SYMBOLS: Record<ABSuit, string> = {
  hearts: "\u2665", diamonds: "\u2666", clubs: "\u2663", spades: "\u2660",
};

export function abSuitSymbol(suit: ABSuit): string { return SUIT_SYMBOLS[suit]; }
export function abRankName(rank: number): string {
  if (rank === 1) return "A";
  if (rank === 11) return "J";
  if (rank === 12) return "Q";
  if (rank === 13) return "K";
  return String(rank);
}

function createDeck(): ABCard[] {
  const deck: ABCard[] = [];
  for (const suit of SUITS) {
    for (let rank = 1; rank <= 13; rank++) {
      deck.push({ suit, rank });
    }
  }
  return deck;
}

function shuffleDeck(deck: ABCard[], serverSeed: string, nonce: number): ABCard[] {
  const arr = [...deck];
  for (let i = arr.length - 1; i > 0; i--) {
    const rand = generateResult(serverSeed, "andarbahar", nonce + i);
    const j = Math.floor(rand * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export interface DealResult {
  side: "andar" | "bahar";
  cardsDealt: number;
  matchCard: ABCard;
  andarCards: ABCard[];
  baharCards: ABCard[];
}

export function getMultiplier(cardsDealt: number, cardsRemaining: number): number {
  if (cardsRemaining <= 0) return 1;
  const matchingCardsLeft = 3;
  const prob = matchingCardsLeft / cardsRemaining;
  return Math.round((1 / prob) * 0.99 * 100) / 100;
}

export function runDeal(serverSeed: string, clientSeed: string, nonce: number): DealResult {
  const deck = shuffleDeck(createDeck(), serverSeed, nonce);
  const jokerIdx = Math.floor(generateResult(serverSeed, clientSeed, nonce) * deck.length);
  const matchCard = deck.splice(jokerIdx, 1)[0];

  const andarCards: ABCard[] = [];
  const baharCards: ABCard[] = [];
  let side: "andar" | "bahar" = "andar";
  let cardsRemaining = deck.length;

  for (const card of deck) {
    cardsRemaining--;
    if (card.rank === matchCard.rank) {
      if (side === "andar") andarCards.push(card);
      else baharCards.push(card);
      return { side, cardsDealt: andarCards.length + baharCards.length, matchCard, andarCards, baharCards };
    }
    if (side === "andar") andarCards.push(card);
    else baharCards.push(card);
    side = side === "andar" ? "bahar" : "andar";
  }

  return { side: "andar", cardsDealt: andarCards.length + baharCards.length, matchCard, andarCards, baharCards };
}
