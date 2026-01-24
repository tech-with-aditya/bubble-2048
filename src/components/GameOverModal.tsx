import React from 'react';
import '../styles/Modal.css';

interface GameOverModalProps {
  score: number;
  onNewGame: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({ score, onNewGame }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className="modal-title">Game Over!</h2>
        <p className="modal-score">Final Score: {score}</p>
        <button className="modal-button" onClick={onNewGame}>
          Try Again
        </button>
      </div>
    </div>
  );
};
