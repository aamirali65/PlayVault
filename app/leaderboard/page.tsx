"use client";

import { useState } from "react";
import { Trophy, ArrowUp, ArrowDown, Minus, Crown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs } from "@/components/ui/tabs";
import { useUserStore } from "@/store/userStore";
import { formatNumber } from "@/lib/utils";

interface Player {
  rank: number;
  username: string;
  level: number;
  gamesPlayed: number;
  wins: number;
  rankChange: number;
}

const PLAYER_NAMES = [
  "ShadowKing", "NeonViper", "PixelMaster", "CyberWolf", "BlazeRunner",
  "ThunderFox", "IronGamer", "StormBreaker", "NightHawk", "VoltStrike",
  "DragonPulse", "FrostByte", "TurboNinja", "CosmicRay", "RogueAgent",
  "WildCard", "SilentEdge", "NovaStar", "ZenBlade", "PhantomX",
];

function generatePlayers(): Player[] {
  return PLAYER_NAMES.map((name, i) => ({
    rank: i + 1,
    username: name,
    level: Math.floor(Math.random() * 50) + 5,
    gamesPlayed: Math.floor(Math.random() * 2000) + 100,
    wins: 0,
    rankChange: Math.floor(Math.random() * 5) - 2,
  })).map((p) => ({
    ...p,
    wins: Math.floor(p.gamesPlayed * (0.3 + Math.random() * 0.3)),
  })).sort((a, b) => b.wins - a.wins).map((p, i) => ({
    ...p,
    rank: i + 1,
  }));
}

const ALL_TIME = generatePlayers();
const WEEKLY = generatePlayers().slice(0, 15);
const DAILY = generatePlayers().slice(0, 10);
const MONTHLY = generatePlayers().slice(0, 18);

function LeaderboardTable({ players }: { players: Player[] }) {
  const user = useUserStore((s) => s.user);

  function getRankStyle(rank: number) {
    if (rank === 1) return "bg-[#FFD700]/10 border-[#FFD700]/30";
    if (rank === 2) return "bg-[#C0C0C0]/10 border-[#C0C0C0]/30";
    if (rank === 3) return "bg-[#CD7F32]/10 border-[#CD7F32]/30";
    return "";
  }

  function getRankIcon(rank: number) {
    if (rank === 1) return <Crown className="h-4 w-4 text-[#FFD700]" />;
    if (rank === 2) return <span className="text-sm font-bold text-[#C0C0C0]">2</span>;
    if (rank === 3) return <span className="text-sm font-bold text-[#CD7F32]">3</span>;
    return <span className="text-sm text-text-muted">#{rank}</span>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[600px]">
        <thead>
          <tr className="border-b border-border">
            <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-text-muted">
              Rank
            </th>
            <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-text-muted">
              Player
            </th>
            <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-text-muted">
              Level
            </th>
            <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-text-muted">
              Games
            </th>
            <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-text-muted">
              Wins
            </th>
            <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-text-muted">
              Win Rate
            </th>
          </tr>
        </thead>
        <tbody>
          {players.map((player) => {
            const isCurrentUser = user?.username === player.username;
            const winRate = player.gamesPlayed > 0
              ? ((player.wins / player.gamesPlayed) * 100).toFixed(1)
              : "0.0";

            return (
              <tr
                key={player.username}
                className={`border-b border-border/50 transition-colors ${
                  isCurrentUser ? "bg-accent/5" : "hover:bg-white/[0.02]"
                } ${getRankStyle(player.rank)}`}
              >
                <td className="py-3">
                  <div className="flex items-center gap-2">
                    {getRankIcon(player.rank)}
                    <span className="flex items-center">
                      {player.rankChange > 0 && (
                        <ArrowUp className="h-3 w-3 text-success" />
                      )}
                      {player.rankChange < 0 && (
                        <ArrowDown className="h-3 w-3 text-danger" />
                      )}
                      {player.rankChange === 0 && (
                        <Minus className="h-3 w-3 text-text-muted" />
                      )}
                    </span>
                  </div>
                </td>
                <td className="py-3">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface text-sm font-bold">
                      {player.username[0]}
                    </div>
                    <span className={`text-sm font-medium ${isCurrentUser ? "text-accent" : "text-text-primary"}`}>
                      {player.username}
                      {isCurrentUser && <span className="ml-1 text-xs text-accent">(You)</span>}
                    </span>
                  </div>
                </td>
                <td className="py-3">
                  <Badge variant="primary">{player.level}</Badge>
                </td>
                <td className="py-3 text-sm text-text-primary">
                  {formatNumber(player.gamesPlayed)}
                </td>
                <td className="py-3 text-sm text-text-primary">
                  {formatNumber(player.wins)}
                </td>
                <td className="py-3 text-sm text-text-primary">
                  {winRate}%
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default function LeaderboardPage() {
  const [activeTab, setActiveTab] = useState("daily");

  const tabs = [
    { key: "daily", label: "Daily" },
    { key: "weekly", label: "Weekly" },
    { key: "monthly", label: "Monthly" },
    { key: "alltime", label: "All-Time" },
  ];

  const tabContent: Record<string, React.ReactNode> = {
    daily: <LeaderboardTable players={DAILY} />,
    weekly: <LeaderboardTable players={WEEKLY} />,
    monthly: <LeaderboardTable players={MONTHLY} />,
    alltime: <LeaderboardTable players={ALL_TIME} />,
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 md:py-12">
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <Trophy className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold">Leaderboard</h1>
            <p className="text-text-secondary">Compete with players worldwide</p>
          </div>
        </div>
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="p-5 pb-0">
          <Tabs tabs={tabs} onChange={setActiveTab}>
            {tabContent[activeTab]}
          </Tabs>
        </div>
      </Card>
    </div>
  );
}
