import { useEffect, useCallback, useRef } from 'react';
import type { Direction } from '../types/game';

interface Position {
  x: number;
  y: number;
}

const SWIPE_THRESHOLD = 30;

function getDirectionFromDelta(deltaX: number, deltaY: number): Direction | null {
  const absDeltaX = Math.abs(deltaX);
  const absDeltaY = Math.abs(deltaY);

  if (Math.max(absDeltaX, absDeltaY) < SWIPE_THRESHOLD) {
    return null;
  }

  if (absDeltaX > absDeltaY) {
    return deltaX > 0 ? 'right' : 'left';
  } else {
    return deltaY > 0 ? 'down' : 'up';
  }
}

export function useInputHandler(
  onMove: (direction: Direction) => void,
  disabled: boolean = false
) {
  const dragStartRef = useRef<Position | null>(null);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (disabled) return;

      const keyDirectionMap: Record<string, Direction> = {
        ArrowUp: 'up',
        ArrowDown: 'down',
        ArrowLeft: 'left',
        ArrowRight: 'right',
        w: 'up',
        W: 'up',
        s: 'down',
        S: 'down',
        a: 'left',
        A: 'left',
        d: 'right',
        D: 'right',
      };

      const direction = keyDirectionMap[event.key];
      if (direction) {
        event.preventDefault();
        onMove(direction);
      }
    },
    [onMove, disabled]
  );

  // Touch events (mobile)
  const handleTouchStart = useCallback(
    (event: TouchEvent) => {
      if (disabled) return;
      const touch = event.touches[0];
      dragStartRef.current = { x: touch.clientX, y: touch.clientY };
    },
    [disabled]
  );

  const handleTouchEnd = useCallback(
    (event: TouchEvent) => {
      if (disabled || !dragStartRef.current) return;

      const touch = event.changedTouches[0];
      const deltaX = touch.clientX - dragStartRef.current.x;
      const deltaY = touch.clientY - dragStartRef.current.y;

      dragStartRef.current = null;

      const direction = getDirectionFromDelta(deltaX, deltaY);
      if (direction) {
        onMove(direction);
      }
    },
    [onMove, disabled]
  );

  // Mouse events (desktop)
  const handleMouseDown = useCallback(
    (event: MouseEvent) => {
      if (disabled) return;
      dragStartRef.current = { x: event.clientX, y: event.clientY };
    },
    [disabled]
  );

  const handleMouseUp = useCallback(
    (event: MouseEvent) => {
      if (disabled || !dragStartRef.current) return;

      const deltaX = event.clientX - dragStartRef.current.x;
      const deltaY = event.clientY - dragStartRef.current.y;

      dragStartRef.current = null;

      const direction = getDirectionFromDelta(deltaX, deltaY);
      if (direction) {
        onMove(direction);
      }
    },
    [onMove, disabled]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleKeyDown, handleTouchStart, handleTouchEnd, handleMouseDown, handleMouseUp]);
}
