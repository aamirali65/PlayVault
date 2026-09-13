"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useUserStore } from "@/store/userStore";
import { formatCoins, cn } from "@/lib/utils";
import { spinReels, calculatePayout, SYMBOLS, type SpinResult } from "@/lib/games/slots/engine";
import { generateServerSeed, generateId } from "@/lib/fairness/rng";

interface HistoryEntry {
  symbols: [string, string, string];
  payout: number;
  bet: number;
  timestamp: number;
}

const QUICK_BETS = [50, 100, 250, 500, 1000];

export default function SlotsGame() {
  const { user, playGame } = useUserStore();
  const [reels, setReels] = useState<string[]>(["7", "7", "7"]);
  const [spinning, setSpinning] = useState(false);
  const [bet, setBet] = useState(100);
  const [lastWin, setLastWin] = useState<SpinResult | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [spinClass, setSpinClass] = useState<string[]>(["", "", ""]);
  const [showWinAnim, setShowWinAnim] = useState(false);
  const animRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const balance = user?.balance ?? 0;

  useEffect(() => {
    return () => animRef.current.forEach(clearTimeout);
  }, []);

  const doSpin = useCallback(() => {
    if (spinning || balance < bet) return;
    setSpinning(true);
    setLastWin(null);
    setShowWinAnim(false);

    setSpinClass(["animate-slot-spin", "animate-slot-spin", "animate-slot-spin"]);

    const serverSeed = generateServerSeed();
    const clientSeed = generateId();
    const nonce = Date.now();

    const result = spinReels(serverSeed, clientSeed, nonce);

    const delays = [600, 800, 1000];
    result.forEach((sym, i) => {
      const t = setTimeout(() => {
        setReels((prev) => {
          const next = [...prev];
          next[i] = sym;
          return next;
        });
        setSpinClass((prev) => {
          const next = [...prev];
          next[i] = "";
          return next;
        });

        if (i === 2) {
          const payoutResult = calculatePayout(result, bet);
          setTimeout(() => {
            setLastWin(payoutResult);
            if (payoutResult.payout > 0) setShowWinAnim(true);
            playGame("Slots", bet, payoutResult.payout, `${result.join(" | ")} x${payoutResult.multiplier}`);
            setHistory((prev) =>
              [{ symbols: result, payout: payoutResult.payout, bet, timestamp: Date.now() }, ...prev].slice(0, 20)
            );
            setSpinning(false);
          }, 200);
        }
      }, delays[i]);
      animRef.current.push(t);
    });
  }, [spinning, balance, bet, playGame]);

  return (
    <div className="flex min-h-[calc(100vh-80px)]">
      {/* Bet Panel */}
      <div className="w-full lg:w-[340px] shrink-0 bg-canvas-card border-r border-border-muted p-4 flex flex-col gap-4 overflow-y-auto">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-text-primary">Slots</h2>
          <span className="text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full bg-primary text-canvas">
            DEMO MODE
          </span>
        </div>

        {/* Bet Amount */}
        <div>
          <label className="text-xs text-text-secondary mb-1.5 block">Bet Amount</label>
          <input
            type="number"
            value={bet}
            onChange={(e) => setBet(Math.max(0, Number(e.target.value)))}
            disabled={spinning}
            className="input-field w-full h-10 px-3 text-sm font-[family-name:var(--font-mono)] tabular-nums"
          />
          <div className="flex gap-1.5 mt-2">
            {QUICK_BETS.map((b) => (
              <button
                key={b}
                onClick={() => !spinning && setBet(b)}
                disabled={spinning}
                className={cn(
                  "flex-1 h-7 rounded-md text-[11px] font-semibold transition-colors cursor-pointer disabled:opacity-40",
                  bet === b
                    ? "bg-primary/20 text-primary border border-primary/30"
                    : "bg-canvas-elevated text-text-secondary border border-border-muted hover:text-text-primary"
                )}
              >
                {b.toLocaleString()}
              </button>
            ))}
          </div>
        </div>

        {/* Balance */}
        <div className="bg-canvas-elevated rounded-lg px-3 py-2 border border-border-muted">
          <span className="text-xs text-text-secondary">Balance: </span>
          <span className="text-sm font-semibold text-primary font-[family-name:var(--font-mono)] tabular-nums">
            {formatCoins(balance)}
          </span>
        </div>

        {/* Spin Button */}
        <button
          onClick={doSpin}
          disabled={spinning || balance < bet}
          className="btn-primary w-full h-12 text-sm font-bold cursor-pointer disabled:opacity-40"
        >
          {spinning ? "Spinning..." : `Spin (${formatCoins(bet)})`}
        </button>

        {/* Payout Table */}
        <div className="bg-canvas-elevated rounded-lg border border-border-muted p-3">
          <p className="text-[10px] text-text-disabled uppercase tracking-wider mb-2">Payouts</p>
          <div className="grid grid-cols-2 gap-1">
            {SYMBOLS.map((sym) => (
              <div key={sym.id} className="flex justify-between items-center bg-canvas rounded px-2 py-1">
                <span className="text-xs text-text-primary">{sym.id}</span>
                <span className="text-xs font-bold text-success font-[family-name:var(--font-mono)] tabular-nums">
                  {sym.payout3}x
                </span>
              </div>
            ))}
            <div className="flex justify-between items-center bg-canvas rounded px-2 py-1 col-span-2">
              <span className="text-xs text-text-primary">2x match</span>
              <span className="text-xs font-bold text-success font-[family-name:var(--font-mono)] tabular-nums">2x</span>
            </div>
          </div>
        </div>

        {/* History */}
        {history.length > 0 && (
          <div className="mt-auto pt-2">
            <p className="text-[10px] text-text-disabled uppercase tracking-wider mb-2">Recent</p>
            <div className="space-y-1 max-h-48 overflow-y-auto">
              {history.map((h) => (
                <div
                  key={h.timestamp}
                  className="flex items-center justify-between text-[11px] bg-canvas-elevated border border-border-muted rounded-lg px-2.5 py-1.5"
                >
                  <span className="font-[family-name:var(--font-mono)] tabular-nums text-text-primary">
                    {h.symbols.join(" | ")}
                  </span>
                  <span
                    className={cn(
                      "font-bold font-[family-name:var(--font-mono)] tabular-nums",
                      h.payout > 0 ? "text-success" : "text-danger"
                    )}
                  >
                    {h.payout > 0 ? `+${h.payout.toLocaleString()}` : `-${h.bet.toLocaleString()}`}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Game Area */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 lg:p-8">
        <div className="w-full max-w-[520px]">
          {/* Reels */}
          <div className="bg-canvas-card border border-border-muted rounded-xl p-8 mb-4">
            <div className="flex items-center justify-center gap-4">
              {reels.map((sym, i) => (
                <div
                  key={i}
                  className={cn(
                    "w-28 h-40 rounded-xl border-2 flex items-center justify-center overflow-hidden transition-colors",
                    "bg-canvas-elevated",
                    lastWin && lastWin.payout > 0 && lastWin.symbols[i] === lastWin.symbols[0]
                      ? "border-success"
                      : "border-border-muted"
                  )}
                >
                  <span
                    className={cn(
                      "text-5xl font-black font-[family-name:var(--font-mono)] transition-all",
                      spinClass[i] || ""
                    )}
                  >
                    {sym}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Win Display */}
          {showWinAnim && lastWin && lastWin.payout > 0 && (
            <div className="text-center mb-4 animate-win-flash">
              <span className="text-4xl font-black text-success font-[family-name:var(--font-mono)] tabular-nums">
                +{formatCoins(lastWin.payout)}
              </span>
            </div>
          )}

          {lastWin && !spinning && (
            <div className="text-center text-sm text-text-secondary mb-4 font-[family-name:var(--font-mono)]">
              {lastWin.payout > 0 ? `${lastWin.multiplier}x multiplier` : "No match"}
            </div>
          )}

          {/* Status */}
          {!lastWin && !spinning && (
            <div className="text-center py-4">
              <p className="text-sm text-text-secondary">Set your bet and spin the reels</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
