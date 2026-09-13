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
  { id: 1, message: "New tournament available: Weekend Challenge", read: false, time: "2m ago" },
  { id: 2, message: "Daily reward ready to claim!", read: false, time: "1h ago" },
  { id: 3, message: "You've been playing for 2 hours. Take a break!", read: false, time: "3h ago" },
  { id: 4, message: "Your rank improved to #15 on the leaderboard", read: true, time: "5h ago" },
];

export function Notifications() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL);
  const ref = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  function markAsRead(id: number) {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }

  function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  function removeNotification(id: number) {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-surface border border-border text-text-muted hover:text-text-primary hover:border-accent/40 transition-colors cursor-pointer"
      >
        <Bell className="h-4.5 w-4.5" />
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-danger text-[10px] font-bold text-white">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 rounded-xl bg-surface border border-border shadow-2xl overflow-hidden z-50">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <span className="text-sm font-semibold text-text-primary">Notifications</span>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="text-xs text-accent hover:underline cursor-pointer"
              >
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="px-4 py-8 text-center text-sm text-text-muted">
                No notifications
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className={`flex items-start gap-3 px-4 py-3 border-b border-border/50 ${
                    !n.read ? "bg-accent/[0.03]" : ""
                  }`}
                >
                  <div className="mt-0.5">
                    {n.read ? (
                      <Check className="h-4 w-4 text-text-muted" />
                    ) : (
                      <span className="block h-2 w-2 rounded-full bg-accent" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm ${n.read ? "text-text-muted" : "text-text-primary"}`}>
                      {n.message}
                    </p>
                    <span className="text-xs text-text-muted">{n.time}</span>
                  </div>
                  <button
                    onClick={() => removeNotification(n.id)}
                    className="shrink-0 text-text-muted hover:text-text-primary transition-colors cursor-pointer"
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
