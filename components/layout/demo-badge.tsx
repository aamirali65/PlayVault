"use client";

import { useState } from "react";
import { X, Coins } from "lucide-react";

export default function DemoBadge() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="relative z-[60] flex items-center justify-center gap-2 bg-gradient-to-r from-gold/10 via-orange/10 to-gold/10 border-b border-gold/20 px-4 py-2">
      <Coins className="w-3.5 h-3.5 text-gold shrink-0" />
      <span className="text-[11px] font-bold text-gold/90 text-center">
        DEMO MODE — All balances are virtual Demo Coins. No real money involved.
      </span>
      <button
        onClick={() => setDismissed(true)}
        className="shrink-0 p-0.5 rounded text-gold/40 hover:text-gold transition-colors"
      >
        <X className="w-3 h-3" />
      </button>
    </div>
  );
}
