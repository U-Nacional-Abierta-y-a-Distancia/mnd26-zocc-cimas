/**
 * MÓDULO DE MINIJUEGO ECO-MATCH (TIPO CANDY CRUSH)
 * Misión lúdica en Retos: Une elementos ecológicos para limpiar el Río Magdalena y ganar semillas 🌱
 */

const AppCandyGame = (() => {
  const ROWS = 6;
  const COLS = 6;
  const TARGET_SCORE = 350;
  const INITIAL_MOVES = 16;
  const SEEDS_PRIZE = 35;

  const TILE_TYPES = [
    { type: 0, icon: "💧", name: "Agua", color: "rgba(71, 127, 168, 0.5)", bg: "#F0F6FA" },
    { type: 1, icon: "🌱", name: "Semilla", color: "rgba(111, 158, 69, 0.5)", bg: "#EAF3DC" },
    { type: 2, icon: "🐟", name: "Bocachico", color: "rgba(128, 82, 56, 0.5)", bg: "#FFF3D6" },
    { type: 3, icon: "🌳", name: "Caracolí", color: "rgba(45, 106, 79, 0.5)", bg: "#EDF5EF" },
    { type: 4, icon: "☀️", name: "Sol", color: "rgba(217, 107, 53, 0.5)", bg: "#FDF4ED" },
    { type: 5, icon: "♻️", name: "Reciclaje", color: "rgba(31, 78, 107, 0.5)", bg: "#EDF6F6" }
  ];

  let board = [];
  let score = 0;
  let movesLeft = INITIAL_MOVES;
  let selectedTile = null;
  let isBusy = false;
  let gameWon = false;

  function init() {
    setupGameTriggerButtons();
  }

  function setupGameTriggerButtons() {
    // Escuchar botón para abrir el juego
    const btnOpen = document.getElementById("btnOpenCandyGame");
    if (btnOpen) {
      btnOpen.addEventListener("click", openGame);
    }
  }

  function openGame() {
    const modal = document.getElementById("candyGameModalOverlay");
    if (!modal) return;

    modal.classList.add("open");
    resetGame();
  }

  function closeGame() {
    const modal = document.getElementById("candyGameModalOverlay");
    if (modal) modal.classList.remove("open");
  }

  function resetGame() {
    score = 0;
    movesLeft = INITIAL_MOVES;
    selectedTile = null;
    isBusy = false;
    gameWon = false;

    hideEndgameBanners();
    updateHUD();
    generateInitialBoard();
    renderBoard();
  }

  function updateHUD() {
    const scoreEl = document.getElementById("gameScoreVal");
    const movesEl = document.getElementById("gameMovesVal");
    const progressFill = document.getElementById("gameTargetProgressBar");
    const targetEl = document.getElementById("gameTargetVal");

    if (scoreEl) scoreEl.innerText = score;
    if (movesEl) movesEl.innerText = movesLeft;
    if (targetEl) targetEl.innerText = TARGET_SCORE;

    if (progressFill) {
      const pct = Math.min(100, Math.round((score / TARGET_SCORE) * 100));
      progressFill.style.width = `${pct}%`;
    }
  }

  function getRandomTile() {
    const idx = Math.floor(Math.random() * TILE_TYPES.length);
    return { ...TILE_TYPES[idx], id: Math.random().toString(36).substr(2, 9) };
  }

  function generateInitialBoard() {
    board = [];
    for (let r = 0; r < ROWS; r++) {
      board[r] = [];
      for (let c = 0; c < COLS; c++) {
        let tile;
        do {
          tile = getRandomTile();
        } while (
          (c >= 2 && board[r][c - 1]?.type === tile.type && board[r][c - 2]?.type === tile.type) ||
          (r >= 2 && board[r - 1][c]?.type === tile.type && board[r - 2][c]?.type === tile.type)
        );
        board[r][c] = tile;
      }
    }
  }

  function renderBoard() {
    const boardEl = document.getElementById("candyGameBoard");
    if (!boardEl) return;

    boardEl.innerHTML = "";

    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const tile = board[r][c];
        const cell = document.createElement("div");
        cell.className = "candy-tile";
        cell.dataset.r = r;
        cell.dataset.c = c;

        if (selectedTile && selectedTile.r === r && selectedTile.c === c) {
          cell.classList.add("selected");
        }

        cell.style.background = tile ? tile.bg : "transparent";
        cell.style.borderColor = tile ? tile.color : "transparent";

        cell.innerHTML = `
          <span class="candy-icon-symbol">${tile ? tile.icon : ""}</span>
        `;

        cell.onclick = () => onTileClick(r, c);
        boardEl.appendChild(cell);
      }
    }
  }

  function onTileClick(r, c) {
    if (isBusy || gameWon || movesLeft <= 0) return;

    if (!selectedTile) {
      selectedTile = { r, c };
      renderBoard();
      return;
    }

    const prevR = selectedTile.r;
    const prevC = selectedTile.c;

    // Si toca la misma, deseleccionar
    if (prevR === r && prevC === c) {
      selectedTile = null;
      renderBoard();
      return;
    }

    // Verificar si son adyacentes (arriba, abajo, izquierda, derecha)
    const isAdjacent = (Math.abs(prevR - r) === 1 && prevC === c) || (Math.abs(prevC - c) === 1 && prevR === r);

    if (!isAdjacent) {
      // Cambiar selección a la nueva casilla
      selectedTile = { r, c };
      renderBoard();
      return;
    }

    // Intercambiar fichas
    selectedTile = null;
    attemptSwap(prevR, prevC, r, c);
  }

  function attemptSwap(r1, c1, r2, c2) {
    isBusy = true;

    // Swap temporal
    const temp = board[r1][c1];
    board[r1][c1] = board[r2][c2];
    board[r2][c2] = temp;

    const matches = findMatches();

    if (matches.length > 0) {
      // Movimiento válido
      movesLeft--;
      updateHUD();
      renderBoard();

      setTimeout(() => {
        processMatches(matches);
      }, 200);
    } else {
      // Swap no válido: revertir con animación visual
      renderBoard();
      showToastNotice("¡Esa combinación no crea una tercia!");

      setTimeout(() => {
        const revert = board[r1][c1];
        board[r1][c1] = board[r2][c2];
        board[r2][c2] = revert;
        renderBoard();
        isBusy = false;
      }, 300);
    }
  }

  function findMatches() {
    const matchedCoords = new Set();

    // Comprobar horizontales
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS - 2; c++) {
        const type = board[r][c]?.type;
        if (type !== undefined && type === board[r][c + 1]?.type && type === board[r][c + 2]?.type) {
          matchedCoords.add(`${r},${c}`);
          matchedCoords.add(`${r},${c + 1}`);
          matchedCoords.add(`${r},${c + 2}`);
        }
      }
    }

    // Comprobar verticales
    for (let c = 0; c < COLS; c++) {
      for (let r = 0; r < ROWS - 2; r++) {
        const type = board[r][c]?.type;
        if (type !== undefined && type === board[r + 1][c]?.type && type === board[r + 2][c]?.type) {
          matchedCoords.add(`${r},${c}`);
          matchedCoords.add(`${r + 1},${c}`);
          matchedCoords.add(`${r + 2},${c}`);
        }
      }
    }

    return Array.from(matchedCoords).map(coord => {
      const [r, c] = coord.split(",").map(Number);
      return { r, c };
    });
  }

  function processMatches(matches) {
    if (matches.length === 0) {
      isBusy = false;
      checkGameState();
      return;
    }

    // Sumar puntos: base 10 pts por ficha + bonus combo
    const pointsGained = matches.length * 15 + (matches.length > 3 ? 30 : 0);
    score += pointsGained;
    updateHUD();

    // Resaltar visualmente las fichas que explotan
    const boardEl = document.getElementById("candyGameBoard");
    if (boardEl) {
      matches.forEach(({ r, c }) => {
        const cell = boardEl.querySelector(`[data-r="${r}"][data-c="${c}"]`);
        if (cell) cell.classList.add("popping");
      });
    }

    setTimeout(() => {
      // Eliminar fichas
      matches.forEach(({ r, c }) => {
        board[r][c] = null;
      });

      // Gravedad: hacer caer las fichas superiores
      for (let c = 0; c < COLS; c++) {
        let emptyRow = ROWS - 1;
        for (let r = ROWS - 1; r >= 0; r--) {
          if (board[r][c] !== null) {
            if (r !== emptyRow) {
              board[emptyRow][c] = board[r][c];
              board[r][c] = null;
            }
            emptyRow--;
          }
        }
        // Rellenar espacios vacíos superiores con nuevas fichas
        for (let r = emptyRow; r >= 0; r--) {
          board[r][c] = getRandomTile();
        }
      }

      renderBoard();

      // Buscar combos en cascada
      setTimeout(() => {
        const cascadeMatches = findMatches();
        if (cascadeMatches.length > 0) {
          showFloatingCombo("¡Combo Cascada! 🌟");
          processMatches(cascadeMatches);
        } else {
          isBusy = false;
          checkGameState();
        }
      }, 260);

    }, 280);
  }

  function checkGameState() {
    if (score >= TARGET_SCORE && !gameWon) {
      gameWon = true;
      triggerVictory();
    } else if (movesLeft <= 0 && score < TARGET_SCORE) {
      triggerDefeat();
    }
  }

  function triggerVictory() {
    // Otorgar semillas reales a la cuenta del usuario
    AppState.addSemillas(SEEDS_PRIZE, "Victoria en Limpia el Río Match-3");

    if (window.confetti) {
      confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
    }

    AppVoice.speakMessage("¡Excelente trabajo! Has limpiado el cauce del río y ganado 35 semillas colectivas.");

    const victoryBanner = document.getElementById("candyGameVictoryBanner");
    if (victoryBanner) victoryBanner.style.display = "flex";
  }

  function triggerDefeat() {
    const defeatBanner = document.getElementById("candyGameDefeatBanner");
    if (defeatBanner) defeatBanner.style.display = "flex";
  }

  function hideEndgameBanners() {
    const v = document.getElementById("candyGameVictoryBanner");
    const d = document.getElementById("candyGameDefeatBanner");
    if (v) v.style.display = "none";
    if (d) d.style.display = "none";
  }

  function showToastNotice(text) {
    const notice = document.getElementById("candyGameToastNotice");
    if (notice) {
      notice.innerText = text;
      notice.style.opacity = "1";
      setTimeout(() => { notice.style.opacity = "0"; }, 1600);
    }
  }

  function showFloatingCombo(text) {
    showToastNotice(text);
  }

  return {
    init,
    openGame,
    closeGame,
    resetGame
  };
})();

window.AppCandyGame = AppCandyGame;

