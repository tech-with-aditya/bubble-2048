import React, { useMemo } from 'react';
import '../styles/BackgroundBubbles.css';

interface Bubble {
  id: number;
  left: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
}

const BUBBLE_COUNT = 15;

export const BackgroundBubbles: React.FC = React.memo(() => {
  const bubbles = useMemo<Bubble[]>(() => {
    return Array.from({ length: BUBBLE_COUNT }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: 4 + Math.random() * 12,
      duration: 8 + Math.random() * 12,
      delay: Math.random() * 10,
      opacity: 0.1 + Math.random() * 0.2,
    }));
  }, []);

  return (
    <div className="background-bubbles">
      {bubbles.map((bubble) => (
        <div
          key={bubble.id}
          className="bg-bubble"
          style={{
            left: `${bubble.left}%`,
            width: `${bubble.size}px`,
            height: `${bubble.size}px`,
            animationDuration: `${bubble.duration}s`,
            animationDelay: `${bubble.delay}s`,
            opacity: bubble.opacity,
          }}
        />
      ))}
    </div>
  );
});

BackgroundBubbles.displayName = 'BackgroundBubbles';
