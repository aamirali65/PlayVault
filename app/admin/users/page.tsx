"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Card } from "@/components/ui/card";
import { formatCoins, formatNumber } from "@/lib/utils";

const USERS = [
  { username: "ShadowKing", email: "shadow@demo.com", balance: 25000, gamesPlayed: 1247, joinedAt: "2024-01-15" },
  { username: "NeonViper", email: "neon@demo.com", balance: 18500, gamesPlayed: 983, joinedAt: "2024-02-20" },
  { username: "PixelMaster", email: "pixel@demo.com", balance: 32100, gamesPlayed: 1562, joinedAt: "2024-01-05" },
  { username: "CyberWolf", email: "cyber@demo.com", balance: 8900, gamesPlayed: 456, joinedAt: "2024-03-10" },
  { username: "BlazeRunner", email: "blaze@demo.com", balance: 15600, gamesPlayed: 789, joinedAt: "2024-02-28" },
  { username: "ThunderFox", email: "thunder@demo.com", balance: 42000, gamesPlayed: 2103, joinedAt: "2024-01-01" },
  { username: "IronGamer", email: "iron@demo.com", balance: 5200, gamesPlayed: 312, joinedAt: "2024-04-15" },
  { username: "StormBreaker", email: "storm@demo.com", balance: 21000, gamesPlayed: 1100, joinedAt: "2024-02-12" },
  { username: "NightHawk", email: "night@demo.com", balance: 12300, gamesPlayed: 645, joinedAt: "2024-03-22" },
  { username: "VoltStrike", email: "volt@demo.com", balance: 9800, gamesPlayed: 534, joinedAt: "2024-04-01" },
];

export default function AdminUsersPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:py-12">
      <div className="mb-8 flex items-center gap-3">
        <Link href="/admin" className="text-text-muted hover:text-text-primary transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="font-sora text-3xl font-bold">Users</h1>
          <p className="text-text-muted">Manage platform users</p>
        </div>
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="border-b border-border">
                <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-muted">Username</th>
                <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-muted">Email</th>
                <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-muted">Balance</th>
                <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-muted">Games Played</th>
                <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-muted">Joined</th>
              </tr>
            </thead>
            <tbody>
              {USERS.map((u) => (
                <tr key={u.username} className="border-b border-border/50 hover:bg-white/[0.02]">
                  <td className="px-5 py-3 text-sm font-medium text-text-primary">{u.username}</td>
                  <td className="px-5 py-3 text-sm text-text-muted">{u.email}</td>
                  <td className="px-5 py-3 text-sm text-accent font-medium">{formatCoins(u.balance)}</td>
                  <td className="px-5 py-3 text-sm text-text-primary">{formatNumber(u.gamesPlayed)}</td>
                  <td className="px-5 py-3 text-sm text-text-muted">{u.joinedAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
