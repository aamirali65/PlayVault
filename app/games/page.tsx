"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useGameStore } from "@/store/gameStore";
import type { GameCategory } from "@/types";

interface GameDef {
  slug: string;
  name: string;
  category: GameCategory;
  gradient: string;
  icon: string;
  playerCount: number;
  description: string;
  howToPlay: string;
  isNew?: boolean;
  isPopular?: boolean;
}

const GAMES: GameDef[] = [
  { slug: "crash", name: "Crash", category: "crash", gradient: "from-red-500/20 to-orange-500/20", icon: "📈", playerCount: 3847, description: "Watch the multiplier rise and cash out before it crashes.", howToPlay: "Place a bet and watch the multiplier increase. Cash out before it crashes to win your bet multiplied by the current value.", isPopular: true },
  { slug: "dice", name: "Dice", category: "dice", gradient: "from-blue-500/20 to-purple-500/20", icon: "🎲", playerCount: 2156, description: "Roll the dice and predict the outcome.", howToPlay: "Choose a number range. If the dice roll lands within your range, you win.", isPopular: true },
  { slug: "roulette", name: "Roulette", category: "cards", gradient: "from-red-600/20 to-yellow-500/20", icon: "🎰", playerCount: 4201, description: "Classic roulette with multiple betting options.", howToPlay: "Place your bet on a color, number, or range. Spin the wheel and see where the ball lands.", isPopular: true },
  { slug: "blackjack", name: "Blackjack", category: "cards", gradient: "from-green-500/20 to-emerald-500/20", icon: "🃏", playerCount: 1892, description: "Beat the dealer to 21 without going over.", howToPlay: "Get as close to 21 as possible without going over. Beat the dealer's hand to win.", isPopular: true },
  { slug: "snake", name: "Snake", category: "arcade", gradient: "from-lime-500/20 to-green-600/20", icon: "🐍", playerCount: 1234, description: "Classic snake game with a twist.", howToPlay: "Use arrow keys to control the snake. Eat food to grow longer. Avoid hitting walls or yourself." },
  { slug: "slots", name: "Slots", category: "slots", gradient: "from-cyan-500/20 to-blue-500/20", icon: "🎰", playerCount: 4890, description: "Spin the reels and match symbols.", howToPlay: "Set your bet amount and spin the reels. Match symbols across paylines to win." },
  { slug: "mines", name: "Mines", category: "dice", gradient: "from-yellow-500/20 to-amber-600/20", icon: "💣", playerCount: 2734, description: "Navigate a minefield and collect gems.", howToPlay: "Reveal tiles one by one. Each safe tile multiplies your bet. Hit a mine and you lose.", isPopular: true },
  { slug: "plinko", name: "Plinko", category: "arcade", gradient: "from-pink-500/20 to-rose-500/20", icon: "📌", playerCount: 1567, description: "Drop the ball and watch it bounce.", howToPlay: "Drop a ball from the top. It bounces off pegs and lands in a multiplier slot at the bottom." },
  { slug: "coinflip", name: "Coin Flip", category: "dice", gradient: "from-amber-500/20 to-yellow-500/20", icon: "🪙", playerCount: 3210, description: "Simple heads or tails with a multiplier.", howToPlay: "Choose heads or tails. If the coin lands on your choice, you double your bet." },
  { slug: "hilo", name: "Hi-Lo", category: "cards", gradient: "from-indigo-500/20 to-violet-500/20", icon: "🃏", playerCount: 1890, description: "Predict if the next card is higher or lower.", howToPlay: "You're shown a card. Predict whether the next card will be higher or lower to win." },
  { slug: "aviator", name: "Aviator", category: "crash", gradient: "from-purple-500/20 to-pink-500/20", icon: "✈️", playerCount: 3156, description: "Bet and cash out before the plane flies away.", howToPlay: "Place a bet and watch the plane fly. Cash out at any time to collect your multiplied bet.", isPopular: true },
  { slug: "teenpatti", name: "Teen Patti", category: "cards", gradient: "from-orange-500/20 to-red-500/20", icon: "🃏", playerCount: 2345, description: "Three-card poker variant popular in South Asia.", howToPlay: "Get three cards and bet on who has the best hand. Blind or seen play options available." },
  { slug: "andarbahar", name: "Andar Bahar", category: "cards", gradient: "from-teal-500/20 to-cyan-500/20", icon: "🎯", playerCount: 1890, description: "Classic Indian card game of chance.", howToPlay: "A card is placed in the middle. Bet on whether a matching card appears on the Andar or Bahar side." },
  { slug: "baccarat", name: "Baccarat", category: "cards", gradient: "from-emerald-500/20 to-teal-500/20", icon: "🃏", playerCount: 2678, description: "Elegant card game of banker vs player.", howToPlay: "Bet on Player, Banker, or Tie. Two hands are dealt and the closest to 9 wins." },
  { slug: "limbo", name: "Limbo", category: "crash", gradient: "from-violet-500/20 to-indigo-500/20", icon: "🚀", playerCount: 1456, description: "Set your target multiplier and test your luck.", howToPlay: "Choose a target multiplier. If the result is at or above your target, you win your bet multiplied." },
];

const CATEGORIES: { key: GameCategory; label: string }[] = [
  { key: "all", label: "All" },
  { key: "popular", label: "Popular" },
  { key: "crash", label: "Crash" },
  { key: "cards", label: "Cards" },
  { key: "arcade", label: "Arcade" },
  { key: "dice", label: "Dice" },
  { key: "slots", label: "Slots" },
  { key: "puzzle", label: "Puzzle" },
  { key: "live", label: "Live" },
];

const SORT_OPTIONS = ["Popular", "Newest", "A-Z"] as const;

export default function GamesPage() {
  const { searchQuery, setSearch, selectedCategory, setCategory } = useGameStore();
  const [sort, setSort] = useState<(typeof SORT_OPTIONS)[number]>("Popular");

  const filteredGames = useMemo(() => {
    let games = [...GAMES];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      games = games.filter((g) => g.name.toLowerCase().includes(q) || g.slug.includes(q));
    }

    if (selectedCategory === "popular") {
      games = games.filter((g) => g.isPopular);
    } else if (selectedCategory !== "all") {
      games = games.filter((g) => g.category === selectedCategory);
    }

    switch (sort) {
      case "A-Z":
        games.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "Popular":
        games.sort((a, b) => b.playerCount - a.playerCount);
        break;
    }

    return games;
  }, [searchQuery, selectedCategory, sort]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:py-12">
      <div className="mb-8">
        <h1 className="font-sora text-3xl font-bold">Games</h1>
        <p className="mt-1 text-text-muted">Choose from {GAMES.length} games and start playing.</p>
      </div>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder="Search games..."
            value={searchQuery}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 w-full rounded-xl bg-surface border border-border pl-10 pr-4 text-sm text-text-primary placeholder:text-text-muted outline-none transition-all duration-150 focus:ring-2 focus:ring-accent/40 focus:border-accent"
          />
        </div>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as typeof SORT_OPTIONS[number])}
          className="h-10 rounded-xl bg-surface border border-border px-3 text-sm text-text-primary outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent appearance-none cursor-pointer"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </div>

      <div className="mb-8 flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setCategory(cat.key)}
            className={`whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-colors cursor-pointer ${
              selectedCategory === cat.key
                ? "bg-accent text-background"
                : "bg-surface border border-border text-text-muted hover:text-text-primary hover:border-accent/40"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {filteredGames.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-text-muted">No games found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {filteredGames.map((game) => (
            <Link key={game.slug} href={`/games/${game.slug}`}>
              <Card hover className="group cursor-pointer p-0 overflow-hidden">
                <div className={`flex aspect-[4/3] items-center justify-center bg-gradient-to-br ${game.gradient}`}>
                  <span className="text-4xl transition-transform group-hover:scale-110">{game.icon}</span>
                </div>
                <div className="p-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold truncate">{game.name}</h3>
                    {game.isNew && <Badge variant="primary" className="text-[10px]">NEW</Badge>}
                  </div>
                  <div className="mt-1.5 flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
                    <span className="text-xs text-text-muted">{game.playerCount.toLocaleString()}</span>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
