import { type User } from "@/types";

const USER_KEY = "playvault_user";

function generateId(): string {
  return Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
}

function createUser(username: string, email: string): User {
  const now = new Date().toISOString();
  return {
    id: generateId(),
    username,
    email,
    avatar: `https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${username}`,
    balance: 10000,
    level: 1,
    xp: 0,
    gamesPlayed: 0,
    wins: 0,
    losses: 0,
    favoriteGame: "",
    achievements: [],
    gameHistory: [],
    joinedAt: now,
    lastLogin: now,
  };
}

function saveUser(user: User | null): void {
  if (typeof window === "undefined") return;
  try {
    if (user) {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER_KEY);
    }
  } catch {
    // storage unavailable
  }
}

function loadUser(): User | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function register(username: string, email: string, _password: string): User {
  const user = createUser(username, email);
  saveUser(user);
  return user;
}

export function login(email: string, _password: string): User | null {
  const existing = loadUser();
  if (existing && existing.email === email) {
    existing.lastLogin = new Date().toISOString();
    saveUser(existing);
    return existing;
  }
  const user = createUser(email.split("@")[0], email);
  saveUser(user);
  return user;
}

export function logout(): void {
  saveUser(null);
}

export function getCurrentUser(): User | null {
  return loadUser();
}

export function continueAsGuest(): User {
  const guestNum = Math.floor(Math.random() * 99999);
  const user = createUser(`Guest_${guestNum}`, `guest_${guestNum}@playvault.local`);
  user.username = `Guest_${guestNum}`;
  saveUser(user);
  return user;
}

export function updateUser(updated: User): void {
  saveUser(updated);
}
