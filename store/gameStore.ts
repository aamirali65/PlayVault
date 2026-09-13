import { create } from "zustand";
import { type GameCategory, type GameHistoryEntry } from "@/types";

const HISTORY_KEY = "playvault_game_history";

function loadHistory(): GameHistoryEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveHistory(entries: GameHistoryEntry[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(entries));
  } catch {
    // storage unavailable
  }
}

interface GameState {
  selectedCategory: GameCategory;
  searchQuery: string;
  currentGame: string | null;
  gameHistory: GameHistoryEntry[];

  setCategory: (category: GameCategory) => void;
  setSearch: (query: string) => void;
  setCurrentGame: (slug: string | null) => void;
  addGameHistory: (entry: GameHistoryEntry) => void;
  clearHistory: () => void;
}

export const useGameStore = create<GameState>((set) => ({
  selectedCategory: "all",
  searchQuery: "",
  currentGame: null,
  gameHistory: loadHistory(),

  setCategory: (category) => set({ selectedCategory: category }),
  setSearch: (query) => set({ searchQuery: query }),
  setCurrentGame: (slug) => set({ currentGame: slug }),

  addGameHistory: (entry) =>
    set((state) => {
      const updated = [entry, ...state.gameHistory].slice(0, 200);
      saveHistory(updated);
      return { gameHistory: updated };
    }),

  clearHistory: () => {
    saveHistory([]);
    set({ gameHistory: [] });
  },
}));
