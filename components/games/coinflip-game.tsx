"use client";

import { useState, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useUserStore } from "@/store/userStore";
import { formatCoins, cn } from "@/lib/utils";
import { flipCoin, calculatePayout, type CoinResult, type CoinflipHistory } from "@/lib/games/coinflip/engine";
import { generateServerSeed, generateId } from "@/lib/fairness/rng";

const QUICK_BETS = [100, 500, 1000, 5000];

export default function CoinflipGame() {
  const user = useUserStore((s) => s.user);
  const playGame = useUserStore((s) => s.playGame);

  const [betAmount, setBetAmount] = useState(100);
  const [choice, setChoice] = useState<CoinResult | null>(null);
  const [flipping, setFlipping] = useState(false);
  const [result, setResult] = useState<CoinResult | null>(null);
  const [lastPayout, setLastPayout] = useState<number | null>(null);
  const [history, setHistory] = useState<CoinflipHistory[]>([]);
  const [flipCount, setFlipCount] = useState(0);
  const [headsCount, setHeadsCount] = useState(0);
  const [tailsCount, setTailsCount] = useState(0);
  const [coinState, setCoinState] = useState<"idle" | "spinning" | "landed">("idle");
  const spinRef = useRef<HTMLDivElement>(null);

  const headsPct = flipCount > 0 ? Math.round((headsCount / flipCount) * 100) : 50;
  const tailsPct = flipCount > 0 ? Math.round((tailsCount / flipCount) * 100) : 50;

  const handleFlip = useCallback(() => {
    if (!user || betAmount <= 0 || betAmount > user.balance || !choice || flipping) return;

    setFlipping(true);
    setCoinState("spinning");
    setResult(null);
    setLastPayout(null);

    const serverSeed = generateServerSeed();
    const clientSeed = generateId();
    const nonce = Date.now();

    setTimeout(() => {
      const coinResult = flipCoin(serverSeed, clientSeed, nonce);
      const payout = calculatePayout(choice, coinResult, betAmount);
      const won = choice === coinResult;

      setResult(coinResult);
      setLastPayout(payout);
      setFlipping(false);
      setCoinState("landed");
      setFlipCount((c) => c + 1);
      if (coinResult === "heads") setHeadsCount((c) => c + 1);
      else setTailsCount((c) => c + 1);

      const entry: CoinflipHistory = { choice, result: coinResult, won, payout, nonce };
      setHistory((prev) => [entry, ...prev].slice(0, 12));

      playGame("Coin Flip", betAmount, payout);

      setTimeout(() => setCoinState("idle"), 600);
    }, 1000);
  }, [user, betAmount, choice, flipping, playGame]);

  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="bg-primary/10 border border-primary/30 rounded-xl px-4 py-2 text-center mb-4">
        <span className="text-primary font-bold text-sm tracking-wider uppercase font-[family-name:var(--font-mono)]">
          Demo Mode
        </span>
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        {/* Bet Panel */}
        <div className="lg:w-[340px] shrink-0 space-y-4">
          <Card className="space-y-4">
            <Input
              label="Bet Amount"
              type="number"
              value={betAmount}
              onChange={(e) => setBetAmount(Math.max(0, Number(e.target.value)))}
              min={1}
              disabled={flipping}
              className="font-[family-name:var(--font-mono)] tabular-nums"
            />

            <div className="flex gap-2">
              {QUICK_BETS.map((amount) => (
                <Button
                  key={amount}
                  variant="secondary"
                  size="sm"
                  onClick={() => setBetAmount(amount)}
                  disabled={flipping}
                  className="font-[family-name:var(--font-mono)] tabular-nums"
                >
                  {amount}
                </Button>
              ))}
            </div>
          </Card>

          <Card className="space-y-3">
            <button
              onClick={() => setChoice("heads")}
              disabled={flipping}
              className={cn(
                "w-full h-14 rounded-[12px] text-lg font-bold transition-all duration-150 cursor-pointer",
                choice === "heads"
                  ? "bg-primary text-canvas shadow-[0_0_20px_rgba(0,245,160,0.3)]"
                  : "bg-canvas-elevated text-text-primary border border-border-muted hover:border-primary/30"
              )}
            >
              Heads
            </button>
            <button
              onClick={() => setChoice("tails")}
              disabled={flipping}
              className={cn(
                "w-full h-14 rounded-[12px] text-lg font-bold transition-all duration-150 cursor-pointer",
                choice === "tails"
                  ? "bg-accent text-white shadow-[0_0_20px_rgba(112,0,255,0.3)]"
                  : "bg-canvas-elevated text-text-primary border border-border-muted hover:border-accent/30"
              )}
            >
              Tails
            </button>
          </Card>

          <Button
            variant="primary"
            size="lg"
            className="w-full"
            onClick={handleFlip}
            disabled={flipping || !choice || !user || betAmount <= 0 || betAmount > (user?.balance ?? 0)}
          >
            {flipping ? "Flipping..." : `Flip (${formatCoins(betAmount)})`}
          </Button>

          {user && (
            <Card>
              <p className="text-center text-text-secondary text-sm font-[family-name:var(--font-mono)] tabular-nums">
                Balance: {formatCoins(user.balance)}
              </p>
            </Card>
          )}

          {result && !flipping && (
            <Card
              className={cn(
                lastPayout && lastPayout > betAmount
                  ? "border-success/30 bg-success/5"
                  : "border-danger/30 bg-danger/5"
              )}
            >
              <div className="text-center">
                <p
                  className={cn(
                    "text-lg font-bold font-[family-name:var(--font-mono)]",
                    lastPayout && lastPayout > betAmount ? "text-success" : "text-danger"
                  )}
                >
                  {lastPayout && lastPayout > betAmount
                    ? `Won ${formatCoins(Math.round((lastPayout - betAmount) * 100) / 100)}!`
                    : `Lost ${formatCoins(betAmount)}`}
                </p>
              </div>
            </Card>
          )}
        </div>

        {/* Game Area */}
        <div className="flex-1 space-y-4">
          {/* History Strip */}
          <div className="flex gap-1.5 overflow-x-auto pb-1">
            {history.map((h, i) => (
              <span
                key={i}
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold shrink-0 font-[family-name:var(--font-mono)] animate-chip-in",
                  h.result === "heads"
                    ? "bg-primary/15 text-primary border border-primary/30"
                    : "bg-accent/15 text-accent border border-accent/30",
                  !h.won && "opacity-40"
                )}
              >
                {h.result === "heads" ? "H" : "T"}
              </span>
            ))}
            {history.length === 0 && (
              <span className="text-text-disabled text-xs">No flips yet</span>
            )}
          </div>

          {/* Coin Display */}
          <Card className="relative overflow-hidden">
            <div className="flex flex-col items-center justify-center py-16">
              <div className="relative">
                <div
                  ref={spinRef}
                  className={cn(
                    "w-40 h-40 rounded-full border-4 flex items-center justify-center text-5xl font-bold transition-all duration-500 select-none preserve-3d",
                    coinState === "spinning"
                      ? "animate-slot-spin border-text-disabled"
                      : result === "heads"
                        ? "bg-primary border-primary text-canvas shadow-[0_0_40px_rgba(0,245,160,0.3)]"
                        : result === "tails"
                          ? "bg-accent border-accent text-white shadow-[0_0_40px_rgba(112,0,255,0.3)]"
                          : "bg-canvas-elevated border-border-muted text-text-secondary"
                  )}
                  style={{
                    animation: coinState === "spinning"
                      ? "coinSpin 1s ease-in-out"
                      : undefined,
                  }}
                >
                  {coinState === "spinning"
                    ? "?"
                    : result
                      ? result === "heads"
                        ? "H"
                        : "T"
                      : "?"}
                </div>

                <style>{`
                  @keyframes coinSpin {
                    0% { transform: rotateY(0deg) scale(1); }
                    25% { transform: rotateY(270deg) scale(1.1); }
                    50% { transform: rotateY(540deg) scale(0.95); }
                    75% { transform: rotateY(810deg) scale(1.05); }
                    100% { transform: rotateY(1080deg) scale(1); }
                  }
                `}</style>
              </div>

              <div className="mt-8 text-center">
                {coinState === "spinning" ? (
                  <p className="text-text-secondary text-lg">Flipping...</p>
                ) : result ? (
                  <p
                    className={cn(
                      "text-2xl font-bold font-[family-name:var(--font-mono)]",
                      choice === result ? "text-success" : "text-danger"
                    )}
                  >
                    {choice === result ? "You won!" : "You lost!"}
                  </p>
                ) : (
                  <p className="text-text-disabled text-lg">Pick heads or tails</p>
                )}
              </div>
            </div>
          </Card>

          {/* Running Stats */}
          {flipCount > 0 && (
            <Card>
              <div className="flex justify-around text-center">
                <div>
                  <p className="text-text-disabled text-xs">Flips</p>
                  <p className="text-text-primary font-bold tabular-nums font-[family-name:var(--font-mono)]">{flipCount}</p>
                </div>
                <div>
                  <p className="text-text-disabled text-xs">Heads</p>
                  <p className="text-primary font-bold tabular-nums font-[family-name:var(--font-mono)]">{headsPct}%</p>
                </div>
                <div>
                  <p className="text-text-disabled text-xs">Tails</p>
                  <p className="text-accent font-bold tabular-nums font-[family-name:var(--font-mono)]">{tailsPct}%</p>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
