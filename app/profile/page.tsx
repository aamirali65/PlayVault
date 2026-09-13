"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  TrendingUp,
  Clock,
  Medal,
  Settings,
  RotateCcw,
  Award,
  Trophy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/toast";
import { useUserStore } from "@/store/userStore";
import { formatCoins, formatDate, formatNumber } from "@/lib/utils";

type ProfileTab = "overview" | "history" | "achievements" | "settings";

const ALL_ACHIEVEMENTS = [
  { id: "first-win", name: "First Win", desc: "Win your first game", icon: "🏆", max: 1 },
  { id: "ten-wins", name: "On a Roll", desc: "Win 10 games", icon: "🔥", max: 10 },
  { id: "fifty-games", name: "Regular Player", desc: "Play 50 games", icon: "🎮", max: 50 },
  { id: "hundred-games", name: "Dedicated", desc: "Play 100 games", icon: "⭐", max: 100 },
  { id: "high-roller", name: "High Roller", desc: "Bet 1,000+ in a single game", icon: "💎", max: 1 },
  { id: "big-winner", name: "Big Winner", desc: "Win 10,000+ in a single game", icon: "👑", max: 1 },
  { id: "streak-5", name: "Winning Streak", desc: "Win 5 games in a row", icon: "⚡", max: 5 },
  { id: "all-games", name: "Explorer", desc: "Play all game types", icon: "🗺️", max: 15 },
  { id: "level-5", name: "Rising Star", desc: "Reach Level 5", icon: "🌟", max: 5 },
  { id: "level-10", name: "Veteran", desc: "Reach Level 10", icon: "🎖️", max: 10 },
];

export default function ProfilePage() {
  const { toast } = useToast();
  const user = useUserStore((s) => s.user);
  const resetBalance = useUserStore((s) => s.resetBalance);
  const [tab, setTab] = useState<ProfileTab>("overview");

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card className="text-center p-8">
          <p className="text-text-muted mb-4">You need to be logged in to view your profile.</p>
          <Link href="/login">
            <Button>Sign In</Button>
          </Link>
        </Card>
      </div>
    );
  }

  const winRate = user.gamesPlayed > 0 ? Math.round((user.wins / user.gamesPlayed) * 100) : 0;
  const xpForNextLevel = (user.level) * 500;
  const xpProgress = (user.xp / xpForNextLevel) * 100;

  const initials = user.username.slice(0, 2).toUpperCase();

  const unlockedAchievements = useMemo(() => {
    const unlocked = new Set(user.achievements.map((a) => a.id));
    return ALL_ACHIEVEMENTS.map((a) => ({
      ...a,
      progress: unlocked.has(a.id) ? a.max : 0,
      unlocked: unlocked.has(a.id),
    }));
  }, [user.achievements]);

  const tabs: { key: ProfileTab; label: string; icon: typeof Trophy }[] = [
    { key: "overview", label: "Overview", icon: TrendingUp },
    { key: "history", label: "Game History", icon: Clock },
    { key: "achievements", label: "Achievements", icon: Award },
    { key: "settings", label: "Settings", icon: Settings },
  ];

  const handleResetBalance = () => {
    resetBalance();
    toast("Demo balance reset to 10,000 DEMO.", "success");
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 md:py-12">
      <Card className="mb-6 p-6">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-accent to-accent-secondary text-background font-sora text-2xl font-bold">
            {initials}
          </div>
          <div className="text-center sm:text-left flex-1">
            <h1 className="font-sora text-2xl font-bold">{user.username}</h1>
            <p className="text-sm text-text-muted">{user.email}</p>
            <div className="mt-2 flex flex-wrap items-center gap-3 justify-center sm:justify-start">
              <Badge variant="primary">Level {user.level}</Badge>
              <Badge variant="muted">{formatCoins(user.balance)}</Badge>
              <span className="text-xs text-text-muted">
                {user.xp}/{xpForNextLevel} XP
              </span>
            </div>
          </div>
        </div>

        <div className="mt-4 h-2 rounded-full bg-border overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-accent to-accent-secondary transition-all duration-500"
            style={{ width: `${Math.min(xpProgress, 100)}%` }}
          />
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 mb-6">
        <Card className="text-center p-4">
          <div className="text-2xl font-bold text-accent">{formatNumber(user.gamesPlayed)}</div>
          <div className="text-xs text-text-muted mt-1">Games Played</div>
        </Card>
        <Card className="text-center p-4">
          <div className="text-2xl font-bold text-success">{formatNumber(user.wins)}</div>
          <div className="text-xs text-text-muted mt-1">Wins</div>
        </Card>
        <Card className="text-center p-4">
          <div className="text-2xl font-bold text-danger">{formatNumber(user.losses)}</div>
          <div className="text-xs text-text-muted mt-1">Losses</div>
        </Card>
        <Card className="text-center p-4">
          <div className="text-2xl font-bold text-text-primary">{winRate}%</div>
          <div className="text-xs text-text-muted mt-1">Win Rate</div>
        </Card>
      </div>

      <div className="flex gap-1 mb-6 overflow-x-auto pb-1 border-b border-border">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-t-lg transition-colors whitespace-nowrap cursor-pointer ${
              tab === t.key
                ? "bg-surface text-accent border border-border border-b-transparent -mb-px"
                : "text-text-muted hover:text-text-primary hover:bg-surface/50"
            }`}
          >
            <t.icon className="h-4 w-4" />
            {t.label}
          </button>
        ))}
      </div>

      {tab === "overview" && (
        <div className="space-y-6">
          <Card>
            <h3 className="font-sora font-semibold mb-3">Account Summary</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-text-muted">Member Since</span>
                <p className="font-medium">{formatDate(user.joinedAt)}</p>
              </div>
              <div>
                <span className="text-text-muted">Last Login</span>
                <p className="font-medium">{formatDate(user.lastLogin)}</p>
              </div>
              <div>
                <span className="text-text-muted">Current Level</span>
                <p className="font-medium">Level {user.level}</p>
              </div>
              <div>
                <span className="text-text-muted">Total XP</span>
                <p className="font-medium">{user.xp}</p>
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="font-sora font-semibold mb-3">Recent Games</h3>
            {user.gameHistory.length === 0 ? (
              <p className="text-sm text-text-muted">No games played yet.</p>
            ) : (
              <div className="space-y-2">
                {user.gameHistory.slice(0, 5).map((entry) => (
                  <div key={entry.id} className="flex items-center justify-between rounded-lg bg-background p-3">
                    <div className="flex items-center gap-3">
                      <span className={`text-lg ${entry.result === "win" ? "text-success" : "text-danger"}`}>
                        {entry.result === "win" ? "🏆" : "💀"}
                      </span>
                      <div>
                        <p className="text-sm font-medium">{entry.gameName}</p>
                        <p className="text-xs text-text-muted">{formatDate(entry.playedAt)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-semibold ${entry.result === "win" ? "text-success" : "text-danger"}`}>
                        {entry.result === "win" ? "+" : "-"}{Math.abs(entry.payout - entry.bet)}
                      </p>
                      <p className="text-xs text-text-muted">Bet: {entry.bet}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      )}

      {tab === "history" && (
        <Card>
          {user.gameHistory.length === 0 ? (
            <div className="text-center py-8">
              <Clock className="mx-auto h-12 w-12 text-text-muted/40 mb-3" />
              <p className="text-text-muted">No game history yet.</p>
              <Link href="/games">
                <Button className="mt-4" size="sm">Play a Game</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {user.gameHistory.map((entry) => (
                <div key={entry.id} className="flex items-center justify-between rounded-lg bg-background p-3">
                  <div className="flex items-center gap-3">
                    <span className={`text-lg ${entry.result === "win" ? "text-success" : "text-danger"}`}>
                      {entry.result === "win" ? "🏆" : "💀"}
                    </span>
                    <div>
                      <p className="text-sm font-medium">{entry.gameName}</p>
                      <p className="text-xs text-text-muted">{formatDate(entry.playedAt)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant={entry.result === "win" ? "success" : "danger"}>
                      {entry.result === "win" ? "WIN" : "LOSS"}
                    </Badge>
                    <p className="text-xs text-text-muted mt-1">
                      Bet: {entry.bet} | Payout: {entry.payout}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      {tab === "achievements" && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {unlockedAchievements.map((a) => (
            <Card key={a.id} className={`p-4 ${a.unlocked ? "" : "opacity-50"}`}>
              <div className="flex items-start gap-3">
                <span className="text-2xl">{a.icon}</span>
                <div className="flex-1">
                  <h4 className="text-sm font-semibold">{a.name}</h4>
                  <p className="text-xs text-text-muted">{a.desc}</p>
                  <div className="mt-2 h-1.5 rounded-full bg-border overflow-hidden">
                    <div
                      className="h-full rounded-full bg-accent transition-all duration-500"
                      style={{ width: `${(a.progress / a.max) * 100}%` }}
                    />
                  </div>
                  <p className="mt-1 text-[10px] text-text-muted">
                    {a.progress}/{a.max}
                  </p>
                </div>
                {a.unlocked && (
                  <Medal className="h-5 w-5 text-accent shrink-0" />
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {tab === "settings" && (
        <Card>
          <h3 className="font-sora font-semibold mb-4">Settings</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-lg bg-background p-4">
              <div>
                <p className="text-sm font-medium">Reset Demo Balance</p>
                <p className="text-xs text-text-muted">Reset your balance back to 10,000 DEMO Coins.</p>
              </div>
              <Button variant="danger" size="sm" onClick={handleResetBalance}>
                <RotateCcw className="h-4 w-4" />
                Reset
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
