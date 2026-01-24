import React from 'react';
import type { Tile as TileType } from '../types/game';
import '../styles/Tile.css';

interface TileProps {
  tile: TileType;
}

const TILE_COLORS: Record<number, { background: string; text: string }> = {
  2: { background: '#e8f4f8', text: '#1a5276' },
  4: { background: '#d4effc', text: '#1a5276' },
  8: { background: '#81d4fa', text: '#ffffff' },
  16: { background: '#4fc3f7', text: '#ffffff' },
  32: { background: '#29b6f6', text: '#ffffff' },
  64: { background: '#03a9f4', text: '#ffffff' },
  128: { background: '#00bcd4', text: '#ffffff' },
  256: { background: '#009688', text: '#ffffff' },
  512: { background: '#26a69a', text: '#ffffff' },
  1024: { background: '#4db6ac', text: '#ffffff' },
  2048: { background: '#ffd700', text: '#1a5276' },
};

function getTileStyle(value: number) {
  const colors = TILE_COLORS[value] || { background: '#9c27b0', text: '#ffffff' };
  return {
    backgroundColor: colors.background,
    color: colors.text,
  };
}

function getFontSize(value: number): string {
  if (value < 100) return '2.5rem';
  if (value < 1000) return '2rem';
  return '1.5rem';
}

export const Tile: React.FC<TileProps> = React.memo(({ tile }) => {
  const { value, position, isNew, mergedFrom, previousPosition } = tile;

  // Generate a consistent delay based on position so tiles wobble out of sync
  const wobbleDelay = ((position.row * 4 + position.col) * 0.2) % 3;

  const cssVars: Record<string, number | string> = {
    '--tile-x': position.col,
    '--tile-y': position.row,
    '--wobble-delay': `${wobbleDelay}s`,
  };

  if (previousPosition) {
    cssVars['--prev-x'] = previousPosition.col;
    cssVars['--prev-y'] = previousPosition.row;
  }

  const style: React.CSSProperties = {
    ...getTileStyle(value),
    fontSize: getFontSize(value),
    ...cssVars,
  } as React.CSSProperties;

  const classNames = ['tile'];
  if (isNew) classNames.push('tile-new');
  if (mergedFrom) classNames.push('tile-merged');
  if (previousPosition) classNames.push('tile-moving');

  return (
    <div className={classNames.join(' ')} style={style}>
      {value}
    </div>
  );
});

Tile.displayName = 'Tile';
