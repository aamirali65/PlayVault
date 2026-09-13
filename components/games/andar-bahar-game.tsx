"use client";

import { useState, useCallback, useRef } from "react";
import { useUserStore } from "@/store/userStore";
import { formatCoins, cn, randomBetween } from "@/lib/utils";
import { generateServerSeed, generateId } from "@/lib/fairness/rng";
import {
  ABCard,
  DealResult,
  runDeal,
  getMultiplier,
  abSuitSymbol,
  abRankName,
} from "@/lib/games/andarbahar/engine";

const QUICK_BETS = [100, 500, 1000, 5000];

function ABCardDisplay({
  card,
  faceDown,
  small,
  highlight,
}: {
  card?: ABCard;
  faceDown?: boolean;
  small?: boolean;
  highlight?: boolean;
}) {
  if (faceDown) {
    return (
      <div
        className={cn(
          "flex items-center justify-center rounded-lg select-none",
          small ? "h-14 w-10 text-xs" : "h-20 w-14 text-sm"
        )}
        style={{
          background: "linear-gradient(135deg, #121420, #1A1D30)",
          border: "1px solid #1E2235",
        }}
      >
        <span className="font-bold opacity-20" style={{ color: "#474D66" }}>?</span>
      </div>
    );
  }
  if (!card) return null;

  const isRed = card.suit === "hearts" || card.suit === "diamonds";

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-lg select-none bg-white shadow-md",
        small ? "h-14 w-10 text-xs" : "h-20 w-14 text-sm",
        highlight && "shadow-[0_0_12px_rgba(0,245,160,0.3)] outline-2 outline-primary"
      )}
    >
      <span className={cn("text-lg leading-none", isRed ? "text-[#FF3366]" : "text-[#121420]")}>
        {abSuitSymbol(card.suit)}
      </span>
      <span
        className={cn(
          "font-bold font-[family-name:var(--font-mono)]",
          isRed ? "text-[#FF3366]" : "text-[#121420]",
          small ? "text-[10px]" : "text-xs"
        )}
      >
        {abRankName(card.rank)}
      </span>
    </div>
  );
}

type GamePhase = "idle" | "betting" | "dealing" | "result";

interface HistoryEntry {
  id: number;
  side: "andar" | "bahar";
  matchCard: ABCard;
  cardsDealt: number;
  multiplier: number;
  bet: number;
  payout: number;
  won: boolean;
}

export default function AndarBaharGame() {
  const { user, playGame: storePlayGame } = useUserStore();
  const [phase, setPhase] = useState<GamePhase>("idle");
  const [betSide, setBetSide] = useState<"andar" | "bahar" | null>(null);
  const [betAmount, setBetAmount] = useState(1000);
  const [matchCard, setMatchCard] = useState<ABCard | null>(null);
  const [andarCards, setAndarCards] = useState<ABCard[]>([]);
  const [baharCards, setBaharCards] = useState<ABCard[]>([]);
  const [result, setResult] = useState<DealResult | null>(null);
  const [currentMultiplier, setCurrentMultiplier] = useState(1);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [payout, setPayout] = useState(0);
  const [wins, setWins] = useState(0);
  const [losses, setLosses] = useState(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const historyIdRef = useRef(0);

  const balance = user?.balance ?? 0;

  const cleanup = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  }, []);

  const animateDeal = useCallback(
    (deal: DealResult) => {
      const aCards = deal.andarCards;
      const bCards = deal.baharCards;
      const totalCards = aCards.length + bCards.length;

      const allCards: ABCard[] = [];
      const maxLen = Math.max(aCards.length, bCards.length);
      for (let i = 0; i < maxLen; i++) {
        if (i < aCards.length) allCards.push(aCards[i]);
        if (i < bCards.length) allCards.push(bCards[i]);
      }

      let idx = 0;
      let currentAndar: ABCard[] = [];
      let currentBahar: ABCard[] = [];
      let isAndarTurn = true;

      const step = () => {
        if (idx >= allCards.length) {
          const finalMult = getMultiplier(totalCards, 51 - totalCards);
          setCurrentMultiplier(finalMult);
          setPhase("result");
          setResult(deal);
          setPayout(0);

          historyIdRef.current += 1;
          const entry: HistoryEntry = {
            id: historyIdRef.current,
            side: deal.side,
            matchCard: deal.matchCard,
            cardsDealt: totalCards,
            multiplier: finalMult,
            bet: betAmount,
            payout: 0,
            won: false,
          };

          if (betSide === deal.side) {
            const winAmount = Math.floor(betAmount * finalMult);
            entry.payout = winAmount;
            entry.won = true;
            setPayout(winAmount);
            setWins((w) => w + 1);
            storePlayGame("Andar Bahar", betAmount, winAmount, `${deal.side} won, ${totalCards} cards`);
          } else {
            setLosses((l) => l + 1);
            storePlayGame("Andar Bahar", betAmount, 0, `${deal.side} won, ${totalCards} cards`);
          }

          setHistory((h) => [entry, ...h].slice(0, 15));
          return;
        }

        const card = allCards[idx];
        if (isAndarTurn) {
          currentAndar = [...currentAndar, card];
          setAndarCards([...currentAndar]);
          isAndarTurn = false;
        } else {
          currentBahar = [...currentBahar, card];
          setBaharCards([...currentBahar]);
          isAndarTurn = true;
        }

        const dealtSoFar = currentAndar.length + currentBahar.length;
        setCurrentMultiplier(getMultiplier(dealtSoFar, 51 - dealtSoFar));
        idx++;
        timeoutRef.current = setTimeout(step, randomBetween(250, 500));
      };

      setMatchCard(deal.matchCard);
      step();
    },
    [betSide, betAmount, storePlayGame]
  );

  const handleDeal = useCallback(() => {
    if (!betSide) return;
    if (balance < betAmount) return;

    cleanup();
    setPhase("dealing");
    setAndarCards([]);
    setBaharCards([]);
    setResult(null);
    setPayout(0);
    setCurrentMultiplier(1);

    const serverSeed = generateServerSeed();
    const clientSeed = generateId();
    const nonce = Date.now();

    const deal = runDeal(serverSeed, clientSeed, nonce);
    animateDeal(deal);
  }, [betSide, betAmount, balance, cleanup, animateDeal]);

  const handleNewRound = useCallback(() => {
    cleanup();
    setPhase("idle");
    setBetSide(null);
    setMatchCard(null);
    setAndarCards([]);
    setBaharCards([]);
    setResult(null);
    setCurrentMultiplier(1);
  }, [cleanup]);

  return (
    <div className="flex h-full min-h-[600px] flex-col">
      <div className="flex items-center justify-between p-4">
        <h2 className="text-xl font-bold text-text-primary">Andar Bahar</h2>
        <div className="flex items-center gap-4">
          <div className="text-xs text-text-secondary">
            W:{" "}
            <span className="font-medium font-[family-name:var(--font-mono)] tabular-nums text-success">{wins}</span>{" "}
            / L:{" "}
            <span className="font-medium font-[family-name:var(--font-mono)] tabular-nums text-danger">{losses}</span>
          </div>
          <div className="text-sm text-text-secondary">
            Balance:{" "}
            <span className="font-[family-name:var(--font-mono)] font-semibold tabular-nums text-primary">
              {formatCoins(balance)}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center gap-6 px-4">
        <div className="flex items-center gap-6 md:gap-10">
          <div className="flex flex-col items-center gap-3">
            <div className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "#00D2FF" }}>
              Andar
            </div>
            <div
              className="relative min-h-[140px] min-w-[160px] rounded-xl p-3 flex flex-wrap gap-1.5 content-start justify-center transition-all duration-300"
              style={{
                background:
                  betSide === "andar" && phase !== "idle"
                    ? "rgba(0,210,255,0.08)"
                    : "#090A0F",
                border: `1px solid ${
                  betSide === "andar" && phase !== "idle"
                    ? "rgba(0,210,255,0.5)"
                    : "#1E2235"
                }`,
                boxShadow:
                  betSide === "andar" && phase !== "idle"
                    ? "0 0 20px rgba(0,210,255,0.1)"
                    : "none",
              }}
            >
              {andarCards.map((card, i) => (
                <ABCardDisplay key={i} card={card} small />
              ))}
              {andarCards.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center text-xs text-text-disabled">
                  Waiting...
                </div>
              )}
            </div>
            <div className="font-[family-name:var(--font-mono)] text-xs tabular-nums text-text-secondary">
              {andarCards.length} cards
            </div>
          </div>

          <div className="flex flex-col items-center gap-3">
            <div className="text-[10px] font-bold uppercase tracking-wider text-text-secondary">
              Joker
            </div>
            <div className="relative">
              {matchCard ? (
                <ABCardDisplay card={matchCard} highlight />
              ) : (
                <div
                  className="flex h-20 w-14 items-center justify-center rounded-lg"
                  style={{ background: "#121420", border: "1px solid #1E2235" }}
                >
                  <span className="text-lg text-text-disabled">?</span>
                </div>
              )}
            </div>
            {result && (
              <div className="text-center">
                <div className="text-[10px] text-text-secondary">Match</div>
                <div
                  className="text-sm font-bold"
                  style={{ color: result.side === "andar" ? "#00D2FF" : "#FFB800" }}
                >
                  {result.side.toUpperCase()}
                </div>
                <div className="font-[family-name:var(--font-mono)] text-xs tabular-nums text-text-secondary">
                  {result.cardsDealt} cards dealt
                </div>
              </div>
            )}
            {phase === "dealing" && (
              <div className="text-center">
                <div className="text-[10px] text-text-secondary">Multiplier</div>
                <div className="font-[family-name:var(--font-mono)] text-lg font-bold tabular-nums text-primary">
                  {currentMultiplier.toFixed(2)}x
                </div>
              </div>
            )}
            {phase === "result" && result && (
              <div className="text-center">
                <div className="text-[10px] text-text-secondary">Payout</div>
                <div className="font-[family-name:var(--font-mono)] text-lg font-bold tabular-nums text-primary">
                  {getMultiplier(result.cardsDealt, 51 - result.cardsDealt).toFixed(2)}x
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col items-center gap-3">
            <div className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "#FFB800" }}>
              Bahar
            </div>
            <div
              className="relative min-h-[140px] min-w-[160px] rounded-xl p-3 flex flex-wrap gap-1.5 content-start justify-center transition-all duration-300"
              style={{
                background:
                  betSide === "bahar" && phase !== "idle"
                    ? "rgba(255,184,0,0.08)"
                    : "#090A0F",
                border: `1px solid ${
                  betSide === "bahar" && phase !== "idle"
                    ? "rgba(255,184,0,0.5)"
                    : "#1E2235"
                }`,
                boxShadow:
                  betSide === "bahar" && phase !== "idle"
                    ? "0 0 20px rgba(255,184,0,0.1)"
                    : "none",
              }}
            >
              {baharCards.map((card, i) => (
                <ABCardDisplay key={i} card={card} small />
              ))}
              {baharCards.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center text-xs text-text-disabled">
                  Waiting...
                </div>
              )}
            </div>
            <div className="font-[family-name:var(--font-mono)] text-xs tabular-nums text-text-secondary">
              {baharCards.length} cards
            </div>
          </div>
        </div>

        {phase === "idle" && (
          <div className="w-full max-w-md rounded-xl bg-canvas-card p-5 border border-border-muted">
            <div className="space-y-4">
              <div className="text-center">
                <div className="mb-1 text-xs text-text-secondary">Select your side</div>
                <div className="flex justify-center gap-3">
                  <button
                    onClick={() => setBetSide("andar")}
                    className="rounded-xl border-2 px-6 py-3 text-sm font-bold transition-all"
                    style={{
                      background: betSide === "andar" ? "rgba(0,210,255,0.15)" : "#121420",
                      borderColor: betSide === "andar" ? "#00D2FF" : "#1E2235",
                      color: betSide === "andar" ? "#00D2FF" : "#8F95B2",
                      boxShadow: betSide === "andar" ? "0 0 20px rgba(0,210,255,0.15)" : "none",
                    }}
                  >
                    ANDAR
                  </button>
                  <button
                    onClick={() => setBetSide("bahar")}
                    className="rounded-xl border-2 px-6 py-3 text-sm font-bold transition-all"
                    style={{
                      background: betSide === "bahar" ? "rgba(255,184,0,0.15)" : "#121420",
                      borderColor: betSide === "bahar" ? "#FFB800" : "#1E2235",
                      color: betSide === "bahar" ? "#FFB800" : "#8F95B2",
                      boxShadow: betSide === "bahar" ? "0 0 20px rgba(255,184,0,0.15)" : "none",
                    }}
                  >
                    BAHAR
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-center gap-2">
                <span className="text-xs text-text-secondary">Bet:</span>
                <input
                  type="number"
                  value={betAmount}
                  onChange={(e) => setBetAmount(Math.max(100, Number(e.target.value)))}
                  className="input-field w-28 px-3 py-1.5 text-center font-[family-name:var(--font-mono)] text-sm tabular-nums text-text-primary"
                />
                <div className="flex gap-1">
                  {QUICK_BETS.map((q) => (
                    <button
                      key={q}
                      onClick={() => setBetAmount(q)}
                      className="rounded-lg px-2 py-1 text-[10px] font-medium transition-all"
                      style={{
                        background: betAmount === q ? "#00F5A0" : "#121420",
                        border: `1px solid ${betAmount === q ? "#00F5A0" : "#1E2235"}`,
                        color: betAmount === q ? "#090A0F" : "#8F95B2",
                      }}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleDeal}
                disabled={!betSide || balance < betAmount}
                className="btn-primary w-full py-3.5 text-sm font-bold tracking-wide disabled:opacity-40"
              >
                Deal
              </button>

              <div className="rounded-lg bg-canvas p-3">
                <div className="mb-2 text-[10px] uppercase tracking-wider text-text-secondary">Payout Table</div>
                <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                  <div className="flex justify-between text-text-secondary">
                    <span>1-5 cards</span>
                    <span className="font-medium text-success">4.0x</span>
                  </div>
                  <div className="flex justify-between text-text-secondary">
                    <span>6-10 cards</span>
                    <span className="font-medium text-success">3.0x</span>
                  </div>
                  <div className="flex justify-between text-text-secondary">
                    <span>11-15 cards</span>
                    <span className="font-medium text-success">2.5x</span>
                  </div>
                  <div className="flex justify-between text-text-secondary">
                    <span>16-25 cards</span>
                    <span className="font-medium text-success">2.0x</span>
                  </div>
                  <div className="flex justify-between text-text-secondary">
                    <span>26+ cards</span>
                    <span className="font-medium text-success">1.5x</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {phase === "result" && result && (
          <div className="flex flex-col items-center gap-3">
            <div
              className="text-2xl font-bold"
              style={{ color: betSide === result.side ? "#00F5A0" : "#FF3366" }}
            >
              {betSide === result.side
                ? `You won ${formatCoins(payout)}!`
                : "You lost!"}
            </div>
            {betSide === result.side && (
              <div className="font-[family-name:var(--font-mono)] text-xs tabular-nums text-text-secondary">
                {formatCoins(betAmount)} ×{" "}
                {getMultiplier(result.cardsDealt, 51 - result.cardsDealt).toFixed(2)}x ={" "}
                {formatCoins(payout)}
              </div>
            )}
            <button onClick={handleNewRound} className="btn-primary px-6 py-2 text-sm font-bold">
              Play Again
            </button>
          </div>
        )}

        {phase === "dealing" && (
          <div className="text-center">
            <div className="text-sm text-text-secondary animate-pulse">Dealing...</div>
            <div className="mt-1 text-xs text-text-secondary">
              Multiplier:{" "}
              <span className="font-medium font-[family-name:var(--font-mono)] tabular-nums text-primary">
                {currentMultiplier.toFixed(2)}x
              </span>
            </div>
          </div>
        )}
      </div>

      {history.length > 0 && (
        <div className="px-4 pb-4">
          <div className="mb-2 text-[10px] uppercase tracking-wider text-text-secondary">
            Recent History
          </div>
          <div className="flex flex-wrap gap-2">
            {history.map((h) => (
              <div
                key={h.id}
                className="rounded-full px-2.5 py-1 text-[10px] font-medium"
                style={{
                  background: h.won ? "rgba(0,245,160,0.1)" : "rgba(255,51,102,0.1)",
                  border: `1px solid ${h.won ? "rgba(0,245,160,0.3)" : "rgba(255,51,102,0.3)"}`,
                  color: h.won ? "#00F5A0" : "#FF3366",
                }}
              >
                <span className="mr-1">{h.side === "andar" ? "A" : "B"}</span>
                <span className="text-text-secondary">{h.cardsDealt} cards</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
