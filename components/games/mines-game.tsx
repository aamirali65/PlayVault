"use client";

import { useState, useCallback } from "react";
import { useUserStore } from "@/store/userStore";
import { formatCoins, cn } from "@/lib/utils";
import { generateServerSeed, generateId } from "@/lib/fairness/rng";
import { MinesEngine, type MinesRevealResult } from "@/lib/games/mines/engine";

const TOTAL_TILES = 25;
const QUICK_BETS = [50, 100, 250, 500, 1000];

export default function MinesGame() {
  const user = useUserStore((s) => s.user);
  const playGame = useUserStore((s) => s.playGame);

  const [engine] = useState(() => new MinesEngine());
  const [gameActive, setGameActive] = useState(false);
  const [betAmount, setBetAmount] = useState(100);
  const [mineCount, setMineCount] = useState(5);
  const [revealed, setRevealed] = useState<boolean[]>(new Array(TOTAL_TILES).fill(false));
  const [mines, setMines] = useState<boolean[]>([]);
  const [tiles, setTiles] = useState<(MinesRevealResult | null)[]>(new Array(TOTAL_TILES).fill(null));
  const [currentMultiplier, setCurrentMultiplier] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const [lastProfit, setLastProfit] = useState<number | null>(null);
  const [history, setHistory] = useState<{ bet: number; payout: number; mines: number }[]>([]);
  const [seeds, setSeeds] = useState({ serverSeed: "", clientSeed: "", nonce: 0 });

  const startGame = useCallback(() => {
    if (!user || betAmount <= 0 || betAmount > user.balance) return;
    const serverSeed = generateServerSeed();
    const clientSeed = generateId();
    const nonce = 0;
    setSeeds({ serverSeed, clientSeed, nonce });
    engine.init(mineCount, serverSeed, clientSeed, nonce);
    setRevealed(new Array(TOTAL_TILES).fill(false));
    setMines([]);
    setTiles(new Array(TOTAL_TILES).fill(null));
    setCurrentMultiplier(1);
    setGameActive(true);
    setGameOver(false);
    setLastProfit(null);
  }, [engine, mineCount, betAmount, user]);

  const handleTileClick = useCallback(
    (index: number) => {
      if (!gameActive || revealed[index] || gameOver) return;

      const result = engine.revealTile(index);

      const newRevealed = [...revealed];
      newRevealed[index] = true;

      const newTiles = [...tiles];
      newTiles[index] = result;

      if (result.isMine) {
        const allMines = engine.revealAll();
        setMines(allMines);
        setRevealed(new Array(TOTAL_TILES).fill(true));
        setTiles(newTiles);
        setGameOver(true);
        setGameActive(false);
        setLastProfit(null);
        playGame("Mines", betAmount, 0);
        setHistory((prev) => [{ bet: betAmount, payout: 0, mines: mineCount }, ...prev].slice(0, 20));
      } else {
        setRevealed(newRevealed);
        setTiles(newTiles);
        setCurrentMultiplier(result.multiplierSoFar);
      }
    },
    [gameActive, revealed, tiles, gameOver, engine, betAmount, mineCount, playGame]
  );

  const handleCashOut = useCallback(() => {
    if (!gameActive || engine.revealedCount === 0) return;
    const multiplier = engine.cashOut();
    const payout = Math.round(betAmount * multiplier * 100) / 100;
    const profit = payout - betAmount;

    playGame("Mines", betAmount, payout);
    setLastProfit(profit);
    setGameOver(true);
    setGameActive(false);
    const allMines = engine.revealAll();
    setMines(allMines);
    setRevealed(new Array(TOTAL_TILES).fill(true));
    setHistory((prev) => [{ bet: betAmount, payout, mines: mineCount }, ...prev].slice(0, 20));
  }, [gameActive, engine, betAmount, mineCount, playGame]);

  return (
    <div className="flex min-h-[calc(100vh-80px)]">
      {/* Bet Panel */}
      <div className="w-full lg:w-[340px] shrink-0 bg-canvas-card border-r border-border p-4 flex flex-col gap-4 overflow-y-auto">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-text-gold">Mines</h2>
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

        {/* Mine Count */}
        <div>
          <label className="text-xs text-text-secondary mb-1.5 block">
            Mines: <span className="text-gold font-bold">{mineCount}</span>
          </label>
          <input
            type="range"
            min={1}
            max={24}
            value={mineCount}
            onChange={(e) => setMineCount(Number(e.target.value))}
            disabled={gameActive}
            className="w-full accent-primary h-2"
          />
          <div className="flex justify-between text-[10px] text-text-disabled mt-1">
            <span>1</span>
            <span>24</span>
          </div>
        </div>

        {/* Balance */}
        <div className="bg-canvas-elevated rounded-lg px-3 py-2 border border-border">
          <span className="text-xs text-text-secondary">Balance: </span>
          <span className="text-sm font-semibold text-gold font-[family-name:var(--font-mono)] tabular-nums">
            {formatCoins(user?.balance ?? 0)}
          </span>
        </div>

        {/* Start / Cash Out */}
        {!gameActive && !gameOver && (
          <button onClick={startGame} className="btn-primary w-full h-12 text-sm font-bold cursor-pointer">
            Bet ({formatCoins(betAmount)})
          </button>
        )}

        {gameActive && (
          <>
            <div className="bg-canvas-elevated rounded-lg px-4 py-3 border border-border flex items-center justify-between">
              <span className="text-xs text-text-secondary">Multiplier</span>
              <span className="text-lg font-bold text-success font-[family-name:var(--font-mono)] tabular-nums">
                {currentMultiplier.toFixed(2)}x
              </span>
            </div>
            <button onClick={handleCashOut} className="btn-primary w-full h-12 text-sm font-bold cursor-pointer">
              Cash Out ({formatCoins(Math.round(betAmount * currentMultiplier * 100) / 100)})
            </button>
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
          {/* Grid */}
          <div className="grid grid-cols-5 gap-2 mb-4">
            {Array.from({ length: TOTAL_TILES }).map((_, i) => {
              const isRevealed = revealed[i];
              const isMine = mines[i];
              const tileResult = tiles[i];

              let bgClass = "bg-canvas-card border-border hover:brightness-150 cursor-pointer";
              let content = null;

              if (isRevealed) {
                if (isMine) {
                  bgClass = "bg-danger/20 border-danger/40";
                  content = <span className="text-2xl">💣</span>;
                } else if (tileResult && !tileResult.isMine) {
                  bgClass = "bg-success/20 border-success/40";
                  content = <span className="text-2xl">💎</span>;
                }
              }

              return (
                <button
                  key={i}
                  onClick={() => handleTileClick(i)}
                  disabled={!gameActive || isRevealed}
                  className={cn(
                    "aspect-square rounded-xl flex items-center justify-center transition-all duration-150 border",
                    bgClass,
                    (!gameActive || isRevealed) && "pointer-events-none"
                  )}
                >
                  {content}
                </button>
              );
            })}
          </div>

          {/* Game Status */}
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
                  ? `Won ${formatCoins(Math.round(betAmount * currentMultiplier * 100) / 100)}`
                  : `Lost ${formatCoins(betAmount)}`}
              </span>
            </div>
          )}

          {gameOver && lastProfit === null && engine.revealedCount > 0 && (
            <div className="text-center py-4 rounded-xl border bg-danger/10 border-danger/30">
              <span className="text-lg font-bold text-danger font-[family-name:var(--font-mono)] tabular-nums">
                Hit a mine! Lost {formatCoins(betAmount)}
              </span>
            </div>
          )}

          {!gameActive && !gameOver && (
            <div className="text-center py-4">
              <p className="text-sm text-text-secondary">Place a bet and start the game</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
