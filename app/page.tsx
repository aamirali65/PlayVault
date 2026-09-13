"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Zap,
  Gamepad2,
  Gift,
  Trophy,
  Award,
  Timer,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useUserStore } from "@/store/userStore";
import { formatCoins } from "@/lib/utils";
import Footer from "@/components/layout/footer";

const GAMES = [
  {
    slug: "crash",
    name: "Crash",
    gradient: "from-red-500/20 to-orange-500/20",
    icon: "📈",
    players: 3847,
    category: "crash",
  },
  {
    slug: "dice",
    name: "Dice",
    gradient: "from-blue-500/20 to-purple-500/20",
    icon: "🎲",
    players: 2156,
    category: "dice",
  },
  {
    slug: "roulette",
    name: "Roulette",
    gradient: "from-red-600/20 to-yellow-500/20",
    icon: "🎰",
    players: 4201,
    category: "cards",
  },
  {
    slug: "blackjack",
    name: "Blackjack",
    gradient: "from-green-500/20 to-emerald-500/20",
    icon: "🃏",
    players: 1892,
    category: "cards",
  },
  {
    slug: "mines",
    name: "Mines",
    gradient: "from-yellow-500/20 to-amber-600/20",
    icon: "💣",
    players: 2734,
    category: "dice",
  },
  {
    slug: "aviator",
    name: "Aviator",
    gradient: "from-purple-500/20 to-pink-500/20",
    icon: "✈️",
    players: 3156,
    category: "crash",
  },
];

const LIVE_GAMES = [
  { slug: "crash", name: "Crash", gradient: "from-red-500/20 to-orange-500/20", icon: "📈", players: 4210 },
  { slug: "roulette", name: "Roulette", gradient: "from-red-600/20 to-yellow-500/20", icon: "🎰", players: 3892 },
  { slug: "aviator", name: "Aviator", gradient: "from-purple-500/20 to-pink-500/20", icon: "✈️", players: 2734 },
  { slug: "blackjack", name: "Blackjack", gradient: "from-green-500/20 to-emerald-500/20", icon: "🃏", players: 1956 },
  { slug: "mines", name: "Mines", gradient: "from-yellow-500/20 to-amber-600/20", icon: "💣", players: 3567 },
  { slug: "slots", name: "Slots", gradient: "from-cyan-500/20 to-blue-500/20", icon: "🎰", players: 4890 },
];

const FEATURES = [
  { icon: Zap, title: "Instant Play", desc: "No downloads required. Jump straight into the action." },
  { icon: Gamepad2, title: "Multiple Games", desc: "15+ games across crash, cards, dice, arcade & more." },
  { icon: Gift, title: "Daily Rewards", desc: "Log in daily to earn escalating bonus coins." },
  { icon: Trophy, title: "Leaderboards", desc: "Compete with players worldwide for the top spot." },
  { icon: Award, title: "Achievements", desc: "Unlock badges and track your gaming milestones." },
  { icon: Timer, title: "Fast Gameplay", desc: "Quick rounds mean non-stop entertainment." },
];

const DAILY_REWARDS = [100, 200, 500, 1000, 2000, 3500, 5000];

const STEPS = [
  { num: 1, title: "Create Account", desc: "Sign up in seconds — no credit card needed." },
  { num: 2, title: "Receive Demo Coins", desc: "Start with 10,000 free Demo Coins." },
  { num: 3, title: "Choose a Game", desc: "Pick from 15+ games across multiple categories." },
  { num: 4, title: "Play & Compete", desc: "Climb the leaderboard and unlock achievements." },
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
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-[-20%] left-[-10%] h-[600px] w-[600px] rounded-full bg-accent/10 blur-[120px] animate-pulse" />
          <div className="absolute bottom-[-20%] right-[-10%] h-[500px] w-[500px] rounded-full bg-accent-secondary/10 blur-[120px] animate-pulse" style={{ animationDelay: "1s" }} />
          <div className="absolute top-[30%] left-[40%] h-[300px] w-[300px] rounded-full bg-accent/5 blur-[100px] animate-pulse" style={{ animationDelay: "2s" }} />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 pt-32 pb-24 md:pt-44 md:pb-36">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="max-w-3xl"
          >
            <Badge variant="primary" className="mb-6">
              <Sparkles className="mr-1 h-3 w-3" /> 15+ Games Available
            </Badge>

            <h1 className="font-sora text-4xl font-bold leading-tight tracking-tight md:text-6xl lg:text-7xl">
              Your Playground.{" "}
              <span className="text-accent">Your Games.</span>{" "}
              Your Challenge.
            </h1>

            <p className="mt-6 max-w-xl text-lg text-text-muted md:text-xl">
              Play arcade, cards, crash &amp; competitive games. Compete with
              players worldwide, climb leaderboards, and level up — all with
              virtual Demo Coins.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/games">
                <Button size="lg" className="group">
                  Play Now
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="/games">
                <Button variant="secondary" size="lg">
                  Explore Games
                </Button>
              </Link>
            </div>

            {user && (
              <p className="mt-6 text-sm text-text-muted">
                Welcome back, <span className="text-text-primary">{user.username}</span>. Your balance:{" "}
                <span className="text-accent font-semibold">{formatCoins(user.balance)}</span>
              </p>
            )}
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 md:py-24">
        <motion.div {...fadeInUp(true)} className="mb-10">
          <h2 className="font-sora text-2xl font-bold md:text-3xl">Popular Games</h2>
          <p className="mt-2 text-text-muted">The hottest games our players love right now.</p>
        </motion.div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {GAMES.map((game, i) => (
            <motion.div key={game.slug} {...fadeInUp(i === 0)}>
              <Link href={`/games/${game.slug}`}>
                <Card hover className="group cursor-pointer p-0 overflow-hidden">
                  <div className={`flex aspect-[4/3] items-center justify-center bg-gradient-to-br ${game.gradient}`}>
                    <span className="text-4xl">{game.icon}</span>
                  </div>
                  <div className="p-3">
                    <h3 className="text-sm font-semibold">{game.name}</h3>
                    <div className="mt-1 flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
                      <span className="text-xs text-text-muted">{game.players.toLocaleString()} playing</span>
                    </div>
                    <Badge variant="muted" className="mt-2 text-[10px]">{game.category}</Badge>
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 md:py-24">
        <motion.div {...fadeInUp(true)} className="mb-10">
          <h2 className="font-sora text-2xl font-bold md:text-3xl">Live &amp; Trending</h2>
          <p className="mt-2 text-text-muted">Watch what everyone is playing right now.</p>
        </motion.div>

        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-none">
          {LIVE_GAMES.map((game, i) => (
            <motion.div key={game.slug} {...fadeInUp(i === 0)}>
              <Link href={`/games/${game.slug}`}>
                <Card hover className="group w-64 shrink-0 cursor-pointer p-0 overflow-hidden">
                  <div className={`flex h-36 items-center justify-center bg-gradient-to-br ${game.gradient}`}>
                    <span className="text-5xl transition-transform group-hover:scale-110">{game.icon}</span>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">{game.name}</h3>
                      <span className="flex items-center gap-1.5 text-xs text-success">
                        <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
                        LIVE
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-text-muted">
                      {game.players.toLocaleString()} players online
                    </p>
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 md:py-24">
        <motion.div {...fadeInUp(true)} className="mb-10 text-center">
          <h2 className="font-sora text-2xl font-bold md:text-3xl">Why PlayVault</h2>
          <p className="mt-2 text-text-muted">Everything you need for the ultimate demo gaming experience.</p>
        </motion.div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => (
            <motion.div key={f.title} {...fadeInUp(i === 0)}>
              <Card hover className="h-full">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="font-semibold">{f.title}</h3>
                <p className="mt-1 text-sm text-text-muted">{f.desc}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 md:py-24">
        <motion.div {...fadeInUp(true)} className="mb-10">
          <h2 className="font-sora text-2xl font-bold md:text-3xl">How It Works</h2>
          <p className="mt-2 text-text-muted">Get started in four simple steps.</p>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, i) => (
            <motion.div key={step.num} {...fadeInUp(i === 0)}>
              <Card hover className="h-full text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent text-background font-sora text-lg font-bold">
                  {step.num}
                </div>
                <h3 className="font-semibold">{step.title}</h3>
                <p className="mt-1 text-sm text-text-muted">{step.desc}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 md:py-24">
        <motion.div {...fadeInUp(true)} className="text-center mb-10">
          <h2 className="font-sora text-2xl font-bold md:text-3xl">Daily Rewards</h2>
          <p className="mt-2 text-text-muted">Log in every day and earn escalating rewards.</p>
        </motion.div>

        <motion.div {...fadeInUp(true)}>
          <Card className="mx-auto max-w-3xl">
            <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4">
              {DAILY_REWARDS.map((amount, i) => (
                <div key={i} className="flex flex-col items-center gap-2">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-accent/10 text-accent font-sora text-sm font-bold border border-accent/20">
                    {formatCoins(amount)}
                  </div>
                  <span className="text-xs text-text-muted">Day {i + 1}</span>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}
