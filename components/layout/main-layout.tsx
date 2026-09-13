"use client";

import { type ReactNode } from "react";
import DesktopNav from "@/components/navigation/desktop-nav";
import MobileNav from "@/components/navigation/mobile-nav";

function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-canvas">
      <DesktopNav />
      <main className="flex-1">{children}</main>
      <MobileNav />
    </div>
  );
}

export default MainLayout;
