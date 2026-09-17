"use client";

import { useState, useEffect } from "react";
import { Swords, Clock, Users, Trophy, ChevronRight, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/toast";
import { formatCoins, formatNumber } from "@/lib/utils";

interface TournamentDef {
  id: string;
  name: string;
  description: string;
  icon: string;
  entryFee: number;
  prizePool: number;
  startDate: string;
  endDate: string;
  participants: number;
  maxParticipants: number;
  bracket: { round: number; p1: string; p2: string; winner?: string }[];
}

const TOURNAMENTS: TournamentDef[] = [
  {
    id: "weekend",
    name: "Weekend Challenge",
    description: "High stakes weekend tournament for the best players.",
    icon: "🏆",
    entryFee: 1000,
    prizePool: 10000,
    startDate: new Date(Date.now() + 86400000).toISOString(),
    endDate: new Date(Date.now() + 259200000).toISOString(),
    participants: 64,
    maxParticipants: 128,
    bracket: [
      { round: 1, p1: "ShadowKing", p2: "NeonViper", winner: "ShadowKing" },
      { round: 1, p1: "PixelMaster", p2: "CyberWolf", winner: "CyberWolf" },
      { round: 2, p1: "ShadowKing", p2: "CyberWolf" },
    ],
  },
  {
    id: "crash-masters",
    name: "Crash Masters",
    description: "Prove your skills in the ultimate crash game showdown.",
    icon: "📈",
    entryFee: 500,
    prizePool: 5000,
    startDate: new Date(Date.now() + 172800000).toISOString(),
    endDate: new Date(Date.now() + 345600000).toISOString(),
    participants: 32,
    maxParticipants: 64,
    bracket: [
      { round: 1, p1: "BlazeRunner", p2: "ThunderFox", winner: "ThunderFox" },
      { round: 1, p1: "IronGamer", p2: "StormBreaker" },
      { round: 2, p1: "ThunderFox", p2: "TBD" },
    ],
  },
  {
    id: "arcade-rush",
    name: "Arcade Rush",
    description: "Fast-paced arcade game tournament with quick rounds.",
    icon: "🕹️",
    entryFee: 200,
    prizePool: 2000,
    startDate: new Date(Date.now() + 259200000).toISOString(),
    endDate: new Date(Date.now() + 432000000).toISOString(),
    participants: 48,
    maxParticipants: 96,
    bracket: [
      { round: 1, p1: "NightHawk", p2: "VoltStrike" },
      { round: 1, p1: "DragonPulse", p2: "FrostByte" },
    ],
  },
  {
    id: "card-champion",
    name: "Card Champion",
    description: "The ultimate card game championship with massive prizes.",
    icon: "🃏",
    entryFee: 1000,
    prizePool: 15000,
    startDate: new Date(Date.now() + 345600000).toISOString(),
    endDate: new Date(Date.now() + 518400000).toISOString(),
    participants: 16,
    maxParticipants: 32,
    bracket: [
      { round: 1, p1: "TurboNinja", p2: "CosmicRay", winner: "CosmicRay" },
      { round: 1, p1: "RogueAgent", p2: "WildCard" },
    ],
  },
  {
    id: "teen-patti",
    name: "Teen Patti Cup",
    description: "Three-card poker showdown for South Asian gaming fans.",
    icon: "🎴",
    entryFee: 500,
    prizePool: 7500,
    startDate: new Date(Date.now() + 432000000).toISOString(),
    endDate: new Date(Date.now() + 604800000).toISOString(),
    participants: 24,
    maxParticipants: 48,
    bracket: [
      { round: 1, p1: "SilentEdge", p2: "NovaStar", winner: "SilentEdge" },
      { round: 1, p1: "ZenBlade", p2: "PhantomX" },
    ],
  },
  {
    id: "aviator-masters",
    name: "Aviator Masters",
    description: "Master the aviator game and fly to the top of the leaderboard.",
    icon: "✈️",
    entryFee: 750,
    prizePool: 8000,
    startDate: new Date(Date.now() + 518400000).toISOString(),
    endDate: new Date(Date.now() + 691200000).toISOString(),
    participants: 40,
    maxParticipants: 80,
    bracket: [
      { round: 1, p1: "NeonViper", p2: "BlazeRunner", winner: "NeonViper" },
      { round: 1, p1: "StormBreaker", p2: "IronGamer" },
    ],
  },
];

function CountdownTimer({ target }: { target: string }) {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    function update() {
      const diff = new Date(target).getTime() - Date.now();
      if (diff <= 0) {
        setTimeLeft("Started");
        return;
      }
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft(`${d}d ${h}h ${m}m ${s}s`);
    }
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [target]);

  return (
    <span className="flex items-center gap-1.5 text-sm text-text-muted">
      <Clock className="h-3.5 w-3.5 text-gold" />
      <span className="font-mono text-xs tracking-wider">{timeLeft}</span>
    </span>
  );
}

function StatusBadge({ status }: { status: "active" | "upcoming" | "completed" }) {
  const map = {
    active: <Badge variant="success">Active</Badge>,
    upcoming: <Badge variant="gold">Upcoming</Badge>,
    completed: <Badge variant="muted">Completed</Badge>,
  };
  return map[status];
}

function getTournamentStatus(t: TournamentDef): "active" | "upcoming" | "completed" {
  const now = Date.now();
  const start = new Date(t.startDate).getTime();
  const end = new Date(t.endDate).getTime();
  if (now >= end) return "completed";
  if (now >= start) return "active";
  return "upcoming";
}

export default function TournamentsPage() {
  const { toast } = useToast();
  const [joined, setJoined] = useState<Set<string>>(new Set());
  const [expanded, setExpanded] = useState<string | null>(null);

  function toggleJoin(id: string) {
    if (joined.has(id)) return;
    setJoined((prev) => new Set([...prev, id]));
    toast("Successfully joined the tournament!", "success");
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:py-12">
      <div className="mb-10">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gold/10 border border-gold/20">
            <Swords className="h-7 w-7 text-gold" />
          </div>
          <div>
            <h1 className="font-display text-4xl font-extrabold tracking-tight">
              <span className="gaming-gradient-text">TOURNAMENTS</span>
            </h1>
            <p className="mt-1 text-text-secondary text-sm">Compete for massive prize pools</p>
          </div>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {TOURNAMENTS.map((t) => {
          const isJoined = joined.has(t.id);
          const isExpanded = expanded === t.id;
          const spotsLeft = t.maxParticipants - t.participants;
          const status = getTournamentStatus(t);

          return (
            <div key={t.id} className="gaming-card rounded-2xl p-5">
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-canvas-elevated border border-border text-2xl">
                  {t.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-lg font-bold font-display">{t.name}</h3>
                    <StatusBadge status={status} />
                    {isJoined && <Badge variant="success">Joined</Badge>}
                  </div>
                  <p className="mt-1 text-sm text-text-muted line-clamp-2">{t.description}</p>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="hud-panel rounded-xl p-3">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-text-muted">Entry Fee</span>
                  <p className="text-sm font-bold text-text-primary mt-0.5">{formatCoins(t.entryFee)}</p>
                </div>
                <div className="hud-panel rounded-xl p-3">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-text-muted">Prize Pool</span>
                  <p className="text-sm font-bold text-gold mt-0.5 text-glow-gold">{formatCoins(t.prizePool)}</p>
                </div>
                <div className="hud-panel rounded-xl p-3">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-text-muted">Players</span>
                  <p className="text-sm font-semibold mt-0.5">
                    <span className="text-text-primary">{formatNumber(t.participants)}</span>
                    <span className="text-text-muted">/{formatNumber(t.maxParticipants)}</span>
                  </p>
                </div>
                <div className="hud-panel rounded-xl p-3">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-text-muted">Starts In</span>
                  <div className="mt-0.5">
                    <CountdownTimer target={t.startDate} />
                  </div>
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <Button
                  variant={isJoined ? "secondary" : "primary"}
                  className="flex-1"
                  disabled={isJoined || spotsLeft <= 0}
                  onClick={() => toggleJoin(t.id)}
                >
                  {isJoined ? (
                    "Joined"
                  ) : spotsLeft <= 0 ? (
                    "Full"
                  ) : (
                    <>
                      <Zap className="h-4 w-4" />
                      Join Tournament
                    </>
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setExpanded(isExpanded ? null : t.id)}
                >
                  Bracket
                  <ChevronRight className={`h-4 w-4 transition-transform ${isExpanded ? "rotate-90" : ""}`} />
                </Button>
              </div>

              {isExpanded && (
                <div className="mt-4 hud-panel rounded-xl p-4">
                  <h4 className="mb-3 text-[10px] font-extrabold uppercase tracking-wider text-text-muted">
                    Bracket Preview
                  </h4>
                  <div className="space-y-2">
                    {t.bracket.map((match, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        <Badge variant="muted" className="w-16 justify-center">
                          R{match.round}
                        </Badge>
                        <span className={match.winner === match.p1 ? "text-success font-medium" : "text-text-primary"}>
                          {match.p1}
                        </span>
                        <span className="text-text-muted">vs</span>
                        <span className={match.winner === match.p2 ? "text-success font-medium" : "text-text-primary"}>
                          {match.p2}
                        </span>
                        {match.winner && (
                          <Trophy className="ml-auto h-3.5 w-3.5 text-gold" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
