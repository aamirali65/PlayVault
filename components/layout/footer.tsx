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
      { label: "Puzzle", href: "/games?category=puzzle" },
    ],
  },
  {
    title: "About",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Careers", href: "/careers" },
      { label: "Blog", href: "/blog" },
    ],
  },
  {
    title: "FAQ",
    links: [{ label: "FAQ", href: "/faq" }],
  },
  {
    title: "Support",
    links: [
      { label: "Contact", href: "/contact" },
      { label: "Help Center", href: "/help" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Responsible Play", href: "/responsible-play" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-border bg-background-secondary">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 md:grid-cols-5">
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-semibold text-text-primary mb-3">
                {section.title}
              </h3>
              <ul className="flex flex-col gap-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-text-muted hover:text-text-primary transition-colors"
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

      <div className="border-t border-border px-6 py-6">
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-text-muted">
            &copy; 2024 PlayVault. All rights reserved.
          </p>
          <span className="inline-flex items-center gap-1.5 rounded-md border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
            DEMO MODE - No real money
          </span>
        </div>
      </div>
    </footer>
  );
}
