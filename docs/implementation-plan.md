# Bubble 2048 - Implementation Plan

## Phase 1: Project Setup & Foundation

### 1.1 Initialize Project Structure
- [x] Create Vite + React + TypeScript project
- [x] Configure GitHub Pages deployment in `vite.config.ts`
- [x] Set up basic folder structure:
  ```
  src/
    components/     # React components
    hooks/          # Custom hooks
    utils/          # Game logic utilities
    types/          # TypeScript types
    styles/         # CSS/styling
    assets/         # Images, fonts
  ```
- [x] Configure base path for GitHub Pages deployment

### 1.2 Core Type Definitions
- [x] Define `Tile` type (id, value, position)
- [x] Define `Grid` type (4x4 array structure)
- [x] Define `GameState` type (grid, score, bestScore, gameStatus)
- [x] Define `Direction` enum (UP, DOWN, LEFT, RIGHT)
- [x] Define `GameStatus` enum (PLAYING, WON, LOST)

---

## Phase 2: Game Logic Implementation

### 2.1 Grid Management Utilities
- [x] `initializeGrid()` - Create empty 4x4 grid
- [x] `addRandomTile()` - Spawn new tile (2 or 4) in random empty cell
- [x] `getEmptyCells()` - Return array of empty cell positions
- [x] `cloneGrid()` - Deep copy grid for state management

### 2.2 Core Movement Logic
- [x] `moveTiles(grid, direction)` - Move tiles in specified direction
  - [x] Implement slide logic (move to furthest empty position)
  - [x] Implement merge logic (combine same values)
  - [x] Return new grid and points earned
- [x] `canMove(grid)` - Check if any valid moves exist (game over detection)
- [x] `hasWon(grid)` - Check if 2048 tile exists

### 2.3 Unique Bubble Mechanic
- [x] `bubbleShiftUp(grid)` - Shift all tiles one row upward with merging
  1. Player's directional move (LEFT/RIGHT/DOWN/UP)
  2. Automatic upward shift (one row at a time, not to top)
- [x] Return combined results (final grid, total score from both moves)
- [x] Handle animation coordination between the two movements
- [x] **Fixed animation issues** - see [docs/tile-animation-fix.md](tile-animation-fix.md)

---

## Phase 3: React Component Architecture

### 3.1 Game State Management
- [x] Create `useGameState` hook:
  - [x] Manage grid state
  - [x] Manage score and best score
  - [x] Manage game status (playing/won/lost)
  - [x] Handle localStorage for best score persistence
  - [x] Expose game actions (move, newGame, restart)

### 3.2 Input Handling
- [x] Create `useInputHandler` hook:
  - [x] Detect touch swipes on mobile
  - [x] Detect keyboard arrow keys on desktop
  - [x] Detect mouse drag on desktop
  - [x] Prevent moves during animations
  - [x] Return direction of swipe/keypress

### 3.3 Animation System
- [x] Animation state tracking (isAnimating) - built into useGameState
- [x] Coordinate tile movement animations - CSS transitions
- [x] Coordinate merge animations - CSS animations
- [x] Handle sequential animations (player move → bubble move)

### 3.4 Component Hierarchy
```
<App>
  └─ <GameContainer>
      ├─ <ScoreBoard>
      │   ├─ <Score current={score} />
      │   └─ <Score best={bestScore} />
      ├─ <Grid>
      │   └─ <Tile> (multiple, positioned absolutely)
      └─ <GameControls>
          └─ <NewGameButton>
  └─ <GameOverModal> (conditional)
  └─ <WinModal> (conditional)
```

### Component Details:
- [x] `App.tsx` - Root component, global state
- [x] `GameContainer.tsx` - Main game wrapper, handles input
- [x] `Grid.tsx` - 4x4 grid layout, bubble styling
- [x] `Tile.tsx` - Individual tile with value, animations
- [x] `ScoreBoard.tsx` - Display current and best score
- [x] `GameControls.tsx` - New game button, instructions
- [x] `GameOverModal.tsx` - Game over overlay
- [x] `WinModal.tsx` - Victory overlay (with continue option)

---

## Phase 4: Styling & Theme

### 4.1 Ocean Theme Design
- [x] Define color palette:
  - Background: Deep blue gradient
  - Grid: Translucent bubble containers
  - Tiles: Gradient from light blue → teal → purple based on value
  - Text: White/light colors for contrast
- [x] Design bubble-shaped cells:
  - Circular or rounded square with glossy effect
  - Subtle shine/reflection on top
  - Box shadow for depth

### 4.2 Animations & Transitions
- [x] Tile movement transitions (smooth slide) - **Fixed with DOM manipulation approach**
- [x] Tile merge animations (scale up/down, glow)
- [x] Tile spawn animations (fade in, scale from 0)
- [x] Bubble rising effect (tiles shift one row upward with animation)
- [ ] Score increment animations (number fly-up)

### 4.3 Responsive Design
- [x] Mobile-first approach (320px - 768px)
- [x] Tablet layout (768px - 1024px)
- [x] Desktop layout (1024px+)
- [x] Ensure touch targets are large enough (min 44x44px)

---

## Phase 5: Game Features & Polish

### 5.1 Core Features
- [x] New Game button
- [x] Score tracking and display
- [x] Best score persistence (localStorage)
- [x] Game over detection and modal
- [x] Win condition (2048) detection and modal
- [x] Continue playing after winning

### 5.2 Enhanced UX
- [ ] Loading state on game initialization
- [x] Smooth animations for all interactions
- [ ] Visual feedback for invalid moves
- [ ] Instructions/tutorial overlay (first time users)
- [x] Keyboard and touch input support

### 5.3 Optional Features (Nice-to-Have)
- [ ] Undo last move
- [ ] Restart current game (vs. New Game)
- [ ] Game state persistence (survive page refresh)
- [ ] Sound effects for movements and merges
- [ ] Difficulty settings (spawn higher numbers, different grid sizes)
- [ ] Leaderboard or score sharing

---

## Phase 6: Testing & Quality Assurance

### 6.1 Functionality Testing
- [x] Test all movement directions
- [x] Test merge logic (same values combine correctly)
- [x] Test bubble mechanic (automatic upward movement)
- [ ] Test win condition (reaching 2048)
- [ ] Test game over condition (no moves available)
- [ ] Test edge cases (corner merges, multiple merges in one move)

### 6.2 Cross-Browser Testing
- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari (iOS and macOS)
- [ ] Mobile browsers (iOS Safari, Chrome Android)

### 6.3 Performance Testing
- [ ] Check animation performance (60fps target)
- [ ] Test on lower-end mobile devices
- [ ] Optimize bundle size

---

## Phase 7: Deployment

### 7.1 Production Build
- [x] Run `npm run build`
- [ ] Test production build locally (`npm run preview`)
- [x] Verify assets load correctly with GitHub Pages base path

### 7.2 GitHub Pages Setup
- [x] Create GitHub repository
- [x] Configure GitHub Pages (gh-pages branch or /docs folder)
- [x] Set up automated deployment (GitHub Actions)
- [ ] Verify live site works correctly

### 7.3 Documentation
- [x] Update README with:
  - Game description
  - Gameplay mechanics
  - Controls
  - Tech stack
  - Development commands
  - Credits (Global Game Jam 2025)
- [x] Technical documentation:
  - [docs/tile-animation-fix.md](tile-animation-fix.md) - Animation system deep dive
  - [docs/implementation-plan.md](implementation-plan.md) - This document
- [ ] Add LICENSE file
- [ ] Add CONTRIBUTING.md if accepting contributions

---

## Technical Decisions & Recommendations

### State Management
**Recommendation**: Use React hooks (`useState`, `useReducer`) without external libraries.
- The game state is simple enough (grid + scores)
- Keeps dependencies minimal per project requirements
- Consider `useReducer` for complex state transitions

### Styling Approach
**Recommendation**: CSS Modules or plain CSS with CSS variables.
- Avoid heavy CSS-in-JS libraries to keep bundle small
- Use CSS Grid for layout, Flexbox for alignment
- CSS transforms for animations (GPU-accelerated)

### Animation Library
**Recommendation**: Pure CSS transitions + Framer Motion (if needed).
- CSS handles most tile movements efficiently
- Framer Motion only if complex animation choreography is needed
- Evaluate bundle size impact before adding

### Build Optimization
- Enable code splitting in Vite
- Optimize images (use WebP with fallbacks)
- Enable compression in Vite config
- Lazy load modals and non-critical components

---

## Development Sequence (Suggested Order)

1. **Setup** → Initialize Vite project with TypeScript ✅
2. **Types** → Define all TypeScript interfaces ✅
3. **Logic** → Implement game logic utilities (test with console logs) ✅
4. **Components** → Build basic UI structure (no styling) ✅
5. **State** → Wire up game state with React hooks ✅
6. **Input** → Add keyboard and swipe controls ✅
7. **Styling** → Apply ocean theme and bubble design ✅
8. **Animations** → Add movement and merge transitions ✅
9. **Polish** → Add modals, instructions, edge case handling ✅
10. **Deploy** → Build and publish to GitHub Pages ✅

---

## Success Criteria

- [x] Game is fully playable on desktop and mobile
- [x] Bubble mechanic (double-movement) works correctly
- [x] Ocean theme is visually appealing
- [x] Animations are smooth (no jank)
- [x] Game persists best score
- [x] Successfully deployed to GitHub Pages
- [x] Code is clean and well-organized
- [x] Minimal dependencies usedcu

---

## Estimated Complexity by Phase

| Phase | Complexity | Time Estimate |
|-------|-----------|---------------|
| Phase 1: Setup | Low | Quick setup |
| Phase 2: Game Logic | High | Core complexity here |
| Phase 3: React Components | Medium | Standard React work |
| Phase 4: Styling | Medium | Creative work |
| Phase 5: Features | Low-Medium | Mostly straightforward |
| Phase 6: Testing | Medium | Thorough testing needed |
| Phase 7: Deployment | Low | Standard process |

**Critical Path**: Phase 2 (Game Logic) → Phase 3 (React Integration) → Phase 4 (Styling)
