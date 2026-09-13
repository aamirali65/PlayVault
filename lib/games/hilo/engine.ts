import { generateResult, HOUSE_EDGE } from "@/lib/fairness/rng";

export interface Card {
  suit: "hearts" | "diamonds" | "clubs" | "spades";
  rank: number;
}

export interface HiLoGuessResult {
  correct: boolean;
  nextCard: Card;
  multiplier: number;
  probability: number;
}

const SUITS: Card["suit"][] = ["hearts", "diamonds", "clubs", "spades"];

const SUIT_SYMBOLS: Record<Card["suit"], string> = {
  hearts: "\u2665",
  diamonds: "\u2666",
  clubs: "\u2663",
  spades: "\u2660",
};

const RANK_NAMES: Record<number, string> = {
  1: "A", 11: "J", 12: "Q", 13: "K",
};

export function cardDisplay(card: Card): string {
  return `${RANK_NAMES[card.rank] || String(card.rank)}${SUIT_SYMBOLS[card.suit]}`;
}

export function isRed(card: Card): boolean {
  return card.suit === "hearts" || card.suit === "diamonds";
}

export function createFullDeck(): Card[] {
  const deck: Card[] = [];
  for (const suit of SUITS) {
    for (let rank = 1; rank <= 13; rank++) {
      deck.push({ suit, rank });
    }
  }
  return deck;
}

export function shuffleDeck(deck: Card[], serverSeed: string, nonce: number): Card[] {
  const arr = [...deck];
  for (let i = arr.length - 1; i > 0; i--) {
    const rand = generateResult(serverSeed, "shuffle", nonce + i);
    const j = Math.floor(rand * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export class HiLoEngine {
  deck: Card[] = [];
  currentCard: Card | null = null;
  streak = 0;
  compoundedMultiplier = 1;
  history: { card: Card; correct: boolean }[] = [];

  init(serverSeed: string, clientSeed: string, nonce: number) {
    this.deck = shuffleDeck(createFullDeck(), serverSeed, nonce);
    this.streak = 0;
    this.compoundedMultiplier = 1;
    this.history = [];
    this.drawNextCard();
  }

  drawNextCard(): Card {
    if (this.deck.length === 0) {
      this.deck = shuffleDeck(createFullDeck(), "reshuffle", Date.now());
    }
    this.currentCard = this.deck.pop()!;
    return this.currentCard;
  }

  getHigherChance(): number {
    if (!this.currentCard) return 0.5;
    return this.deck.filter(c => c.rank > this.currentCard!.rank).length / this.deck.length;
  }

  getLowerChance(): number {
    if (!this.currentCard) return 0.5;
    return this.deck.filter(c => c.rank < this.currentCard!.rank).length / this.deck.length;
  }

  guess(isHigher: boolean, serverSeed: string, clientSeed: string, nonce: number): HiLoGuessResult {
    const nextCard = this.drawNextCard();
    const currentVal = this.currentCard!.rank;
    const nextVal = nextCard.rank;

    let correct: boolean;
    if (isHigher) {
      correct = nextVal > currentVal;
    } else {
      correct = nextVal < currentVal;
    }

    if (correct) {
      this.streak++;
      const probability = isHigher ? this.getHigherChance() : this.getLowerChance();
      const stepMultiplier = (1 - HOUSE_EDGE) / Math.max(probability, 0.01);
      this.compoundedMultiplier *= stepMultiplier;
      this.compoundedMultiplier = Math.round(this.compoundedMultiplier * 100) / 100;
    } else {
      this.streak = 0;
      this.compoundedMultiplier = 1;
    }

    this.history.unshift({ card: nextCard, correct });
    if (this.history.length > 20) this.history.pop();

    const probability = isHigher
      ? this.deck.filter(c => c.rank > nextCard.rank).length / Math.max(this.deck.length, 1)
      : this.deck.filter(c => c.rank < nextCard.rank).length / Math.max(this.deck.length, 1);

    this.currentCard = nextCard;

    return {
      correct,
      nextCard,
      multiplier: this.compoundedMultiplier,
      probability,
    };
  }
}
