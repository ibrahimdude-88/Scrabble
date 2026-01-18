// ==================== CONFIGURACIÓN DEL JUEGO ====================

// Valores de letras en español (México)
const LETTER_SCORES = {
    'A': 1, 'B': 3, 'C': 3, 'D': 2, 'E': 1,
    'F': 4, 'G': 2, 'H': 4, 'I': 1, 'J': 8,
    'L': 1, 'M': 3, 'N': 1, 'Ñ': 8, 'O': 1,
    'P': 3, 'Q': 5, 'R': 1, 'RR': 8, 'S': 1,
    'T': 1, 'U': 1, 'V': 4, 'X': 8, 'Y': 4,
    'Z': 10, '_': 0 // Comodín
};

// Casillas especiales del tablero (posiciones 0-14)
const SPECIAL_CELLS = {
    'TW': ['0-0', '0-7', '0-14', '7-0', '7-14', '14-0', '14-7', '14-14'],
    'DW': ['1-1', '2-2', '3-3', '4-4', '1-13', '2-12', '3-11', '4-10', '7-7',
        '10-4', '11-3', '12-2', '13-1', '10-10', '11-11', '12-12', '13-13'],
    'TL': ['1-5', '1-9', '5-1', '5-5', '5-9', '5-13', '9-1', '9-5', '9-9', '9-13', '13-5', '13-9'],
    'DL': ['0-3', '0-11', '2-6', '2-8', '3-0', '3-7', '3-14', '6-2', '6-6', '6-8', '6-12',
        '7-3', '7-11', '8-2', '8-6', '8-8', '8-12', '11-0', '11-7', '11-14', '12-6', '12-8', '14-3', '14-11']
};

const BOARD_SIZE = 15;

// ==================== ESTADO DEL JUEGO ====================

const gameState = {
    players: [],
    currentTurnIndex: 0,
    board: {}, // { "row-col": "letter" }
    tempTiles: [], // { row, col, letter }
    moveHistory: [],
    totalMoves: 0,
    gameStarted: false,
    targetCell: null,
    lastInsertedWord: '', // Palabra completa insertada
    boardHistory: [], // Historial de estados del tablero para deshacer
    scoreHistory: [], // Historial de puntuaciones para deshacer
    startTime: null, // Tiempo de inicio de la partida
    timerInterval: null // Intervalo del cronómetro
};

// LocalStorage/Firebase para jugadores guardados
const STORAGE_KEY = 'scrabble_saved_players';

// Esperar a que Firebase esté disponible
function waitForFirebase() {
    return new Promise((resolve) => {
        if (window.firebaseDB) {
            resolve(window.firebaseDB);
        } else {
            const checkInterval = setInterval(() => {
                if (window.firebaseDB) {
                    clearInterval(checkInterval);
                    resolve(window.firebaseDB);
                }
            }, 100);
        }
    });
}

async function getSavedPlayers() {
    try {
        const fb = await waitForFirebase();
        const playersRef = fb.ref(fb.database, 'savedPlayers');
        const snapshot = await fb.get(playersRef);

        if (snapshot.exists()) {
            return snapshot.val() || [];
        }

        // Fallback a localStorage si no hay datos en Firebase
        const localSaved = localStorage.getItem(STORAGE_KEY);
        return localSaved ? JSON.parse(localSaved) : [];
    } catch (error) {
        console.error('Error getting saved players:', error);
        const localSaved = localStorage.getItem(STORAGE_KEY);
        return localSaved ? JSON.parse(localSaved) : [];
    }
}

async function savePlayers(players) {
    try {
        const uniquePlayers = [...new Set(players.filter(p => p.trim()))];

        // Guardar en Firebase
        const fb = await waitForFirebase();
        const playersRef = fb.ref(fb.database, 'savedPlayers');
        await fb.set(playersRef, uniquePlayers);

        // También guardar en localStorage como backup
        localStorage.setItem(STORAGE_KEY, JSON.stringify(uniquePlayers));
    } catch (error) {
        console.error('Error saving players:', error);
        // Fallback a localStorage
        const uniquePlayers = [...new Set(players.filter(p => p.trim()))];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(uniquePlayers));
    }
}

async function addPlayerToHistory(playerName) {
    if (!playerName || !playerName.trim()) return;
    const saved = await getSavedPlayers();
    if (!saved.includes(playerName)) {
        saved.push(playerName);
        await savePlayers(saved);
    }
}

// ==================== SISTEMA DE ESTADÍSTICAS ====================

const STATS_KEY = 'scrabble_player_stats';

async function getPlayerStats() {
    try {
        const fb = await waitForFirebase();
        const statsRef = fb.ref(fb.database, 'playerStats');
        const snapshot = await fb.get(statsRef);

        if (snapshot.exists()) {
            return snapshot.val() || {};
        }

        const localStats = localStorage.getItem(STATS_KEY);
        return localStats ? JSON.parse(localStats) : {};
    } catch (error) {
        console.error('Error getting stats:', error);
        const localStats = localStorage.getItem(STATS_KEY);
        return localStats ? JSON.parse(localStats) : {};
    }
}

async function savePlayerStats(stats) {
    try {
        const fb = await waitForFirebase();
        const statsRef = fb.ref(fb.database, 'playerStats');
        await fb.set(statsRef, stats);
        localStorage.setItem(STATS_KEY, JSON.stringify(stats));
    } catch (error) {
        console.error('Error saving stats:', error);
        localStorage.setItem(STATS_KEY, JSON.stringify(stats));
    }
}

async function updatePlayerStats(playerName, gameScore, bestWordInGame, bestScoreInGame, isWinner) {
    const stats = await getPlayerStats();

    if (!stats[playerName]) {
        stats[playerName] = {
            gamesPlayed: 0,
            gamesWon: 0,
            totalPoints: 0,
            bestGameScore: 0,
            bestWord: '',
            bestWordScore: 0
        };
    }

    const playerStats = stats[playerName];
    playerStats.gamesPlayed++;
    if (isWinner) playerStats.gamesWon++;
    playerStats.totalPoints += gameScore;

    if (gameScore > playerStats.bestGameScore) {
        playerStats.bestGameScore = gameScore;
    }

    if (bestScoreInGame > playerStats.bestWordScore) {
        playerStats.bestWordScore = bestScoreInGame;
        playerStats.bestWord = bestWordInGame;
    }

    await savePlayerStats(stats);
}

async function clearPlayerStats() {
    if (confirm('¿Estás seguro de que quieres eliminar todas las estadísticas? Esta acción no se puede deshacer.')) {
        try {
            const fb = await waitForFirebase();
            const statsRef = fb.ref(fb.database, 'playerStats');
            await fb.set(statsRef, {});
            localStorage.removeItem(STATS_KEY);
            alert('Estadísticas eliminadas correctamente');
            await loadRankingUI();
        } catch (error) {
            console.error('Error clearing stats:', error);
            localStorage.removeItem(STATS_KEY);
            alert('Estadísticas eliminadas correctamente');
            await loadRankingUI();
        }
    }
}

async function loadRankingUI() {
    const stats = await getPlayerStats();
    const rankingSection = document.getElementById('rankingSection');
    const rankingTable = document.getElementById('rankingTable');

    // Convertir stats a array y ordenar por victorias
    const playersArray = Object.entries(stats).map(([name, data]) => ({
        name,
        ...data
    })).sort((a, b) => {
        if (b.gamesWon !== a.gamesWon) return b.gamesWon - a.gamesWon;
        return b.totalPoints - a.totalPoints;
    });

    if (playersArray.length > 0) {
        rankingSection.classList.remove('hidden');

        let html = '<table class="ranking-table"><thead><tr>';
        html += '<th>Pos</th>';
        html += '<th>Jugador</th>';
        html += '<th>Partidas</th>';
        html += '<th>Victorias</th>';
        html += '<th>Puntos Totales</th>';
        html += '<th>Mejor Partida</th>';
        html += '<th>Mejor Palabra</th>';
        html += '</tr></thead><tbody>';

        playersArray.forEach((player, index) => {
            const position = index + 1;
            let posClass = '';
            if (position === 1) posClass = 'gold';
            else if (position === 2) posClass = 'silver';
            else if (position === 3) posClass = 'bronze';

            html += '<tr>';
            html += `<td><span class="rank-position ${posClass}">${position}°</span></td>`;
            html += `<td><span class="player-name">${player.name}</span></td>`;
            html += `<td><span class="stat-number">${player.gamesPlayed}</span></td>`;
            html += `<td><span class="stat-number">${player.gamesWon}</span></td>`;
            html += `<td><span class="stat-number">${player.totalPoints}</span></td>`;
            html += `<td><span class="stat-number">${player.bestGameScore}</span></td>`;
            html += `<td><span class="best-word">${player.bestWord || '-'}</span> <span class="stat-number">(${player.bestWordScore})</span></td>`;
            html += '</tr>';
        });

        html += '</tbody></table>';
        rankingTable.innerHTML = html;
    } else {
        rankingSection.classList.add('hidden');
    }
}

// ==================== FUNCIONES DE UTILIDAD ====================

function getCellType(row, col) {
    const key = `${row}-${col}`;
    if (key === '7-7') return 'center';
    if (SPECIAL_CELLS.TW.includes(key)) return 'tw';
    if (SPECIAL_CELLS.DW.includes(key)) return 'dw';
    if (SPECIAL_CELLS.TL.includes(key)) return 'tl';
    if (SPECIAL_CELLS.DL.includes(key)) return 'dl';
    return 'normal';
}

function getCellLabel(type) {
    const labels = {
        'tw': 'TP',
        'dw': 'DP',
        'tl': 'TL',
        'dl': 'DL',
        'center': '★'
    };
    return labels[type] || '';
}

function calculateMoveScore(tiles) {
    let score = 0;
    let wordMultiplier = 1;

    tiles.forEach(tile => {
        const isBlank = tile.letter !== tile.letter.toUpperCase();
        const letter = tile.letter.toUpperCase();
        let letterScore = isBlank ? 0 : (LETTER_SCORES[letter] || 0);

        const cellType = getCellType(tile.row, tile.col);

        // Aplicar multiplicadores de letra
        if (cellType === 'tl') letterScore *= 3;
        if (cellType === 'dl') letterScore *= 2;

        // Acumular multiplicadores de palabra
        if (cellType === 'tw') wordMultiplier *= 3;
        if (cellType === 'dw') wordMultiplier *= 2;

        score += letterScore;
    });

    return score * wordMultiplier;
}

function formatTime() {
    const now = new Date();
    return now.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
}

// ==================== INICIALIZACIÓN ====================

document.addEventListener('DOMContentLoaded', () => {
    initSetupView();
    initGameView();
    initModals();
});

function initSetupView() {
    // Cargar y mostrar jugadores guardados
    loadSavedPlayersUI();

    // Cargar ranking
    loadRankingUI();

    // Event listeners para ranking
    const btnToggleRanking = document.getElementById('btnToggleRanking');
    const btnClearRanking = document.getElementById('btnClearRanking');
    const rankingContent = document.getElementById('rankingContent');

    btnToggleRanking.addEventListener('click', () => {
        rankingContent.classList.toggle('hidden');
        btnToggleRanking.textContent = rankingContent.classList.contains('hidden') ? 'Ver Ranking' : 'Ocultar Ranking';
    });

    btnClearRanking.addEventListener('click', clearPlayerStats);

    const btnStart = document.getElementById('btnStartGame');

    btnStart.addEventListener('click', async () => {
        const player1 = document.getElementById('player1').value.trim();
        const player2 = document.getElementById('player2').value.trim();
        const player3 = document.getElementById('player3').value.trim();
        const player4 = document.getElementById('player4').value.trim();

        if (!player1 || !player2) {
            alert('Debes ingresar al menos 2 jugadores');
            return;
        }

        // Crear jugadores
        gameState.players = [];
        if (player1) {
            gameState.players.push({ name: player1, score: 0 });
            await addPlayerToHistory(player1);
        }
        if (player2) {
            gameState.players.push({ name: player2, score: 0 });
            await addPlayerToHistory(player2);
        }
        if (player3) {
            gameState.players.push({ name: player3, score: 0 });
            await addPlayerToHistory(player3);
        }
        if (player4) {
            gameState.players.push({ name: player4, score: 0 });
            await addPlayerToHistory(player4);
        }

        gameState.gameStarted = true;
        startGame();
    });
}

async function loadSavedPlayersUI() {
    const savedPlayers = await getSavedPlayers();
    const section = document.getElementById('savedPlayersSection');
    const list = document.getElementById('savedPlayersList');

    if (savedPlayers.length > 0) {
        section.classList.remove('hidden');
        list.innerHTML = '';

        savedPlayers.forEach(playerName => {
            const chip = document.createElement('div');
            chip.className = 'saved-player-chip';
            chip.textContent = playerName;
            chip.onclick = () => selectSavedPlayer(playerName, chip);
            list.appendChild(chip);
        });
    }
}

function selectSavedPlayer(playerName, chipElement) {
    // Encontrar el primer input vacío
    const inputs = ['player1', 'player2', 'player3', 'player4'];
    for (let inputId of inputs) {
        const input = document.getElementById(inputId);
        if (!input.value.trim()) {
            input.value = playerName;
            chipElement.classList.add('selected');
            setTimeout(() => chipElement.classList.remove('selected'), 500);
            break;
        }
    }
}


function startGame() {
    // Cambiar a vista de juego
    document.getElementById('setup-view').classList.add('hidden');
    document.getElementById('game-view').classList.remove('hidden');

    // Iniciar cronómetro
    startTimer();

    // Inicializar tablero
    renderBoard();
    renderPlayers();
    updateTurnIndicator();
    updateStats();
}

// ==================== CRONÓMETRO ====================

function startTimer() {
    gameState.startTime = Date.now();
    gameState.timerInterval = setInterval(updateTimer, 1000);
    updateTimer(); // Actualizar inmediatamente
}

function stopTimer() {
    if (gameState.timerInterval) {
        clearInterval(gameState.timerInterval);
        gameState.timerInterval = null;
    }
}

function updateTimer() {
    if (!gameState.startTime) return;

    const elapsed = Date.now() - gameState.startTime;
    const formatted = formatElapsedTime(elapsed);

    const timerEl = document.getElementById('gameTimer');
    if (timerEl) {
        timerEl.textContent = formatted;
    }
}

function formatElapsedTime(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function getElapsedTime() {
    if (!gameState.startTime) return '00:00:00';
    const elapsed = Date.now() - gameState.startTime;
    return formatElapsedTime(elapsed);
}

// ==================== RENDERIZADO ====================

function renderBoard() {
    const boardEl = document.getElementById('scrabbleBoard');
    boardEl.innerHTML = '';

    for (let row = 0; row < BOARD_SIZE; row++) {
        for (let col = 0; col < BOARD_SIZE; col++) {
            const cell = document.createElement('div');
            const cellType = getCellType(row, col);
            cell.className = `cell ${cellType}`;

            const key = `${row}-${col}`;
            const fixedTile = gameState.board[key];
            const tempTile = gameState.tempTiles.find(t => t.row === row && t.col === col);

            if (fixedTile || tempTile) {
                const letter = fixedTile || tempTile.letter;
                const isTemp = !!tempTile;
                const isBlank = letter !== letter.toUpperCase();
                const displayLetter = letter.toUpperCase();
                const score = isBlank ? 0 : (LETTER_SCORES[displayLetter] || 0);

                const tileDiv = document.createElement('div');
                tileDiv.className = `tile ${isBlank ? 'blank' : ''} ${isTemp ? 'temp' : ''}`;
                tileDiv.innerHTML = `${displayLetter}<span class="tile-score">${score}</span>`;

                // Click en ficha temporal para alternar blanca/normal
                if (isTemp) {
                    tileDiv.addEventListener('click', (e) => {
                        e.stopPropagation();
                        toggleBlankTile(tempTile);
                    });
                }

                cell.appendChild(tileDiv);
            } else {
                const label = getCellLabel(cellType);
                if (label) {
                    cell.textContent = label;
                }

                // Click en celda vacía para insertar palabra
                cell.addEventListener('click', () => {
                    gameState.targetCell = { row, col };
                    showWordModal();
                });
            }

            boardEl.appendChild(cell);
        }
    }

    updateScorePreview();
}

function renderPlayers() {
    const listEl = document.getElementById('playersList');
    listEl.innerHTML = '';

    gameState.players.forEach((player, index) => {
        const card = document.createElement('div');
        card.className = `player-card ${index === gameState.currentTurnIndex ? 'active' : ''}`;
        card.innerHTML = `
            <div class="player-name">${player.name}</div>
            <div class="player-score">${player.score} pts</div>
        `;
        listEl.appendChild(card);
    });
}

function renderHistory() {
    const historyEl = document.getElementById('moveHistory');
    historyEl.innerHTML = '';

    // Mostrar en orden inverso (más reciente primero)
    const reversedHistory = [...gameState.moveHistory].reverse();

    reversedHistory.forEach(move => {
        const item = document.createElement('div');
        item.className = 'history-item';
        item.innerHTML = `
            <div class="history-header">
                <span class="history-player">${move.player}</span>
                <span class="history-score">+${move.score} pts</span>
            </div>
            <div class="history-word">${move.word}</div>
            <div class="history-time">${move.time}</div>
        `;
        historyEl.appendChild(item);
    });
}

function updateTurnIndicator() {
    const currentPlayer = gameState.players[gameState.currentTurnIndex];
    document.getElementById('currentPlayer').textContent = currentPlayer.name;
}

function updateStats() {
    document.getElementById('totalMoves').textContent = gameState.totalMoves;
    const totalPoints = gameState.players.reduce((sum, p) => sum + p.score, 0);
    document.getElementById('totalPoints').textContent = totalPoints;
}

function updateScorePreview() {
    const score = calculateMoveScore(gameState.tempTiles);
    document.getElementById('moveScore').textContent = score;
}

// ==================== LÓGICA DE JUGADAS ====================

function toggleBlankTile(tile) {
    const index = gameState.tempTiles.indexOf(tile);
    if (index !== -1) {
        const current = gameState.tempTiles[index].letter;
        gameState.tempTiles[index].letter = current === current.toUpperCase()
            ? current.toLowerCase()
            : current.toUpperCase();
        renderBoard();
    }
}

function clearMove() {
    gameState.tempTiles = [];
    renderBoard();
}

function confirmMove() {
    if (gameState.tempTiles.length === 0) {
        alert('No hay fichas para confirmar');
        return;
    }

    // Guardar estado actual para poder deshacer
    saveStateForUndo();

    // Calcular puntos
    const score = calculateMoveScore(gameState.tempTiles);

    // Guardar fichas en el tablero
    gameState.tempTiles.forEach(tile => {
        gameState.board[`${tile.row}-${tile.col}`] = tile.letter;
    });

    // Actualizar puntuación del jugador actual
    const currentPlayer = gameState.players[gameState.currentTurnIndex];
    currentPlayer.score += score;

    // Guardar en historial - usar la palabra completa insertada
    const word = gameState.lastInsertedWord || gameState.tempTiles
        .map(t => t.letter.toUpperCase())
        .join('');

    gameState.moveHistory.push({
        player: currentPlayer.name,
        word: word,
        score: score,
        time: formatTime(),
        type: 'move' // Tipo de acción
    });

    gameState.totalMoves++;

    // Limpiar fichas temporales y palabra insertada
    gameState.tempTiles = [];
    gameState.lastInsertedWord = '';

    // Pasar turno
    nextTurn();

    // Actualizar UI
    renderBoard();
    renderPlayers();
    renderHistory();
    updateStats();
}

function saveStateForUndo() {
    // Guardar copia profunda del tablero
    const boardCopy = JSON.parse(JSON.stringify(gameState.board));
    gameState.boardHistory.push(boardCopy);

    // Guardar copia de las puntuaciones
    const scoresCopy = gameState.players.map(p => ({ name: p.name, score: p.score }));
    gameState.scoreHistory.push(scoresCopy);

    // Limitar el historial a las últimas 10 jugadas
    if (gameState.boardHistory.length > 10) {
        gameState.boardHistory.shift();
        gameState.scoreHistory.shift();
    }
}

function undoLastMove() {
    if (gameState.boardHistory.length === 0) {
        alert('No hay movimientos para deshacer');
        return;
    }

    if (!confirm('¿Deshacer la última jugada?')) {
        return;
    }

    // Restaurar el tablero anterior
    gameState.board = gameState.boardHistory.pop();

    // Restaurar las puntuaciones anteriores
    const previousScores = gameState.scoreHistory.pop();
    previousScores.forEach(savedScore => {
        const player = gameState.players.find(p => p.name === savedScore.name);
        if (player) {
            player.score = savedScore.score;
        }
    });

    // Eliminar la última entrada del historial
    const lastMove = gameState.moveHistory.pop();
    if (lastMove) {
        gameState.totalMoves--;
    }

    // Retroceder el turno
    gameState.currentTurnIndex = (gameState.currentTurnIndex - 1 + gameState.players.length) % gameState.players.length;

    // Limpiar fichas temporales
    gameState.tempTiles = [];

    // Actualizar UI
    renderBoard();
    renderPlayers();
    renderHistory();
    updateStats();
    updateTurnIndicator();
}

function exchangeTiles() {
    const currentPlayer = gameState.players[gameState.currentTurnIndex];

    if (!confirm(`${currentPlayer.name}, ¿cambiar fichas? Perderás tu turno.`)) {
        return;
    }

    // Limpiar fichas temporales
    gameState.tempTiles = [];

    // Agregar al historial
    gameState.moveHistory.push({
        player: currentPlayer.name,
        word: '🔄 Cambió fichas',
        score: 0,
        time: formatTime(),
        type: 'exchange'
    });

    // Pasar turno
    nextTurn();

    // Actualizar UI
    renderBoard();
    renderPlayers();
    renderHistory();
}

function passTurn() {
    if (confirm('¿Seguro que quieres pasar tu turno?')) {
        gameState.tempTiles = [];
        nextTurn();
        renderBoard();
        renderPlayers();
    }
}

function nextTurn() {
    gameState.currentTurnIndex = (gameState.currentTurnIndex + 1) % gameState.players.length;
    updateTurnIndicator();
}

// ==================== MODALES ====================

function initModals() {
    // Modal de palabra
    document.getElementById('btnCancelWord').addEventListener('click', hideWordModal);
    document.getElementById('btnInsertWord').addEventListener('click', insertWord);

    // Controles de jugada
    document.getElementById('btnClearMove').addEventListener('click', clearMove);
    document.getElementById('btnUndoMove').addEventListener('click', undoLastMove);
    document.getElementById('btnConfirmMove').addEventListener('click', confirmMove);
    document.getElementById('btnExchangeTiles').addEventListener('click', exchangeTiles);
    document.getElementById('btnPassTurn').addEventListener('click', passTurn);

    // Finalizar partida
    document.getElementById('btnEndGame').addEventListener('click', showEndGameModal);
    document.getElementById('btnCancelEnd').addEventListener('click', hideEndGameModal);
    document.getElementById('btnConfirmEnd').addEventListener('click', calculateFinalResults);

    // Nueva partida
    document.getElementById('btnNewGame').addEventListener('click', () => {
        if (confirm('¿Seguro que quieres iniciar una nueva partida? Se perderá el progreso actual.')) {
            location.reload();
        }
    });

    document.getElementById('btnBackToSetup').addEventListener('click', () => {
        location.reload();
    });

    // Enter en input de palabra
    document.getElementById('wordInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            insertWord();
        }
    });
}

function showWordModal() {
    document.getElementById('wordModal').classList.remove('hidden');
    document.getElementById('wordInput').value = '';
    document.getElementById('wordInput').focus();
}

function hideWordModal() {
    document.getElementById('wordModal').classList.add('hidden');
}

function insertWord() {
    const word = document.getElementById('wordInput').value.trim().toUpperCase();
    if (!word) return;

    const direction = document.querySelector('input[name="direction"]:checked').value;
    const { row, col } = gameState.targetCell;

    let r = row;
    let c = col;

    // Validar que la palabra cabe en el tablero
    for (let i = 0; i < word.length; i++) {
        if (r >= BOARD_SIZE || c >= BOARD_SIZE) {
            alert('La palabra se sale del tablero');
            return;
        }

        const key = `${r}-${c}`;
        const existing = gameState.board[key];

        // Validar conflictos
        if (existing && existing.toUpperCase() !== word[i]) {
            alert(`Conflicto: En la casilla hay una '${existing.toUpperCase()}' pero intentas poner '${word[i]}'`);
            return;
        }

        if (direction === 'H') c++;
        else r++;
    }

    // Insertar fichas
    r = row;
    c = col;

    for (let i = 0; i < word.length; i++) {
        const key = `${r}-${c}`;

        // Solo insertar si la casilla está vacía
        if (!gameState.board[key]) {
            // Remover ficha temporal si existe
            gameState.tempTiles = gameState.tempTiles.filter(t => !(t.row === r && t.col === c));

            const letter = word[i];
            if (LETTER_SCORES[letter] !== undefined) {
                gameState.tempTiles.push({ row: r, col: c, letter: letter });
            }
        }

        if (direction === 'H') c++;
        else r++;
    }

    // Guardar la palabra completa para el historial
    gameState.lastInsertedWord = word;

    hideWordModal();
    renderBoard();
}

function showEndGameModal() {
    const formEl = document.getElementById('remainingLettersForm');
    formEl.innerHTML = '';

    gameState.players.forEach(player => {
        const group = document.createElement('div');
        group.className = 'remaining-input-group';
        group.innerHTML = `
            <label>${player.name}:</label>
            <input type="text" 
                   id="remaining-${player.name}" 
                   placeholder="Ej: ABC (letras sobrantes)"
                   autocomplete="off">
        `;
        formEl.appendChild(group);
    });

    document.getElementById('endGameModal').classList.remove('hidden');
}

function hideEndGameModal() {
    document.getElementById('endGameModal').classList.add('hidden');
}

function calculateFinalResults() {
    // Detener cronómetro
    stopTimer();
    const totalTime = getElapsedTime();

    const results = [];
    let totalRemainingPoints = 0;

    // Calcular puntos de letras sobrantes
    gameState.players.forEach(player => {
        const input = document.getElementById(`remaining-${player.name}`);
        const remaining = input.value.trim().toUpperCase();

        let remainingPoints = 0;
        for (let letter of remaining) {
            remainingPoints += LETTER_SCORES[letter] || 0;
        }

        totalRemainingPoints += remainingPoints;

        results.push({
            name: player.name,
            gameScore: player.score,
            remainingLetters: remaining,
            remainingPoints: remainingPoints,
            finalScore: player.score - remainingPoints
        });
    });

    // Ordenar por puntuación final
    results.sort((a, b) => b.finalScore - a.finalScore);

    // El ganador recibe los puntos de las letras sobrantes de los demás
    if (results.length > 0) {
        results[0].finalScore += totalRemainingPoints - results[0].remainingPoints;
    }

    showFinalResults(results, totalTime);
}

async function showFinalResults(results, totalTime) {
    hideEndGameModal();

    const resultsEl = document.getElementById('finalResults');

    // Guardar estadísticas de cada jugador
    for (let i = 0; i < results.length; i++) {
        const result = results[i];
        const isWinner = i === 0;

        // Encontrar la mejor palabra de este jugador en el historial
        let bestWord = '';
        let bestWordScore = 0;

        gameState.moveHistory.forEach(move => {
            if (move.player === result.name && move.score > bestWordScore && move.type !== 'exchange' && move.type !== 'undo') {
                bestWordScore = move.score;
                bestWord = move.word;
            }
        });

        await updatePlayerStats(result.name, result.finalScore, bestWord, bestWordScore, isWinner);
    }

    // Agregar información del tiempo total
    let html = `<div style="text-align: center; margin-bottom: 1.5rem; padding: 1rem; background: var(--bg-dark); border-radius: 8px;">
        <h3 style="margin-bottom: 0.5rem; color: var(--text-muted);">Tiempo Total de Partida</h3>
        <div style="font-family: 'Courier New', monospace; font-size: 2rem; font-weight: 700; color: var(--warning);">
            ⏱️ ${totalTime}
        </div>
    </div>`;

    html += '<table class="results-table"><thead><tr>';
    html += '<th>Posición</th>';
    html += '<th>Jugador</th>';
    html += '<th>Puntos de Juego</th>';
    html += '<th>Letras Sobrantes</th>';
    html += '<th>Penalización</th>';
    html += '<th>Puntuación Final</th>';
    html += '</tr></thead><tbody>';

    results.forEach((result, index) => {
        const isWinner = index === 0;
        html += `<tr class="${isWinner ? 'winner' : ''}">`;
        html += `<td>${index + 1}°</td>`;
        html += `<td>${result.name}${isWinner ? '<span class="winner-badge">🏆 GANADOR</span>' : ''}</td>`;
        html += `<td>${result.gameScore}</td>`;
        html += `<td>${result.remainingLetters || '-'}</td>`;
        html += `<td>-${result.remainingPoints}</td>`;
        html += `<td><strong>${result.finalScore}</strong></td>`;
        html += '</tr>';
    });

    html += '</tbody></table>';

    resultsEl.innerHTML = html;
    document.getElementById('resultsModal').classList.remove('hidden');
}

// ==================== INICIALIZACIÓN DE CONTROLES ====================

function initGameView() {
    // Los event listeners se configuran en initModals()
}

console.log('🎲 Scrabble - Contador de Puntos iniciado correctamente');
