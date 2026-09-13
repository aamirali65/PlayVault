"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useUserStore } from "@/store/userStore";
import { cn } from "@/lib/utils";
import {
  createInitialState,
  tick,
  changeDirection,
  GRID_SIZE,
  type SnakeState,
  type Direction,
} from "@/lib/games/snake/engine";

const CELL = 20;

export default function SnakeGame() {
  const { user } = useUserStore();
  const [state, setState] = useState<SnakeState>(createInitialState());
  const [gamePhase, setGamePhase] = useState<"idle" | "playing" | "dead">("idle");
  const [highScore, setHighScore] = useState(() => {
    if (typeof window !== "undefined") {
      return Number(localStorage.getItem("snake_high_score") || "0");
    }
    return 0;
  });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const stateRef = useRef(state);

  useEffect(() => {
    stateRef.current = state;
  });

  const draw = useCallback((s: SnakeState) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "#090A0F";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = "#1E2235";
    ctx.lineWidth = 0.5;
    for (let x = 0; x <= GRID_SIZE; x++) {
      ctx.beginPath();
      ctx.moveTo(x * CELL, 0);
      ctx.lineTo(x * CELL, GRID_SIZE * CELL);
      ctx.stroke();
    }
    for (let y = 0; y <= GRID_SIZE; y++) {
      ctx.beginPath();
      ctx.moveTo(0, y * CELL);
      ctx.lineTo(GRID_SIZE * CELL, y * CELL);
      ctx.stroke();
    }

    s.snake.forEach((seg, i) => {
      ctx.fillStyle = i === 0 ? "#00F5A0" : "#00D2FF";
      ctx.shadowColor = i === 0 ? "#00F5A0" : "transparent";
      ctx.shadowBlur = i === 0 ? 8 : 0;
      ctx.fillRect(seg.x * CELL + 1, seg.y * CELL + 1, CELL - 2, CELL - 2);
      ctx.shadowBlur = 0;
    });

    ctx.fillStyle = "#00F5A0";
    ctx.shadowColor = "#00F5A0";
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(
      s.food.x * CELL + CELL / 2,
      s.food.y * CELL + CELL / 2,
      CELL / 2 - 2,
      0,
      Math.PI * 2
    );
    ctx.fill();
    ctx.shadowBlur = 0;
  }, []);

  const doTick = useCallback(() => {
    setState((prev) => {
      const next = tick(prev);
      draw(next);
      if (!next.isAlive) {
        setGamePhase("dead");
        if (tickRef.current) clearInterval(tickRef.current);
        tickRef.current = null;
        const hs = Number(localStorage.getItem("snake_high_score") || "0");
        if (next.score > hs) {
          localStorage.setItem("snake_high_score", String(next.score));
          setHighScore(next.score);
        }
      }
      return next;
    });
  }, [draw]);

  const startGame = useCallback(() => {
    const initial = createInitialState();
    setState(initial);
    setGamePhase("playing");
    draw(initial);
    if (tickRef.current) clearInterval(tickRef.current);
    tickRef.current = setInterval(doTick, initial.speed);
  }, [draw, doTick]);

  useEffect(() => {
    if (gamePhase === "playing" && tickRef.current) {
      clearInterval(tickRef.current);
      tickRef.current = setInterval(doTick, stateRef.current.speed);
    }
  }, [state.level, gamePhase, doTick]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (gamePhase !== "playing") return;
      const map: Record<string, Direction> = {
        ArrowUp: "up", ArrowDown: "down", ArrowLeft: "left", ArrowRight: "right",
        w: "up", s: "down", a: "left", d: "right",
        W: "up", S: "down", A: "left", D: "right",
      };
      if (map[e.key]) {
        e.preventDefault();
        setState((prev) => changeDirection(prev, map[e.key]));
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [gamePhase]);

  useEffect(() => {
    return () => {
      if (tickRef.current) clearInterval(tickRef.current);
    };
  }, []);

  const dpad = (dir: Direction) => () => {
    if (gamePhase === "playing") {
      setState((prev) => changeDirection(prev, dir));
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-80px)]">
      {/* Side Panel */}
      <div className="w-full lg:w-[340px] shrink-0 bg-canvas-card border-r border-border-muted p-4 flex flex-col gap-4 overflow-y-auto">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-text-primary">Snake</h2>
          <span className="text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full bg-primary text-canvas">
            DEMO MODE
          </span>
        </div>

        {/* Stats */}
        <div className="space-y-2">
          <div className="bg-canvas-elevated rounded-lg px-4 py-3 border border-border-muted flex items-center justify-between">
            <span className="text-xs text-text-secondary">Score</span>
            <span className="text-lg font-bold text-primary font-[family-name:var(--font-mono)] tabular-nums">
              {state.score}
            </span>
          </div>
          <div className="bg-canvas-elevated rounded-lg px-4 py-3 border border-border-muted flex items-center justify-between">
            <span className="text-xs text-text-secondary">Level</span>
            <span className="text-lg font-bold text-secondary font-[family-name:var(--font-mono)] tabular-nums">
              {state.level}
            </span>
          </div>
          <div className="bg-canvas-elevated rounded-lg px-4 py-3 border border-border-muted flex items-center justify-between">
            <span className="text-xs text-text-secondary">High Score</span>
            <span className="text-lg font-bold text-accent font-[family-name:var(--font-mono)] tabular-nums">
              {highScore}
            </span>
          </div>
        </div>

        {/* Controls Info */}
        <div className="bg-canvas-elevated rounded-lg px-3 py-2 border border-border-muted">
          <p className="text-[10px] text-text-disabled uppercase tracking-wider mb-2">Controls</p>
          <div className="space-y-1 text-xs text-text-secondary">
            <p>↑ ↓ ← → Arrow keys</p>
            <p>W A S D</p>
            <p className="text-text-disabled mt-2">Mobile: Use d-pad below</p>
          </div>
        </div>

        {/* Start / Restart */}
        {gamePhase === "idle" && (
          <button onClick={startGame} className="btn-primary w-full h-12 text-sm font-bold cursor-pointer">
            Start Game
          </button>
        )}

        {gamePhase === "dead" && (
          <button onClick={startGame} className="btn-primary w-full h-12 text-sm font-bold cursor-pointer">
            Play Again
          </button>
        )}

        {gamePhase === "playing" && (
          <div className="bg-canvas-elevated rounded-lg px-4 py-3 border border-border-muted text-center">
            <span className="text-sm text-text-secondary">Use arrow keys or WASD to play</span>
          </div>
        )}
      </div>

      {/* Game Area */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 lg:p-8">
        <div className="w-full max-w-[520px]">
          <div className="bg-canvas-card border border-border-muted rounded-xl overflow-hidden flex items-center justify-center">
            <canvas
              ref={canvasRef}
              width={GRID_SIZE * CELL}
              height={GRID_SIZE * CELL}
              className="block"
            />
          </div>

          {/* Mobile D-Pad */}
          <div className="mt-4 flex justify-center md:hidden">
            <div className="grid grid-cols-3 gap-1.5 w-36">
              <div />
              <button
                onClick={dpad("up")}
                className="h-12 rounded-lg bg-canvas-elevated border border-border-muted text-text-primary flex items-center justify-center active:bg-primary/20 active:border-primary/30 cursor-pointer"
              >
                ▲
              </button>
              <div />
              <button
                onClick={dpad("left")}
                className="h-12 rounded-lg bg-canvas-elevated border border-border-muted text-text-primary flex items-center justify-center active:bg-primary/20 active:border-primary/30 cursor-pointer"
              >
                ◄
              </button>
              <div />
              <button
                onClick={dpad("right")}
                className="h-12 rounded-lg bg-canvas-elevated border border-border-muted text-text-primary flex items-center justify-center active:bg-primary/20 active:border-primary/30 cursor-pointer"
              >
                ►
              </button>
              <div />
              <button
                onClick={dpad("down")}
                className="h-12 rounded-lg bg-canvas-elevated border border-border-muted text-text-primary flex items-center justify-center active:bg-primary/20 active:border-primary/30 cursor-pointer"
              >
                ▼
              </button>
              <div />
            </div>
          </div>
        </div>
      </div>

      {/* Game Over Overlay */}
      {gamePhase === "dead" && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-canvas-card border border-border-muted rounded-xl p-8 text-center max-w-sm w-full mx-4">
            <h2 className="text-3xl font-bold mb-2 text-text-primary">Game Over</h2>
            <p className="text-sm text-text-secondary mb-1">Score</p>
            <p className="text-4xl font-bold text-primary mb-4 font-[family-name:var(--font-mono)] tabular-nums">
              {state.score}
            </p>
            {state.score >= highScore && state.score > 0 && (
              <p className="text-sm text-success mb-4 font-semibold">New High Score!</p>
            )}
            <button onClick={startGame} className="btn-primary w-full h-12 text-sm font-bold cursor-pointer">
              Play Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
