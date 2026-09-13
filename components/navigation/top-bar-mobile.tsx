"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Coins } from "lucide-react";
import { useUserStore } from "@/store/userStore";

export default function TopBarMobile() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, isAuthenticated } = useUserStore();

  return (
    <header className="md:hidden sticky top-0 z-40 border-b border-border bg-background-secondary">
      <div className="flex items-center justify-between h-14 px-4">
        <Link
          href="/"
          className="font-sora text-lg font-bold tracking-tight text-accent"
        >
          PlayVault
        </Link>

        {isAuthenticated && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-surface border border-border">
            <Coins className="w-3.5 h-3.5 text-accent" />
            <span className="text-xs font-medium tabular-nums text-text-primary">
              {user?.balance.toLocaleString() ?? "0"}
            </span>
          </div>
        )}

        <button
          onClick={() => setMenuOpen((prev) => !prev)}
          className="p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-white/5 transition-colors"
        >
          {menuOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
        </button>
      </div>

      {menuOpen && (
        <div className="border-t border-border px-4 py-3 flex flex-col gap-1 bg-background-secondary">
          {isAuthenticated && user ? (
            <>
              <div className="px-3 py-2 text-sm text-text-primary font-medium">
                {user.username}
              </div>
              <Link
                href="/profile"
                onClick={() => setMenuOpen(false)}
                className="px-3 py-2 rounded-lg text-sm text-text-muted hover:text-text-primary hover:bg-white/5 transition-colors"
              >
                Profile
              </Link>
              <Link
                href="/settings"
                onClick={() => setMenuOpen(false)}
                className="px-3 py-2 rounded-lg text-sm text-text-muted hover:text-text-primary hover:bg-white/5 transition-colors"
              >
                Settings
              </Link>
            </>
          ) : (
            <Link
              href="/login"
              onClick={() => setMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-sm font-semibold text-accent hover:bg-accent/10 transition-colors"
            >
              Login
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
