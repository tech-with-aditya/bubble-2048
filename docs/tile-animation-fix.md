# Tile Sliding Animation Fix

## Problem Overview

The game implements two types of tile movements:
1. **Player moves** - tiles slide in the direction the player swipes
2. **Bubble shift** - after the player move, tiles automatically shift one row upward

Both movements should show smooth CSS slide animations, but initially only merge animations were visible.

## Root Cause

The issue stemmed from how CSS animations work with React component updates:

### 1. Base Transform Conflict
The `.tile` base class applied a `transform` that positioned tiles at their **final location** immediately:
```css
.tile {
  transform: translate(
    calc(var(--tile-x) * (100% + 13.33px) + 5px),
    calc(var(--tile-y) * (100% + 13.33px) + 5px)
  );
}
```

When `.tile-moving` animation was applied, the base transform took precedence, causing tiles to jump to their destination before the animation could run.

### 2. Animation State Persistence
When `cloneGrid()` was called, it copied the entire tile object including `previousPosition` from the last animation. This caused:
- Stale animation data to be reused
- Incorrect `previousPosition` values for new movements
- React components receiving tiles with mixed animation states

### 3. Animation Not Retriggering
React reuses DOM elements for components with the same `key` (tile ID). When the same element already had `.tile-moving` applied:
- CSS animations only start when the animation class is **first added**
- Changing CSS variables (`--prev-x`, `--prev-y`) alone doesn't restart the animation
- The animation appeared to not work because the browser never restarted it

## Solution

### 1. Conditional Base Transform
Only apply the base transform when the tile is NOT animating:
```css
/* Only apply base position when NOT animating */
.tile:not(.tile-moving):not(.tile-merged):not(.tile-new) {
  transform: translate(
    calc(var(--tile-x) * (100% + 13.33px) + 5px),
    calc(var(--tile-y) * (100% + 13.33px) + 5px)
  );
}
```

This ensures animations have full control over the `transform` property.

### 2. Clean Grid Cloning
Modified `cloneGrid()` to only copy core tile properties, excluding animation state:
```typescript
export function cloneGrid(grid: Grid): Grid {
  return grid.map(row =>
    row.map(cell =>
      cell
        ? {
            id: cell.id,
            value: cell.value,
            position: { ...cell.position },
            // Don't copy animation state - set fresh by move functions
          }
        : null
    )
  );
}
```

Each move function (`moveTiles`, `bubbleShiftUp`) now sets fresh `previousPosition` values.

### 3. Clear Animation State Between Phases
Before the bubble shift starts, clear the player move animation state:
```typescript
// In useGameState.ts
animationTimeoutRef.current = window.setTimeout(() => {
  const cleanedGrid = clearAnimationState(playerResult.grid);
  const bubbleResult = bubbleShiftUp(cleanedGrid);
  // ...
}, ANIMATION_DURATION + BUBBLE_DELAY);
```

### 4. Force Animation Restart with DOM Manipulation
Added a `useEffect` that directly manipulates the DOM to force animation restart:
```typescript
useEffect(() => {
  if (shouldAnimate && elementRef.current) {
    const element = elementRef.current;
    // Remove the animation class
    element.classList.remove('tile-moving');
    // Force a reflow to ensure browser registers the removal
    void element.offsetWidth;
    // Add the animation class back to restart the animation
    element.classList.add('tile-moving');
  }
}, [previousPosition?.row, previousPosition?.col, shouldAnimate]);
```

The `void element.offsetWidth` forces a browser reflow, ensuring the class removal is processed before re-adding it.

### 5. Direct Props-Based Animation Check
Removed state-based animation control in favor of direct prop checking:
```typescript
// Calculate directly from props, no state needed
const shouldAnimate = !!(previousPosition && !mergedFrom);
```

This eliminates the timing issues that occurred with `useState` and `useEffect` coordination.

## Results

- ✅ Player move tiles slide smoothly in the direction swiped
- ✅ Bubble shift tiles slide smoothly upward one row
- ✅ No flash/jump at the destination before animation
- ✅ Animations work for both moves and merges
- ✅ Animation duration: 150ms (snappy but visible)

## Key Learnings

1. **CSS animations don't restart automatically** - changing CSS variables isn't enough; the animation class must be removed and re-added
2. **Base styles can conflict with animations** - use `:not()` selectors to conditionally apply base styles
3. **React state timing matters** - direct prop calculations avoid render timing issues
4. **Force reflow when needed** - accessing `offsetWidth` ensures DOM changes are processed
5. **Clean state between phases** - clear animation properties between different movement phases to avoid conflicts

## Files Modified

- `src/components/Tile.tsx` - Added ref and useEffect for animation restart
- `src/styles/Tile.css` - Conditional base transform and wobble animation
- `src/utils/gameLogic.ts` - Clean grid cloning without animation state
- `src/hooks/useGameState.ts` - Clear animation state between move phases
