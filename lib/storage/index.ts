const STORAGE_PREFIX = "playvault_";

export const storage = {
  get<T>(key: string): T | null {
    if (typeof window === "undefined") return null;
    try {
      const item = localStorage.getItem(STORAGE_PREFIX + key);
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  },

  set<T>(key: string, value: T): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
    } catch {
      // storage full or unavailable
    }
  },

  remove(key: string): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem(STORAGE_PREFIX + key);
  },

  clear(): void {
    if (typeof window === "undefined") return;
    Object.keys(localStorage)
      .filter((k) => k.startsWith(STORAGE_PREFIX))
      .forEach((k) => localStorage.removeItem(k));
  },
};
