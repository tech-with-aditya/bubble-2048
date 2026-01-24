import React from 'react';
import '../styles/Modal.css';

interface WinModalProps {
  score: number;
  onContinue: () => void;
  onNewGame: () => void;
}

export const WinModal: React.FC<WinModalProps> = ({ score, onContinue, onNewGame }) => {
  return (
    <div className="modal-overlay win-overlay">
      <div className="modal-content">
        <h2 className="modal-title win-title">You Win!</h2>
        <p className="modal-score">Score: {score}</p>
        <div className="modal-buttons">
          <button className="modal-button continue-button" onClick={onContinue}>
            Keep Playing
          </button>
          <button className="modal-button" onClick={onNewGame}>
            New Game
          </button>
        </div>
      </div>
    </div>
  );
};
