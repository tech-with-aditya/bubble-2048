# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Bubble 2048** is a web-based game created at Global Game Jam 2025 with the theme "Bubble". It's a variant of the classic 2048 game with unique mechanics:

- **Core gameplay**: 4x4 grid with swipe controls to merge numbers toward 2048
- **Unique twist**: After each player move, all numbers automatically move up (like bubbles rising), creating a second merge opportunity
- **Theme**: Ocean-themed with bubble-shaped grid elements

## Tech Stack

- **Framework**: React with minimal dependencies
- **Build tool**: Vite
- **Package manager**: npm
- **Deployment**: GitHub Pages

## Development Commands

### Setup and Development
```bash
npm install              # Install dependencies
npm run dev             # Start development server
npm run build           # Build for production
npm run preview         # Preview production build locally
```

### Testing and Quality
```bash
npm run lint            # Run ESLint (if configured)
npm test                # Run tests (if configured)
```

## Architecture Guidelines

### Game State Management
The game requires managing:
- **Grid state**: 4x4 array of tile values
- **Score tracking**: Current score and best score (persisted to localStorage)
- **Game status**: Playing, won (reached 2048), or game over (no moves available)
- **Animation state**: For smooth tile movements and merges

### Core Game Logic
Key mechanics to implement:

1. **Standard 2048 movement**: When player swipes, tiles move in that direction and merge
2. **Bubble mechanic**: After player's move completes, automatically move all tiles UP and merge again
3. **Spawn logic**: After both movements complete, spawn a new tile (2 or 4) in a random empty position

### Component Structure
Organize components logically:
- Game board container
- Individual tile components with position/value props
- Score display components
- Game control UI (new game, undo if implemented)
- Win/lose overlay modals

### Styling Approach
- Ocean/bubble theme with appropriate colors (blues, aquas)
- Bubble-shaped grid cells (consider border-radius or SVG)
- Smooth animations for tile movements and merges
- Responsive design for mobile and desktop

## Important Implementation Notes

### Movement Algorithm
The double-movement system is the unique feature:
```
1. Player swipes direction → tiles move & merge
2. Automatic upward movement → tiles move up & merge (bubble effect)
3. Spawn new tile in empty position
```

Both movements should use the same merge logic but in different directions.

### State Persistence
- Save best score to localStorage
- Consider saving current game state for page refresh recovery

### Performance Considerations
- Use React.memo or useMemo for tile rendering if performance issues arise
- Coordinate animations carefully to avoid visual glitches during the double-movement
- Debounce input to prevent multiple moves during animations

## Deployment

The game will be deployed to GitHub Pages:
```bash
npm run build           # Build production bundle
# Deploy dist/ folder to gh-pages branch
```

Configure Vite base path for GitHub Pages in vite.config.ts:
```ts
export default defineConfig({
  base: '/bubble-merge-2048/', // Replace with actual repo name
})
```
