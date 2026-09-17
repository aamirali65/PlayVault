import { Shield, AlertTriangle, Phone, ExternalLink, Clock, Ban, UserX } from "lucide-react";

export const metadata = {
  title: "Responsible Play - PlayVault",
  description: "PlayVault promotes responsible gaming. Learn about our commitment to safe and enjoyable play.",
};

export default function ResponsiblePlayPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 md:py-16">
      <div className="mb-10 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gold/10 border border-gold/20">
          <Shield className="h-8 w-8 text-gold" />
        </div>
        <h1 className="font-display text-4xl font-extrabold tracking-tight">
          <span className="gaming-gradient-text">RESPONSIBLE PLAY</span>
        </h1>
        <p className="mt-3 text-text-secondary">Your wellbeing matters to us</p>
      </div>

      <div className="space-y-6">
        <section className="hud-panel rounded-2xl p-6">
          <h2 className="mb-3 text-lg font-bold font-display text-text-primary flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gold/10 border border-gold/20">
              <AlertTriangle className="h-4 w-4 text-gold" />
            </span>
            Demo Platform Notice
          </h2>
          <p className="text-sm leading-relaxed text-text-muted">
            PlayVault is a <span className="font-semibold text-text-primary">demo platform</span> designed
            for entertainment purposes only. All balances shown are{" "}
            <span className="font-semibold text-gold">virtual Demo Coins</span> with no real-world monetary value.
          </p>
          <ul className="mt-3 space-y-1.5 text-sm text-text-muted">
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
              No real money involved
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
              No deposits or withdrawals
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
              No cash prizes or rewards
            </li>
          </ul>
        </section>

        <section className="hud-panel rounded-2xl p-6">
          <h2 className="mb-3 text-lg font-bold font-display text-text-primary flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-success/10 border border-success/20">
              <Shield className="h-4 w-4 text-success" />
            </span>
            Play Responsibly
          </h2>
          <div className="space-y-3 text-sm text-text-muted leading-relaxed">
            <p>Gaming should be fun and entertaining. Here are some guidelines to keep your experience positive:</p>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-success" />
                Set time limits for your gaming sessions
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-success" />
                Take regular breaks every hour
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-success" />
                Never play when feeling stressed or upset
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-success" />
                Balance gaming with other activities
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-success" />
                Remember: it&apos;s just a game
              </li>
            </ul>
          </div>
        </section>

        <section className="hud-panel rounded-2xl p-6">
          <h2 className="mb-3 text-lg font-bold font-display text-text-primary flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-warning/10 border border-warning/20">
              <Clock className="h-4 w-4 text-warning" />
            </span>
            Self-Exclusion
          </h2>
          <p className="text-sm text-text-muted leading-relaxed">
            If you feel you need a break from gaming, you can use our self-exclusion feature.
            This will temporarily disable your account for a period of your choice.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <button className="hud-panel rounded-xl border border-border px-5 py-2.5 text-sm font-bold text-text-primary hover:border-gold/30 hover:bg-gold/5 transition-all">
              <Clock className="inline h-4 w-4 mr-1.5 text-gold" />
              Take a Break (24h)
            </button>
            <button className="hud-panel rounded-xl border border-border px-5 py-2.5 text-sm font-bold text-text-primary hover:border-gold/30 hover:bg-gold/5 transition-all">
              <Ban className="inline h-4 w-4 mr-1.5 text-gold" />
              Self-Exclude (7 days)
            </button>
            <button className="hud-panel rounded-xl border border-danger/30 bg-danger/5 px-5 py-2.5 text-sm font-bold text-danger hover:bg-danger/10 transition-all">
              <UserX className="inline h-4 w-4 mr-1.5" />
              Self-Exclude (30 days)
            </button>
          </div>
        </section>

        <section className="hud-panel rounded-2xl p-6">
          <h2 className="mb-3 text-lg font-bold font-display text-text-primary">Age Verification</h2>
          <p className="text-sm text-text-muted leading-relaxed">
            PlayVault is intended for users aged 18 and above. By using this platform, you confirm
            that you are at least 18 years old and have the legal capacity to participate in
            entertainment activities of this nature.
          </p>
        </section>

        <section className="hud-panel rounded-2xl p-6">
          <h2 className="mb-3 text-lg font-bold font-display text-text-primary">Need Help?</h2>
          <p className="mb-4 text-sm text-text-muted leading-relaxed">
            If you or someone you know has a gambling problem, help is available.
          </p>
          <div className="space-y-3">
            <a
              href="https://www.begambleaware.org"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 hud-panel rounded-xl p-4 text-sm text-text-primary hover:border-gold/20 hover:bg-gold/5 transition-all"
            >
              <ExternalLink className="h-4 w-4 text-gold shrink-0" />
              <div>
                <span className="font-bold">BeGambleAware</span>
                <span className="ml-2 text-text-muted">begambleaware.org</span>
              </div>
            </a>
            <a
              href="https://www.gamblersanonymous.org"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 hud-panel rounded-xl p-4 text-sm text-text-primary hover:border-gold/20 hover:bg-gold/5 transition-all"
            >
              <ExternalLink className="h-4 w-4 text-gold shrink-0" />
              <div>
                <span className="font-bold">Gamblers Anonymous</span>
                <span className="ml-2 text-text-muted">gamblersanonymous.org</span>
              </div>
            </a>
            <a
              href="tel:1-800-522-4700"
              className="flex items-center gap-3 hud-panel rounded-xl p-4 text-sm text-text-primary hover:border-gold/20 hover:bg-gold/5 transition-all"
            >
              <Phone className="h-4 w-4 text-gold shrink-0" />
              <div>
                <span className="font-bold">National Problem Gambling Helpline</span>
                <span className="ml-2 text-text-muted">1-800-522-4700</span>
              </div>
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
