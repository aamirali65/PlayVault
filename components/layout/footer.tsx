import Link from "next/link";

const footerSections = [
  {
    title: "Games",
    links: [
      { label: "Crash", href: "/games?category=crash" },
      { label: "Cards", href: "/games?category=cards" },
      { label: "Arcade", href: "/games?category=arcade" },
      { label: "Dice", href: "/games?category=dice" },
      { label: "Slots", href: "/games?category=slots" },
    ],
  },
  {
    title: "Community",
    links: [
      { label: "Leaderboard", href: "/leaderboard" },
      { label: "Tournaments", href: "/tournaments" },
      { label: "Rewards", href: "/rewards" },
      { label: "Promotions", href: "/promotions" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Help Center", href: "/help" },
      { label: "Contact", href: "/contact" },
      { label: "FAQ", href: "/faq" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Responsible Gaming", href: "/responsible-play" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-border bg-canvas-card/50 mt-auto">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-2 md:grid-cols-5">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-[8px] bg-gradient-to-br from-gold via-orange to-gold flex items-center justify-center shadow-[0_2px_8px_rgba(255,209,92,0.3)]">
                <span className="text-[#080A12] font-display font-black text-xs">PV</span>
              </div>
              <span className="font-display font-black text-base">
                <span className="text-gold">PLAY</span>
                <span className="text-text-primary">VAULT</span>
              </span>
            </Link>
            <p className="text-xs text-text-muted leading-relaxed">
              Demo gaming platform. No real money involved. Play for fun!
            </p>
          </div>

          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="text-xs font-extrabold text-gold uppercase tracking-wider mb-3">
                {section.title}
              </h3>
              <ul className="flex flex-col gap-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-text-muted hover:text-gold transition-colors font-semibold"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-border px-6 py-5">
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-text-muted font-semibold">
            &copy; 2024 PlayVault. All rights reserved. Demo mode only.
          </p>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-[6px] border border-gold/20 bg-gold/5 px-3 py-1 text-[10px] font-extrabold text-gold uppercase tracking-wider">
              DEMO MODE
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
