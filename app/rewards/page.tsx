"use client";

import { useState, useEffect } from "react";
import { Gift, Check, Lock, Trophy } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { useUserStore } from "@/store/userStore";
import { formatCoins } from "@/lib/utils";

const REWARDS = [100, 200, 300, 500, 1000, 2000, 5000];
const STORAGE_KEY = "playvault_daily_rewards";

function getClaimedDays(): number[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const data = JSON.parse(raw);
    const today = new Date().toDateString();
    if (data.date !== today) return [];
    return data.claimedDays || [];
  } catch {
    return [];
  }
}

function saveClaimedDays(days: number[]) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ date: new Date().toDateString(), claimedDays: days })
  );
}

function getCurrentDay(): number {
  const day = new Date().getDay();
  return day === 0 ? 7 : day;
}

export default function RewardsPage() {
  const { toast } = useToast();
  const addCoins = useUserStore((s) => s.addCoins);
  const [claimedDays, setClaimedDays] = useState<number[]>([]);
  const [currentDay, setCurrentDay] = useState(1);

  useEffect(() => {
    setClaimedDays(getClaimedDays());
    setCurrentDay(getCurrentDay());
  }, []);

  const totalClaimed = claimedDays.reduce((sum, d) => sum + REWARDS[d - 1], 0);

  function claimReward(day: number) {
    if (day !== currentDay || claimedDays.includes(day)) return;
    const amount = REWARDS[day - 1];
    const updated = [...claimedDays, day];
    setClaimedDays(updated);
    saveClaimedDays(updated);
    addCoins(amount);
    toast(`+${formatCoins(amount)} claimed!`, "success");
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 md:py-12">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/10">
          <Gift className="h-8 w-8 text-accent" />
        </div>
        <h1 className="font-sora text-3xl font-bold">Daily Rewards</h1>
        <p className="mt-2 text-text-muted">
          Log in daily to claim escalating rewards
        </p>
        <div className="mt-4 inline-flex items-center gap-2 rounded-xl bg-surface border border-border px-4 py-2">
          <Trophy className="h-4 w-4 text-accent" />
          <span className="text-sm font-medium">
            Total Claimed: <span className="text-accent">{formatCoins(totalClaimed)}</span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {REWARDS.map((amount, i) => {
          const day = i + 1;
          const isClaimed = claimedDays.includes(day);
          const isCurrent = day === currentDay;
          const isLocked = !isClaimed && !isCurrent;

          return (
            <Card
              key={day}
              className={`relative overflow-hidden transition-all ${
                isCurrent
                  ? "border-accent shadow-[0_0_20px_rgba(196,255,0,0.1)]"
                  : isClaimed
                  ? "border-success/30"
                  : ""
              }`}
            >
              {isCurrent && (
                <div className="absolute -right-6 -top-6 rotate-45 bg-accent px-8 py-1 text-[10px] font-bold text-background">
                  TODAY
                </div>
              )}

              <div className="flex flex-col items-center text-center">
                <div
                  className={`mb-3 flex h-12 w-12 items-center justify-center rounded-xl ${
                    isClaimed
                      ? "bg-success/15"
                      : isCurrent
                      ? "bg-accent/15"
                      : "bg-white/5"
                  }`}
                >
                  {isClaimed ? (
                    <Check className="h-6 w-6 text-success" />
                  ) : isLocked ? (
                    <Lock className="h-6 w-6 text-text-muted" />
                  ) : (
                    <Gift className="h-6 w-6 text-accent" />
                  )}
                </div>

                <span className="text-xs font-medium text-text-muted uppercase tracking-wider">
                  Day {day}
                </span>
                <span className="mt-1 text-2xl font-bold text-text-primary">
                  {amount.toLocaleString()}
                </span>
                <span className="text-xs text-text-muted">Demo Coins</span>

                <div className="mt-4 w-full">
                  {isClaimed ? (
                    <div className="flex items-center justify-center gap-1.5 rounded-lg bg-success/10 py-2 text-xs font-medium text-success">
                      <Check className="h-3.5 w-3.5" />
                      Claimed
                    </div>
                  ) : (
                    <Button
                      variant={isCurrent ? "primary" : "secondary"}
                      size="sm"
                      className="w-full"
                      disabled={!isCurrent}
                      onClick={() => claimReward(day)}
                    >
                      {isCurrent ? "Claim" : "Locked"}
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="mt-8 rounded-xl bg-surface border border-border p-6 text-center">
        <p className="text-sm text-text-muted">
          Rewards reset each day. Claim your daily bonus to keep your streak going!
        </p>
        <p className="mt-2 text-xs text-text-muted">
          All rewards are Demo Coins — no real money involved.
        </p>
      </div>
    </div>
  );
}
