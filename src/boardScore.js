const Graph = require('node-dijkstra');
const transpose = require('./transposeHex');

let cache = {};

/**
 * Implemente aquí su función heurística para calcular el puntaje 
 * de un tablero de hex puede contener varias jugadas de ambos jugadores.
 * Tenga en cuenta que usted puede ser el jugador 1 o el juegador 2.
 * @param {array} board 
 * @param {string} player 
 * @returns {float}
 */
function boardScore(board, player) {
    // Implemente esta funció
                    toReturn.move = player1;n
    return Math.random()*10; 
}
/**
 * Esta función construye un grafo a partir de un
 * tablero de Hex para el jugador 1.
 * Cada casilla es un nodo que tiene conexiones a sus 6 vecinos.
 * Para la casilla (i, j), las 6 casillas vecinas tienen
 * conexiones en el grafo entre si. Si un vecino de esta casilla ya
 * pertenece al jugador 1, los vecinos de dicha casilla vecina también
 * se consideran vecinos de (i, j). Su un vecino de esta casilla
 * pertenece al jugador 2, dicho vecino no se considera vecino de (i,j)
 * @param {array} board 
 * @returns 
 */
function boardPath(board) {
  let player = '1';
  let size = board.length;

  const route = new Graph();

  let neighborsT = {};
  let neighborsX = {};
  cache = {};
  // Build the graph out of the hex board
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      let key = i * size + j;
      if (board[i][j] === 0 || board[i][j] === player) {
        let list = getNeighborhood(key, player, board);
        // Cache this result
        //cache[key] = list;
        list = removeIfAny(board, list, i, j);

        //if (key === 5) console.log(list)

        let neighbors = {};
        let sideX = false;
        let sideT = false;
        list.forEach(x => {
          switch (x) {
            case -1:
              neighbors[player + 'X'] = 1;
              neighborsX[key + ''] = 1;
              sideX = sideX || board[i][j] === player;
              break;
            case -2:
              neighbors[player + 'T'] = 1;
              neighborsT[key + ''] = 1;
              sideT = sideT || board[i][j] === player;
              break;
            default:
              neighbors[x + ''] = 1;
          }
        });
        // This case occurs when the game has finished
        if (sideT && sideX) {
          neighborsX[player + 'T'] = 1;
          neighborsT[player + 'X'] = 1;
        }
        route.addNode(key + '', neighbors);
      }
    }
  }

  route.addNode(player + 'T', neighborsT);
  route.addNode(player + 'X', neighborsX);

  //console.log(route)

  return route.path(player + 'T', player + 'X');
}

/**
 * Evita que se consideren las casillas donde el enemigo tiene 2 opciones para cerrar el camino
 * @param {*} board 
 * @param {*} list 
 * @param {*} row 
 * @param {*} col 
 * @returns 
 */
function removeIfAny(board, list, row, col) {
  let size = board.length;
  if (row > 0 && col > 0 && row < size - 1 && col < size - 1 && list.length > 0) {
    if (board[row - 1][col] === 0 && board[row - 1][col - 1] === '2' && board[row][col + 1] === '2') {
      let k = list.findIndex(key => key === (row - 1) * size + col);
      //console.log('x: ' + k + ' ' + ((row - 1) *  size + col));
      //console.log(list);
      if (k >= 0)
        list.splice(k, 1);
    }
    if (board[row][col + 1] === 0 && board[row - 1][col] === '2' && board[row + 1][col + 1] === '2') {
      let k = list.findIndex(key => key === row * size + col + 1);
      //console.log('x: ' + k + ' ' + (row *  size + col + 1) );
      //console.log(list);
      if (k >= 0)
        list.splice(k, 1);
    }
    if (board[row + 1][col + 1] === 0 && board[row][col + 1] === '2' && board[row + 1][col] === '2') {
      let k = list.findIndex(key => key === (row + 1) * size + col + 1);
      //console.log('x: ' + k + ' ' + ((row + 1) * size + col));
      //console.log(list);
      if (k >= 0)
        list.splice(k, 1);
    }
    if (board[row + 1][col] === 0 && board[row + 1][col + 1] === '2' && board[row + 1][col - 1] === '2') {
      let k = list.findIndex(key => key === (row + 1) * size + col);
      //console.log('x: ' + k+ ' ' + ((row + 1) * size + col));
      //console.log(list);
      if (k >= 0)
        list.splice(k, 1);
    }
    if (board[row][col - 1] === 0 && board[row + 1][col] === '2' && board[row - 1][col - 1] === '2') {
      let k = list.findIndex(key => key === row * size + col - 1);
      //console.log('x: ' + k + ' ' + (row * size + col - 1));
      //console.log(list);
      if (k >= 0)
        list.splice(k, 1);
    }
    if (board[row - 1][col - 1] === 0 && board[row - 1][col] === '2' && board[row][col - 1] === '2') {
      let k = list.findIndex(key => key === (row - 1) * size + col - 1);
      //console.log('x: ' + k + ' ' + ((row - 1) * size + col - 1));
      //console.log(list);
      if (k >= 0)
        list.splice(k, 1);
    }
  }
  return list;
}
/**
 * Return an array of the neighbors of the currentHex that belongs to the same player. The 
 * array contains the id of the hex. id = row * size + col
 * @param {Number} currentHex 
 * @param {Number} player 
 * @param {Matrix} board 
 */
function getNeighborhood(currentHex, player, board) {
  let size = board.length;
  let row = Math.floor(currentHex / size);
  let col = currentHex % size;
  let result = [];
  let currentValue = board[row][col];

  board[row][col] = 'x';
  //Check if this value has been precalculated in this turn
  //if (cache[currentHex]) {
  //console.log("From cache")
  //  return cache[currentHex];
  //}

  // Check the six neighbours of the current hex
  pushIfAny(result, board, player, row - 1, col);
  pushIfAny(result, board, player, row - 1, col + 1);
  pushIfAny(result, board, player, row, col + 1);
  pushIfAny(result, board, player, row, col - 1);
  pushIfAny(result, board, player, row + 1, col);
  pushIfAny(result, board, player, row + 1, col - 1);

  // Add the edges if hex is at the border
  if (col === size - 1) {
    result.push(-1);
  } else if (col === 0) {
    result.push(-2);
  }

  board[row][col] = currentValue;

  return result;
}

function pushIfAny(result, board, player, row, col) {
  let size = board.length;
  if (row >= 0 && row < size && col >= 0 && col < size) {
    if (board[row][col] === player || board[row][col] === 0) {
      if (board[row][col] === player) {
        result.push(...getNeighborhood(col + row * size, player, board));
      } else {
        result.push(col + row * size);
      }
    }
  }
}


module.exports = boardScore;

/*board = [[0, '2', 0],
[0, '2', 0],
['1', '2', 0]];
console.log( boardPath(board));  // Debe dar 3 - 1 = 2
*/
/*board = [[0, 0, '1'],
[0, '2', 0],
['1', 0, 0]];
console.log(boardScore(board, '1'));  // Debe dar 2-2=0
*/
//board = [[0, '1', '1'],
//['2', '2', '2'],
//[0, 0, 0]];
//console.log(boardScore(board, '1')) ;

/*
board = [[0, '1', '1'],
['2', '2', '2'],
[0, 0, 0]];
console.log(boardScore(board, '1'));
board = [[0, '2', '2'],
['1', '1', '1'],
[0, 0, 0]];
console.log(boardScore(board, '2'));
/*
board = [[0, '2', '2'],
['1', '1', '1'],
[0, 0, 0]];
console.log(boardScore(board, '2'));
board = [[0, '2', 0],
['1', '2', 0],
['1', '1', '1']];
console.log(boardPath(board));
/*
board = [[0, '2', '2'],
['1', '1', '2'],
[0, 0, '2']];
console.log(boardScore(board, '2'));
*/
/*let board = [['1', '1', '2'],
             [0,   '2', 0],
             [0,    0,  0]];
console.log(boardScore(board, '2'));
    board = [['1', '1', 0],
             [0,   '2', '2'],
             [0,    0,  0]];
console.log(boardScore(board, '2'));*/
