const WALLET_KEY = "playvault_balance";
const DEFAULT_BALANCE = 10000;

function readBalance(): number {
  if (typeof window === "undefined") return DEFAULT_BALANCE;
  try {
    const raw = localStorage.getItem(WALLET_KEY);
    return raw ? parseInt(raw, 10) : DEFAULT_BALANCE;
  } catch {
    return DEFAULT_BALANCE;
  }
}

function writeBalance(balance: number): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(WALLET_KEY, String(balance));
  } catch {
    // storage unavailable
  }
}

export function getBalance(): number {
  return readBalance();
}

export function addDemoCoins(amount: number, reason: string): void {
  if (amount < 0) throw new Error("Amount must be non-negative");
  const current = readBalance();
  writeBalance(current + amount);
  logTransaction("add", amount, reason);
}

export function removeDemoCoins(amount: number, reason: string): boolean {
  if (amount < 0) throw new Error("Amount must be non-negative");
  const current = readBalance();
  if (current < amount) return false;
  writeBalance(current - amount);
  logTransaction("remove", amount, reason);
  return true;
}

export function canPlay(stake: number): boolean {
  return readBalance() >= stake;
}

export function resetDemoBalance(): void {
  writeBalance(DEFAULT_BALANCE);
}

function logTransaction(type: "add" | "remove", amount: number, reason: string): void {
  const key = "playvault_transactions";
  try {
    const raw = localStorage.getItem(key);
    const txns: Array<{ type: string; amount: number; reason: string; time: number }> = raw ? JSON.parse(raw) : [];
    txns.unshift({ type, amount, reason, time: Date.now() });
    if (txns.length > 200) txns.length = 200;
    localStorage.setItem(key, JSON.stringify(txns));
  } catch {
    // ignore
  }
}

export function syncUserBalance(user: { balance: number }): number {
  return readBalance();
}
