"use client";

import { useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard, Users, Gamepad2, Swords, Gift, BarChart3, Settings, ArrowLeft,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { formatNumber } from "@/lib/utils";

const NAV_ITEMS = [
  { id: "overview", label: "Overview", icon: LayoutDashboard, href: "/admin" },
  { id: "users", label: "Users", icon: Users, href: "/admin/users" },
  { id: "games", label: "Games", icon: Gamepad2, href: "/admin/games" },
  { id: "tournaments", label: "Tournaments", icon: Swords, href: "/admin/tournaments" },
  { id: "rewards", label: "Rewards", icon: Gift, href: "/admin/rewards" },
  { id: "analytics", label: "Analytics", icon: BarChart3, href: "/admin/analytics" },
  { id: "settings", label: "Settings", icon: Settings, href: "/admin/settings" },
];

const STATS = [
  { label: "Total Users", value: 1247, color: "text-accent" },
  { label: "Games Played", value: 45892, color: "text-success" },
  { label: "Revenue", value: 0, suffix: " DEMO", color: "text-text-primary" },
  { label: "Active Players", value: 89, color: "text-accent" },
];

const CHART_DATA = [
  { label: "Mon", value: 320 },
  { label: "Tue", value: 450 },
  { label: "Wed", value: 380 },
  { label: "Thu", value: 520 },
  { label: "Fri", value: 610 },
  { label: "Sat", value: 780 },
  { label: "Sun", value: 650 },
];

const maxBar = Math.max(...CHART_DATA.map((d) => d.value));

export default function AdminPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:py-12">
      <div className="mb-8 flex items-center gap-3">
        <Link href="/" className="text-text-muted hover:text-text-primary transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="font-sora text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-text-muted">Manage your PlayVault platform</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STATS.map((stat) => (
          <Card key={stat.label}>
            <span className="text-xs font-medium uppercase tracking-wider text-text-muted">
              {stat.label}
            </span>
            <p className={`mt-2 text-2xl font-bold ${stat.color}`}>
              {formatNumber(stat.value)}{stat.suffix || ""}
            </p>
          </Card>
        ))}
      </div>

      <Card className="mt-6">
        <h3 className="mb-4 text-sm font-medium uppercase tracking-wider text-text-muted">
          Weekly Activity
        </h3>
        <div className="flex items-end gap-3 h-48">
          {CHART_DATA.map((d) => (
            <div key={d.label} className="flex flex-1 flex-col items-center gap-2">
              <div className="w-full flex justify-center">
                <div
                  className="w-full max-w-[48px] rounded-t-lg bg-accent/20 transition-all duration-500"
                  style={{ height: `${(d.value / maxBar) * 140}px` }}
                />
              </div>
              <span className="text-xs text-text-muted">{d.label}</span>
            </div>
          ))}
        </div>
      </Card>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <Card>
          <h3 className="mb-3 text-sm font-medium uppercase tracking-wider text-text-muted">
            Recent Activity
          </h3>
          <div className="space-y-3">
            {[
              { text: "ShadowKing played Crash", time: "2m ago" },
              { text: "New user registered: NeonViper", time: "5m ago" },
              { text: "Tournament started: Weekend Challenge", time: "12m ago" },
              { text: "Daily reward claimed by PixelMaster", time: "18m ago" },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <span className="text-text-primary">{item.text}</span>
                <span className="text-xs text-text-muted">{item.time}</span>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <h3 className="mb-3 text-sm font-medium uppercase tracking-wider text-text-muted">
            Quick Links
          </h3>
          <div className="space-y-2">
            {NAV_ITEMS.slice(1).map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-text-muted hover:bg-white/5 hover:text-text-primary transition-colors"
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
