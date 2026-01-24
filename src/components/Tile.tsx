import React, { useEffect, useRef, useState } from 'react';
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

function getTileBackground(value: number): string {
  const colors = TILE_COLORS[value] || { background: '#9c27b0' };
  return colors.background;
}

function getFontSize(value: number): string {
  if (value < 100) return '2.5rem';
  if (value < 1000) return '2rem';
  return '1.5rem';
}

export const Tile: React.FC<TileProps> = React.memo(({ tile }) => {
  const { value, position, isNew, mergedFrom, previousPosition } = tile;
  const elementRef = useRef<HTMLDivElement>(null);

  // Determine if this tile should animate - directly from props, no state needed
  const shouldAnimate = !!(previousPosition && !mergedFrom);

  // Force animation restart by manipulating the DOM directly
  useEffect(() => {
    if (shouldAnimate && elementRef.current) {
      const element = elementRef.current;
      // Remove the animation class
      element.classList.remove('tile-moving');
      // Force a reflow
      void element.offsetWidth;
      // Add the animation class back
      element.classList.add('tile-moving');
    }
  }, [previousPosition?.row, previousPosition?.col, shouldAnimate]);

  // Generate a consistent delay based on position so tiles wobble out of sync
  const wobbleDelay = ((position.row * 4 + position.col) * 0.2) % 3;

  const cssVars: Record<string, number | string> = {
    '--tile-x': position.col,
    '--tile-y': position.row,
    '--wobble-delay': `${wobbleDelay}s`,
  };

  // Set previous position for slide animation
  if (previousPosition) {
    cssVars['--prev-x'] = previousPosition.col;
    cssVars['--prev-y'] = previousPosition.row;
    // Add a unique animation name to force restart when positions change
    cssVars['--anim-key'] = `${previousPosition.row}-${previousPosition.col}-to-${position.row}-${position.col}`;
  }

  // Calculate merge direction for the incoming bubble
  if (mergedFrom && previousPosition) {
    const offsetX = previousPosition.col - position.col;
    const offsetY = previousPosition.row - position.row;
    cssVars['--merge-offset-x'] = offsetX;
    cssVars['--merge-offset-y'] = offsetY;
    // Get the color of the pre-merged tile (half the current value)
    cssVars['--merge-bubble-color'] = getTileBackground(value / 2);
  }

  const style: React.CSSProperties = {
    ...getTileStyle(value),
    fontSize: getFontSize(value),
    ...cssVars,
  } as React.CSSProperties;

  const classNames = ['tile'];
  if (isNew) classNames.push('tile-new');
  if (mergedFrom) classNames.push('tile-merged');
  if (previousPosition && !mergedFrom && shouldAnimate) classNames.push('tile-moving');

  // For merged tiles, render the incoming bubble
  const showMergeBubble = mergedFrom && previousPosition;

  return (
    <div ref={elementRef} className={classNames.join(' ')} style={style}>
      <span className="tile-value">{value}</span>
      {showMergeBubble && (
        <div
          className="merge-incoming-bubble"
          style={{ backgroundColor: getTileBackground(value / 2) }}
        />
      )}
    </div>
  );
});

Tile.displayName = 'Tile';
