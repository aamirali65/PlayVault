"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatNumber } from "@/lib/utils";
import { useState } from "react";

const GAMES = [
  { name: "Crash", category: "crash", playerCount: 3847, status: true },
  { name: "Dice", category: "dice", playerCount: 2156, status: true },
  { name: "Roulette", category: "cards", playerCount: 4201, status: true },
  { name: "Blackjack", category: "cards", playerCount: 1892, status: true },
  { name: "Snake", category: "arcade", playerCount: 1234, status: true },
  { name: "Slots", category: "slots", playerCount: 4890, status: true },
  { name: "Mines", category: "dice", playerCount: 2734, status: true },
  { name: "Plinko", category: "arcade", playerCount: 1567, status: true },
  { name: "Coin Flip", category: "dice", playerCount: 3210, status: true },
  { name: "Hi-Lo", category: "cards", playerCount: 1890, status: true },
  { name: "Aviator", category: "crash", playerCount: 3156, status: true },
  { name: "Teen Patti", category: "cards", playerCount: 2345, status: true },
  { name: "Andar Bahar", category: "cards", playerCount: 1890, status: true },
  { name: "Baccarat", category: "cards", playerCount: 2678, status: true },
  { name: "Limbo", category: "crash", playerCount: 1456, status: true },
];

export default function AdminGamesPage() {
  const [games, setGames] = useState(GAMES);

  function toggleStatus(index: number) {
    setGames((prev) =>
      prev.map((g, i) => (i === index ? { ...g, status: !g.status } : g))
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:py-12">
      <div className="mb-8 flex items-center gap-3">
        <Link href="/admin" className="text-text-muted hover:text-text-primary transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="font-sora text-3xl font-bold">Games</h1>
          <p className="text-text-muted">Manage game availability</p>
        </div>
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[650px]">
            <thead>
              <tr className="border-b border-border">
                <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-muted">Game</th>
                <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-muted">Category</th>
                <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-muted">Players</th>
                <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-muted">Status</th>
              </tr>
            </thead>
            <tbody>
              {games.map((game, i) => (
                <tr key={game.name} className="border-b border-border/50 hover:bg-white/[0.02]">
                  <td className="px-5 py-3 text-sm font-medium text-text-primary">{game.name}</td>
                  <td className="px-5 py-3">
                    <Badge variant="muted" className="capitalize">{game.category}</Badge>
                  </td>
                  <td className="px-5 py-3 text-sm text-text-muted">{formatNumber(game.playerCount)}</td>
                  <td className="px-5 py-3">
                    <button
                      onClick={() => toggleStatus(i)}
                      className={`relative h-6 w-11 rounded-full transition-colors cursor-pointer ${
                        game.status ? "bg-success" : "bg-white/10"
                      }`}
                    >
                      <span
                        className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-transform ${
                          game.status ? "left-6" : "left-1"
                        }`}
                      />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
