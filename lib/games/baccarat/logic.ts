import { generateResult } from "@/lib/fairness/rng";

export type Suit = "hearts" | "diamonds" | "clubs" | "spades";
export interface Card { suit: Suit; rank: number; }
export interface RoundResult {
  playerHand: Card[];
  bankerHand: Card[];
  playerScore: number;
  bankerScore: number;
  winner: "player" | "banker" | "tie";
}

const SUITS: Suit[] = ["hearts", "diamonds", "clubs", "spades"];
const DECK_COUNT = 8;

export function cardValue(card: Card): number {
  if (card.rank >= 10) return 0;
  return card.rank;
}

export function handScore(hand: Card[]): number {
  return hand.reduce((sum, card) => sum + cardValue(card), 0) % 10;
}

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
    const rand = generateResult(serverSeed, "baccarat-shuffle", nonce + i);
    const j = Math.floor(rand * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

export function dealCard(deck: Card[]): Card {
  return deck.pop()!;
}

export function bankerShouldDraw(bankerHand: Card[], playerThirdCard?: Card): boolean {
  const bankerScore = handScore(bankerHand);
  if (bankerScore >= 8) return false;
  if (bankerScore <= 5) return true;
  if (bankerScore === 6) {
    if (!playerThirdCard) return false;
    const pVal = cardValue(playerThirdCard);
    return pVal === 6 || pVal === 7;
  }
  return false;
}

export function playRound(deck: Card[]): RoundResult {
  const playerHand = [dealCard(deck), dealCard(deck)];
  const bankerHand = [dealCard(deck), dealCard(deck)];

  const playerNatural = handScore(playerHand) >= 8;
  const bankerNatural = handScore(bankerHand) >= 8;

  if (playerNatural || bankerNatural) {
    const ps = handScore(playerHand);
    const bs = handScore(bankerHand);
    return {
      playerHand,
      bankerHand,
      playerScore: ps,
      bankerScore: bs,
      winner: ps > bs ? "player" : bs > ps ? "banker" : "tie",
    };
  }

  let playerThirdCard: Card | undefined;
  if (handScore(playerHand) <= 5) {
    playerThirdCard = dealCard(deck);
    playerHand.push(playerThirdCard);
  }

  if (bankerShouldDraw(bankerHand, playerThirdCard)) {
    bankerHand.push(dealCard(deck));
  }

  const finalPlayerScore = handScore(playerHand);
  const finalBankerScore = handScore(bankerHand);

  return {
    playerHand,
    bankerHand,
    playerScore: finalPlayerScore,
    bankerScore: finalBankerScore,
    winner:
      finalPlayerScore > finalBankerScore ? "player" :
      finalBankerScore > finalPlayerScore ? "banker" : "tie",
  };
}
