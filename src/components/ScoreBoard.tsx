import React from 'react';
import '../styles/ScoreBoard.css';

interface ScoreBoardProps {
  score: number;
  bestScore: number;
}

export const ScoreBoard: React.FC<ScoreBoardProps> = ({ score, bestScore }) => {
  return (
    <div className="score-board">
      <div className="score-box">
        <div className="score-label">SCORE</div>
        <div className="score-value">{score}</div>
      </div>
      <div className="score-box">
        <div className="score-label">BEST</div>
        <div className="score-value">{bestScore}</div>
      </div>
    </div>
  );
};
