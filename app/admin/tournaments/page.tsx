"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCoins, formatNumber } from "@/lib/utils";

const TOURNAMENTS = [
  { name: "Weekend Challenge", prize: 10000, participants: "64/128", status: "upcoming" as const },
  { name: "Crash Masters", prize: 5000, participants: "32/64", status: "upcoming" as const },
  { name: "Arcade Rush", prize: 2000, participants: "48/96", status: "upcoming" as const },
  { name: "Card Champion", prize: 15000, participants: "16/32", status: "upcoming" as const },
  { name: "Teen Patti Cup", prize: 7500, participants: "24/48", status: "upcoming" as const },
  { name: "Aviator Masters", prize: 8000, participants: "40/80", status: "upcoming" as const },
];

export default function AdminTournamentsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:py-12">
      <div className="mb-8 flex items-center gap-3">
        <Link href="/admin" className="text-text-muted hover:text-text-primary transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="font-sora text-3xl font-bold">Tournaments</h1>
          <p className="text-text-muted">Manage tournaments</p>
        </div>
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="border-b border-border">
                <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-muted">Tournament</th>
                <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-muted">Prize Pool</th>
                <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-muted">Participants</th>
                <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-muted">Status</th>
              </tr>
            </thead>
            <tbody>
              {TOURNAMENTS.map((t) => (
                <tr key={t.name} className="border-b border-border/50 hover:bg-white/[0.02]">
                  <td className="px-5 py-3 text-sm font-medium text-text-primary">{t.name}</td>
                  <td className="px-5 py-3 text-sm text-accent font-medium">{formatCoins(t.prize)}</td>
                  <td className="px-5 py-3 text-sm text-text-muted">{t.participants}</td>
                  <td className="px-5 py-3">
                    <Badge variant="primary">Upcoming</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
