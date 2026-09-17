"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Flame, TrendingUp, Sparkles, ArrowRight, Crown, Trophy,
  Star, Zap, Gift, Target, Dices, Rocket, Swords, Gamepad2,
  ChevronRight, Coins, Medal, Timer, Shield, Heart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useUserStore } from "@/store/userStore";
import { formatCoins } from "@/lib/utils";
import Footer from "@/components/layout/footer";

const GAMES = [
  { slug: "crash", name: "Crash", icon: TrendingUp, players: 3847, category: "crash", hot: true, gradient: "from-red-500 via-orange-500 to-yellow-500", emoji: "📈" },
  { slug: "dice", name: "Dice", icon: Dices, players: 2156, category: "dice", hot: false, gradient: "from-blue-500 via-indigo-500 to-purple-500", emoji: "🎲" },
  { slug: "roulette", name: "Roulette", icon: Target, players: 4201, category: "cards", hot: true, gradient: "from-red-600 via-yellow-500 to-green-500", emoji: "🎰" },
  { slug: "blackjack", name: "Blackjack", icon: Crown, players: 1892, category: "cards", hot: false, gradient: "from-green-400 via-emerald-500 to-teal-500", emoji: "🃏" },
  { slug: "mines", name: "Mines", icon: Target, players: 2734, category: "dice", hot: true, gradient: "from-yellow-400 via-amber-500 to-orange-500", emoji: "💣" },
  { slug: "aviator", name: "Aviator", icon: Rocket, players: 3156, category: "crash", hot: true, gradient: "from-purple-500 via-pink-500 to-rose-500", emoji: "✈️" },
  { slug: "slots", name: "Slots", icon: Star, players: 4890, category: "slots", hot: true, gradient: "from-cyan-400 via-blue-500 to-indigo-500", emoji: "🎰" },
  { slug: "plinko", name: "Plinko", icon: Target, players: 1567, category: "arcade", hot: false, gradient: "from-pink-400 via-rose-500 to-red-500", emoji: "📌" },
];

const CATEGORIES = [
  { label: "Popular", icon: Flame, color: "from-orange to-rose", slug: "popular" },
  { label: "Crash", icon: TrendingUp, color: "from-red-500 to-orange", slug: "crash" },
  { label: "Cards", icon: Swords, color: "from-purple to-indigo-600", slug: "cards" },
  { label: "Dice", icon: Dices, color: "from-blue-500 to-cyan", slug: "dice" },
  { label: "Arcade", icon: Gamepad2, color: "from-emerald to-cyan", slug: "arcade" },
  { label: "Slots", icon: Star, color: "from-yellow-400 to-orange", slug: "slots" },
];

const DAILY_REWARDS = [
  { day: 1, amount: 100, icon: "🪙", label: "Coins" },
  { day: 2, amount: 200, icon: "🪙", label: "Coins" },
  { day: 3, amount: 500, icon: "💎", label: "Gems" },
  { day: 4, amount: 1000, icon: "🎁", label: "Mystery" },
  { day: 5, amount: 2000, icon: "🏆", label: "Trophy" },
  { day: 6, amount: 3500, icon: "💎", label: "Gems" },
  { day: 7, amount: 5000, icon: "🎁", label: "Jackpot" },
];

const LEADERBOARD = [
  { rank: 1, name: "LuckyDragon", score: 125800, medal: "🥇" },
  { rank: 2, name: "NeonAce", score: 98400, medal: "🥈" },
  { rank: 3, name: "CoinMaster", score: 87200, medal: "🥉" },
  { rank: 4, name: "PixelKing", score: 72100, medal: "" },
  { rank: 5, name: "StarPlayer", score: 65500, medal: "" },
];

function fadeInUp(initial = false) {
  return {
    initial: initial ? { opacity: 0, y: 30 } : { opacity: 1, y: 0 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-50px" },
    transition: { duration: 0.5, ease: "easeOut" as const },
  };
}

export default function HomePage() {
  const user = useUserStore((s) => s.user);

  return (
    <div className="min-h-screen">
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-5%] left-[5%] h-[500px] w-[500px] rounded-full bg-gold/[0.04] blur-[150px]" />
          <div className="absolute bottom-[0%] right-[5%] h-[400px] w-[400px] rounded-full bg-purple/[0.05] blur-[130px]" />
          <div className="absolute top-[30%] left-[50%] h-[300px] w-[300px] rounded-full bg-cyan/[0.03] blur-[100px]" />
        </div>

        <div className="relative mx-auto max-w-7xl px-5 pt-20 pb-16 md:pt-28 md:pb-24">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            {/* LEFT: Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <Badge variant="gold" className="mb-5">
                <Sparkles className="h-3 w-3" /> 15+ Games Available
              </Badge>

              <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-black leading-[1.05] tracking-tight mb-5">
                <span className="text-text-primary">READY</span>
                <br />
                <span className="text-gold text-glow-gold">TO PLAY?</span>
              </h1>

              <p className="text-lg text-text-secondary max-w-md mb-8 font-semibold leading-relaxed">
                Spin, play, compete and chase your next big win.
                All with virtual Demo Coins — no real money involved.
              </p>

              <div className="flex flex-wrap gap-3">
                <Link href="/games">
                  <Button variant="gold" size="lg" className="group">
                    <Flame className="h-5 w-5" />
                    PLAY NOW
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                <Link href="/games">
                  <Button variant="outline" size="lg">
                    <Gamepad2 className="h-5 w-5" />
                    EXPLORE GAMES
                  </Button>
                </Link>
              </div>

              {user && (
                <div className="mt-6 flex items-center gap-2 text-sm">
                  <span className="text-text-muted font-semibold">Welcome back,</span>
                  <span className="text-gold font-extrabold">{user.username}</span>
                  <span className="text-text-muted font-semibold">— Balance:</span>
                  <span className="text-gold font-extrabold">{formatCoins(user.balance)}</span>
                </div>
              )}
            </motion.div>

            {/* RIGHT: Gaming Visual */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
              className="relative hidden md:flex items-center justify-center"
            >
              <div className="relative w-[420px] h-[420px]">
                {/* Central orb */}
                <div className="absolute inset-[60px] rounded-full bg-gradient-to-br from-gold/20 via-orange/10 to-purple/20 blur-[2px] animate-glow-pulse" />
                <div className="absolute inset-[80px] rounded-full bg-gradient-to-br from-gold/10 to-transparent blur-[30px]" />

                {/* Orbiting elements */}
                <div className="absolute top-[20%] left-[10%] animate-float">
                  <div className="w-20 h-20 rounded-[16px] bg-gradient-to-br from-gold/20 to-orange/10 border border-gold/20 flex items-center justify-center text-4xl shadow-[0_8px_30px_rgba(255,209,92,0.15)] backdrop-blur-sm">
                    🪙
                  </div>
                </div>
                <div className="absolute top-[5%] right-[25%] animate-float" style={{ animationDelay: "0.5s" }}>
                  <div className="w-16 h-16 rounded-[12px] bg-gradient-to-br from-purple/20 to-cyan/10 border border-purple/20 flex items-center justify-center text-3xl shadow-[0_8px_30px_rgba(168,85,247,0.15)] backdrop-blur-sm">
                    🎰
                  </div>
                </div>
                <div className="absolute bottom-[20%] left-[5%] animate-float" style={{ animationDelay: "1s" }}>
                  <div className="w-18 h-18 rounded-[14px] bg-gradient-to-br from-emerald/20 to-cyan/10 border border-emerald/20 flex items-center justify-center text-3xl shadow-[0_8px_30px_rgba(52,211,153,0.15)] backdrop-blur-sm">
                    🃏
                  </div>
                </div>
                <div className="absolute bottom-[10%] right-[10%] animate-float" style={{ animationDelay: "1.5s" }}>
                  <div className="w-22 h-22 rounded-[18px] bg-gradient-to-br from-rose/20 to-orange/10 border border-rose/20 flex items-center justify-center text-4xl shadow-[0_8px_30px_rgba(244,63,94,0.15)] backdrop-blur-sm">
                    🎲
                  </div>
                </div>
                <div className="absolute top-[45%] right-[-5%] animate-float" style={{ animationDelay: "2s" }}>
                  <div className="w-14 h-14 rounded-[10px] bg-gradient-to-br from-yellow-400/20 to-gold/10 border border-yellow-400/20 flex items-center justify-center text-2xl shadow-[0_8px_30px_rgba(234,179,8,0.15)] backdrop-blur-sm">
                    🏆
                  </div>
                </div>

                {/* Center mascot area */}
                <div className="absolute inset-[120px] flex items-center justify-center">
                  <div className="relative">
                    <div className="w-28 h-28 rounded-full bg-gradient-to-br from-gold via-orange to-gold flex items-center justify-center shadow-[0_0_60px_rgba(255,209,92,0.3),0_10px_40px_rgba(0,0,0,0.3)] animate-float-slow">
                      <span className="text-5xl">🎮</span>
                    </div>
                    <div className="absolute -top-2 -right-2 animate-badge-pop">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald to-cyan flex items-center justify-center shadow-[0_3px_10px_rgba(52,211,153,0.4)]">
                        <Crown className="w-4 h-4 text-[#080A12]" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="mx-auto max-w-7xl px-5 py-8">
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/games?category=${cat.slug}`}
              className="flex items-center gap-2.5 px-5 py-3 rounded-[12px] bg-surface border border-border hover:border-gold/30 hover:bg-surface-hover transition-all whitespace-nowrap group cursor-pointer"
            >
              <div className={`w-8 h-8 rounded-[8px] bg-gradient-to-br ${cat.color} flex items-center justify-center shadow-[0_2px_8px_rgba(0,0,0,0.2)]`}>
                <cat.icon className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-bold text-text-secondary group-hover:text-text-primary transition-colors">{cat.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* JACKPOT SECTION */}
      <section className="mx-auto max-w-7xl px-5 py-8">
        <motion.div {...fadeInUp(true)}>
          <div className="relative overflow-hidden rounded-[20px] bg-gradient-to-br from-surface via-canvas-card to-surface border border-gold/20 p-6 md:p-10">
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[200px] w-[600px] bg-gold/[0.06] blur-[80px] rounded-full" />
              <div className="absolute bottom-0 left-[20%] h-[150px] w-[300px] bg-orange/[0.04] blur-[60px] rounded-full" />
            </div>

            <div className="relative flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="text-center md:text-left">
                <div className="flex items-center gap-2 justify-center md:justify-start mb-3">
                  <div className="w-10 h-10 rounded-[10px] bg-gradient-to-br from-gold via-orange to-gold flex items-center justify-center shadow-[0_3px_12px_rgba(255,209,92,0.3)]">
                    <Trophy className="w-5 h-5 text-[#080A12]" />
                  </div>
                  <span className="text-xs font-extrabold text-gold uppercase tracking-widest">THE JACKPOT IS WAITING</span>
                </div>
                <div className="font-display text-5xl md:text-7xl font-black text-gold text-glow-gold tabular-nums mb-2 animate-jackpot">
                  {formatCoins(1245892)}
                </div>
                <p className="text-text-secondary font-semibold">Chase the next big win. Every spin counts.</p>
              </div>

              <div className="flex flex-col items-center gap-4">
                <div className="flex items-center gap-3">
                  <span className="text-4xl animate-float">🪙</span>
                  <span className="text-5xl animate-float" style={{ animationDelay: "0.3s" }}>🏆</span>
                  <span className="text-4xl animate-float" style={{ animationDelay: "0.6s" }}>💎</span>
                </div>
                <Link href="/games">
                  <Button variant="gold" size="lg" className="group">
                    <Zap className="h-5 w-5" />
                    CHASE THE JACKPOT
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* FEATURED GAMES */}
      <section className="mx-auto max-w-7xl px-5 py-12 md:py-16">
        <motion.div {...fadeInUp(true)} className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Flame className="h-6 w-6 text-orange" />
            <h2 className="font-display text-2xl md:text-3xl font-black">WHAT&apos;S HOT?</h2>
          </div>
          <p className="text-text-secondary font-semibold">Jump into the games everyone&apos;s playing.</p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {GAMES.map((game, i) => (
            <motion.div key={game.slug} {...fadeInUp(i === 0)}>
              <Link href={`/games/${game.slug}`}>
                <div className="group cursor-pointer gaming-card">
                  <div className={`relative aspect-[4/3] rounded-t-[15px] bg-gradient-to-br ${game.gradient} overflow-hidden`}>
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-5xl md:text-6xl transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 drop-shadow-lg">{game.emoji}</span>
                    </div>
                    {game.hot && (
                      <div className="absolute top-2.5 right-2.5 animate-badge-pop">
                        <Badge variant="hot" className="text-[9px] shadow-[0_2px_8px_rgba(0,0,0,0.3)]">
                          <Flame className="h-2.5 w-2.5" /> HOT
                        </Badge>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 translate-y-3 group-hover:translate-y-0 transition-all duration-300 z-20">
                      <div className="flex items-center justify-center gap-2 bg-gradient-to-b from-[#FFE566] via-[#FFD15C] to-[#E8B820] text-[#1A1200] font-black text-xs uppercase tracking-wider rounded-[8px] px-3 py-2 border-2 border-[#FFE566]/50 shadow-[0_4px_0_0_#B89420,0_6px_0_0_#8B6914,0_6px_15px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.25)]">
                        <Zap className="h-3.5 w-3.5 fill-current" />
                        PLAY NOW
                      </div>
                    </div>
                  </div>
                  <div className="p-3">
                    <h3 className="text-sm font-extrabold truncate">{game.name}</h3>
                    <div className="mt-1 flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald animate-pulse-dot" />
                      <span className="text-[11px] text-text-muted font-semibold">{game.players.toLocaleString()} playing</span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="mt-6 text-center">
          <Link href="/games">
            <Button variant="secondary" size="md" className="group">
              VIEW ALL GAMES
              <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </section>

      {/* DAILY REWARDS + LEADERBOARD */}
      <section className="mx-auto max-w-7xl px-5 py-12 md:py-16">
        <div className="grid md:grid-cols-2 gap-6">
          {/* DAILY REWARDS */}
          <motion.div {...fadeInUp(true)}>
            <div className="hud-panel p-6 h-full">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 rounded-[10px] bg-gradient-to-br from-emerald to-cyan flex items-center justify-center shadow-[0_3px_10px_rgba(52,211,153,0.3)]">
                  <Gift className="w-5 h-5 text-[#080A12]" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-black">DAILY BONUS</h3>
                  <p className="text-xs text-text-muted font-semibold">Log in daily for bigger rewards</p>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-2 mb-5">
                {DAILY_REWARDS.map((reward, i) => (
                  <div key={i} className={`flex flex-col items-center gap-1.5 p-2 rounded-[10px] transition-all ${
                    i === 0
                      ? "bg-gold/15 border border-gold/30 shadow-[0_0_15px_rgba(255,209,92,0.1)]"
                      : "bg-surface border border-border"
                  }`}>
                    <span className="text-xl">{reward.icon}</span>
                    <span className="text-[10px] font-extrabold text-text-muted">D{reward.day}</span>
                    <span className={`text-[9px] font-black ${i === 0 ? "text-gold" : "text-text-muted"}`}>
                      {formatCoins(reward.amount)}
                    </span>
                  </div>
                ))}
              </div>

              <Button variant="gold" size="md" className="w-full">
                <Gift className="h-4 w-4" />
                CLAIM REWARD
              </Button>
            </div>
          </motion.div>

          {/* LEADERBOARD PREVIEW */}
          <motion.div {...fadeInUp(true)}>
            <div className="hud-panel p-6 h-full">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 rounded-[10px] bg-gradient-to-br from-gold to-orange flex items-center justify-center shadow-[0_3px_10px_rgba(255,209,92,0.3)]">
                  <Trophy className="w-5 h-5 text-[#080A12]" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-black">TOP PLAYERS</h3>
                  <p className="text-xs text-text-muted font-semibold">This week&apos;s leaderboard</p>
                </div>
              </div>

              <div className="space-y-2">
                {LEADERBOARD.map((entry, i) => (
                  <div
                    key={entry.rank}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-[10px] transition-all ${
                      i < 3 ? "bg-gold/[0.05] border border-gold/10" : "bg-surface border border-border"
                    }`}
                  >
                    <span className={`w-7 text-center font-display font-black text-sm ${
                      i === 0 ? "text-gold" : i === 1 ? "text-[#C0C0C0]" : i === 2 ? "text-[#CD7F32]" : "text-text-muted"
                    }`}>
                      {entry.medal || `#${entry.rank}`}
                    </span>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple/30 to-cyan/30 flex items-center justify-center border border-border">
                      <span className="text-xs font-bold">{entry.name[0]}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-sm font-bold truncate block">{entry.name}</span>
                    </div>
                    <span className="text-sm font-extrabold tabular-nums text-gold font-[family-name:var(--font-space)]">
                      {entry.score.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              <Link href="/leaderboard" className="block mt-4">
                <Button variant="ghost" size="sm" className="w-full group">
                  VIEW FULL LEADERBOARD
                  <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* REWARDS PROGRESSION */}
      <section className="mx-auto max-w-7xl px-5 py-12 md:py-16">
        <motion.div {...fadeInUp(true)}>
          <div className="hud-panel p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <Medal className="h-6 w-6 text-gold" />
                  <h2 className="font-display text-2xl font-black">PLAY. LEVEL UP. GET REWARDED.</h2>
                </div>
                <p className="text-text-secondary font-semibold">Earn XP by playing games and climbing levels.</p>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-[10px] bg-gold/10 border border-gold/20">
                <span className="text-xs font-extrabold text-gold uppercase tracking-wider">LEVEL</span>
                <span className="font-display text-2xl font-black text-gold">12</span>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-text-secondary">Progress to Level 13</span>
                <span className="text-sm font-extrabold text-gold tabular-nums">8,450 / 10,000 XP</span>
              </div>
              <div className="h-4 w-full rounded-full bg-surface border border-border overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: "84.5%" }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
                  className="h-full rounded-full bg-gradient-to-r from-gold via-gold-bright to-gold relative"
                >
                  <div className="absolute inset-0 shimmer-bg rounded-full" />
                </motion.div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { icon: "🪙", label: "Coins Earned", value: "24,800", color: "from-gold/15 to-orange/10" },
                { icon: "💎", label: "Gems Collected", value: "156", color: "from-cyan/15 to-purple/10" },
                { icon: "🎁", label: "Mystery Boxes", value: "8", color: "from-purple/15 to-pink/10" },
                { icon: "🏆", label: "Achievements", value: "23/50", color: "from-emerald/15 to-cyan/10" },
              ].map((item) => (
                <div key={item.label} className={`rounded-[12px] bg-gradient-to-br ${item.color} border border-border p-4 text-center`}>
                  <span className="text-2xl block mb-2">{item.icon}</span>
                  <div className="font-display text-xl font-black text-text-primary">{item.value}</div>
                  <div className="text-[11px] font-bold text-text-muted uppercase tracking-wider mt-1">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* HOW IT WORKS */}
      <section className="mx-auto max-w-7xl px-5 py-12 md:py-16">
        <motion.div {...fadeInUp(true)} className="text-center mb-10">
          <h2 className="font-display text-2xl md:text-3xl font-black mb-2">LET&apos;S PLAY</h2>
          <p className="text-text-secondary font-semibold">Get started in four simple steps.</p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { num: "01", title: "CREATE ACCOUNT", desc: "Sign up in seconds", icon: Shield, color: "from-gold to-orange" },
            { num: "02", title: "GET COINS", desc: "Start with 10,000 free", icon: Coins, color: "from-emerald to-cyan" },
            { num: "03", title: "CHOOSE A GAME", desc: "15+ games await", icon: Gamepad2, color: "from-purple to-pink" },
            { num: "04", title: "PLAY & WIN", desc: "Climb the ranks", icon: Trophy, color: "from-cyan to-blue-500" },
          ].map((step, i) => (
            <motion.div key={step.num} {...fadeInUp(i === 0)}>
              <div className="hud-panel p-5 text-center h-full">
                <div className={`w-12 h-12 rounded-[12px] bg-gradient-to-br ${step.color} flex items-center justify-center mx-auto mb-3 shadow-[0_4px_12px_rgba(0,0,0,0.3)]`}>
                  <step.icon className="w-6 h-6 text-[#080A12]" />
                </div>
                <div className="font-display text-xs font-black text-text-muted tracking-widest mb-1">STEP {step.num}</div>
                <h3 className="font-display text-sm font-black mb-1">{step.title}</h3>
                <p className="text-xs text-text-muted font-semibold">{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-5 py-12 md:py-16">
        <motion.div {...fadeInUp(true)}>
          <div className="relative overflow-hidden rounded-[20px] bg-gradient-to-br from-surface via-canvas-card to-surface border border-border p-8 md:p-12 text-center">
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-[-50%] left-1/2 -translate-x-1/2 h-[400px] w-[800px] bg-gold/[0.04] blur-[100px] rounded-full" />
            </div>
            <div className="relative z-10">
              <Crown className="h-12 w-12 text-gold mx-auto mb-4 animate-float text-glow-gold" />
              <h2 className="font-display text-3xl md:text-4xl font-black mb-3">
                YOUR LUCKY MOMENT
              </h2>
              <p className="text-text-secondary max-w-lg mx-auto mb-8 font-semibold">
                Join thousands of players. Start with 10,000 free Demo Coins and chase your next big win.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Link href="/register">
                  <Button variant="gold" size="xl" className="group">
                    <Sparkles className="h-5 w-5" />
                    GET STARTED FREE
                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                <Link href="/games">
                  <Button variant="ghost" size="lg" className="text-text-secondary hover:text-gold">
                    BROWSE GAMES
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}
