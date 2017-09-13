//variables
var origBoard;
const huPlayer = '0';
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
  origBoard = Array.from(Array(9).keys());

  //reseting the gameboard to empty values.
  for (var i = 0; i < cells.length; i++) {
    //replace with foreach.
    cells[i].innerText = '';
    cells[i].style.removeProperty('background-color');
    cells[i].addEventListener('click', turnClick, false);
  }
}


function turnClick(square) {
  turn(square.target.id, huPlayer)
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
    document.getElementById(index).style.backgroundColor =
      gameWon.player == huPlayer ? 'blue' : 'red';
      for (var i = 0; i < cells.length; i++) {
        cells[i].removeEventListener('click', turnClick, false);
      }
  }
}

//creating AI


//initiation
startGame();
