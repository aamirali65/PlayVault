"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Search, User, Coins, Menu, X, Home, Gamepad2, Radio, Trophy, Gift, Swords, BarChart3, ChevronRight } from "lucide-react";
import { useUserStore } from "@/store/userStore";

const navLinks = [
  { label: "Home", href: "/", icon: Home },
  { label: "Games", href: "/games", icon: Gamepad2 },
  { label: "Live", href: "/live", icon: Radio },
  { label: "Rewards", href: "/rewards", icon: Gift },
  { label: "Leaderboard", href: "/leaderboard", icon: Trophy },
];

export default function DesktopNav() {
  const pathname = usePathname();
  const { user, isAuthenticated } = useUserStore();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <nav className="hidden md:flex items-center h-[60px] px-5 border-b border-border bg-canvas-card/80 backdrop-blur-xl sticky top-0 z-50">
        <Link href="/" className="flex items-center gap-2.5 mr-6 group">
          <div className="w-9 h-9 rounded-[10px] bg-gradient-to-br from-gold via-orange to-gold flex items-center justify-center shadow-[0_3px_10px_rgba(255,209,92,0.3)] group-hover:shadow-[0_3px_20px_rgba(255,209,92,0.5)] transition-shadow">
            <span className="text-[#080A12] font-display font-black text-sm">PV</span>
          </div>
          <span className="font-display font-black text-lg tracking-tight">
            <span className="text-gold">PLAY</span>
            <span className="text-text-primary">VAULT</span>
          </span>
        </Link>

        <div className="flex items-center gap-0.5">
          {navLinks.map((link) => {
            const isActive =
              pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3.5 py-2 rounded-[8px] text-sm font-bold transition-all duration-200 flex items-center gap-1.5 ${
                  isActive
                    ? "text-gold bg-gold/10"
                    : "text-text-muted hover:text-text-primary hover:bg-white/5"
                }`}
              >
                <link.icon className="w-4 h-4" />
                {link.label}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <Link
            href="/games"
            className="p-2 rounded-[8px] text-text-muted hover:text-gold hover:bg-gold/5 transition-all"
          >
            <Search className="w-4 h-4" />
          </Link>

          {isAuthenticated && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-[10px] bg-surface border border-border hover:border-gold/30 transition-all cursor-default">
              <div className="w-5 h-5 rounded-full bg-gradient-to-br from-gold to-orange flex items-center justify-center">
                <Coins className="w-3 h-3 text-[#080A12]" />
              </div>
              <span className="text-sm font-extrabold tabular-nums text-gold font-[family-name:var(--font-space)]">
                {user?.balance.toLocaleString() ?? "0"}
              </span>
            </div>
          )}

          {isAuthenticated ? (
            <Link
              href="/profile"
              className="flex items-center gap-2 px-3 py-1.5 rounded-[10px] text-sm font-bold text-text-muted hover:text-gold hover:bg-gold/5 transition-all"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple/30 to-cyan/30 flex items-center justify-center border border-border">
                <User className="w-4 h-4 text-text-primary" />
              </div>
              <span className="hidden lg:inline">{user?.username ?? "Player"}</span>
            </Link>
          ) : (
            <Link
              href="/login"
              className="px-5 py-2 rounded-[10px] text-sm font-extrabold bg-gradient-to-b from-gold-bright to-gold text-[#080A12] shadow-[0_3px_0_0_#B8942A] hover:shadow-[0_4px_0_0_#B8942A,0_4px_15px_rgba(255,209,92,0.3)] hover:translate-y-[-1px] active:translate-y-[1px] active:shadow-[0_1px_0_0_#B8942A] transition-all"
            >
              PLAY NOW
            </Link>
          )}
        </div>
      </nav>

      {/* Mobile Header */}
      <header className="md:hidden sticky top-0 z-50 border-b border-border bg-canvas-card/95 backdrop-blur-xl">
        <div className="flex items-center justify-between h-[56px] px-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-[8px] bg-gradient-to-br from-gold via-orange to-gold flex items-center justify-center shadow-[0_2px_8px_rgba(255,209,92,0.3)]">
              <span className="text-[#080A12] font-display font-black text-xs">PV</span>
            </div>
            <span className="font-display font-black text-base tracking-tight">
              <span className="text-gold">PLAY</span>
              <span className="text-text-primary">VAULT</span>
            </span>
          </Link>

          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-[8px] bg-surface border border-border">
                <Coins className="w-3.5 h-3.5 text-gold" />
                <span className="text-xs font-extrabold tabular-nums text-gold">
                  {user?.balance.toLocaleString() ?? "0"}
                </span>
              </div>
            )}

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-[8px] text-text-muted hover:text-gold hover:bg-gold/5 transition-all"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileOpen && (
          <div className="border-t border-border bg-canvas-card/98 backdrop-blur-xl animate-slide-up">
            <div className="p-3 flex flex-col gap-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-[10px] text-sm font-bold transition-all ${
                      isActive
                        ? "text-gold bg-gold/10"
                        : "text-text-secondary hover:text-text-primary hover:bg-white/5"
                    }`}
                  >
                    <link.icon className="w-5 h-5" />
                    {link.label}
                    <ChevronRight className="w-4 h-4 ml-auto opacity-40" />
                  </Link>
                );
              })}
              {isAuthenticated ? (
                <Link
                  href="/profile"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-[10px] text-sm font-bold text-text-secondary hover:text-gold hover:bg-gold/5 transition-all"
                >
                  <User className="w-5 h-5" />
                  Profile
                </Link>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="mx-3 mt-2 mb-1 py-3 rounded-[10px] text-sm font-extrabold text-center bg-gradient-to-b from-gold-bright to-gold text-[#080A12] shadow-[0_3px_0_0_#B8942A]"
                >
                  PLAY NOW
                </Link>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
}
