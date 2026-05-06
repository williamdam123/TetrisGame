const { useCallback, useEffect, useRef, useState } = React;

const COLS = 10;
const ROWS = 20;
const BLOCK_SIZE = 30;

const COLORS = [
  null,
  "#FF0D72",
  "#6091a1",
  "#0DFF72",
  "#F538FF",
  "#FF8E0D",
  "#FFE138",
  "#3877FF",
];

const SHAPES = [
  [],
  [[1, 1, 1, 1]],
  [
    [2, 2],
    [2, 2],
  ],
  [
    [0, 3, 0],
    [3, 3, 3],
  ],
  [
    [0, 4, 4],
    [4, 4, 0],
  ],
  [
    [5, 5, 0],
    [0, 5, 5],
  ],
  [
    [6, 6, 6],
    [0, 0, 6],
  ],
  [
    [7, 7, 7],
    [7, 0, 0],
  ],
];

const THEMES = {
  normal: {
    label: "Normal",
    symbols: [null, "", "", "", "", "", "", ""],
  },
  newYear: {
    label: "New Year's",
    symbols: [null, "★", "✦", "✨", "🎉", "🎆", "🥂", "☆"],
  },
  lunarNewYear: {
    label: "Lunar New Year",
    symbols: [null, "福", "龙", "春", "灯", "财", "喜", "红"],
  },
  valentines: {
    label: "Valentine's Day",
    symbols: [null, "♥", "♡", "❤", "💕", "💘", "💞", "💖"],
  },
  stPatricks: {
    label: "St. Patrick's Day",
    symbols: [null, "☘", "♣", "🍀", "✿", "★", "☘", "♣"],
  },
  easter: {
    label: "Easter",
    symbols: [null, "🐣", "🥚", "🐰", "🌷", "✿", "🐇", "🪺"],
  },
  july4th: {
    label: "4th of July",
    symbols: [null, "★", "☆", "✦", "✧", "🎆", "🇺🇸", "★"],
  },
  halloween: {
    label: "Halloween",
    symbols: [null, "🎃", "🦇", "🕸", "👻", "☠", "🕷", "🧙"],
  },
  thanksgiving: {
    label: "Thanksgiving",
    symbols: [null, "🦃", "🍂", "🌽", "🥧", "🍁", "🧡", "🌾"],
  },
  christmas: {
    label: "Christmas",
    symbols: [null, "🎄", "🎁", "❄", "🔔", "⭐", "🎅", "🎀"],
  },
};

function makeBoard() {
  return Array.from({ length: ROWS }, () => Array(COLS).fill(0));
}

function randomPiece() {
  const typeId = Math.floor(Math.random() * (SHAPES.length - 1)) + 1;
  const matrix = SHAPES[typeId];
  return { matrix, typeId, row: 0, col: Math.floor(COLS / 2) - 1 };
}

function rotate(matrix) {
  return matrix[0].map((_, i) => matrix.map((row) => row[i])).reverse();
}

function collide(matrix, row, col, board) {
  return matrix.some((r, y) =>
    r.some((value, x) => {
      if (value === 0) return false;
      const newY = y + row;
      const newX = x + col;
      return (
        newY < 0 ||
        newY >= ROWS ||
        newX < 0 ||
        newX >= COLS ||
        (board[newY] && board[newY][newX]) !== 0
      );
    })
  );
}

function merge(board, matrix, row, col) {
  const newBoard = board.map((r) => [...r]);
  matrix.forEach((r, y) => {
    r.forEach((value, x) => {
      if (value !== 0) newBoard[y + row][x + col] = value;
    });
  });
  return newBoard;
}

function clearLines(board) {
  let cleared = 0;
  const newBoard = board.filter((row) => {
    if (row.every((cell) => cell !== 0)) {
      cleared += 1;
      return false;
    }
    return true;
  });
  while (newBoard.length < ROWS) newBoard.unshift(Array(COLS).fill(0));
  return [newBoard, cleared];
}

function Tetris() {
  const canvasRef = useRef(null);
  const previewRef = useRef(null);
  const audioCtxRef = useRef(null);
  const musicLoopRef = useRef(null);
  const musicGainRef = useRef(null);
  const musicFadeTimeoutRef = useRef(null);
  const soundEnabledRef = useRef(true);
  const musicEnabledRef = useRef(true);
  const screenRef = useRef("menu");
  const themeRef = useRef("normal");
  const boardRef = useRef(makeBoard());
  const pieceRef = useRef(randomPiece());
  const nextPieceRef = useRef(randomPiece());
  const dropIntervalRef = useRef(1000);
  const lastTimeRef = useRef(0);
  const pausedRef = useRef(false);
  const scoreRef = useRef(0);
  const highScoreRef = useRef(0);
  const levelRef = useRef(1);
  const linesRef = useRef(0);
  const gameOverRef = useRef(false);

  const [screen, setScreen] = useState("menu");
  const [themeKey, setThemeKey] = useState("normal");
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [musicEnabled, setMusicEnabled] = useState(true);
  const [board, setBoard] = useState(makeBoard());
  const [piece, setPiece] = useState(randomPiece());
  const [nextPiece, setNextPiece] = useState(randomPiece());
  const [dropInterval, setDropInterval] = useState(1000);
  const [lastTime, setLastTime] = useState(0);
  const [paused, setPaused] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [lines, setLines] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    screenRef.current = screen;
  }, [screen]);

  useEffect(() => {
    themeRef.current = themeKey;
  }, [themeKey]);

  useEffect(() => {
    soundEnabledRef.current = soundEnabled;
  }, [soundEnabled]);

  useEffect(() => {
    musicEnabledRef.current = musicEnabled;
    if (!musicEnabled) {
      stopMusic();
      return;
    }
    if (musicEnabled && screen === "game") {
      startMusic();
    }
  }, [musicEnabled, screen, startMusic, stopMusic]);

  useEffect(() => {
    boardRef.current = board;
  }, [board]);

  useEffect(() => {
    pieceRef.current = piece;
  }, [piece]);

  useEffect(() => {
    nextPieceRef.current = nextPiece;
  }, [nextPiece]);

  useEffect(() => {
    dropIntervalRef.current = dropInterval;
  }, [dropInterval]);

  useEffect(() => {
    lastTimeRef.current = lastTime;
  }, [lastTime]);

  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  useEffect(() => {
    scoreRef.current = score;
  }, [score]);

  useEffect(() => {
    highScoreRef.current = highScore;
  }, [highScore]);

  useEffect(() => {
    levelRef.current = level;
  }, [level]);

  useEffect(() => {
    linesRef.current = lines;
  }, [lines]);

  useEffect(() => {
    gameOverRef.current = gameOver;
  }, [gameOver]);

  const ensureAudio = useCallback(() => {
    if (typeof window === "undefined") return null;
    const AudioContextCtor = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextCtor) return null;
    if (!audioCtxRef.current) {
      audioCtxRef.current = new AudioContextCtor();
    }
    if (audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  }, []);

  const playTone = useCallback((freq, duration = 0.08, type = "sine", volume = 0.02, delay = 0) => {
    if (!soundEnabledRef.current) return;
    const ctx = ensureAudio();
    if (!ctx) return;
    const start = ctx.currentTime + delay;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, start);
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(volume, start + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(start);
    osc.stop(start + duration + 0.02);
  }, [ensureAudio]);

  const playMoveSound = useCallback(() => {
    playTone(420, 0.04, "sine", 0.05);
  }, [playTone]);

  const playRotateSound = useCallback(() => {
    playTone(520, 0.05, "triangle", 0.055);
  }, [playTone]);

  const playDropSound = useCallback(() => {
    playTone(220, 0.08, "triangle", 0.09);
    playTone(330, 0.05, "sine", 0.06, 0.03);
  }, [playTone]);

  const playLockSound = useCallback(() => {
    playTone(160, 0.06, "triangle", 0.1);
    playTone(260, 0.05, "square", 0.08, 0.04);
  }, [playTone]);

  const playClearSound = useCallback(() => {
    playTone(440, 0.06, "sine", 0.12, 0);
    playTone(550, 0.1, "triangle", 0.1, 0.05);
    playTone(660, 0.08, "sine", 0.09, 0.12);
  }, [playTone]);

  const playGameOverSound = useCallback(() => {
    playTone(392, 0.12, "triangle", 0.02, 0);
    playTone(311, 0.16, "triangle", 0.018, 0.14);
    playTone(196, 0.22, "triangle", 0.016, 0.3);
  }, [playTone]);

  const stopMusic = useCallback(() => {
    if (musicLoopRef.current) {
      clearTimeout(musicLoopRef.current);
      musicLoopRef.current = null;
    }
    if (musicFadeTimeoutRef.current) {
      clearTimeout(musicFadeTimeoutRef.current);
      musicFadeTimeoutRef.current = null;
    }
    if (musicGainRef.current) {
      const gain = musicGainRef.current;
      const ctx = audioCtxRef.current;
      const when = ctx ? ctx.currentTime : 0;
      gain.gain.cancelScheduledValues(when);
      const currentValue = gain.gain.value || 0.06;
      gain.gain.setValueAtTime(currentValue, when);
      gain.gain.exponentialRampToValueAtTime(0.0001, when + 0.35);
      musicFadeTimeoutRef.current = window.setTimeout(() => {
        if (musicGainRef.current === gain) {
          gain.disconnect();
          musicGainRef.current = null;
        }
        musicFadeTimeoutRef.current = null;
      }, 420);
    }
  }, []);

  const startMusic = useCallback(() => {
    const ctx = ensureAudio();
    if (!ctx || !musicEnabledRef.current) return;
    if (musicFadeTimeoutRef.current) {
      clearTimeout(musicFadeTimeoutRef.current);
      musicFadeTimeoutRef.current = null;
    }
    if (musicGainRef.current) {
      musicGainRef.current.disconnect();
      musicGainRef.current = null;
    }
    if (musicLoopRef.current) return;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.connect(ctx.destination);
    musicGainRef.current = gain;

    const notes = [262, 330, 392, 523];
    let idx = 0;

    function scheduleNote() {
      const start = ctx.currentTime + 0.05;
      const freq = notes[idx % notes.length];

      const oscA = ctx.createOscillator();
      oscA.type = "triangle";
      oscA.frequency.setValueAtTime(freq, start);
      const gainA = ctx.createGain();
      gainA.gain.setValueAtTime(0.0001, start);
      gainA.gain.exponentialRampToValueAtTime(0.1, start + 0.02);
      gainA.gain.exponentialRampToValueAtTime(0.0001, start + 0.45);
      oscA.connect(gainA).connect(gain);
      oscA.start(start);
      oscA.stop(start + 0.46);

      const oscB = ctx.createOscillator();
      oscB.type = "sine";
      oscB.frequency.setValueAtTime(freq * 1.5, start);
      const gainB = ctx.createGain();
      gainB.gain.setValueAtTime(0.0001, start);
      gainB.gain.exponentialRampToValueAtTime(0.05, start + 0.02);
      gainB.gain.exponentialRampToValueAtTime(0.0001, start + 0.4);
      oscB.connect(gainB).connect(gain);
      oscB.start(start);
      oscB.stop(start + 0.42);

      idx += 1;
      musicLoopRef.current = window.setTimeout(scheduleNote, 450);
    }

    scheduleNote();
  }, [ensureAudio]);

  const resetGame = useCallback(() => {
    const freshBoard = makeBoard();
    const freshPiece = randomPiece();
    const freshNextPiece = randomPiece();

    boardRef.current = freshBoard;
    pieceRef.current = freshPiece;
    nextPieceRef.current = freshNextPiece;
    dropIntervalRef.current = 1000;
    lastTimeRef.current = 0;
    pausedRef.current = false;
    scoreRef.current = 0;
    levelRef.current = 1;
    linesRef.current = 0;
    gameOverRef.current = false;

    setBoard(freshBoard);
    setPiece(freshPiece);
    setNextPiece(freshNextPiece);
    setDropInterval(1000);
    setLastTime(0);
    setPaused(false);
    setScore(0);
    setLevel(1);
    setLines(0);
    setGameOver(false);
  }, []);

  const startGame = useCallback(() => {
    ensureAudio();
    resetGame();
    setScreen("game");
    // Delay music start slightly to ensure audio context is ready
    setTimeout(() => {
      if (musicEnabledRef.current) {
        startMusic();
      }
    }, 100);
  }, [ensureAudio, resetGame, startMusic]);

  const returnToMenu = useCallback(() => {
    stopMusic();
    resetGame();
    setScreen("menu");
  }, [resetGame, stopMusic]);

  const togglePause = useCallback(() => {
    if (screenRef.current !== "game" || gameOverRef.current) return;
    const next = !pausedRef.current;
    pausedRef.current = next;
    setPaused(next);
    if (next) {
      // Pausing: stop music
      stopMusic();
    } else {
      // Unpausing: start music if enabled
      if (musicEnabledRef.current) {
        startMusic();
      }
    }
  }, [stopMusic, startMusic]);

  useEffect(() => {
    return () => {
      stopMusic();
    };
  }, [stopMusic]);

  const lockCurrentPiece = useCallback(() => {
    const currentPiece = pieceRef.current;
    const currentBoard = boardRef.current;
    const mergedBoard = merge(currentBoard, currentPiece.matrix, currentPiece.row, currentPiece.col);
    const [clearedBoard, clearedLines] = clearLines(mergedBoard);

    boardRef.current = clearedBoard;
    setBoard(clearedBoard);

    if (clearedLines > 0) {
      const updatedLines = linesRef.current + clearedLines;
      const updatedScore = scoreRef.current + clearedLines * 10;
      const updatedLevel = Math.min(10, Math.floor(updatedScore / 1000) + 1);
      const updatedInterval = Math.max(120, 1000 - (updatedLevel - 1) * 80);

      linesRef.current = updatedLines;
      scoreRef.current = updatedScore;
      levelRef.current = updatedLevel;
      dropIntervalRef.current = updatedInterval;

      setLines(updatedLines);
      setScore(updatedScore);
      setLevel(updatedLevel);
      setDropInterval(updatedInterval);

      if (updatedScore > highScoreRef.current) {
        highScoreRef.current = updatedScore;
        setHighScore(updatedScore);
      }
      console.log(`Cleared ${clearedLines} lines, score +${clearedLines * 10}, total score: ${updatedScore}, lines: ${updatedLines}`);
      playClearSound();
    } else {
      playLockSound();
    }

    const upcomingPiece = nextPieceRef.current;
    const freshNextPiece = randomPiece();
    nextPieceRef.current = freshNextPiece;
    setNextPiece(freshNextPiece);

    if (collide(upcomingPiece.matrix, upcomingPiece.row, upcomingPiece.col, clearedBoard)) {
      gameOverRef.current = true;
      pausedRef.current = false;
      setGameOver(true);
      setPaused(false);
      playGameOverSound();
    } else {
      pieceRef.current = upcomingPiece;
      setPiece(upcomingPiece);
    }
  }, [playClearSound, playGameOverSound, playLockSound]);

  const move = useCallback((dir) => {
    if (screenRef.current !== "game" || pausedRef.current || gameOverRef.current) return;
    const currentPiece = pieceRef.current;
    const newCol = currentPiece.col + dir;
    if (!collide(currentPiece.matrix, currentPiece.row, newCol, boardRef.current)) {
      const moved = { ...currentPiece, col: newCol };
      pieceRef.current = moved;
      setPiece(moved);
      playMoveSound();
    }
  }, [playMoveSound]);

  const rotatePiece = useCallback(() => {
    if (screenRef.current !== "game" || pausedRef.current || gameOverRef.current) return;
    const currentPiece = pieceRef.current;
    const rotated = rotate(currentPiece.matrix);
    const currentBoard = boardRef.current;

    if (!collide(rotated, currentPiece.row, currentPiece.col, currentBoard)) {
      const updated = { ...currentPiece, matrix: rotated };
      pieceRef.current = updated;
      setPiece(updated);
      playRotateSound();
      return;
    }

    if (!collide(rotated, currentPiece.row, currentPiece.col - 1, currentBoard)) {
      const updated = { ...currentPiece, matrix: rotated, col: currentPiece.col - 1 };
      pieceRef.current = updated;
      setPiece(updated);
      playRotateSound();
    } else if (!collide(rotated, currentPiece.row, currentPiece.col + 1, currentBoard)) {
      const updated = { ...currentPiece, matrix: rotated, col: currentPiece.col + 1 };
      pieceRef.current = updated;
      setPiece(updated);
      playRotateSound();
    }
  }, [playRotateSound]);

  const softDrop = useCallback(() => {
    if (screenRef.current !== "game" || pausedRef.current || gameOverRef.current) return;
    const currentPiece = pieceRef.current;
    const nextRow = currentPiece.row + 1;
    if (!collide(currentPiece.matrix, nextRow, currentPiece.col, boardRef.current)) {
      const moved = { ...currentPiece, row: nextRow };
      pieceRef.current = moved;
      setPiece(moved);
      playDropSound();
    } else {
      lockCurrentPiece();
    }
  }, [lockCurrentPiece, playDropSound]);

  const hardDrop = useCallback(() => {
    if (screenRef.current !== "game" || pausedRef.current || gameOverRef.current) return;
    const currentPiece = pieceRef.current;
    let finalRow = currentPiece.row;
    while (!collide(currentPiece.matrix, finalRow + 1, currentPiece.col, boardRef.current)) {
      finalRow += 1;
    }
    const dropped = { ...currentPiece, row: finalRow };
    pieceRef.current = dropped;
    setPiece(dropped);
    playDropSound();
    lockCurrentPiece();
  }, [lockCurrentPiece, playDropSound]);

  const drawMatrix = useCallback((ctx, matrix, offset, themeSymbols) => {
    matrix.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value !== 0) {
          const px = x + offset.x;
          const py = y + offset.y;
          ctx.fillStyle = COLORS[value];
          ctx.fillRect(px, py, 1, 1);
          ctx.strokeStyle = "#000";
          ctx.lineWidth = 0.05;
          ctx.strokeRect(px, py, 1, 1);

          const symbol = themeSymbols?.[value];
          if (symbol) {
            ctx.save();
            ctx.fillStyle = "rgba(255,255,255,0.92)";
            ctx.font = "bold 0.58px sans-serif";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(symbol, px + 0.5, py + 0.56);
            ctx.restore();
          }
        }
      });
    });
  }, []);

  const drawOverlay = useCallback((ctx, title, subtitle, extra) => {
    ctx.save();
    ctx.fillStyle = "rgba(0,0,0,0.8)";
    ctx.fillRect(0, ROWS / 2 - 3, COLS, 6);
    ctx.fillStyle = "#fff";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "bold 1px Arial";
    ctx.fillText(title, COLS / 2, ROWS / 2 - 1);
    ctx.font = "0.6px Arial";
    if (subtitle) ctx.fillText(subtitle, COLS / 2, ROWS / 2 + 0.4);
    if (extra) ctx.fillText(extra, COLS / 2, ROWS / 2 + 1.6);
    ctx.restore();
  }, []);

  const draw = useCallback(() => {
    if (!canvasRef.current || screenRef.current !== "game") return;
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    ctx.setTransform(BLOCK_SIZE, 0, 0, BLOCK_SIZE, 0, 0);
    ctx.clearRect(0, 0, COLS, ROWS);
    ctx.fillStyle = "#111";
    ctx.fillRect(0, 0, COLS, ROWS);

    ctx.strokeStyle = "#222";
    for (let y = 0; y < ROWS; y += 1) {
      for (let x = 0; x < COLS; x += 1) {
        ctx.strokeRect(x, y, 1, 1);
      }
    }

    const themeSymbols = THEMES[themeRef.current]?.symbols;
    drawMatrix(ctx, boardRef.current, { x: 0, y: 0 }, themeSymbols);
    drawMatrix(ctx, pieceRef.current.matrix, { x: pieceRef.current.col, y: pieceRef.current.row }, themeSymbols);

    if (gameOverRef.current) {
      drawOverlay(
        ctx,
        "GAME OVER",
        `Score: ${scoreRef.current} | Lines: ${linesRef.current} | Level: ${levelRef.current}`,
        "Press R to Restart or M to Menu"
      );
    } else if (pausedRef.current) {
      drawOverlay(
        ctx,
        "PAUSED",
        "Press P to resume",
        "M - Return to Menu"
      );
    }
  }, [drawMatrix, drawOverlay]);

  const drawPreview = useCallback(() => {
    if (!previewRef.current || screenRef.current !== "game") return;
    const pctx = previewRef.current.getContext("2d");
    if (!pctx) return;

    pctx.setTransform(BLOCK_SIZE / 2, 0, 0, BLOCK_SIZE / 2, 0, 0);
    pctx.clearRect(0, 0, 6, 6);
    pctx.fillStyle = "#111";
    pctx.fillRect(0, 0, 6, 6);
    pctx.strokeStyle = "#222";
    for (let y = 0; y < 6; y += 1) {
      for (let x = 0; x < 6; x += 1) {
        pctx.strokeRect(x, y, 1, 1);
      }
    }
    const themeSymbols = THEMES[themeRef.current]?.symbols;
    drawMatrix(pctx, nextPieceRef.current.matrix, { x: 1, y: 1 }, themeSymbols);
  }, [drawMatrix]);

  useEffect(() => {
    if (screen !== "game") return undefined;

    let animationFrameId;

    function update(time = 0) {
      if (!pausedRef.current && !gameOverRef.current) {
        const deltaTime = time - lastTimeRef.current;
        if (deltaTime > dropIntervalRef.current) {
          softDrop();
          lastTimeRef.current = time;
          setLastTime(time);
        }
      }

      draw();
      drawPreview();
      animationFrameId = requestAnimationFrame(update);
    }

    animationFrameId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(animationFrameId);
  }, [screen, softDrop, draw, drawPreview]);

  useEffect(() => {
    function handleKey(e) {
      if (screenRef.current !== "game") return;

      if (e.key.toLowerCase() === "m") {
        e.preventDefault();
        if (pausedRef.current || gameOverRef.current) {
          returnToMenu();
        }
        return;
      }

      if (gameOverRef.current) {
        if (e.key.toLowerCase() === "r") {
          e.preventDefault();
          resetGame();
        }
        return;
      }

      if (e.key === "ArrowLeft") {
        e.preventDefault();
        move(-1);
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        move(1);
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        softDrop();
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        rotatePiece();
      }
      if (e.key === " ") {
        e.preventDefault();
        hardDrop();
      }
      if (e.key.toLowerCase() === "p") {
        e.preventDefault();
        togglePause();
      }
      if (e.key.toLowerCase() === "r") {
        e.preventDefault();
        resetGame();
      }
    }

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [hardDrop, move, resetGame, returnToMenu, rotatePiece, softDrop, togglePause]);

  if (screen === "menu") {
    return (
      <div className="min-h-screen w-full bg-black text-white flex items-center justify-center p-6">
        <div className="w-full max-w-3xl rounded-3xl border border-white/10 bg-white/5 shadow-2xl p-6 md:p-8">
          <div className="text-center space-y-3">
            <h1 className="text-4xl md:text-5xl font-black tracking-tight">Tetris</h1>
            <p className="text-white/70">Choose a theme, then press Play.</p>
          </div>

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <div className="space-y-4 rounded-2xl border border-white/10 bg-black/30 p-4">
              <div>
                <label className="block text-sm font-semibold text-white/80 mb-2">Theme</label>
                <select
                  className="w-full rounded-xl border border-white/15 bg-black/60 px-3 py-2 text-white outline-none"
                  value={themeKey}
                  onChange={(e) => setThemeKey(e.target.value)}
                >
                  {Object.entries(THEMES).map(([key, theme]) => (
                    <option key={key} value={key}>
                      {theme.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid gap-3">
                <button
                  onClick={() => setSoundEnabled((prev) => !prev)}
                  className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-left text-white transition hover:bg-white/10"
                >
                  Sound Effects: {soundEnabled ? "On" : "Off"}
                </button>
                <button
                  onClick={() => setMusicEnabled((prev) => !prev)}
                  className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-left text-white transition hover:bg-white/10"
                >
                  Music: {musicEnabled ? "On" : "Off"}
                </button>
              </div>

              <button
                onClick={startGame}
                className="w-full rounded-xl bg-white px-4 py-3 font-bold text-black transition hover:opacity-90"
              >
                Play
              </button>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/30 p-4 space-y-3">
              <h2 className="text-xl font-bold">How to Play</h2>
              <div className="space-y-2 text-sm text-white/80 leading-6">
                <p>• Arrow Left / Right: move</p>
                <p>• Arrow Up: rotate</p>
                <p>• Arrow Down: soft drop</p>
                <p>• Space: hard drop</p>
                <p>• P: pause or resume</p>
                <p>• M: return to menu</p>
                <p>• R: restart after game over</p>
                <p>Fill lines to score points and level up.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <div className="flex gap-8">
        <canvas
          ref={canvasRef}
          width={COLS * BLOCK_SIZE}
          height={ROWS * BLOCK_SIZE}
          className="border-2 border-gray-700 rounded-xl shadow-lg"
        />
        <div className="flex flex-col items-center text-white gap-2">
          <span className="text-lg font-bold">Next Piece</span>
          <canvas
            ref={previewRef}
            width={6 * (BLOCK_SIZE / 2)}
            height={6 * (BLOCK_SIZE / 2)}
            className="border border-gray-500 rounded"
          />
        </div>
      </div>
      <div
        className="flex gap-8 text-lg font-bold text-white bg-black/70 px-4 py-2 rounded-xl border border-gray-600"
        style={{ display: "flex", justifyContent: "space-evenly", width: "100%", gap: "1.5rem", flexWrap: "wrap" }}
      >
        <span style={{ flex: 1, textAlign: "center" }}>Score: {score}</span>
        <span style={{ flex: 1, textAlign: "center" }}>High Score: {highScore}</span>
        <span style={{ flex: 1, textAlign: "center" }}>Level: {level}</span>
        <span style={{ flex: 1, textAlign: "center" }}>Lines: {lines}</span>
      </div>
      <div className="flex flex-col items-center gap-3 text-sm text-gray-200 text-center">
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => setSoundEnabled((prev) => !prev)}
            className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-white transition hover:bg-white/10"
          >
            Sound: {soundEnabled ? "On" : "Off"}
          </button>
          <button
            onClick={() => setMusicEnabled((prev) => !prev)}
            className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-white transition hover:bg-white/10"
          >
            Music: {musicEnabled ? "On" : "Off"}
          </button>
        </div>
        <div className="text-sm text-gray-400">
          Controls: ← → move | ↑ rotate | ↓ soft drop | Space hard drop | P pause | M menu | R restart
        </div>
      </div>
    </div>
  );
}

window.Tetris = Tetris;