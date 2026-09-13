import { create } from "zustand";
import { type User, type GameHistoryEntry } from "@/types";
import * as wallet from "@/lib/wallet";
import * as auth from "@/lib/auth";

interface UserState {
  user: User | null;
  isAuthenticated: boolean;
  isGuest: boolean;

  setUser: (user: User | null) => void;
  login: (email: string, password: string) => User | null;
  register: (username: string, email: string, password: string) => User;
  logout: () => void;
  updateBalance: (balance: number) => void;
  addCoins: (amount: number, reason?: string) => void;
  removeCoins: (amount: number, reason?: string) => boolean;
  playGame: (gameName: string, bet: number, payout: number, details?: string) => void;
  updateProfile: (updates: Partial<User>) => void;
  resetBalance: () => void;
  continueAsGuest: () => User;
}

export const useUserStore = create<UserState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isGuest: false,

  setUser: (user) => set({ user, isAuthenticated: !!user }),

  login: (email, password) => {
    const user = auth.login(email, password);
    if (user) {
      const balance = wallet.getBalance();
      const synced = { ...user, balance };
      set({ user: synced, isAuthenticated: true, isGuest: false });
      auth.updateUser(synced);
      return synced;
    }
    return null;
  },

  register: (username, email, password) => {
    const user = auth.register(username, email, password);
    set({ user, isAuthenticated: true, isGuest: false });
    return user;
  },

  logout: () => {
    auth.logout();
    set({ user: null, isAuthenticated: false, isGuest: false });
  },

  updateBalance: (balance) => {
    const { user } = get();
    if (!user) return;
    const updated = { ...user, balance };
    set({ user: updated });
    auth.updateUser(updated);
  },

  addCoins: (amount, reason = "bonus") => {
    const { user } = get();
    if (!user) return;
    wallet.addDemoCoins(amount, reason);
    const balance = wallet.getBalance();
    const updated = { ...user, balance };
    set({ user: updated });
    auth.updateUser(updated);
  },

  removeCoins: (amount, reason = "bet") => {
    const { user } = get();
    if (!user) return false;
    const success = wallet.removeDemoCoins(amount, reason);
    if (!success) return false;
    const balance = wallet.getBalance();
    const updated = { ...user, balance };
    set({ user: updated });
    auth.updateUser(updated);
    return true;
  },

  playGame: (gameName, bet, payout, details) => {
    const { user } = get();
    if (!user) return;
    if (!wallet.canPlay(bet)) return;

    wallet.removeDemoCoins(bet, `play:${gameName}`);
    if (payout > 0) {
      wallet.addDemoCoins(payout, `win:${gameName}`);
    }

    const balance = wallet.getBalance();
    const isWin = payout > bet;

    const entry: GameHistoryEntry = {
      id: Math.random().toString(36).substring(2, 10),
      gameSlug: gameName.toLowerCase().replace(/\s+/g, "-"),
      gameName,
      bet,
      payout,
      result: isWin ? "win" : payout === 0 ? "loss" : "push",
      playedAt: new Date().toISOString(),
      details,
    };

    const updated: User = {
      ...user,
      balance,
      gamesPlayed: user.gamesPlayed + 1,
      wins: user.wins + (isWin ? 1 : 0),
      losses: user.losses + (payout === 0 ? 1 : 0),
      gameHistory: [entry, ...user.gameHistory].slice(0, 200),
    };

    set({ user: updated });
    auth.updateUser(updated);
  },

  updateProfile: (updates) => {
    const { user } = get();
    if (!user) return;
    const updated = { ...user, ...updates };
    set({ user: updated });
    auth.updateUser(updated);
  },

  resetBalance: () => {
    const { user } = get();
    if (!user) return;
    wallet.resetDemoBalance();
    const balance = wallet.getBalance();
    const updated = { ...user, balance };
    set({ user: updated });
    auth.updateUser(updated);
  },

  continueAsGuest: () => {
    const user = auth.continueAsGuest();
    set({ user, isAuthenticated: true, isGuest: true });
    return user;
  },
}));
