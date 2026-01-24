import React from 'react';
import { Grid } from './Grid';
import { ScoreBoard } from './ScoreBoard';
import { GameControls } from './GameControls';
import { GameOverModal } from './GameOverModal';
import { WinModal } from './WinModal';
import { useGameState } from '../hooks/useGameState';
import { useInputHandler } from '../hooks/useInputHandler';
import '../styles/GameContainer.css';

export const GameContainer: React.FC = () => {
  const { gameState, isAnimating, move, startNewGame, continueAfterWin } = useGameState();

  useInputHandler(move, isAnimating);

  const showGameOver = gameState.gameStatus === 'lost';
  const showWin = gameState.gameStatus === 'won' && !gameState.hasWonOnce;

  return (
    <div className="game-container">
      <header className="game-header">
        <h1 className="game-title">Bubble 2048</h1>
        <p className="game-subtitle">Merge numbers, watch them rise!</p>
      </header>

      <div className="game-info">
        <ScoreBoard score={gameState.score} bestScore={gameState.bestScore} />
        <GameControls onNewGame={startNewGame} />
      </div>

      <div className="grid-wrapper">
        <Grid tiles={gameState.tiles} />
        {showGameOver && (
          <GameOverModal score={gameState.score} onNewGame={startNewGame} />
        )}
        {showWin && (
          <WinModal
            score={gameState.score}
            onContinue={continueAfterWin}
            onNewGame={startNewGame}
          />
        )}
      </div>

      <div className="game-instructions">
        <p>Use arrow keys or swipe to move tiles</p>
        <p className="bubble-hint">After each move, tiles bubble up!</p>
      </div>
    </div>
  );
};
