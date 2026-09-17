"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Gamepad2, Radio, Gift, User } from "lucide-react";

const bottomLinks = [
  { label: "Home", href: "/", icon: Home },
  { label: "Games", href: "/games", icon: Gamepad2 },
  { label: "Live", href: "/live", icon: Radio },
  { label: "Rewards", href: "/rewards", icon: Gift },
  { label: "Profile", href: "/profile", icon: User },
];

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-canvas-card/95 backdrop-blur-xl safe-area-bottom">
      <div className="flex items-center justify-around h-[60px] px-1">
        {bottomLinks.map((link) => {
          const isActive =
            pathname === link.href ||
            (link.href !== "/" && pathname.startsWith(link.href));
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex flex-col items-center gap-1 px-3 py-2 rounded-[10px] transition-all duration-200 min-w-[52px] ${
                isActive
                  ? "text-gold"
                  : "text-text-disabled hover:text-text-muted"
              }`}
            >
              <div className={`p-1.5 rounded-[8px] transition-all ${isActive ? "bg-gold/10" : ""}`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-extrabold">{link.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
