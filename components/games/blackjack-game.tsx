"use client";

import { useState, useCallback, useRef } from "react";
import { useUserStore } from "@/store/userStore";
import { formatCoins } from "@/lib/utils";
import { generateServerSeed, generateId } from "@/lib/fairness/rng";
import {
  createShoe,
  dealCard,
  handScore,
  dealerPlay,
  checkResult,
  isNaturalBlackjack,
  rankLabel,
  suitSymbol,
  suitColor,
  type Card as BJCard,
  type GameResult,
} from "@/lib/games/blackjack/engine";

const BET_OPTIONS = [100, 250, 500, 1000];

interface HandEntry {
  player: BJCard[];
  dealer: BJCard[];
  result: GameResult;
  bet: number;
  payout: number;
}

function CardFace({ card, revealed = true, small = false }: { card: BJCard; revealed?: boolean; small?: boolean }) {
  const isRed = card.suit === "hearts" || card.suit === "diamonds";
  return (
    <div
      className={`relative ${small ? "h-16 w-11" : "h-24 w-16"} perspective-[600px]`}
    >
      <div
        className="preserve-3d h-full w-full transition-transform duration-500"
        style={{ transform: revealed ? "rotateY(0deg)" : "rotateY(180deg)" }}
      >
        <div
          className="backface-hidden absolute inset-0 flex flex-col items-center justify-center rounded-lg border-2"
          style={{
            backgroundColor: "#121420",
            borderColor: revealed ? "#1E2235" : "#1A1D30",
            color: suitColor(card.suit),
          }}
        >
          {revealed ? (
            <>
              <span className={`${small ? "text-sm" : "text-lg"} leading-none`}>
                {suitSymbol(card.suit)}
              </span>
              <span
                className={`mt-0.5 font-bold font-[family-name:var(--font-mono)] ${small ? "text-[9px]" : "text-xs"}`}
              >
                {rankLabel(card.rank)}
              </span>
            </>
          ) : (
            <span className={small ? "text-base" : "text-xl"}>?</span>
          )}
        </div>
        <div
          className="backface-hidden rotate-y-180 absolute inset-0 flex flex-col items-center justify-center rounded-lg border-2"
          style={{ backgroundColor: "#121420", borderColor: "#1A1D30" }}
        >
          <span className={small ? "text-base" : "text-xl"} style={{ color: "#474D66" }}>?</span>
        </div>
      </div>
    </div>
  );
}

export default function BlackjackGame() {
  const { user, playGame } = useUserStore();
  const [deck, setDeck] = useState<BJCard[]>([]);
  const [playerHand, setPlayerHand] = useState<BJCard[]>([]);
  const [dealerHand, setDealerHand] = useState<BJCard[]>([]);
  const [dealerRevealed, setDealerRevealed] = useState(false);
  const [gameState, setGameState] = useState<"betting" | "playing" | "standing" | "result">("betting");
  const [result, setResult] = useState<GameResult | null>(null);
  const [bet, setBet] = useState(100);
  const [history, setHistory] = useState<HandEntry[]>([]);
  const [dealKey, setDealKey] = useState(0);
  const lastNonce = useRef(0);

  const balance = user?.balance ?? 0;

  const startRound = useCallback(() => {
    if (balance < bet) return;
    const serverSeed = generateServerSeed();
    const nonce = Date.now();
    lastNonce.current = nonce;
    const newDeck = createShoe(serverSeed, nonce);
    const pHand = [dealCard(newDeck), dealCard(newDeck)];
    const dHand = [dealCard(newDeck), dealCard(newDeck)];
    setDeck(newDeck);
    setPlayerHand(pHand);
    setDealerHand(dHand);
    setDealerRevealed(false);
    setGameState("playing");
    setResult(null);
    setDealKey((k) => k + 1);
  }, [balance, bet]);

  const finalize = useCallback(
    (pHand: BJCard[], dHand: BJCard[], currentDeck: BJCard[]) => {
      const finalDealer = dealerPlay([...dHand], [...currentDeck]);
      setDealerHand(finalDealer);
      setDealerRevealed(true);
      const pScore = handScore(pHand);
      const dScore = handScore(finalDealer);
      const hasNatural = isNaturalBlackjack(pHand);
      const res = checkResult(pScore, dScore, hasNatural);
      const payout =
        res === "blackjack" ? bet * 3 : res === "win" ? bet * 2 : 0;
      playGame("Blackjack", bet, payout, `${res} (P:${pScore} D:${dScore})`);
      setResult(res);
      setGameState("result");
      setHistory((prev) =>
        [{ player: pHand, dealer: finalDealer, result: res, bet, payout }, ...prev].slice(0, 20)
      );
    },
    [bet, playGame]
  );

  const hit = useCallback(() => {
    setDeck((prev) => {
      const newDeck = [...prev];
      const card = dealCard(newDeck);
      setPlayerHand((h) => {
        const newHand = [...h, card];
        if (handScore(newHand) > 21) {
          setTimeout(() => finalize(newHand, dealerHand, newDeck), 300);
        }
        return newHand;
      });
      return newDeck;
    });
  }, [dealerHand, finalize]);

  const stand = useCallback(() => {
    setDealerRevealed(true);
    setGameState("standing");
    finalize(playerHand, dealerHand, deck);
  }, [playerHand, dealerHand, deck, finalize]);

  const playerScore = handScore(playerHand);
  const dealerScore = dealerRevealed ? handScore(dealerHand) : handScore([dealerHand[0]]);

  const resultColor = (r: GameResult) => {
    if (r === "win" || r === "blackjack") return "#00F5A0";
    if (r === "push") return "#8F95B2";
    return "#FF3366";
  };

  return (
    <div className="flex h-full min-h-[600px] flex-col lg:flex-row">
      <div className="flex w-full flex-col gap-3 p-4 lg:w-[340px] lg:shrink-0 lg:overflow-y-auto lg:border-r lg:border-border-muted">
        {gameState === "betting" && (
          <>
            <div className="rounded-xl bg-canvas-elevated p-4">
              <p className="mb-2 text-xs font-medium uppercase tracking-wider text-text-secondary">
                Bet Amount
              </p>
              <input
                type="number"
                value={bet}
                onChange={(e) => setBet(Math.max(1, Number(e.target.value)))}
                min={1}
                className="input-field w-full px-3 py-2.5 text-center font-[family-name:var(--font-mono)] text-lg tabular-nums text-text-primary"
              />
              <div className="mt-2.5 grid grid-cols-4 gap-1.5">
                {BET_OPTIONS.map((amt) => (
                  <button
                    key={amt}
                    onClick={() => setBet(amt)}
                    className="rounded-lg border border-border-muted bg-canvas-card px-2 py-1.5 text-[11px] font-semibold tabular-nums text-text-secondary transition-colors hover:border-primary hover:text-primary"
                  >
                    {amt.toLocaleString()}
                  </button>
                ))}
              </div>
            </div>
            <button
              onClick={startRound}
              disabled={balance < bet}
              className="btn-primary w-full py-3.5 text-sm font-bold tracking-wide disabled:opacity-40"
            >
              Deal — {formatCoins(bet)}
            </button>
          </>
        )}

        {gameState === "playing" && (
          <>
            <div className="rounded-xl bg-canvas-elevated p-4">
              <p className="mb-1 text-xs font-medium uppercase tracking-wider text-text-secondary">
                Your Score
              </p>
              <p className="font-[family-name:var(--font-mono)] text-3xl font-bold tabular-nums text-text-primary">
                {playerScore}
              </p>
            </div>
            <div className="flex gap-2">
              <button onClick={hit} className="btn-primary flex-1 py-3 text-sm font-bold">
                Hit
              </button>
              <button onClick={stand} className="btn-secondary flex-1 py-3 text-sm font-bold">
                Stand
              </button>
            </div>
          </>
        )}

        {gameState === "result" && result && (
          <>
            <div className="rounded-xl bg-canvas-elevated p-4 text-center">
              <p
                className="text-2xl font-bold"
                style={{ color: resultColor(result) }}
              >
                {result === "blackjack" && "BLACKJACK!"}
                {result === "win" && "YOU WIN!"}
                {result === "push" && "PUSH"}
                {result === "loss" && "DEALER WINS"}
                {result === "bust" && "BUST!"}
              </p>
            </div>
            <button
              onClick={() => {
                setGameState("betting");
                setPlayerHand([]);
                setDealerHand([]);
                setResult(null);
              }}
              className="btn-primary w-full py-3.5 text-sm font-bold tracking-wide"
            >
              New Round
            </button>
          </>
        )}

        {user && (
          <div className="text-center text-xs text-text-secondary">
            Balance:{" "}
            <span className="font-[family-name:var(--font-mono)] font-semibold tabular-nums text-primary">
              {formatCoins(balance)}
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col items-center justify-center gap-6 p-6">
        <div className="w-full max-w-xl rounded-xl bg-canvas-elevated p-6">
          <div className="mb-2 text-xs font-medium uppercase tracking-wider text-text-secondary">
            Dealer{" "}
            {dealerRevealed && (
              <span className="font-[family-name:var(--font-mono)] tabular-nums text-text-primary">
                {dealerScore}
              </span>
            )}
            {!dealerRevealed && dealerHand.length > 0 && (
              <span className="font-[family-name:var(--font-mono)] tabular-nums text-text-primary">
                {handScore([dealerHand[0]])} + ?
              </span>
            )}
          </div>
          <div className="flex gap-2 flex-wrap">
            {dealerHand.map((card, i) => (
              <CardFace
                key={`d-${dealKey}-${i}`}
                card={card}
                revealed={dealerRevealed || i === 0}
              />
            ))}
          </div>
        </div>

        <div className="w-full max-w-xl rounded-xl bg-canvas-elevated p-6">
          <div className="mb-2 text-xs font-medium uppercase tracking-wider text-text-secondary">
            Player{" "}
            <span className="font-[family-name:var(--font-mono)] tabular-nums text-text-primary">
              {playerScore}
            </span>
          </div>
          <div className="flex gap-2 flex-wrap">
            {playerHand.map((card, i) => (
              <CardFace
                key={`p-${dealKey}-${i}`}
                card={card}
                revealed={true}
              />
            ))}
          </div>
        </div>

        {history.length > 0 && (
          <div className="w-full max-w-xl">
            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-text-secondary">
              Recent Hands
            </p>
            <div className="flex flex-wrap gap-1.5">
              {history.slice(0, 15).map((h, i) => (
                <div
                  key={i}
                  className="flex items-center gap-1.5 rounded-lg border border-border-muted bg-canvas-card px-2 py-1 text-[10px]"
                >
                  <span className="font-bold" style={{ color: resultColor(h.result) }}>
                    {h.result.toUpperCase()}
                  </span>
                  <span className="tabular-nums text-text-secondary">
                    {formatCoins(h.bet)}
                  </span>
                  <span
                    className="font-[family-name:var(--font-mono)] font-semibold tabular-nums"
                    style={{ color: h.payout > 0 ? "#00F5A0" : "#FF3366" }}
                  >
                    {h.payout > 0 ? `+${formatCoins(h.payout)}` : `-${formatCoins(h.bet)}`}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
