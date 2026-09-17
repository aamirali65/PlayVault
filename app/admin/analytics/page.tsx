"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Card } from "@/components/ui/card";

const DAILY_DATA = [
  { day: "Mon", games: 320, revenue: 0 },
  { day: "Tue", games: 450, revenue: 0 },
  { day: "Wed", games: 380, revenue: 0 },
  { day: "Thu", games: 520, revenue: 0 },
  { day: "Fri", games: 610, revenue: 0 },
  { day: "Sat", games: 780, revenue: 0 },
  { day: "Sun", games: 650, revenue: 0 },
];

const WEEKLY_DATA = [
  { week: "Week 1", games: 2800, revenue: 0 },
  { week: "Week 2", games: 3200, revenue: 0 },
  { week: "Week 3", games: 2950, revenue: 0 },
  { week: "Week 4", games: 3600, revenue: 0 },
];

const maxDaily = Math.max(...DAILY_DATA.map((d) => d.games));
const maxWeekly = Math.max(...WEEKLY_DATA.map((d) => d.games));

export default function AdminAnalyticsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:py-12">
      <div className="mb-8 flex items-center gap-3">
        <Link href="/admin" className="text-text-muted hover:text-text-primary transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="font-display text-3xl font-bold">Analytics</h1>
          <p className="text-text-muted">Platform performance metrics</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <h3 className="mb-4 text-sm font-medium uppercase tracking-wider text-text-muted">
            Daily Games Played
          </h3>
          <div className="flex items-end gap-3 h-40">
            {DAILY_DATA.map((d) => (
              <div key={d.day} className="flex flex-1 flex-col items-center gap-2">
                <div className="w-full flex justify-center">
                  <div
                    className="w-full max-w-[40px] rounded-t-lg bg-gold/20"
                    style={{ height: `${(d.games / maxDaily) * 120}px` }}
                  />
                </div>
                <span className="text-xs text-text-muted">{d.day}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="mb-4 text-sm font-medium uppercase tracking-wider text-text-muted">
            Weekly Games Played
          </h3>
          <div className="flex items-end gap-3 h-40">
            {WEEKLY_DATA.map((d) => (
              <div key={d.week} className="flex flex-1 flex-col items-center gap-2">
                <div className="w-full flex justify-center">
                  <div
                    className="w-full max-w-[40px] rounded-t-lg bg-success/20"
                    style={{ height: `${(d.games / maxWeekly) * 120}px` }}
                  />
                </div>
                <span className="text-xs text-text-muted">{d.week}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="mt-6">
        <h3 className="mb-4 text-sm font-medium uppercase tracking-wider text-text-muted">
          Top Games by Players
        </h3>
        <div className="space-y-3">
          {[
            { name: "Slots", players: 4890, pct: 100 },
            { name: "Roulette", players: 4201, pct: 86 },
            { name: "Crash", players: 3847, pct: 79 },
            { name: "Coin Flip", players: 3210, pct: 66 },
            { name: "Aviator", players: 3156, pct: 65 },
          ].map((g) => (
            <div key={g.name} className="flex items-center gap-4">
              <span className="w-24 text-sm text-text-primary">{g.name}</span>
              <div className="flex-1">
                <div className="h-2 rounded-full bg-white/5">
                  <div
                    className="h-full rounded-full bg-gold/30"
                    style={{ width: `${g.pct}%` }}
                  />
                </div>
              </div>
              <span className="w-16 text-right text-xs text-text-muted">
                {g.players.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
