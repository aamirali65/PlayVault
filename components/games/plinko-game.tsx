"use client";

import { useState, useCallback } from "react";
import { useUserStore } from "@/store/userStore";
import { formatCoins, cn } from "@/lib/utils";
import { generateServerSeed, generateId } from "@/lib/fairness/rng";
import { PlinkoEngine, type PlinkoHistory, type RowCount, type RiskLevel } from "@/lib/games/plinko/engine";

const QUICK_BETS = [50, 100, 250, 500, 1000];

function binColor(mult: number): string {
  if (mult >= 10) return "text-success";
  if (mult >= 3) return "text-primary";
  if (mult >= 1) return "text-text-primary";
  return "text-danger";
}

function binBg(mult: number): string {
  if (mult >= 10) return "bg-success/20 border-success/30";
  if (mult >= 3) return "bg-primary/20 border-primary/30";
  if (mult >= 1) return "bg-canvas-elevated border-border-muted";
  return "bg-danger/20 border-danger/30";
}

export default function PlinkoGame() {
  const user = useUserStore((s) => s.user);
  const playGame = useUserStore((s) => s.playGame);

  const [rows, setRows] = useState<RowCount>(12);
  const [risk, setRisk] = useState<RiskLevel>("medium");
  const [engine] = useState(() => new PlinkoEngine(12, "medium"));
  const [betAmount, setBetAmount] = useState(100);
  const [dropping, setDropping] = useState(false);
  const [ballPath, setBallPath] = useState<number[]>([]);
  const [currentRow, setCurrentRow] = useState(-1);
  const [resultBin, setResultBin] = useState<number | null>(null);
  const [history, setHistory] = useState<PlinkoHistory[]>([]);

  const handleConfigChange = useCallback(
    (newRows?: RowCount, newRisk?: RiskLevel) => {
      const r = newRows ?? rows;
      const ri = newRisk ?? risk;
      setRows(r);
      setRisk(ri);
      engine.setConfig(r, ri);
    },
    [rows, risk, engine]
  );

  const animateDrop = useCallback(
    (path: number[], binIdx: number) => {
      setDropping(true);
      setBallPath(path);
      setResultBin(null);
      setCurrentRow(0);

      let row = 0;
      const interval = setInterval(() => {
        row++;
        if (row <= path.length) {
          setCurrentRow(row);
        } else {
          clearInterval(interval);
          setResultBin(binIdx);
          setDropping(false);
        }
      }, 180);
    },
    []
  );

  const handleDrop = useCallback(() => {
    if (!user || betAmount <= 0 || betAmount > user.balance || dropping) return;

    const serverSeed = generateServerSeed();
    const clientSeed = generateId();
    const nonce = Date.now();

    const result = engine.dropBall(serverSeed, clientSeed, nonce);
    animateDrop(result.path, result.binIndex);

    const payout = engine.calculatePayout(betAmount, result.multiplier);
    engine.addHistory(result.multiplier, payout);
    setHistory([...engine.history]);

    setTimeout(() => {
      playGame("Plinko", betAmount, payout);
    }, (rows + 1) * 180);
  }, [user, betAmount, dropping, engine, animateDrop, playGame, rows]);

  const getPegPositions = (row: number) => {
    const count = row + 3;
    return Array.from({ length: count }).map((_, i) => i);
  };

  const bins = engine.bins;

  return (
    <div className="flex min-h-[calc(100vh-80px)]">
      {/* Bet Panel */}
      <div className="w-full lg:w-[340px] shrink-0 bg-canvas-card border-r border-border-muted p-4 flex flex-col gap-4 overflow-y-auto">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-text-primary">Plinko</h2>
          <span className="text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full bg-primary text-canvas">
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
            disabled={dropping}
            className="input-field w-full h-10 px-3 text-sm font-[family-name:var(--font-mono)] tabular-nums"
          />
          <div className="flex gap-1.5 mt-2">
            {QUICK_BETS.map((b) => (
              <button
                key={b}
                onClick={() => !dropping && setBetAmount(b)}
                disabled={dropping}
                className={cn(
                  "flex-1 h-7 rounded-md text-[11px] font-semibold transition-colors cursor-pointer disabled:opacity-40",
                  betAmount === b
                    ? "bg-primary/20 text-primary border border-primary/30"
                    : "bg-canvas-elevated text-text-secondary border border-border-muted hover:text-text-primary"
                )}
              >
                {b.toLocaleString()}
              </button>
            ))}
          </div>
        </div>

        {/* Rows */}
        <div>
          <label className="text-xs text-text-secondary mb-1.5 block">Rows</label>
          <div className="flex gap-1.5">
            {([8, 12, 16] as RowCount[]).map((r) => (
              <button
                key={r}
                onClick={() => handleConfigChange(r)}
                disabled={dropping}
                className={cn(
                  "flex-1 h-9 rounded-lg text-xs font-bold transition-colors cursor-pointer disabled:opacity-40",
                  rows === r
                    ? "bg-primary/20 text-primary border border-primary/30"
                    : "bg-canvas-elevated text-text-secondary border border-border-muted hover:text-text-primary"
                )}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Risk */}
        <div>
          <label className="text-xs text-text-secondary mb-1.5 block">Risk</label>
          <div className="flex gap-1.5">
            {(["low", "medium", "high"] as RiskLevel[]).map((r) => (
              <button
                key={r}
                onClick={() => handleConfigChange(undefined, r)}
                disabled={dropping}
                className={cn(
                  "flex-1 h-9 rounded-lg text-xs font-bold capitalize transition-colors cursor-pointer disabled:opacity-40",
                  risk === r
                    ? "bg-primary/20 text-primary border border-primary/30"
                    : "bg-canvas-elevated text-text-secondary border border-border-muted hover:text-text-primary"
                )}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Balance */}
        <div className="bg-canvas-elevated rounded-lg px-3 py-2 border border-border-muted">
          <span className="text-xs text-text-secondary">Balance: </span>
          <span className="text-sm font-semibold text-primary font-[family-name:var(--font-mono)] tabular-nums">
            {formatCoins(user?.balance ?? 0)}
          </span>
        </div>

        {/* Drop Button */}
        <button
          onClick={handleDrop}
          disabled={dropping}
          className="btn-primary w-full h-12 text-sm font-bold cursor-pointer disabled:opacity-40"
        >
          {dropping ? "Dropping..." : `Drop Ball (${formatCoins(betAmount)})`}
        </button>

        {/* History */}
        {history.length > 0 && (
          <div className="mt-auto pt-2">
            <p className="text-[10px] text-text-disabled uppercase tracking-wider mb-2">Recent</p>
            <div className="flex gap-1 flex-wrap">
              {history.slice(0, 20).map((h, i) => (
                <span
                  key={i}
                  className={cn(
                    "px-2 py-0.5 rounded text-[10px] font-bold font-[family-name:var(--font-mono)] tabular-nums border",
                    binBg(h.multiplier),
                    binColor(h.multiplier)
                  )}
                >
                  {h.multiplier}x
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Game Area */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 lg:p-8">
        <div className="w-full max-w-[600px]">
          {/* Peg Pyramid */}
          <div className="bg-canvas-card border border-border-muted rounded-xl p-6 overflow-hidden">
            <div className="flex flex-col items-center gap-1.5">
              {Array.from({ length: rows }).map((_, row) => {
                const posAtRow = ballPath.slice(0, row + 1).reduce((s, v) => s + v, 0);
                return (
                  <div key={row} className="flex justify-center gap-2.5 relative">
                    {getPegPositions(row).map((pos) => {
                      const isActive = currentRow >= row + 1 && pos === posAtRow;
                      return (
                        <div
                          key={pos}
                          className={cn(
                            "w-2.5 h-2.5 rounded-full transition-all duration-150",
                            isActive
                              ? "bg-primary shadow-[0_0_10px_rgba(0,245,160,0.6)] scale-150"
                              : "bg-text-disabled/30"
                          )}
                        />
                      );
                    })}
                  </div>
                );
              })}
            </div>

            {/* Multiplier Bins */}
            <div className="flex justify-center gap-0.5 mt-4">
              {bins.map((mult, i) => (
                <div
                  key={i}
                  className={cn(
                    "px-1 py-1.5 rounded text-[9px] font-bold text-center min-w-[36px] border transition-all font-[family-name:var(--font-mono)] tabular-nums",
                    binBg(mult),
                    binColor(mult),
                    resultBin === i && "scale-110 ring-2 ring-primary/50"
                  )}
                >
                  {mult}x
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
