"use client";

import { useState, useRef, useEffect } from "react";
import { Bell, Check, X } from "lucide-react";

interface Notification {
  id: number;
  message: string;
  read: boolean;
  time: string;
}

const INITIAL: Notification[] = [
  { id: 1, message: "New tournament: Weekend Challenge is live!", read: false, time: "2m ago" },
  { id: 2, message: "Daily bonus ready to claim!", read: false, time: "1h ago" },
  { id: 3, message: "You've been playing for 2 hours. Take a break!", read: false, time: "3h ago" },
  { id: 4, message: "Your rank improved to #15 on the leaderboard!", read: true, time: "5h ago" },
];

export function Notifications() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL);
  const ref = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  function removeNotification(id: number) {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="relative flex h-10 w-10 items-center justify-center rounded-[10px] bg-surface border border-border text-text-muted hover:text-gold hover:border-gold/30 transition-all cursor-pointer"
      >
        <Bell className="w-[18px] h-[18px]" />
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-gradient-to-b from-rose to-[#DC2626] text-[9px] font-black text-white px-1 shadow-[0_2px_6px_rgba(244,63,94,0.4)]">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 rounded-[14px] bg-canvas-card border border-border shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden z-50 animate-scale-in">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <span className="text-sm font-extrabold text-text-primary">Notifications</span>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="text-xs text-gold hover:underline cursor-pointer font-bold"
              >
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="px-4 py-10 text-center">
                <span className="text-3xl block mb-2">🔔</span>
                <p className="text-sm text-text-muted font-semibold">No notifications yet</p>
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className={`flex items-start gap-3 px-4 py-3 border-b border-border/50 transition-all ${
                    !n.read ? "bg-gold/[0.03]" : "hover:bg-white/[0.02]"
                  }`}
                >
                  <div className="mt-1">
                    {n.read ? (
                      <Check className="h-4 w-4 text-text-muted" />
                    ) : (
                      <span className="block h-2 w-2 rounded-full bg-gold shadow-[0_0_6px_rgba(255,209,92,0.5)]" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm ${n.read ? "text-text-muted" : "text-text-primary font-bold"}`}>
                      {n.message}
                    </p>
                    <span className="text-xs text-text-muted mt-0.5 block">{n.time}</span>
                  </div>
                  <button
                    onClick={() => removeNotification(n.id)}
                    className="shrink-0 text-text-muted hover:text-rose transition-colors cursor-pointer"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
