"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Gamepad2, Radio, Gift, User } from "lucide-react";

const bottomLinks = [
  { label: "Home", href: "/", icon: Home },
  { label: "Casino", href: "/games", icon: Gamepad2 },
  { label: "Live", href: "/live", icon: Radio },
  { label: "Rewards", href: "/rewards", icon: Gift },
  { label: "Profile", href: "/profile", icon: User },
];

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-border-muted bg-canvas/95 backdrop-blur-xl safe-area-bottom">
      <div className="flex items-center justify-around h-14">
        {bottomLinks.map((link) => {
          const isActive =
            pathname === link.href ||
            (link.href !== "/" && pathname.startsWith(link.href));
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex flex-col items-center gap-0.5 px-2 py-1 transition-colors ${
                isActive ? "text-primary" : "text-text-disabled"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{link.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
