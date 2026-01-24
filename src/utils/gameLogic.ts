import type { Direction, Grid, Tile, Position, MoveResult } from '../types/game';

const GRID_SIZE = 4;

let tileIdCounter = 0;

export function generateTileId(): string {
  return `tile-${++tileIdCounter}`;
}

export function resetTileIdCounter(): void {
  tileIdCounter = 0;
}

export function initializeGrid(): Grid {
  const grid: Grid = [];
  for (let row = 0; row < GRID_SIZE; row++) {
    grid[row] = [];
    for (let col = 0; col < GRID_SIZE; col++) {
      grid[row][col] = null;
    }
  }
  return grid;
}

export function getEmptyCells(grid: Grid): Position[] {
  const emptyCells: Position[] = [];
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      if (!grid[row][col]) {
        emptyCells.push({ row, col });
      }
    }
  }
  return emptyCells;
}

export function addRandomTile(grid: Grid): { grid: Grid; newTile: Tile | null } {
  const emptyCells = getEmptyCells(grid);
  if (emptyCells.length === 0) {
    return { grid, newTile: null };
  }

  const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  const value = Math.random() < 0.9 ? 2 : 4;

  const newTile: Tile = {
    id: generateTileId(),
    value,
    position: randomCell,
    isNew: true,
  };

  const newGrid = cloneGrid(grid);
  newGrid[randomCell.row][randomCell.col] = newTile;

  return { grid: newGrid, newTile };
}

export function cloneGrid(grid: Grid): Grid {
  return grid.map(row =>
    row.map(cell =>
      cell
        ? {
            id: cell.id,
            value: cell.value,
            position: { ...cell.position },
            // Don't copy animation state - it should be set fresh by move functions
          }
        : null
    )
  );
}

export function getTilesFromGrid(grid: Grid): Tile[] {
  const tiles: Tile[] = [];
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      const tile = grid[row][col];
      if (tile) {
        tiles.push(tile);
      }
    }
  }
  return tiles;
}

function getTraversalOrder(direction: Direction): { rows: number[]; cols: number[] } {
  const rows = [0, 1, 2, 3];
  const cols = [0, 1, 2, 3];

  if (direction === 'down') {
    rows.reverse();
  }
  if (direction === 'right') {
    cols.reverse();
  }

  return { rows, cols };
}

function getVector(direction: Direction): Position {
  const vectors: Record<Direction, Position> = {
    up: { row: -1, col: 0 },
    down: { row: 1, col: 0 },
    left: { row: 0, col: -1 },
    right: { row: 0, col: 1 },
  };
  return vectors[direction];
}

function isWithinBounds(position: Position): boolean {
  return (
    position.row >= 0 &&
    position.row < GRID_SIZE &&
    position.col >= 0 &&
    position.col < GRID_SIZE
  );
}

function findFarthestPosition(
  grid: Grid,
  position: Position,
  vector: Position
): { farthest: Position; next: Position | null } {
  let previous: Position;
  let current = position;

  do {
    previous = current;
    current = {
      row: previous.row + vector.row,
      col: previous.col + vector.col,
    };
  } while (isWithinBounds(current) && !grid[current.row][current.col]);

  return {
    farthest: previous,
    next: isWithinBounds(current) ? current : null,
  };
}

export function moveTiles(grid: Grid, direction: Direction): MoveResult {
  const newGrid = cloneGrid(grid);
  const { rows, cols } = getTraversalOrder(direction);
  const vector = getVector(direction);
  let score = 0;
  let moved = false;

  const mergedTiles = new Set<string>();

  for (const row of rows) {
    for (const col of cols) {
      const tile = newGrid[row][col];
      if (!tile) continue;

      const { farthest, next } = findFarthestPosition(newGrid, { row, col }, vector);

      const nextTile = next ? newGrid[next.row][next.col] : null;
      const canMerge =
        nextTile &&
        nextTile.value === tile.value &&
        !mergedTiles.has(`${next!.row}-${next!.col}`);

      if (canMerge && next) {
        const mergedValue = tile.value * 2;
        const mergedTile: Tile = {
          id: generateTileId(),
          value: mergedValue,
          position: next,
          mergedFrom: [tile, nextTile!],
          previousPosition: tile.position,
        };

        newGrid[row][col] = null;
        newGrid[next.row][next.col] = mergedTile;
        mergedTiles.add(`${next.row}-${next.col}`);
        score += mergedValue;
        moved = true;
      } else if (farthest.row !== row || farthest.col !== col) {
        const movedTile: Tile = {
          id: tile.id,
          value: tile.value,
          position: farthest,
          previousPosition: { row, col },
          isNew: false,
        };

        newGrid[row][col] = null;
        newGrid[farthest.row][farthest.col] = movedTile;
        moved = true;
      } else {
        newGrid[row][col] = {
          id: tile.id,
          value: tile.value,
          position: tile.position,
          isNew: false,
        };
      }
    }
  }

  return {
    grid: newGrid,
    tiles: getTilesFromGrid(newGrid),
    score,
    moved,
  };
}

export function bubbleShiftUp(grid: Grid): MoveResult {
  const newGrid = cloneGrid(grid);
  let score = 0;
  let moved = false;

  // Process from top to bottom (row 1 to 3, skipping row 0 as it can't move up)
  for (let row = 1; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      const tile = newGrid[row][col];
      if (!tile) continue;

      const targetRow = row - 1;
      const targetTile = newGrid[targetRow][col];

      // Check if we can merge with the tile above
      if (targetTile && targetTile.value === tile.value) {
        const mergedValue = tile.value * 2;
        const mergedTile: Tile = {
          id: generateTileId(),
          value: mergedValue,
          position: { row: targetRow, col },
          mergedFrom: [tile, targetTile],
          previousPosition: tile.position,
        };

        newGrid[row][col] = null;
        newGrid[targetRow][col] = mergedTile;
        score += mergedValue;
        moved = true;
      }
      // Check if the space above is empty
      else if (!targetTile) {
        const movedTile: Tile = {
          id: tile.id,
          value: tile.value,
          position: { row: targetRow, col },
          previousPosition: { row, col },
          isNew: false,
        };

        newGrid[row][col] = null;
        newGrid[targetRow][col] = movedTile;
        moved = true;
      }
      // Tile stays in place
      else {
        newGrid[row][col] = {
          id: tile.id,
          value: tile.value,
          position: tile.position,
          isNew: false,
        };
      }
    }
  }

  // Update tiles in row 0 to clear animation state
  for (let col = 0; col < GRID_SIZE; col++) {
    const tile = newGrid[0][col];
    if (tile && !tile.previousPosition) {
      newGrid[0][col] = {
        id: tile.id,
        value: tile.value,
        position: tile.position,
        isNew: false,
      };
    }
  }

  return {
    grid: newGrid,
    tiles: getTilesFromGrid(newGrid),
    score,
    moved,
  };
}

export function processBubbleMove(
  grid: Grid,
  direction: Direction
): { result: MoveResult; bubbleResult: MoveResult | null } {
  const result = moveTiles(grid, direction);

  if (!result.moved) {
    return { result, bubbleResult: null };
  }

  const bubbleResult = moveTiles(result.grid, 'up');

  return { result, bubbleResult: bubbleResult.moved ? bubbleResult : null };
}

export function canMove(grid: Grid): boolean {
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      if (!grid[row][col]) {
        return true;
      }
    }
  }

  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      const tile = grid[row][col];
      if (!tile) continue;

      const neighbors = [
        { row: row - 1, col },
        { row: row + 1, col },
        { row, col: col - 1 },
        { row, col: col + 1 },
      ];

      for (const neighbor of neighbors) {
        if (isWithinBounds(neighbor)) {
          const neighborTile = grid[neighbor.row][neighbor.col];
          if (neighborTile && neighborTile.value === tile.value) {
            return true;
          }
        }
      }
    }
  }

  return false;
}

export function hasWon(grid: Grid): boolean {
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      const tile = grid[row][col];
      if (tile && tile.value >= 2048) {
        return true;
      }
    }
  }
  return false;
}

export function clearAnimationState(grid: Grid): Grid {
  return grid.map(row =>
    row.map(cell =>
      cell
        ? {
            ...cell,
            isNew: false,
            mergedFrom: undefined,
            previousPosition: undefined,
          }
        : null
    )
  );
}
