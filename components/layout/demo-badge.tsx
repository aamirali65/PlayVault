"use client";

import { useState } from "react";
import { X, Coins } from "lucide-react";

export default function DemoBadge() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center gap-2 bg-accent/15 border-b border-accent/30 px-4 py-2 backdrop-blur-sm">
      <Coins className="w-4 h-4 text-accent shrink-0" />
      <span className="text-xs font-semibold text-accent text-center">
        DEMO MODE - All balances are virtual Demo Coins. No real money.
      </span>
      <button
        onClick={() => setDismissed(true)}
        className="shrink-0 p-1 rounded text-accent/60 hover:text-accent transition-colors"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
