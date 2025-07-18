const welcomeScreen = document.getElementById("welcomeScreen");
const startBtn = document.getElementById("startBtn");
const gameModes = document.getElementById("gameModes");
const symbolSelection = document.getElementById("symbolSelection");
const gameBoard = document.getElementById("gameBoard");
const modeButtons = document.querySelectorAll("#gameModes button");
const symbolButtons = document.querySelectorAll("#symbolSelection button");
const cells = document.querySelectorAll(".cell");
const statusEl = document.getElementById("status");
const scoreXEl = document.getElementById("scoreX");
const scoreOEl = document.getElementById("scoreO");
const resetBtn = document.getElementById("resetBtn");

let board = Array(9).fill("");
let currentPlayer = "X";
let gameActive = false;
let vsComputer = false;
let playerSymbol = "X";
let computerSymbol = "O";
let scores = { X: 0, O: 0 };

startBtn.onclick = () => {
  welcomeScreen.classList.add("hidden");
  gameModes.classList.remove("hidden");
};

modeButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    vsComputer = btn.id === "vsComputer";
    gameModes.classList.add("hidden");

    if (vsComputer) {
      symbolSelection.classList.remove("hidden");
    } else {
      playerSymbol = "X";
      computerSymbol = "O";
      startGame();
    }
  });
});

symbolButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    playerSymbol = btn.textContent;
    computerSymbol = playerSymbol === "X" ? "O" : "X";
    symbolSelection.classList.add("hidden");
    startGame();
  });
});

function startGame() {
  board = Array(9).fill("");
  currentPlayer = "X";
  gameActive = true;
  gameBoard.classList.remove("hidden");
  statusEl.textContent = `Player ${currentPlayer}'s turn`;
  cells.forEach(cell => {
    cell.textContent = "";
    cell.classList.remove("disabled");
  });
}

function updateStatus() {
  statusEl.textContent = `Player ${currentPlayer}'s turn`;
}

function checkWinner() {
  const wins = [
    [0,1,2], [3,4,5], [6,7,8],
    [0,3,6], [1,4,7], [2,5,8],
    [0,4,8], [2,4,6]
  ];
  for (let [a,b,c] of wins) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  return board.includes("") ? null : "Draw";
}

function computerMove() {
  const empty = board.map((val, i) => val === "" ? i : null).filter(i => i !== null);
  if (empty.length === 0) return;

  const move = empty[Math.floor(Math.random() * empty.length)];
  board[move] = computerSymbol;
  cells[move].textContent = computerSymbol;
  cells[move].classList.add("disabled");

  const winner = checkWinner();
  if (winner) endGame(winner);
  else {
    currentPlayer = playerSymbol;
    updateStatus();
  }
}

cells.forEach((cell, index) => {
  cell.addEventListener("click", () => {
    if (!gameActive || board[index] !== "") return;

    board[index] = currentPlayer;
    cell.textContent = currentPlayer;
    cell.classList.add("disabled");

    const winner = checkWinner();
    if (winner) {
      endGame(winner);
    } else {
      currentPlayer = currentPlayer === "X" ? "O" : "X";
      updateStatus();
      if (vsComputer && currentPlayer === computerSymbol) {
        setTimeout(computerMove, 500);
      }
    }
  });
});

function endGame(winner) {
  gameActive = false;
  if (winner === "Draw") {
    statusEl.textContent = "It's a draw!";
  } else {
    statusEl.textContent = `Player ${winner} wins!`;
    scores[winner]++;
    scoreXEl.textContent = scores["X"];
    scoreOEl.textContent = scores["O"];
  }
}

resetBtn.onclick = () => {
  gameBoard.classList.add("hidden");
  gameModes.classList.remove("hidden");
  symbolSelection.classList.add("hidden");
  board = Array(9).fill("");
  gameActive = false;
  statusEl.textContent = "";
};
