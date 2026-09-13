export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function formatCoins(n: number): string {
  return `${n.toLocaleString("en-US")} DEMO`;
}

export function formatNumber(n: number): string {
  return n.toLocaleString("en-US");
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
}

export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function randomMultiplier(): number {
  const houseEdge = 0.97;
  const r = Math.random();
  if (r === 0) return 1;
  const raw = houseEdge / r;
  return Math.max(1, Math.round(raw * 100) / 100);
}
