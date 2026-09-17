"use client";

import { useState } from "react";
import { Trophy, ArrowUp, ArrowDown, Minus, Crown, Star } from "lucide-react";
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

const MEDAL_EMOJIS = ["🥇", "🥈", "🥉"];

function getAvatarGradient(username: string) {
  const gradients = [
    "from-gold to-amber",
    "from-cyan to-blue",
    "from-purple to-pink",
    "from-emerald to-teal",
    "from-rose to-orange",
    "from-violet to-indigo",
  ];
  const idx = username.charCodeAt(0) % gradients.length;
  return gradients[idx];
}

function TopThreeCard({ player, rank }: { player: Player; rank: number }) {
  const user = useUserStore((s) => s.user);
  const isCurrentUser = user?.username === player.username;
  const winRate = player.gamesPlayed > 0
    ? ((player.wins / player.gamesPlayed) * 100).toFixed(1)
    : "0.0";

  const borderColors = rank === 1 ? "border-gold/50" : rank === 2 ? "border-[#C0C0C0]/50" : "border-[#CD7F32]/50";
  const glowColors = rank === 1 ? "shadow-[0_0_30px_rgba(255,209,92,0.15)]" : rank === 2 ? "shadow-[0_0_20px_rgba(192,192,192,0.1)]" : "shadow-[0_0_20px_rgba(205,127,50,0.1)]";
  const bgColors = rank === 1 ? "bg-gold/5" : rank === 2 ? "bg-[#C0C0C0]/5" : "bg-[#CD7F32]/5";
  const sizeClass = rank === 1 ? "w-14 h-14 text-xl" : "w-12 h-12 text-lg";

  return (
    <div className={`gaming-card p-4 ${borderColors} ${glowColors} ${isCurrentUser ? "bg-gold/[0.07]" : bgColors}`}>
      <div className="flex items-center gap-4">
        <span className="text-3xl">{MEDAL_EMOJIS[rank - 1]}</span>

        <div className={`flex items-center justify-center rounded-full bg-gradient-to-br ${getAvatarGradient(player.username)} ${sizeClass} font-extrabold text-canvas`}>
          {player.username[0]}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className={`font-bold truncate ${isCurrentUser ? "text-gold" : "text-text-primary"}`}>
              {player.username}
            </span>
            {isCurrentUser && <span className="text-xs text-gold font-bold">(You)</span>}
            {rank === 1 && <Crown className="h-4 w-4 text-gold flex-shrink-0" />}
          </div>
          <div className="flex items-center gap-3 mt-1">
            <Badge variant="gold">Lvl {player.level}</Badge>
            <span className="text-xs text-text-muted">{formatNumber(player.gamesPlayed)} games</span>
          </div>
        </div>

        <div className="text-right flex-shrink-0">
          <p className="text-xl font-extrabold text-text-primary">{formatNumber(player.wins)}</p>
          <p className="text-[10px] text-text-muted uppercase tracking-wider">Wins</p>
          <p className="text-xs text-gold mt-0.5">{winRate}% WR</p>
        </div>

        <div className="flex-shrink-0">
          <div className="flex items-center gap-1">
            {player.rankChange > 0 && (
              <ArrowUp className="h-3.5 w-3.5 text-emerald" />
            )}
            {player.rankChange < 0 && (
              <ArrowDown className="h-3.5 w-3.5 text-rose" />
            )}
            {player.rankChange === 0 && (
              <Minus className="h-3.5 w-3.5 text-text-muted" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function LeaderboardTable({ players }: { players: Player[] }) {
  const user = useUserStore((s) => s.user);
  const topThree = players.slice(0, 3);
  const rest = players.slice(3);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {topThree.map((player) => (
          <TopThreeCard key={player.username} player={player} rank={player.rank} />
        ))}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="pb-3 text-left text-[10px] font-bold uppercase tracking-widest text-text-muted pl-4">
                Rank
              </th>
              <th className="pb-3 text-left text-[10px] font-bold uppercase tracking-widest text-text-muted">
                Player
              </th>
              <th className="pb-3 text-left text-[10px] font-bold uppercase tracking-widest text-text-muted">
                Level
              </th>
              <th className="pb-3 text-right text-[10px] font-bold uppercase tracking-widest text-text-muted">
                Games
              </th>
              <th className="pb-3 text-right text-[10px] font-bold uppercase tracking-widest text-text-muted">
                Wins
              </th>
              <th className="pb-3 text-right text-[10px] font-bold uppercase tracking-widest text-text-muted pr-4">
                Win Rate
              </th>
            </tr>
          </thead>
          <tbody>
            {rest.map((player) => {
              const isCurrentUser = user?.username === player.username;
              const winRate = player.gamesPlayed > 0
                ? ((player.wins / player.gamesPlayed) * 100).toFixed(1)
                : "0.0";

              return (
                <tr
                  key={player.username}
                  className={`border-b border-border/30 transition-colors ${
                    isCurrentUser ? "bg-gold/[0.06]" : "hover:bg-white/[0.02]"
                  }`}
                >
                  <td className="py-3 pl-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-text-muted">#{player.rank}</span>
                      <span className="flex items-center">
                        {player.rankChange > 0 && (
                          <ArrowUp className="h-3 w-3 text-emerald" />
                        )}
                        {player.rankChange < 0 && (
                          <ArrowDown className="h-3 w-3 text-rose" />
                        )}
                        {player.rankChange === 0 && (
                          <Minus className="h-3 w-3 text-text-muted" />
                        )}
                      </span>
                    </div>
                  </td>
                  <td className="py-3">
                    <div className="flex items-center gap-2.5">
                      <div className={`flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br ${getAvatarGradient(player.username)} text-xs font-extrabold text-canvas`}>
                        {player.username[0]}
                      </div>
                      <span className={`text-sm font-bold ${isCurrentUser ? "text-gold" : "text-text-primary"}`}>
                        {player.username}
                        {isCurrentUser && <span className="ml-1.5 text-[10px] text-gold">(You)</span>}
                      </span>
                    </div>
                  </td>
                  <td className="py-3">
                    <Badge variant="gold">{player.level}</Badge>
                  </td>
                  <td className="py-3 text-sm text-text-secondary text-right font-medium">
                    {formatNumber(player.gamesPlayed)}
                  </td>
                  <td className="py-3 text-sm text-text-primary text-right font-bold">
                    {formatNumber(player.wins)}
                  </td>
                  <td className="py-3 text-sm text-gold text-right font-bold pr-4">
                    {winRate}%
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
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
      <div className="mb-8 text-center md:text-left">
        <div className="flex items-center justify-center md:justify-start gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-gold/20 to-gold/5 border border-gold/20 shadow-[0_0_30px_rgba(255,209,92,0.15)]">
            <Trophy className="h-6 w-6 text-gold" />
          </div>
          <div>
            <h1 className="font-display text-3xl font-extrabold text-text-primary">TOP PLAYERS</h1>
            <p className="text-text-secondary">Compete with players worldwide</p>
          </div>
        </div>
      </div>

      <div className="hud-panel p-4 md:p-6">
        <Tabs tabs={tabs} onChange={setActiveTab}>
          {tabContent[activeTab]}
        </Tabs>
      </div>
    </div>
  );
}
