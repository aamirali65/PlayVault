export interface User {
  id: string;
  username: string;
  email: string;
  avatar: string;
  balance: number;
  level: number;
  xp: number;
  gamesPlayed: number;
  wins: number;
  losses: number;
  favoriteGame: string;
  achievements: Achievement[];
  gameHistory: GameHistoryEntry[];
  joinedAt: string;
  lastLogin: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  progress: number;
  maxProgress: number;
}

export interface GameHistoryEntry {
  id: string;
  gameSlug: string;
  gameName: string;
  bet: number;
  payout: number;
  result: "win" | "loss" | "push";
  playedAt: string;
  details?: string;
}

export interface Game {
  slug: string;
  name: string;
  description: string;
  category: GameCategory;
  thumbnail: string;
  playerCount: number;
  howToPlay: string;
  isNew?: boolean;
  isPopular?: boolean;
}

export type GameCategory =
  | "all"
  | "popular"
  | "crash"
  | "cards"
  | "arcade"
  | "dice"
  | "slots"
  | "puzzle"
  | "live";

export interface DailyReward {
  day: number;
  amount: number;
  claimed: boolean;
}

export interface Tournament {
  id: string;
  name: string;
  description: string;
  game: string;
  entryFee: number;
  prize: number;
  startDate: string;
  endDate: string;
  participants: number;
  maxParticipants: number;
  bracket: BracketMatch[];
}

export interface BracketMatch {
  round: number;
  position: number;
  player1?: string;
  player2?: string;
  winner?: string;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  username: string;
  avatar: string;
  xp: number;
  level: number;
  gamesPlayed: number;
  wins: number;
}

export interface Promotion {
  id: string;
  title: string;
  description: string;
  icon: string;
  reward: number;
  expiresAt: string;
  claimed: boolean;
}

export interface RoundHistory {
  id: string;
  multiplier?: number;
  result?: string;
  payout?: number;
  bet?: number;
  timestamp: string;
  crashed?: boolean;
}
