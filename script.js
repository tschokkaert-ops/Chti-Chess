// Initialisation du jeu et de l'échiquier
let game = new Chess();
let board = Chessboard('board', {
    draggable: true,
    position: 'start',
    onDragStart: onDragStart,
    onDrop: onDrop,
    onSnapEnd: onSnapEnd
});

// Fonction pour vérifier si le déplacement est valide
function onDragStart(source, piece) {
    return !game.game_over() && (game.turn() === piece[0]);
}

// Fonction pour gérer le déplacement
function onDrop(source, target) {
    const move = game.move({ from: source, to: target, promotion: 'q' });
    if (move === null) return 'snapback';
    updateStatus();
}

// Mise à jour du statut du jeu
function onSnapEnd() {
    board.position(game.fen());
    updateStatus();
}

// Afficher le statut (ex: "Échec et mat !")
function updateStatus() {
    const status = document.getElementById('status');
    let message = 'Tour des ';
    message += game.turn() === 'w' ? 'blancs' : 'noirs';

    if (game.isCheck()) message += ' - Échec !';
    if (game.isCheckmate()) message += ' - Échec et mat !';
    if (game.isDraw()) message += ' - Match nul !';

    status.textContent = message;
}

// Initialisation de Stockfish
let stockfish = null;

function initStockfish() {
    stockfish = new Worker('stockfish.min.js');
}

// Fonction pour analyser la partie
document.getElementById('analyzeBtn').addEventListener('click', () => {
    if (!stockfish) initStockfish();

    const fen = game.fen();
    stockfish.postMessage(`position fen ${fen}`);
    stockfish.postMessage('go depth 10');

    stockfish.onmessage = (event) => {
        if (event.data.includes('bestmove')) {
            const bestMove = event.data.split(' ')[1];
            document.getElementById('analysisResult').textContent =
                `Meilleur coup suggéré : ${bestMove}`;
        }
    };
});
