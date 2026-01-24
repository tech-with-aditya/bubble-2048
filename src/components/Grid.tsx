import React from 'react';
import { Tile } from './Tile';
import type { Tile as TileType } from '../types/game';
import '../styles/Grid.css';

interface GridProps {
  tiles: TileType[];
}

export const Grid: React.FC<GridProps> = ({ tiles }) => {
  return (
    <div className="grid-container">
      <div className="grid-background">
        {Array.from({ length: 16 }).map((_, index) => (
          <div key={index} className="grid-cell" />
        ))}
      </div>
      <div className="tiles-container">
        {tiles.map((tile) => (
          <Tile key={tile.id} tile={tile} />
        ))}
      </div>
    </div>
  );
};
