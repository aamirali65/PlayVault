import { generateResult } from "@/lib/fairness/rng";

export type RouletteColor = "red" | "black" | "green";
export type BetType = "red" | "black" | "green" | "odd" | "even" | "number" | "dozen1" | "dozen2" | "dozen3" | "column1" | "column2" | "column3";

const WHEEL_ORDER = [0,32,15,19,4,21,2,25,17,34,6,27,13,36,11,30,8,23,10,5,24,16,33,1,20,14,31,9,22,18,29,7,28,12,35,3,26];

const RED_NUMBERS = new Set([1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36]);

export interface SpinResult {
  number: number;
  color: RouletteColor;
  isOdd: boolean;
  isEven: boolean;
  position: number;
}

export interface RouletteHistoryEntry {
  number: number;
  color: RouletteColor;
}

export class RouletteEngine {
  history: RouletteHistoryEntry[] = [];

  getColor(number: number): RouletteColor {
    if (number === 0) return "green";
    return RED_NUMBERS.has(number) ? "red" : "black";
  }

  spin(serverSeed: string, clientSeed: string, nonce: number): SpinResult {
    const rand = generateResult(serverSeed, clientSeed, nonce);
    const number = Math.floor(rand * 37);
    const color = this.getColor(number);
    const isOdd = number % 2 === 1;
    const isEven = number % 2 === 0 && number !== 0;
    const position = WHEEL_ORDER.indexOf(number);

    const result: SpinResult = { number, color, isOdd, isEven, position };
    this.history.unshift({ number, color });
    if (this.history.length > 50) this.history.pop();
    return result;
  }

  calculatePayout(betType: BetType, betAmount: number, betNumber?: number): number {
    switch (betType) {
      case "number": return betAmount * 35;
      case "green": return betAmount * 35;
      case "red":
      case "black":
      case "odd":
      case "even": return betAmount * 2;
      case "dozen1":
      case "dozen2":
      case "dozen3": return betAmount * 3;
      case "column1":
      case "column2":
      case "column3": return betAmount * 3;
      default: return 0;
    }
  }

  checkWin(betType: BetType, spinResult: SpinResult, betNumber?: number): boolean {
    switch (betType) {
      case "red": return spinResult.color === "red";
      case "black": return spinResult.color === "black";
      case "green": return spinResult.color === "green";
      case "odd": return spinResult.isOdd;
      case "even": return spinResult.isEven;
      case "number": return betNumber === spinResult.number;
      case "dozen1": return spinResult.number >= 1 && spinResult.number <= 12;
      case "dozen2": return spinResult.number >= 13 && spinResult.number <= 24;
      case "dozen3": return spinResult.number >= 25 && spinResult.number <= 36;
      case "column1": return spinResult.number > 0 && spinResult.number % 3 === 1;
      case "column2": return spinResult.number > 0 && spinResult.number % 3 === 2;
      case "column3": return spinResult.number > 0 && spinResult.number % 3 === 0;
      default: return false;
    }
  }
}
