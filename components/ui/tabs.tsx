"use client";

import { useState, type ReactNode } from "react";

interface Tab {
  key: string;
  label: string;
  icon?: ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
  onChange?: (key: string) => void;
  children: ReactNode;
}

function Tabs({ tabs, defaultTab, onChange, children }: TabsProps) {
  const [active, setActive] = useState(defaultTab || tabs[0]?.key || "");

  const handleChange = (key: string) => {
    setActive(key);
    onChange?.(key);
  };

  return (
    <div>
      <div className="flex gap-1 p-1 bg-surface rounded-[12px] border border-border mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => handleChange(tab.key)}
            className={[
              "flex-1 px-4 py-2.5 text-sm font-bold transition-all duration-200 cursor-pointer rounded-[8px] flex items-center justify-center gap-2",
              active === tab.key
                ? "bg-gradient-to-b from-gold/20 to-gold/10 text-gold shadow-[0_2px_8px_rgba(255,209,92,0.15)] border border-gold/20"
                : "text-text-muted hover:text-text-secondary",
            ].join(" ")}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>
      {children}
    </div>
  );
}

export { Tabs, type Tab, type TabsProps };
