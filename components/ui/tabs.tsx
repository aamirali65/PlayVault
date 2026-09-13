"use client";

import { useState, type ReactNode } from "react";

interface Tab {
  key: string;
  label: string;
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
      <div className="flex gap-1 border-b border-border-muted mb-4">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => handleChange(tab.key)}
            className={[
              "px-4 py-2.5 text-sm font-medium transition-all duration-200 cursor-pointer relative",
              active === tab.key
                ? "text-primary"
                : "text-text-secondary hover:text-text-primary",
            ].join(" ")}
          >
            {tab.label}
            {active === tab.key && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
            )}
          </button>
        ))}
      </div>
      {children}
    </div>
  );
}

export { Tabs, type Tab, type TabsProps };
