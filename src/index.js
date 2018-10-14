var origBoard;
const humPlayer = 'O';
const comPlayer = 'X';
const winCombination = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 4, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [6, 4, 2]
];

const cells = document.querySelectorAll('.cell');
startGame();

function startGame() {
    document.querySelector(".endgame").style.display = "none";
    origBoard = Array.from(Array(9).keys());
    for (var i = 0; i < cells.length; i++) {
        cells[i].innerText = '';
        cells[i].style.removeProperty('background-color');
        cells[i].addEventListener('click', turnClick, false);
    }
}

function turnClick(square) {
    if (typeof origBoard[square.target.id] == 'number') {
        turn(square.target.id, humPlayer)
        if (!checkWin(origBoard, humPlayer) && !checkTie()) turn(bestSpot(), comPlayer);
    }
}

function turn(squareId, player) {
    origBoard[squareId] = player;
    document.getElementById(squareId).innerText = player;
    let gameWon = checkWin(origBoard, player);
    if (gameWon) gameOver(gameWon);
}

function checkWin(board, player) {
    let plays = board.reduce((a, e, i) =>
        (e === player) ? a.concat(i) : a, []);
    let gameWon = null;
    for (let [index, win] of winCombination.entries()) {
        if (win.every(elem => plays.indexOf(elem) > -1)) {
            gameWon = { index: index, player: player };
            break;
        }
    }
    return gameWon;
}

function gameOver(gameWon) {
    for (let index of winCombination[gameWon.index]) {
        document.getElementById(index).style.backgroundColor = gameWon.player == humPlayer ? "blue" : "red";
    }
    for (var i = 0; i < cells.length; i++) {
        cells[i].removeEventListener('click', turnClick, false);
    }
    declareWinner(gameWon.player == humPlayer ? "You win!" : "You lose!");
}

function declareWinner(who) {
    document.querySelector(".endgame").style.display = "block";
    document.querySelector(".endgame .text").innerText = who;

}

function emptySquares() {
    return origBoard.filter(s => typeof s == 'number');
}

function bestSpot() {
    return minimax(origBoard, comPlayer).index; //minimax algorithm
}

function checkTie() {
    if (emptySquares().length == 0) {
        for (var i = 0; i < cells.length; i++) {
            cells[i].style.backgroundColor = "green";
            cells[i].removeEventListener('click', turnClick, false);
        }
        declareWinner("Tie game!");
        return true;
    }
    return false;
}
//minimax algorithm function
function minimax(newBoard, player) {
    var freeSpots = emptySquares();
    if (checkWin(newBoard, humPlayer)) {
        return { score: -10 };
    } else if (checkWin(newBoard, comPlayer)) {
        return { score: 10 };
    } else if (freeSpots.length === 0) {
        return { score: 0 };
    }
    var moves = [];
    for (var i = 0; i < freeSpots.length; i++) {
        var move = {};
        move.index = newBoard[freeSpots[i]];
        newBoard[freeSpots[i]] = player;
        if (player == comPlayer) {
            var result = minimax(newBoard, humPlayer);
            move.score = result.score;
        } else {
            var result = minimax(newBoard, comPlayer);
            move.score = result.score;
        }

        newBoard[freeSpots[i]] = move.index;
        moves.push(move);
    }
    var bestMove;
    if (player === comPlayer) {
        var bestScore = -10000;
        for (var i = 0; i < moves.length; i++) {
            if (moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    } else {
        var bestScore = 10000;
        for (var i = 0; i < moves.length; i++) {
            if (moves[i].score < bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }
    return moves[bestMove];
}