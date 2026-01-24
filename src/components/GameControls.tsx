import React from 'react';
import '../styles/GameControls.css';

interface GameControlsProps {
  onNewGame: () => void;
}

export const GameControls: React.FC<GameControlsProps> = ({ onNewGame }) => {
  return (
    <div className="game-controls">
      <button className="new-game-button" onClick={onNewGame}>
        New Game
      </button>
    </div>
  );
};
