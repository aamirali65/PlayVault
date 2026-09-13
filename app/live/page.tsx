"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Radio } from "lucide-react";
import { Card } from "@/components/ui/card";
import { formatNumber } from "@/lib/utils";

interface GameDef {
  slug: string;
  name: string;
  icon: string;
  gradient: string;
  basePlayers: number;
}

const GAMES: GameDef[] = [
  { slug: "crash", name: "Crash", icon: "📈", gradient: "from-red-500/20 to-orange-500/20", basePlayers: 3847 },
  { slug: "dice", name: "Dice", icon: "🎲", gradient: "from-blue-500/20 to-purple-500/20", basePlayers: 2156 },
  { slug: "roulette", name: "Roulette", icon: "🎰", gradient: "from-red-600/20 to-yellow-500/20", basePlayers: 4201 },
  { slug: "blackjack", name: "Blackjack", icon: "🃏", gradient: "from-green-500/20 to-emerald-500/20", basePlayers: 1892 },
  { slug: "snake", name: "Snake", icon: "🐍", gradient: "from-lime-500/20 to-green-600/20", basePlayers: 1234 },
  { slug: "slots", name: "Slots", icon: "🎰", gradient: "from-cyan-500/20 to-blue-500/20", basePlayers: 4890 },
  { slug: "mines", name: "Mines", icon: "💣", gradient: "from-yellow-500/20 to-amber-600/20", basePlayers: 2734 },
  { slug: "plinko", name: "Plinko", icon: "📌", gradient: "from-pink-500/20 to-rose-500/20", basePlayers: 1567 },
  { slug: "coinflip", name: "Coin Flip", icon: "🪙", gradient: "from-amber-500/20 to-yellow-500/20", basePlayers: 3210 },
  { slug: "hilo", name: "Hi-Lo", icon: "🃏", gradient: "from-indigo-500/20 to-violet-500/20", basePlayers: 1890 },
  { slug: "aviator", name: "Aviator", icon: "✈️", gradient: "from-purple-500/20 to-pink-500/20", basePlayers: 3156 },
  { slug: "teenpatti", name: "Teen Patti", icon: "🃏", gradient: "from-orange-500/20 to-red-500/20", basePlayers: 2345 },
  { slug: "andarbahar", name: "Andar Bahar", icon: "🎯", gradient: "from-teal-500/20 to-cyan-500/20", basePlayers: 1890 },
  { slug: "baccarat", name: "Baccarat", icon: "🃏", gradient: "from-emerald-500/20 to-teal-500/20", basePlayers: 2678 },
  { slug: "limbo", name: "Limbo", icon: "🚀", gradient: "from-violet-500/20 to-indigo-500/20", basePlayers: 1456 },
];

export default function LivePage() {
  const [players, setPlayers] = useState<Record<string, number>>(() =>
    Object.fromEntries(GAMES.map((g) => [g.slug, g.basePlayers]))
  );

  useEffect(() => {
    const id = setInterval(() => {
      setPlayers((prev) => {
        const next = { ...prev };
        for (const game of GAMES) {
          const delta = Math.floor(Math.random() * 41) - 20;
          next[game.slug] = Math.max(100, game.basePlayers + delta);
        }
        return next;
      });
    }, 3000);
    return () => clearInterval(id);
  }, []);

  const totalOnline = Object.values(players).reduce((a, b) => a + b, 0);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:py-12">
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <Radio className="h-8 w-8 text-success" />
          <div>
            <h1 className="font-sora text-3xl font-bold">Live Now</h1>
            <p className="text-text-muted">See who is playing right now</p>
          </div>
        </div>

        <div className="mt-4 inline-flex items-center gap-2 rounded-xl bg-surface border border-border px-4 py-2">
          <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
          <span className="text-sm text-text-muted">Total Players Online:</span>
          <span className="text-sm font-bold text-success">{formatNumber(totalOnline)}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {GAMES.map((game) => (
          <Link key={game.slug} href={`/games/${game.slug}`}>
            <Card hover className="group cursor-pointer p-0 overflow-hidden">
              <div className={`flex aspect-[4/3] items-center justify-center bg-gradient-to-br ${game.gradient}`}>
                <span className="text-4xl transition-transform group-hover:scale-110">{game.icon}</span>
              </div>
              <div className="p-3">
                <h3 className="text-sm font-semibold truncate">{game.name}</h3>
                <div className="mt-1.5 flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
                  <span className="text-xs text-text-muted">
                    {formatNumber(players[game.slug])} online
                  </span>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
