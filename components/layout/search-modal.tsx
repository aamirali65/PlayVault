"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, X, Gamepad2, Trophy, Radio, Swords, Gift, BarChart3 } from "lucide-react";

interface SearchResult {
  id: string;
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
}

const PAGES: SearchResult[] = [
  { id: "games", title: "Games", description: "Browse all games", href: "/games", icon: <Gamepad2 className="h-4 w-4" /> },
  { id: "live", title: "Live Now", description: "See who is playing", href: "/live", icon: <Radio className="h-4 w-4" /> },
  { id: "leaderboard", title: "Leaderboard", description: "Top players", href: "/leaderboard", icon: <Trophy className="h-4 w-4" /> },
  { id: "tournaments", title: "Tournaments", description: "Compete for prizes", href: "/tournaments", icon: <Swords className="h-4 w-4" /> },
  { id: "rewards", title: "Daily Rewards", description: "Claim daily bonuses", href: "/rewards", icon: <Gift className="h-4 w-4" /> },
  { id: "promotions", title: "Promotions", description: "Exclusive offers", href: "/promotions", icon: <BarChart3 className="h-4 w-4" /> },
];

const GAMES: SearchResult[] = [
  { id: "crash", title: "Crash", description: "Crash game", href: "/games/crash", icon: <span className="text-sm">📈</span> },
  { id: "dice", title: "Dice", description: "Dice game", href: "/games/dice", icon: <span className="text-sm">🎲</span> },
  { id: "roulette", title: "Roulette", description: "Card game", href: "/games/roulette", icon: <span className="text-sm">🎰</span> },
  { id: "blackjack", title: "Blackjack", description: "Card game", href: "/games/blackjack", icon: <span className="text-sm">🃏</span> },
  { id: "snake", title: "Snake", description: "Arcade game", href: "/games/snake", icon: <span className="text-sm">🐍</span> },
  { id: "slots", title: "Slots", description: "Slot machine", href: "/games/slots", icon: <span className="text-sm">🎰</span> },
  { id: "mines", title: "Mines", description: "Minesweeper style", href: "/games/mines", icon: <span className="text-sm">💣</span> },
  { id: "plinko", title: "Plinko", description: "Arcade game", href: "/games/plinko", icon: <span className="text-sm">📌</span> },
  { id: "coinflip", title: "Coin Flip", description: "Heads or tails", href: "/games/coinflip", icon: <span className="text-sm">🪙</span> },
  { id: "hilo", title: "Hi-Lo", description: "Card game", href: "/games/hilo", icon: <span className="text-sm">🃏</span> },
  { id: "aviator", title: "Aviator", description: "Crash game", href: "/games/aviator", icon: <span className="text-sm">✈️</span> },
  { id: "teenpatti", title: "Teen Patti", description: "Card game", href: "/games/teenpatti", icon: <span className="text-sm">🃏</span> },
  { id: "andarbahar", title: "Andar Bahar", description: "Card game", href: "/games/andarbahar", icon: <span className="text-sm">🎯</span> },
  { id: "baccarat", title: "Baccarat", description: "Card game", href: "/games/baccarat", icon: <span className="text-sm">🃏</span> },
  { id: "limbo", title: "Limbo", description: "Crash game", href: "/games/limbo", icon: <span className="text-sm">🚀</span> },
];

const ALL_ITEMS = [...PAGES, ...GAMES];

export function SearchModal() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const results = query.length > 0
    ? ALL_ITEMS.filter(
        (item) =>
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.description.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const handleSelect = useCallback((href: string) => {
    setOpen(false);
    setQuery("");
    router.push(href);
  }, [router]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100);
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-start justify-center pt-[15vh]">
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setOpen(false)} />
      <div className="relative z-10 w-full max-w-lg mx-4 animate-scale-in">
        <div className="rounded-[16px] bg-canvas-card border border-border overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.6)]">
          <div className="flex items-center gap-3 border-b border-border px-4">
            <Search className="h-5 w-5 text-gold shrink-0" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search games, pages..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="h-12 flex-1 bg-transparent text-sm text-text-primary font-semibold outline-none placeholder:text-text-muted"
            />
            <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-[4px] bg-surface text-[10px] text-text-muted font-mono border border-border">
              ESC
            </kbd>
            <button
              onClick={() => setOpen(false)}
              className="text-text-muted hover:text-gold transition-colors cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {results.length > 0 && (
            <div className="max-h-80 overflow-y-auto p-2">
              {results.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item.href)}
                  className="flex w-full items-center gap-3 rounded-[10px] px-3 py-2.5 text-left text-sm transition-all hover:bg-gold/5 cursor-pointer group"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px] bg-surface text-text-muted group-hover:bg-gold/10 group-hover:text-gold transition-all">
                    {item.icon}
                  </span>
                  <div className="flex-1 min-w-0">
                    <span className="font-bold text-text-primary group-hover:text-gold transition-colors">{item.title}</span>
                    <span className="ml-2 text-xs text-text-muted">{item.description}</span>
                  </div>
                </button>
              ))}
            </div>
          )}

          {query.length > 0 && results.length === 0 && (
            <div className="px-4 py-10 text-center">
              <span className="text-3xl block mb-2">🎮</span>
              <p className="text-sm text-text-muted font-semibold">No results for &quot;{query}&quot;</p>
            </div>
          )}

          {query.length === 0 && (
            <div className="px-4 py-4 text-center text-xs text-text-muted font-semibold">
              Start typing to search...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
