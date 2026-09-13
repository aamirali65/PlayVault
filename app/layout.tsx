import type { Metadata } from "next";
import { Sora, Inter, Space_Grotesk } from "next/font/google";
import ToastProvider from "@/components/ui/toast";
import MainLayout from "@/components/layout/main-layout";
import "./globals.css";

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "PlayVault - Play. Compete. Level Up.",
  description:
    "PlayVault is a demo gaming platform where you can play crash games, cards, arcade, dice, slots, and more. Compete in tournaments, climb leaderboards, and level up — all with virtual Demo Coins. No real money involved.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${sora.variable} ${inter.variable} ${spaceGrotesk.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-inter bg-background text-text-primary">
        <ToastProvider>
          <MainLayout>{children}</MainLayout>
        </ToastProvider>
      </body>
    </html>
  );
}
