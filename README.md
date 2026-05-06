# TetrisGame
A browser-based Tetris game built with React and Web Audio API, featuring smooth gameplay, procedural sound effects, background music, scoring system with levels, mute options, and responsive UI. Play directly in your browser—no installation required!

## Features
- Classic Tetris gameplay with falling blocks
- Procedural sound effects for block drops, locks, and line clears
- Background music loop with mute/unmute options
- Scoring system: +10 points per cleared line, levels increase every 1000 points (max level 10)
- Pause/resume functionality with music control
- Responsive UI with centered text and spacing
- Menu with start game, mute toggles, and return to menu options

## Dependencies

### JavaScript Libraries (Loaded via CDN)
- **React 18**: UI library for rendering the game interface
- **Babel Standalone**: Transpiles JSX to JavaScript in the browser
- **Web Audio API**: Built-in browser API for sound and music generation

No npm packages or additional installations required for these—they are automatically loaded from CDN when you open `index.html`.

### VS Code Requirements
- **Live Server Extension**: Required to run the game locally with Go Live
  - Installation: Open VS Code → Click Extensions (Ctrl+Shift+X) → Search "Live Server" → Click Install (by Ritwick Dey)

## How to Play in VS Code with Go Live

### Prerequisites
- Visual Studio Code installed
- Live Server extension installed in VS Code
- The two project files: `index.html` and `Tetris.js`

### Installation Steps
1. **Install Live Server Extension (One-Time Setup)**:
   - Open VS Code
   - Click the Extensions icon (Ctrl+Shift+X)
   - Search for "Live Server"
   - Find the one by Ritwick Dey
   - Click "Install"
   - Wait for installation to complete

2. **Open the Project Folder in VS Code**:
   - Click `File` > `Open Folder`
   - Navigate to and select the `TetrisGame` folder (containing `index.html` and `Tetris.js`)
   - Click `Select Folder`

3. **Verify Files Are Present**:
   - In the Explorer panel on the left, you should see:
     - `index.html`
     - `Tetris.js`

### Step-by-Step to Play
1. **Start Go Live**:
   - Right-click on `index.html` in the file explorer
   - Select `Open with Live Server`
   - Your default browser will open automatically with the game loaded
   - The URL will look like: `http://127.0.0.1:5500/index.html`

2. **Play the Game**:
   - The game menu will appear in your browser
   - Click "Start Game" to begin
   - Use the controls below to play
   - Interact with the mute toggles to control sound and music

### Game Controls
- **Arrow Left/Right**: Move block left or right
- **Arrow Up**: Rotate block
- **Arrow Down**: Soft drop (move block down one line)
- **Space**: Hard drop (drop block to bottom instantly)
- **P**: Pause/unpause the game
- **M**: Return to menu (while paused)

### Mute Controls
- **In Menu**: Toggle "Mute Music" and "Mute Sound Effects" before starting
- **During Game**: Toggle "Mute Music" and "Mute Sound Effects" while playing

### Scoring
- **Clear 1 line**: +10 points
- **Level**: Increases every 1000 points (Max level 10)
- **Levels**: 1-10, difficulty increases with each level

### Troubleshooting
- **No sound or music playing?**
  - Ensure audio is not muted in your browser or system volume
  - Audio requires user interaction; click in the game window first
  - Check that "Mute Music" and "Mute Sound Effects" are toggled ON in the menu

- **Game won't load?**
  - Verify both `index.html` and `Tetris.js` are in the same folder
  - Check the browser console (F12 > Console tab) for errors
  - Refresh the page (Ctrl+R or Cmd+R)

- **Go Live not working?**
  - Ensure Live Server extension is installed (search Extensions in VS Code)
  - If the extension is not showing in the context menu, restart VS Code
  - Try: Right-click `index.html` → Look for "Open with Live Server"

- **Game performance slow?**
  - Close other browser tabs to free up resources
  - Try refreshing the page

- **"Open with Live Server" option not appearing?**
  - Verify Live Server is installed in Extensions
  - Restart VS Code completely
  - Make sure you're right-clicking directly on `index.html` file

### Development
- If you edit `Tetris.js` or `index.html`, Go Live will automatically refresh your browser with the changes
- If auto-refresh doesn't work, manually refresh the page (Ctrl+R)

Enjoy playing Tetris! Have fun!
