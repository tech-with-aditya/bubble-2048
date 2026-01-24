# Bubble Merge 2048

[![Live Demo](https://img.shields.io/badge/demo-live-success?style=for-the-badge&logo=github)](https://furic.github.io/bubble-2048/)
[![GitHub Pages](https://img.shields.io/badge/deployed-github%20pages-blue?style=for-the-badge&logo=github)](https://furic.github.io/bubble-2048/)
[![Made with React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Global Game Jam 2025](https://img.shields.io/badge/GGJ%202025-Bubble-FF6B6B?style=for-the-badge)](https://globalgamejam.org/)

🎮 **[Play Now!](https://furic.github.io/bubble-2048/)**

A unique twist on the classic 2048 puzzle game, created for Global Game Jam 2025 (theme: "Bubble").

## About

Bubble Merge 2048 combines the familiar 2048 merging mechanics with an innovative bubble physics mechanic. After each move you make, all tiles automatically "bubble up" to the top of the board, creating a second merge opportunity and adding a new strategic dimension to the classic gameplay.

## Gameplay

- **4x4 Grid**: Merge tiles to reach 2048 (and beyond!)
- **Standard Merging**: Swipe in any direction to slide and merge matching numbers
- **Bubble Mechanic**: After your move, tiles automatically shift one row upward (with merging), simulating bubbles rising
- **Ocean Theme**: Beautiful bubble-shaped cells with an aquatic color palette

## Controls

- **Keyboard**: Arrow keys or WASD
- **Mouse**: Click and drag to swipe
- **Touch**: Swipe gestures on mobile devices

## Tech Stack

- **Framework**: React + TypeScript
- **Build Tool**: Vite
- **Styling**: CSS with custom animations
- **Deployment**: GitHub Pages

## Development

### Setup
```bash
npm install              # Install dependencies
npm run dev             # Start development server (http://localhost:5173)
```

### Build
```bash
npm run build           # Build for production
npm run preview         # Preview production build locally
```

## Features

- Multiple input methods (keyboard, mouse, touch)
- Score tracking with best score persistence
- Smooth tile animations
- Win/game over detection
- Responsive design for desktop and mobile

## Technical Documentation

For developers interested in the implementation details:

- **[Animation System Deep Dive](docs/tile-animation-fix.md)** - How we fixed the tile sliding animations
- **[Implementation Plan](docs/implementation-plan.md)** - Complete project roadmap and architecture

## Contributing

This project was created for Global Game Jam 2025. Feel free to fork and create your own variations!

## License

MIT License - see [LICENSE](LICENSE) file for details.

Created for Global Game Jam 2025

---

**Live Demo**: [https://furic.github.io/bubble-2048/](https://furic.github.io/bubble-2048/)

Made with 💙 for Global Game Jam 2025
