"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const REWARDS = [
  { name: "Daily Login Bonus", amount: 100, frequency: "Daily", active: true },
  { name: "Weekly Challenge", amount: 500, frequency: "Weekly", active: true },
  { name: "New Player Welcome", amount: 1000, frequency: "One-time", active: true },
  { name: "Weekend Event", amount: 2000, frequency: "Weekends", active: true },
  { name: "Referral Bonus", amount: 300, frequency: "Per referral", active: false },
  { name: "VIP Daily Reward", amount: 1000, frequency: "Daily", active: false },
];

export default function AdminRewardsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:py-12">
      <div className="mb-8 flex items-center gap-3">
        <Link href="/admin" className="text-text-muted hover:text-text-primary transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="font-sora text-3xl font-bold">Reward Settings</h1>
          <p className="text-text-muted">Configure reward distribution</p>
        </div>
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="border-b border-border">
                <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-muted">Reward</th>
                <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-muted">Amount</th>
                <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-muted">Frequency</th>
                <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-muted">Status</th>
              </tr>
            </thead>
            <tbody>
              {REWARDS.map((r) => (
                <tr key={r.name} className="border-b border-border/50 hover:bg-white/[0.02]">
                  <td className="px-5 py-3 text-sm font-medium text-text-primary">{r.name}</td>
                  <td className="px-5 py-3 text-sm text-accent font-medium">{r.amount.toLocaleString()} DEMO</td>
                  <td className="px-5 py-3 text-sm text-text-muted">{r.frequency}</td>
                  <td className="px-5 py-3">
                    <Badge variant={r.active ? "success" : "muted"}>
                      {r.active ? "Active" : "Inactive"}
                    </Badge>
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
