import { useState, useCallback, useEffect, useRef } from 'react';
import type { Direction, GameState, Grid, Tile } from '../types/game';
import {
  initializeGrid,
  addRandomTile,
  moveTiles,
  canMove,
  hasWon,
  getTilesFromGrid,
  clearAnimationState,
  resetTileIdCounter,
} from '../utils/gameLogic';

const BEST_SCORE_KEY = 'bubble2048_best_score';
const ANIMATION_DURATION = 150;
const BUBBLE_DELAY = 100;

function loadBestScore(): number {
  try {
    const saved = localStorage.getItem(BEST_SCORE_KEY);
    return saved ? parseInt(saved, 10) : 0;
  } catch {
    return 0;
  }
}

function saveBestScore(score: number): void {
  try {
    localStorage.setItem(BEST_SCORE_KEY, score.toString());
  } catch {
    // Ignore localStorage errors
  }
}

function createInitialGame(): { grid: Grid; tiles: Tile[] } {
  resetTileIdCounter();
  let grid = initializeGrid();
  const { grid: grid1 } = addRandomTile(grid);
  grid = grid1;
  const { grid: grid2 } = addRandomTile(grid);
  grid = grid2;
  return { grid, tiles: getTilesFromGrid(grid) };
}

export function useGameState() {
  const [gameState, setGameState] = useState<GameState>(() => {
    const { grid, tiles } = createInitialGame();
    return {
      grid,
      tiles,
      score: 0,
      bestScore: loadBestScore(),
      gameStatus: 'playing',
      hasWonOnce: false,
    };
  });

  const [isAnimating, setIsAnimating] = useState(false);
  const animationTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (gameState.score > gameState.bestScore) {
      saveBestScore(gameState.score);
      setGameState(prev => ({ ...prev, bestScore: gameState.score }));
    }
  }, [gameState.score, gameState.bestScore]);

  const startNewGame = useCallback(() => {
    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current);
    }
    const { grid, tiles } = createInitialGame();
    setGameState(prev => ({
      grid,
      tiles,
      score: 0,
      bestScore: prev.bestScore,
      gameStatus: 'playing',
      hasWonOnce: false,
    }));
    setIsAnimating(false);
  }, []);

  const continueAfterWin = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      gameStatus: 'playing',
      hasWonOnce: true,
    }));
  }, []);

  const move = useCallback(
    (direction: Direction) => {
      if (isAnimating || gameState.gameStatus === 'lost') return;
      if (gameState.gameStatus === 'won' && !gameState.hasWonOnce) return;

      const playerResult = moveTiles(gameState.grid, direction);

      if (!playerResult.moved) return;

      setIsAnimating(true);

      setGameState(prev => ({
        ...prev,
        grid: playerResult.grid,
        tiles: getTilesFromGrid(playerResult.grid),
        score: prev.score + playerResult.score,
      }));

      animationTimeoutRef.current = window.setTimeout(() => {
        const bubbleResult = moveTiles(playerResult.grid, 'up');

        if (bubbleResult.moved) {
          setGameState(prev => ({
            ...prev,
            grid: bubbleResult.grid,
            tiles: getTilesFromGrid(bubbleResult.grid),
            score: prev.score + bubbleResult.score,
          }));

          animationTimeoutRef.current = window.setTimeout(() => {
            const { grid: finalGrid } = addRandomTile(
              clearAnimationState(bubbleResult.grid)
            );
            const finalTiles = getTilesFromGrid(finalGrid);

            let newStatus = gameState.gameStatus;
            if (hasWon(finalGrid) && !gameState.hasWonOnce) {
              newStatus = 'won';
            } else if (!canMove(finalGrid)) {
              newStatus = 'lost';
            }

            setGameState(prev => ({
              ...prev,
              grid: finalGrid,
              tiles: finalTiles,
              gameStatus: newStatus,
            }));
            setIsAnimating(false);
          }, ANIMATION_DURATION);
        } else {
          const { grid: finalGrid } = addRandomTile(
            clearAnimationState(playerResult.grid)
          );
          const finalTiles = getTilesFromGrid(finalGrid);

          let newStatus = gameState.gameStatus;
          if (hasWon(finalGrid) && !gameState.hasWonOnce) {
            newStatus = 'won';
          } else if (!canMove(finalGrid)) {
            newStatus = 'lost';
          }

          setGameState(prev => ({
            ...prev,
            grid: finalGrid,
            tiles: finalTiles,
            gameStatus: newStatus,
          }));
          setIsAnimating(false);
        }
      }, ANIMATION_DURATION + BUBBLE_DELAY);
    },
    [gameState, isAnimating]
  );

  useEffect(() => {
    return () => {
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
    };
  }, []);

  return {
    gameState,
    isAnimating,
    move,
    startNewGame,
    continueAfterWin,
  };
}
