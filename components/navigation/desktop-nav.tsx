"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, User } from "lucide-react";
import { useUserStore } from "@/store/userStore";

const navLinks = [
  { label: "Casino", href: "/games" },
  { label: "Live", href: "/live" },
  { label: "Tournaments", href: "/tournaments" },
  { label: "Promotions", href: "/promotions" },
  { label: "Rewards", href: "/rewards" },
];

export default function DesktopNav() {
  const pathname = usePathname();
  const { user, isAuthenticated } = useUserStore();

  return (
    <nav className="hidden md:flex items-center h-14 px-6 border-b border-border-muted backdrop-blur-xl bg-canvas/80 sticky top-0 z-50">
      <Link
        href="/"
        className="text-lg font-bold tracking-tight text-primary mr-8"
      >
        PLAY<span className="text-text-primary">VAULT</span>
      </Link>

      <div className="flex items-center gap-0.5">
        {navLinks.map((link) => {
          const isActive =
            pathname === link.href || pathname.startsWith(link.href + "/");
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`px-3 py-1.5 rounded-[6px] text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "text-primary bg-primary/10"
                  : "text-text-secondary hover:text-text-primary hover:bg-white/5"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </div>

      <div className="flex items-center gap-2 ml-auto">
        <Link
          href="/games"
          className="p-2 rounded-[6px] text-text-secondary hover:text-text-primary hover:bg-white/5 transition-colors"
        >
          <Search className="w-4 h-4" />
        </Link>

        {isAuthenticated && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-[12px] bg-canvas-card border border-border-muted">
            <span className="text-xs text-text-secondary font-medium">DEMO</span>
            <span className="text-sm font-semibold tabular-nums text-primary font-[family-name:var(--font-mono)]">
              {user?.balance.toLocaleString() ?? "0"}
            </span>
          </div>
        )}

        {isAuthenticated ? (
          <Link
            href="/profile"
            className="flex items-center gap-2 px-3 py-1.5 rounded-[12px] text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-white/5 transition-colors"
          >
            <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center">
              <User className="w-3.5 h-3.5 text-primary" />
            </div>
            <span className="hidden lg:inline">{user?.username ?? "Profile"}</span>
          </Link>
        ) : (
          <Link
            href="/login"
            className="px-4 py-2 rounded-[12px] text-sm font-semibold bg-primary text-canvas hover:shadow-[0_0_20px_rgba(0,245,160,0.3)] transition-all"
          >
            Sign In
          </Link>
        )}
      </div>
    </nav>
  );
}
