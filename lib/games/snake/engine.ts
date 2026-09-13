export interface Point {
  x: number;
  y: number;
}

export type Direction = "up" | "down" | "left" | "right";

export interface SnakeState {
  snake: Point[];
  food: Point;
  direction: Direction;
  score: number;
  highScore: number;
  speed: number;
  isAlive: boolean;
  level: number;
}

export const GRID_SIZE = 20;

export function createInitialState(): SnakeState {
  const mid = Math.floor(GRID_SIZE / 2);
  return {
    snake: [
      { x: mid, y: mid },
      { x: mid - 1, y: mid },
      { x: mid - 2, y: mid },
    ],
    food: spawnFood([{ x: mid, y: mid }, { x: mid - 1, y: mid }, { x: mid - 2, y: mid }]),
    direction: "right",
    score: 0,
    highScore: 0,
    speed: 150,
    isAlive: true,
    level: 1,
  };
}

export function spawnFood(snake: Point[]): Point {
  let food: Point;
  do {
    food = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
  } while (snake.some(s => s.x === food.x && s.y === food.y));
  return food;
}

export function tick(state: SnakeState): SnakeState {
  if (!state.isAlive) return state;

  const head = state.snake[0];
  let newHead: Point;

  switch (state.direction) {
    case "up": newHead = { x: head.x, y: head.y - 1 }; break;
    case "down": newHead = { x: head.x, y: head.y + 1 }; break;
    case "left": newHead = { x: head.x - 1, y: head.y }; break;
    case "right": newHead = { x: head.x + 1, y: head.y }; break;
  }

  if (newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE) {
    return { ...state, isAlive: false };
  }

  if (state.snake.some(s => s.x === newHead.x && s.y === newHead.y)) {
    return { ...state, isAlive: false };
  }

  const ateFood = newHead.x === state.food.x && newHead.y === state.food.y;
  const newSnake = [newHead, ...state.snake];
  if (!ateFood) newSnake.pop();

  const newScore = ateFood ? state.score + 10 : state.score;
  const newLevel = Math.floor(newScore / 50) + 1;
  const newSpeed = Math.max(50, 150 - (newLevel - 1) * 15);

  return {
    ...state,
    snake: newSnake,
    food: ateFood ? spawnFood(newSnake) : state.food,
    score: newScore,
    highScore: Math.max(state.highScore, newScore),
    speed: newSpeed,
    level: newLevel,
  };
}

export function changeDirection(state: SnakeState, newDir: Direction): SnakeState {
  const opposites: Record<Direction, Direction> = { up: "down", down: "up", left: "right", right: "left" };
  if (opposites[newDir] === state.direction) return state;
  return { ...state, direction: newDir };
}
