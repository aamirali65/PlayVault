"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Radio, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
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
      <div className="mb-8 text-center md:text-left">
        <div className="flex items-center justify-center md:justify-start gap-3">
          <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald/20 to-emerald/5 border border-emerald/20">
            <Radio className="h-6 w-6 text-emerald" />
            <span className="absolute -top-1 -right-1 h-3.5 w-3.5 rounded-full bg-emerald animate-pulse border-2 border-background" />
          </div>
          <div>
            <h1 className="font-display text-3xl font-extrabold text-text-primary">
              LIVE NOW
            </h1>
            <p className="text-text-secondary">See who is playing right now</p>
          </div>
        </div>
      </div>

      <div className="hud-panel p-4 md:p-5 mb-6">
        <div className="flex items-center justify-center gap-3">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald animate-pulse" />
            <Users className="h-4 w-4 text-text-muted" />
          </div>
          <span className="text-sm text-text-muted">Players Online</span>
          <span className="text-lg font-extrabold text-emerald">{formatNumber(totalOnline)}</span>
        </div>
      </div>

      <div className="overflow-x-auto pb-4 -mx-4 px-4 md:mx-0 md:px-0">
        <div className="flex gap-4 min-w-max md:min-w-0 md:grid md:grid-cols-3 lg:grid-cols-5">
          {GAMES.map((game) => (
            <Link key={game.slug} href={`/games/${game.slug}`}>
              <div className="gaming-card p-0 overflow-hidden cursor-pointer group">
                <div className={`relative flex aspect-[4/3] items-center justify-center bg-gradient-to-br ${game.gradient}`}>
                  <span className="text-4xl transition-transform group-hover:scale-110 group-hover:rotate-3 duration-300">
                    {game.icon}
                  </span>
                  <div className="absolute top-3 right-3">
                    <Badge variant="live">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald animate-pulse" />
                      LIVE
                    </Badge>
                  </div>
                </div>
                <div className="p-3.5">
                  <h3 className="text-sm font-bold text-text-primary truncate">{game.name}</h3>
                  <div className="mt-2 flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald animate-pulse" />
                    <span className="text-xs font-medium text-text-muted">
                      {formatNumber(players[game.slug])} playing
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
