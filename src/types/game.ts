export type Direction = 'up' | 'down' | 'left' | 'right';

export type GameStatus = 'playing' | 'won' | 'lost';

export interface Position {
  row: number;
  col: number;
}

export interface Tile {
  id: string;
  value: number;
  position: Position;
  mergedFrom?: [Tile, Tile];
  isNew?: boolean;
  previousPosition?: Position;
}

export type Grid = (Tile | null)[][];

export interface GameState {
  grid: Grid;
  tiles: Tile[];
  score: number;
  bestScore: number;
  gameStatus: GameStatus;
  hasWonOnce: boolean;
}

export interface MoveResult {
  grid: Grid;
  tiles: Tile[];
  score: number;
  moved: boolean;
}
