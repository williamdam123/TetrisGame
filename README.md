# TetrisGame
A classic Tetris game built with React and Web Audio API, featuring smooth gameplay, procedural sound effects, background music, scoring system with levels, mute options, and responsive UI. Play directly in your browser—no installation required!

## Features
- Classic Tetris gameplay with falling blocks
- Procedural sound effects for block drops, locks, and line clears
- Background music loop with mute/unmute options
- Scoring system: +10 points per cleared line, levels increase every 1000 points (max level 10)
- Pause/resume functionality with music control
- Responsive UI with centered text and spacing
- Menu with start game, mute toggles, and return to menu options

## How to Run
1. **Clone or Download the Repository**:
   - Clone: `git clone https://github.com/yourusername/TetrisGame.git`
   - Or download the ZIP and extract it to a folder.

2. **Open the Game**:
   - Navigate to the project folder.
   - Open `index.html` in your web browser (e.g., double-click the file or drag it into a browser window).
   - The game will load automatically using CDN-hosted React and Babel.

3. **Play the Game**:
   - Click "Play" from the menu.
   - Use keyboard controls to play.
   - Music and sounds are enabled by default; toggle them in the menu or during gameplay.

## Controls
- **Arrow Keys**: Move left/right, rotate (up), soft drop (down)
- **Space**: Hard drop
- **P**: Pause/unpause
- **M**: Return to menu (from paused state)
- **Mute Toggles**: Available in menu and game UI

## Requirements
- A modern web browser (Chrome, Firefox, Edge, etc.) with JavaScript enabled.
- No additional installations needed—everything runs in the browser.

## Troubleshooting
- If sounds/music don't play, ensure your browser allows audio and interact with the page first (audio context requires user interaction).
- Check browser console (F12) for any errors.
- Game state persists during play; refresh to restart.

Enjoy playing Tetris! If you have suggestions or issues, open a GitHub issue.
