//variables
var origBoard;
const huPlayer = 'O';
const aiPlayer = 'X';
const winCombos = [
  [0,1,2],
  [3,4,5],
  [6,7,8],
  [0,3,6],
  [1,4,7],
  [2,5,8],
  [0,4,8],
  [2,4,6]
];
const cells = document.querySelectorAll('.cell');


//function declarations:

function startGame() {
  document.querySelector('.endgame').style.display = 'none';
  document.querySelector('button').style.display = 'none';
  origBoard = Array.from(Array(9).keys());

  //reseting the gameboard to empty values.
  cells.forEach((cell) => {
    cell.innerText = '';
    cell.style.removeProperty('color');
    cell.addEventListener('click', turnClick, false);
  })
}


function turnClick(square) {
  if (typeof origBoard[square.target.id] == 'number') {
    turn(square.target.id, huPlayer);
    if(!checkTie()) turn(bestSpot(), aiPlayer);
  }
}

//update the game state and check for a win condition.
function turn(id,player) {
  origBoard[id] = player;
  document.getElementById(id).innerText = player;
  let gameWon = checkWin(origBoard, player);
  if(gameWon) gameOver(gameWon);
}

function checkWin(board, player) {
  //find every every index tha the player has played in.
  // a is accumulator (initialised in the end as []).
  //e is the element in the board array that we are going through.
  // i is index.
  //if the element = player then i is added to accumulator array.
  let plays = board.reduce((a,e,i) => (e === player) ? a.concat(i) : a, [])
  let gameWon = null;
  //winCombos.entries is a way to get the index and the subarray from winCombos for each win combo.
  for (let [index, win] of winCombos.entries()) {
    //check if player has played in each spot in the win combo.
    if(win.every(elem => plays.indexOf(elem) > -1)) {
      gameWon = {index: index, player: player};
      break;
    }
  }
  return gameWon;
}

function gameOver(gameWon) {
	for (let index of winCombos[gameWon.index]) {
		document.getElementById(index).style.color =
			gameWon.player == huPlayer ? "blue" : "red";
	}
  cells.forEach((cell) => {
    cell.removeEventListener('click', turnClick, false);
  })
  declareWinner(gameWon.player == huPlayer ? "YOU WON" : "YOU LOST");
}

function declareWinner(who) {
  document.querySelector(".endgame").style.display = 'block';
  document.querySelector("button").style.display = 'block';
  document.querySelector(".endgame .text").innerText = who;
}

function emptySquares() {
  return origBoard.filter(s => typeof s == 'number');
}

function checkTie() {
  if (emptySquares().length == 0) {
    cells.forEach((cell) => {
      cell.style.color = 'green';
      cell.removeEventListener('click', turnClick, false);
    })
    declareWinner("Tie Game!");
    return true
  }
  return false;
}

//creating AI
function bestSpot() {
  return minimax(origBoard, aiPlayer).index;
}

function minimax(newBoard, player) {
  //make a list of all the available empty spots
	var availSpots = emptySquares(newBoard);

  //check the board for any terminal states
	if (checkWin(newBoard, huPlayer)) {
		return {score: -10};
	} else if (checkWin(newBoard, aiPlayer)) {
		return {score: 10};
	} else if (availSpots.length === 0) {
		return {score: 0};
	}

	var moves = [];

	for (var i = 0; i < availSpots.length; i++) {
		var move = {};
		move.index = newBoard[availSpots[i]];
    //puts the current player on the first available spot
		newBoard[availSpots[i]] = player;

		if (player == aiPlayer) {
			var result = minimax(newBoard, huPlayer);
			move.score = result.score;
		} else {
			var result = minimax(newBoard, aiPlayer);
			move.score = result.score;
		}

		newBoard[availSpots[i]] = move.index;

		moves.push(move);
	}

	var bestMove;
	if(player === aiPlayer) {
		var bestScore = -10000;
		for(var i = 0; i < moves.length; i++) {
			if (moves[i].score > bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	} else {
		var bestScore = 10000;
		for(var i = 0; i < moves.length; i++) {
			if (moves[i].score < bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	}
	return moves[bestMove];
}


//initiation
startGame();
