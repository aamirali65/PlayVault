"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Coins } from "lucide-react";
import { useUserStore } from "@/store/userStore";

export default function TopBarMobile() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, isAuthenticated } = useUserStore();

  return (
    <header className="md:hidden sticky top-0 z-40 border-b border-border bg-canvas/95 backdrop-blur-xl">
      <div className="flex items-center justify-between h-16 px-4">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-gold via-orange to-rose flex items-center justify-center shadow-[0_0_10px_rgba(255,215,0,0.3)]">
            <span className="text-canvas font-bold text-xs">P</span>
          </div>
          <span className="font-display text-lg font-bold tracking-tight">
            <span className="text-gold">PLAY</span>
            <span className="text-text-primary">VAULT</span>
          </span>
        </Link>

        {isAuthenticated && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-gold/10 to-orange/10 border border-gold/20">
            <Coins className="w-3.5 h-3.5 text-gold" />
            <span className="text-xs font-bold tabular-nums text-gold">
              {user?.balance.toLocaleString() ?? "0"}
            </span>
          </div>
        )}

        <button
          onClick={() => setMenuOpen((prev) => !prev)}
          className="p-2 rounded-xl text-text-muted hover:text-gold hover:bg-gold/5 transition-all"
        >
          {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {menuOpen && (
        <div className="border-t border-border px-4 py-3 flex flex-col gap-1 bg-canvas/95 backdrop-blur-xl">
          {isAuthenticated && user ? (
            <>
              <div className="px-3 py-2 text-sm text-gold font-bold">
                {user.username}
              </div>
              <Link
                href="/profile"
                onClick={() => setMenuOpen(false)}
                className="px-3 py-2 rounded-xl text-sm text-text-muted hover:text-gold hover:bg-gold/5 transition-all"
              >
                Profile
              </Link>
              <Link
                href="/settings"
                onClick={() => setMenuOpen(false)}
                className="px-3 py-2 rounded-xl text-sm text-text-muted hover:text-gold hover:bg-gold/5 transition-all"
              >
                Settings
              </Link>
            </>
          ) : (
            <Link
              href="/login"
              onClick={() => setMenuOpen(false)}
              className="px-3 py-2 rounded-xl text-sm font-bold text-gold hover:bg-gold/10 transition-all"
            >
              Login
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
