"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, Flame, Sparkles, ChevronDown, Zap, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useGameStore } from "@/store/gameStore";
import type { GameCategory } from "@/types";

interface GameDef {
  slug: string;
  name: string;
  category: GameCategory;
  bgGradient: string;
  gradient: string;
  emoji: string;
  playerCount: number;
  description: string;
  howToPlay: string;
  isNew?: boolean;
  isPopular?: boolean;
  isHot?: boolean;
}

const GAMES: GameDef[] = [
  { slug: "crash", name: "Crash", category: "crash", bgGradient: "from-red-500/30 to-orange-500/20", gradient: "from-red-500 via-orange-500 to-yellow-500", emoji: "📈", playerCount: 3847, description: "Watch the multiplier rise and cash out before it crashes.", howToPlay: "Place a bet and watch the multiplier increase. Cash out before it crashes to win your bet multiplied by the current value.", isPopular: true, isHot: true },
  { slug: "dice", name: "Dice", category: "dice", bgGradient: "from-blue-500/30 to-purple-500/20", gradient: "from-blue-500 via-indigo-500 to-purple-500", emoji: "🎲", playerCount: 2156, description: "Roll the dice and predict the outcome.", howToPlay: "Choose a number range. If the dice roll lands within your range, you win.", isPopular: true },
  { slug: "roulette", name: "Roulette", category: "cards", bgGradient: "from-red-600/30 to-yellow-500/20", gradient: "from-red-600 via-yellow-500 to-green-500", emoji: "🎰", playerCount: 4201, description: "Classic roulette with multiple betting options.", howToPlay: "Place your bet on a color, number, or range. Spin the wheel and see where the ball lands.", isPopular: true, isHot: true },
  { slug: "blackjack", name: "Blackjack", category: "cards", bgGradient: "from-green-500/30 to-emerald-500/20", gradient: "from-green-400 via-emerald-500 to-teal-500", emoji: "🃏", playerCount: 1892, description: "Beat the dealer to 21 without going over.", howToPlay: "Get as close to 21 as possible without going over. Beat the dealer's hand to win.", isPopular: true },
  { slug: "snake", name: "Snake", category: "arcade", bgGradient: "from-lime-500/30 to-green-600/20", gradient: "from-lime-400 via-green-500 to-emerald-600", emoji: "🐍", playerCount: 1234, description: "Classic snake game with a twist.", howToPlay: "Use arrow keys to control the snake. Eat food to grow longer. Avoid hitting walls or yourself.", isNew: true },
  { slug: "slots", name: "Slots", category: "slots", bgGradient: "from-cyan-500/30 to-blue-500/20", gradient: "from-cyan-400 via-blue-500 to-indigo-500", emoji: "🎰", playerCount: 4890, description: "Spin the reels and match symbols.", howToPlay: "Set your bet amount and spin the reels. Match symbols across paylines to win.", isHot: true },
  { slug: "mines", name: "Mines", category: "dice", bgGradient: "from-yellow-500/30 to-amber-600/20", gradient: "from-yellow-400 via-amber-500 to-orange-500", emoji: "💣", playerCount: 2734, description: "Navigate a minefield and collect gems.", howToPlay: "Reveal tiles one by one. Each safe tile multiplies your bet. Hit a mine and you lose.", isPopular: true, isHot: true },
  { slug: "plinko", name: "Plinko", category: "arcade", bgGradient: "from-pink-500/30 to-rose-500/20", gradient: "from-pink-400 via-rose-500 to-red-500", emoji: "📌", playerCount: 1567, description: "Drop the ball and watch it bounce.", howToPlay: "Drop a ball from the top. It bounces off pegs and lands in a multiplier slot at the bottom." },
  { slug: "coinflip", name: "Coin Flip", category: "dice", bgGradient: "from-amber-500/30 to-yellow-500/20", gradient: "from-amber-400 via-yellow-500 to-orange-400", emoji: "🪙", playerCount: 3210, description: "Simple heads or tails with a multiplier.", howToPlay: "Choose heads or tails. If the coin lands on your choice, you double your bet." },
  { slug: "hilo", name: "Hi-Lo", category: "cards", bgGradient: "from-indigo-500/30 to-violet-500/20", gradient: "from-indigo-400 via-violet-500 to-purple-500", emoji: "🃏", playerCount: 1890, description: "Predict if the next card is higher or lower.", howToPlay: "You're shown a card. Predict whether the next card will be higher or lower to win." },
  { slug: "aviator", name: "Aviator", category: "crash", bgGradient: "from-purple-500/30 to-pink-500/20", gradient: "from-purple-500 via-pink-500 to-rose-500", emoji: "✈️", playerCount: 3156, description: "Bet and cash out before the plane flies away.", howToPlay: "Place a bet and watch the plane fly. Cash out at any time to collect your multiplied bet.", isPopular: true, isHot: true },
  { slug: "teenpatti", name: "Teen Patti", category: "cards", bgGradient: "from-orange-500/30 to-red-500/20", gradient: "from-orange-400 via-red-500 to-rose-500", emoji: "🃏", playerCount: 2345, description: "Three-card poker variant popular in South Asia.", howToPlay: "Get three cards and bet on who has the best hand. Blind or seen play options available." },
  { slug: "andarbahar", name: "Andar Bahar", category: "cards", bgGradient: "from-teal-500/30 to-cyan-500/20", gradient: "from-teal-400 via-cyan-500 to-blue-400", emoji: "🎯", playerCount: 1890, description: "Classic Indian card game of chance.", howToPlay: "A card is placed in the middle. Bet on whether a matching card appears on the Andar or Bahar side." },
  { slug: "baccarat", name: "Baccarat", category: "cards", bgGradient: "from-emerald-500/30 to-teal-500/20", gradient: "from-emerald-400 via-teal-500 to-cyan-500", emoji: "🃏", playerCount: 2678, description: "Elegant card game of banker vs player.", howToPlay: "Bet on Player, Banker, or Tie. Two hands are dealt and the closest to 9 wins." },
  { slug: "limbo", name: "Limbo", category: "crash", bgGradient: "from-violet-500/30 to-indigo-500/20", gradient: "from-violet-400 via-indigo-500 to-blue-500", emoji: "🚀", playerCount: 1456, description: "Set your target multiplier and test your luck.", howToPlay: "Choose a target multiplier. If the result is at or above your target, you win your bet multiplied." },
];

const CATEGORIES: { key: GameCategory; label: string; icon?: string; gradient?: string }[] = [
  { key: "all", label: "All Games", icon: "🎮", gradient: "from-gold to-orange" },
  { key: "popular", label: "Popular", icon: "🔥", gradient: "from-orange to-rose" },
  { key: "crash", label: "Crash", icon: "📈", gradient: "from-rose to-gold" },
  { key: "cards", label: "Cards", icon: "🃏", gradient: "from-emerald to-cyan" },
  { key: "arcade", label: "Arcade", icon: "🕹️", gradient: "from-purple to-cyan" },
  { key: "dice", label: "Dice", icon: "🎲", gradient: "from-cyan to-purple" },
  { key: "slots", label: "Slots", icon: "🎰", gradient: "from-gold to-purple" },
  { key: "puzzle", label: "Puzzle", icon: "🧩", gradient: "from-purple to-emerald" },
  { key: "live", label: "Live", icon: "🔴", gradient: "from-emerald to-gold" },
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
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-4xl">🎮</span>
          <h1 className="font-[family-name:var(--font-display)] text-4xl font-extrabold tracking-tight">
            <span className="gaming-gradient-text">Casino</span>{" "}
            <span className="text-text-primary">Games</span>
          </h1>
        </div>
        <p className="text-text-secondary text-base max-w-lg">
          Choose from <span className="text-gold font-bold">{GAMES.length}</span> premium games and start playing instantly.
        </p>
      </div>

      {/* Search & Sort */}
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1 group">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted group-focus-within:text-gold transition-colors" />
          <input
            type="text"
            placeholder="Search games..."
            value={searchQuery}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-11 pl-11 pr-4 text-sm rounded-xl bg-surface border border-border text-text-primary placeholder:text-text-muted outline-none focus:border-gold/50 focus:shadow-[0_0_20px_rgba(255,209,92,0.1)] transition-all duration-300"
          />
        </div>

        <div className="relative">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as typeof SORT_OPTIONS[number])}
            className="h-11 px-4 pr-9 text-sm rounded-xl bg-surface border border-border text-text-primary appearance-none cursor-pointer outline-none focus:border-gold/50 transition-all duration-300"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted pointer-events-none" />
        </div>
      </div>

      {/* Category Tabs */}
      <div className="mb-10 flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setCategory(cat.key)}
            className={`whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-bold transition-all duration-300 cursor-pointer flex items-center gap-2 shrink-0 ${
              selectedCategory === cat.key
                ? `bg-gradient-to-r ${cat.gradient} text-canvas shadow-[0_4px_20px_rgba(255,209,92,0.25)] scale-[1.02]`
                : "bg-surface border border-border text-text-secondary hover:text-text-primary hover:border-gold/25 hover:shadow-[0_0_20px_rgba(255,209,92,0.08)]"
            }`}
          >
            <span className="text-base">{cat.icon}</span>
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Games Grid */}
      {filteredGames.length === 0 ? (
        <div className="text-center py-20">
          <span className="text-6xl mb-5 block">🎮</span>
          <p className="text-text-muted text-lg font-medium">No games found.</p>
          <p className="text-text-muted/60 text-sm mt-1">Try a different search or category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {filteredGames.map((game) => (
            <Link key={game.slug} href={`/games/${game.slug}`}>
              <div className="group cursor-pointer rounded-2xl overflow-hidden bg-canvas-card border border-border transition-all duration-[400ms] hover:-translate-y-2 hover:border-gold/25 hover:shadow-[0_20px_50px_rgba(0,0,0,0.5),0_0_40px_rgba(255,209,92,0.08)]">
                {/* Game Cover Art */}
                <div className={`game-cover relative aspect-[4/3] flex items-center justify-center bg-gradient-to-br ${game.bgGradient}`}>
                  <div className={`absolute inset-0 bg-gradient-to-br ${game.gradient} opacity-10 group-hover:opacity-25 transition-opacity duration-500`} />

                  {/* Animated background glow on hover */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className={`absolute inset-0 bg-gradient-to-br ${game.gradient} opacity-[0.07]`} />
                  </div>

                  {/* Emoji Icon */}
                  <span className="text-6xl relative z-10 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 drop-shadow-[0_8px_16px_rgba(0,0,0,0.4)]">
                    {game.emoji}
                  </span>

                  {/* PLAY NOW Overlay */}
                  <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-[2px]">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-b from-[#FFE566] via-[#FFD15C] to-[#E8B820] flex items-center justify-center border-2 border-[#FFE566]/50 shadow-[0_0_30px_rgba(255,209,92,0.5),0_4px_0_0_#B89420,0_6px_0_0_#8B6914,inset_0_2px_0_rgba(255,255,255,0.3)] scale-75 group-hover:scale-100 transition-transform duration-300">
                        <Zap className="h-8 w-8 text-[#1A1200] fill-[#1A1200]" />
                      </div>
                      <div className="bg-gradient-to-b from-[#FFE566] via-[#FFD15C] to-[#E8B820] text-[#1A1200] font-black text-sm uppercase tracking-wider rounded-[8px] px-5 py-2 border-2 border-[#FFE566]/50 shadow-[0_4px_0_0_#B89420,0_6px_0_0_#8B6914,0_6px_20px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.3)]">
                        PLAY NOW
                      </div>
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="absolute top-2.5 right-2.5 z-10 flex flex-col gap-1.5">
                    {game.isHot && (
                      <Badge variant="hot" className="text-[9px] animate-badge-pop">
                        <Flame className="h-2.5 w-2.5" /> HOT
                      </Badge>
                    )}
                    {game.isNew && (
                      <Badge variant="new" className="text-[9px] animate-badge-pop">
                        <Sparkles className="h-2.5 w-2.5" /> NEW
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Card Footer */}
                <div className="p-3.5">
                  <h3 className="text-sm font-extrabold text-text-primary truncate font-[family-name:var(--font-display)]">
                    {game.name}
                  </h3>
                  <div className="mt-2 flex items-center gap-1.5">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald" />
                    </span>
                    <span className="text-xs text-text-muted flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {game.playerCount.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
