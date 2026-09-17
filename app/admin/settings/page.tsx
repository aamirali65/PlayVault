"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";

export default function AdminSettingsPage() {
  const { toast } = useToast();
  const [siteName, setSiteName] = useState("PlayVault");
  const [maintenance, setMaintenance] = useState(false);
  const [minBet, setMinBet] = useState("10");
  const [maxBet, setMaxBet] = useState("10000");

  function handleSave() {
    toast("Settings saved successfully!", "success");
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 md:py-12">
      <div className="mb-8 flex items-center gap-3">
        <Link href="/admin" className="text-text-muted hover:text-text-primary transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="font-display text-3xl font-bold">Settings</h1>
          <p className="text-text-muted">Platform configuration</p>
        </div>
      </div>

      <div className="space-y-6">
        <Card>
          <h3 className="mb-4 text-sm font-medium uppercase tracking-wider text-text-muted">General</h3>
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-text-primary">Site Name</label>
              <input
                type="text"
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
                className="h-10 w-full rounded-xl bg-canvas-card border border-border px-4 text-sm text-text-primary outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold"
              />
            </div>
          </div>
        </Card>

        <Card>
          <h3 className="mb-4 text-sm font-medium uppercase tracking-wider text-text-muted">Maintenance</h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-text-primary">Maintenance Mode</p>
              <p className="text-xs text-text-muted">When enabled, the site shows a maintenance page</p>
            </div>
            <button
              onClick={() => setMaintenance(!maintenance)}
              className={`relative h-6 w-11 rounded-full transition-colors cursor-pointer ${
                maintenance ? "bg-danger" : "bg-white/10"
              }`}
            >
              <span
                className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-transform ${
                  maintenance ? "left-6" : "left-1"
                }`}
              />
            </button>
          </div>
        </Card>

        <Card>
          <h3 className="mb-4 text-sm font-medium uppercase tracking-wider text-text-muted">Betting Limits</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-text-primary">Min Bet (DEMO)</label>
              <input
                type="number"
                value={minBet}
                onChange={(e) => setMinBet(e.target.value)}
                className="h-10 w-full rounded-xl bg-canvas-card border border-border px-4 text-sm text-text-primary outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-text-primary">Max Bet (DEMO)</label>
              <input
                type="number"
                value={maxBet}
                onChange={(e) => setMaxBet(e.target.value)}
                className="h-10 w-full rounded-xl bg-canvas-card border border-border px-4 text-sm text-text-primary outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold"
              />
            </div>
          </div>
        </Card>

        <div className="flex justify-end">
          <Button variant="primary" onClick={handleSave}>
            Save Settings
          </Button>
        </div>
      </div>
    </div>
  );
}
