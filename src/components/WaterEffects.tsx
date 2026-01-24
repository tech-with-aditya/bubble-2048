import React from 'react';
import '../styles/WaterEffects.css';

export const WaterEffects: React.FC = React.memo(() => {
  return (
    <div className="water-effects">
      {/* Light rays from above */}
      <div className="light-rays">
        <div className="ray ray-1" />
        <div className="ray ray-2" />
        <div className="ray ray-3" />
      </div>

      {/* Caustics overlay */}
      <div className="caustics" />
    </div>
  );
});

WaterEffects.displayName = 'WaterEffects';
