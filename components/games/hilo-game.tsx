"use client";

import { useState, useCallback } from "react";
import { useUserStore } from "@/store/userStore";
import { formatCoins, cn } from "@/lib/utils";
import { HiLoEngine, type Card as TCard, isRed } from "@/lib/games/hilo/engine";
import { generateServerSeed, generateId } from "@/lib/fairness/rng";

const QUICK_BETS = [50, 100, 250, 500, 1000];

function CardDisplay({ card, hidden = false }: { card?: TCard | null; hidden?: boolean }) {
  if (!card || hidden) {
    return (
      <div className="w-32 h-44 rounded-xl border-2 border-dashed border-border bg-canvas-elevated flex items-center justify-center">
        <span className="text-text-disabled text-3xl">?</span>
      </div>
    );
  }

  const red = isRed(card);
  const rankNames: Record<number, string> = { 1: "A", 11: "J", 12: "Q", 13: "K" };
  const rank = rankNames[card.rank] || String(card.rank);

  const suitSymbols: Record<string, string> = {
    hearts: "♥",
    diamonds: "♦",
    clubs: "♣",
    spades: "♠",
  };

  return (
    <div
      className={cn(
        "w-32 h-44 rounded-xl border-2 flex flex-col items-center justify-center select-none shadow-lg",
        red
          ? "bg-white border-danger text-danger"
          : "bg-white border-canvas text-canvas"
      )}
    >
      <span className="text-3xl font-bold">{rank}</span>
      <span className="text-4xl">{suitSymbols[card.suit]}</span>
    </div>
  );
}

export default function HiLoGame() {
  const user = useUserStore((s) => s.user);
  const playGame = useUserStore((s) => s.playGame);

  const [engine] = useState(() => new HiLoEngine());
  const [gameActive, setGameActive] = useState(false);
  const [betAmount, setBetAmount] = useState(100);
  const [currentCard, setCurrentCard] = useState<TCard | null>(null);
  const [nextCard, setNextCard] = useState<TCard | null>(null);
  const [streak, setStreak] = useState(0);
  const [multiplier, setMultiplier] = useState(1);
  const [guessHistory, setGuessHistory] = useState<{ card: TCard; correct: boolean }[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [lastProfit, setLastProfit] = useState<number | null>(null);
  const [revealing, setRevealing] = useState(false);
  const [history, setHistory] = useState<{ bet: number; payout: number; streak: number }[]>([]);
  const [seeds, setSeeds] = useState({ serverSeed: "", clientSeed: "", nonce: 0 });

  const startGame = useCallback(() => {
    if (!user || betAmount <= 0 || betAmount > user.balance) return;

    const serverSeed = generateServerSeed();
    const clientSeed = generateId();
    const nonce = Date.now();
    setSeeds({ serverSeed, clientSeed, nonce });

    engine.init(serverSeed, clientSeed, nonce);
    setCurrentCard(engine.currentCard);
    setNextCard(null);
    setStreak(0);
    setMultiplier(1);
    setGuessHistory([]);
    setGameActive(true);
    setGameOver(false);
    setLastProfit(null);
  }, [engine, betAmount, user]);

  const handleGuess = useCallback(
    (isHigher: boolean) => {
      if (!gameActive || gameOver || revealing) return;

      setRevealing(true);

      setTimeout(() => {
        const result = engine.guess(isHigher, seeds.serverSeed, seeds.clientSeed, seeds.nonce);
        setNextCard(result.nextCard);
        setCurrentCard(result.nextCard);
        setStreak(engine.streak);
        setMultiplier(result.multiplier);
        setGuessHistory([...engine.history]);

        if (!result.correct) {
          setGameOver(true);
          setGameActive(false);
          setLastProfit(null);
          playGame("Hi-Lo", betAmount, 0);
          setHistory((prev) => [{ bet: betAmount, payout: 0, streak: 0 }, ...prev].slice(0, 20));
        }

        setRevealing(false);
      }, 500);
    },
    [gameActive, gameOver, revealing, engine, seeds, betAmount, playGame]
  );

  const handleCollect = useCallback(() => {
    if (!gameActive || streak === 0) return;

    const payout = Math.round(betAmount * multiplier * 100) / 100;
    const profit = payout - betAmount;

    playGame("Hi-Lo", betAmount, payout);
    setLastProfit(profit);
    setGameOver(true);
    setGameActive(false);
    setHistory((prev) => [{ bet: betAmount, payout, streak }, ...prev].slice(0, 20));
  }, [gameActive, streak, multiplier, betAmount, playGame]);

  return (
    <div className="flex min-h-[calc(100vh-80px)]">
      {/* Bet Panel */}
      <div className="w-full lg:w-[340px] shrink-0 bg-canvas-card border-r border-border p-4 flex flex-col gap-4 overflow-y-auto">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-text-gold">Hi-Lo</h2>
          <span className="text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full bg-gold text-canvas">
            DEMO MODE
          </span>
        </div>

        {/* Bet Amount */}
        <div>
          <label className="text-xs text-text-secondary mb-1.5 block">Bet Amount</label>
          <input
            type="number"
            value={betAmount}
            onChange={(e) => setBetAmount(Math.max(0, Number(e.target.value)))}
            disabled={gameActive}
            className="input-field w-full h-10 px-3 text-sm font-[family-name:var(--font-mono)] tabular-nums"
          />
          <div className="flex gap-1.5 mt-2">
            {QUICK_BETS.map((b) => (
              <button
                key={b}
                onClick={() => !gameActive && setBetAmount(b)}
                disabled={gameActive}
                className={cn(
                  "flex-1 h-7 rounded-md text-[11px] font-semibold transition-colors cursor-pointer disabled:opacity-40",
                  betAmount === b
                    ? "bg-gold/20 text-gold border border-gold/30"
                    : "bg-canvas-elevated text-text-secondary border border-border hover:text-text-gold"
                )}
              >
                {b.toLocaleString()}
              </button>
            ))}
          </div>
        </div>

        {/* Balance */}
        <div className="bg-canvas-elevated rounded-lg px-3 py-2 border border-border">
          <span className="text-xs text-text-secondary">Balance: </span>
          <span className="text-sm font-semibold text-gold font-[family-name:var(--font-mono)] tabular-nums">
            {formatCoins(user?.balance ?? 0)}
          </span>
        </div>

        {/* Start Button */}
        {!gameActive && !gameOver && (
          <button onClick={startGame} className="btn-primary w-full h-12 text-sm font-bold cursor-pointer">
            Bet ({formatCoins(betAmount)})
          </button>
        )}

        {/* Stats */}
        {gameActive && (
          <>
            <div className="bg-canvas-elevated rounded-lg px-4 py-3 border border-border flex items-center justify-between">
              <span className="text-xs text-text-secondary">Streak</span>
              <span className="text-lg font-bold text-text-gold font-[family-name:var(--font-mono)] tabular-nums">
                {streak}
              </span>
            </div>
            <div className="bg-canvas-elevated rounded-lg px-4 py-3 border border-border flex items-center justify-between">
              <span className="text-xs text-text-secondary">Multiplier</span>
              <span className="text-lg font-bold text-success font-[family-name:var(--font-mono)] tabular-nums">
                {multiplier.toFixed(2)}x
              </span>
            </div>
          </>
        )}

        {/* History */}
        {history.length > 0 && (
          <div className="mt-auto pt-2">
            <p className="text-[10px] text-text-disabled uppercase tracking-wider mb-2">Recent</p>
            <div className="flex gap-1 flex-wrap">
              {history.slice(0, 15).map((h, i) => (
                <span
                  key={i}
                  className={cn(
                    "px-2 py-0.5 rounded text-[10px] font-bold font-[family-name:var(--font-mono)] tabular-nums",
                    h.payout > 0
                      ? "bg-success/15 text-success"
                      : "bg-danger/15 text-danger"
                  )}
                >
                  {h.payout > 0 ? `+${h.payout.toLocaleString()}` : `-${h.bet.toLocaleString()}`}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Game Area */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 lg:p-8">
        <div className="w-full max-w-[520px]">
          {/* Cards */}
          <div className="flex justify-center items-center gap-6 mb-8">
            <div className="flex flex-col items-center gap-2">
              <CardDisplay card={currentCard} />
              <span className="text-[11px] text-text-secondary uppercase tracking-wider">Current</span>
            </div>
            <span className="text-text-disabled text-2xl font-bold">vs</span>
            <div className="flex flex-col items-center gap-2">
              <CardDisplay card={nextCard} hidden={!nextCard} />
              <span className="text-[11px] text-text-secondary uppercase tracking-wider">Next</span>
            </div>
          </div>

          {/* Action Buttons */}
          {gameActive && (
            <div className="flex gap-3 mb-4">
              <button
                onClick={() => handleGuess(true)}
                disabled={revealing}
                className="flex-1 h-14 rounded-xl text-lg font-bold bg-success text-canvas hover:shadow-[0_0_20px_rgba(0,245,160,0.3)] active:scale-[0.97] transition-all cursor-pointer disabled:opacity-40"
              >
                Higher ↑
              </button>
              <button
                onClick={() => handleGuess(false)}
                disabled={revealing}
                className="flex-1 h-14 rounded-xl text-lg font-bold bg-danger text-white hover:brightness-110 active:scale-[0.97] transition-all cursor-pointer disabled:opacity-40"
              >
                Lower ↓
              </button>
            </div>
          )}

          {/* Collect */}
          {gameActive && streak > 0 && (
            <button
              onClick={handleCollect}
              className="btn-primary w-full h-12 text-sm font-bold cursor-pointer mb-4"
            >
              Collect ({formatCoins(Math.round(betAmount * multiplier * 100) / 100)})
            </button>
          )}

          {/* Game Over Status */}
          {gameOver && lastProfit !== null && (
            <div
              className={cn(
                "text-center py-4 rounded-xl border animate-win-flash",
                lastProfit > 0
                  ? "bg-success/10 border-success/30"
                  : "bg-danger/10 border-danger/30"
              )}
            >
              <span
                className={cn(
                  "text-lg font-bold font-[family-name:var(--font-mono)] tabular-nums",
                  lastProfit > 0 ? "text-success" : "text-danger"
                )}
              >
                {lastProfit > 0
                  ? `Won ${formatCoins(Math.round(betAmount * multiplier * 100) / 100)}`
                  : "Wrong guess!"}
              </span>
            </div>
          )}

          {gameOver && lastProfit === null && (
            <div className="text-center py-4 rounded-xl border bg-danger/10 border-danger/30">
              <span className="text-lg font-bold text-danger font-[family-name:var(--font-mono)] tabular-nums">
                Wrong guess! Lost {formatCoins(betAmount)}
              </span>
            </div>
          )}

          {!gameActive && !gameOver && (
            <div className="text-center py-4">
              <p className="text-sm text-text-secondary">Place a bet and start guessing</p>
            </div>
          )}

          {/* Guess History Strip */}
          {guessHistory.length > 0 && (
            <div className="mt-4">
              <p className="text-[10px] text-text-disabled uppercase tracking-wider mb-2">This Round</p>
              <div className="flex gap-1.5 flex-wrap">
                {guessHistory.map((h, i) => (
                  <span
                    key={i}
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border",
                      h.correct
                        ? "bg-success/20 text-success border-success/30"
                        : "bg-danger/20 text-danger border-danger/30"
                    )}
                  >
                    {h.correct ? "+" : "×"}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
