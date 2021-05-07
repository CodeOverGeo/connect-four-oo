/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

class Game {
  constructor(p1, p2, WIDTH = 7, HEIGHT = 6) {
    this.WIDTH = WIDTH;
    this.HEIGHT = HEIGHT;
    this.players = [p1, p2];
    this.currPlayer = p1;
    this.makeBoard();
    this.makeHtmlBoard();
    this.colorUnique();
  }
  /** makeBoard: create in-JS board structure:
   *   board = array of rows, each row is array of cells  (board[y][x])
   */
  makeBoard() {
    this.board = [];
    for (let y = 0; y < this.HEIGHT; y++) {
      this.board.push(Array.from({ length: this.WIDTH }));
    }
  }

  /** makeHtmlBoard: make HTML table and row of column tops. */
  makeHtmlBoard() {
    const board = document.getElementById('board');
    board.innerHTML = '';
    // make column tops (clickable area for adding a piece to that column)
    var top = document.createElement('tr');
    top.setAttribute('id', 'column-top');
    top.classList.add('player1');
    this.handleGameClick = this.handleClick.bind(this);
    top.addEventListener('click', this.handleGameClick);

    for (let x = 0; x < this.WIDTH; x++) {
      const headCell = document.createElement('td');
      headCell.setAttribute('id', x);
      top.append(headCell);
    }

    board.append(top);

    // make main part of board
    for (let y = 0; y < this.HEIGHT; y++) {
      const row = document.createElement('tr');

      for (let x = 0; x < this.WIDTH; x++) {
        const cell = document.createElement('td');
        cell.setAttribute('id', `${y}-${x}`);
        row.append(cell);
      }

      board.append(row);
    }
  }

  /** findSpotForCol: given column x, return top empty y (null if filled) */
  findSpotForCol(x) {
    for (let y = this.HEIGHT - 1; y >= 0; y--) {
      if (!this.board[y][x]) {
        return y;
      }
    }
    return null;
  }

  //check for color uniqueness
  //if not unique, find the opposite hex color and assign to player 2

  colorUnique() {
    const hexStringP1 = this.players[0].color.substring(1);
    const hexStringP2 = this.players[1].color.substring(1);
    if (this.players[0].color === this.players[1].color) {
      this.players[1].color = `#${(Number(`0x1${hexStringP1}`) ^ 0xffffff)
        .toString(16)
        .substr(1)
        .toUpperCase()}`;
    }
  }

  /** placeInTable: update DOM to place piece into HTML table of board */

  placeInTable(y, x) {
    const piece = document.createElement('div');
    piece.classList.add('piece');

    piece.style.backgroundColor = this.currPlayer.color;
    piece.style.top = -50 * (y + 2);

    const spot = document.getElementById(`${y}-${x}`);

    spot.append(piece);
  }

  /** endGame: announce game end */
  // delay alert so last piece is shown, remove click handler on top row

  endGame(msg) {
    setTimeout(() => {
      const top = document.querySelector('#column-top');
      top.removeEventListener('click', this.handleGameClick);
      alert(msg);
    }, 100);
  }

  /** handleClick: handle click of column top to play piece */

  handleClick(evt) {
    // get x from ID of clicked cell
    const x = +evt.target.id;

    // get next spot in column (if none, ignore click)
    const y = this.findSpotForCol(x);
    if (y === null) {
      return;
    }

    // place piece in board and add to HTML table
    this.board[y][x] = this.currPlayer;
    this.placeInTable(y, x);

    // check for win
    if (this.checkForWin()) {
      return this.endGame(`The ${this.currPlayer.name} Player won!`);
    }

    // check for tie
    if (this.board.every((row) => row.every((cell) => cell))) {
      return this.endGame('Tie!');
    }

    // active player: 1 or 2
    this.currPlayer =
      this.currPlayer === this.players[0] ? this.players[1] : this.players[0];
  }

  /** checkForWin: check board cell-by-cell for "does a win start here?" */

  checkForWin() {
    const _win = (cells) =>
      // Check four cells to see if they're all color of current player
      //  - cells: list of four (y, x) cells
      //  - returns true if all are legal coordinates & all match currPlayer

      cells.every(
        ([y, x]) =>
          y >= 0 &&
          y < this.HEIGHT &&
          x >= 0 &&
          x < this.WIDTH &&
          this.board[y][x] === this.currPlayer
      );
    for (let y = 0; y < this.HEIGHT; y++) {
      for (let x = 0; x < this.WIDTH; x++) {
        // get "check list" of 4 cells (starting here) for each of the different
        // ways to win
        const horiz = [
          [y, x],
          [y, x + 1],
          [y, x + 2],
          [y, x + 3],
        ];
        const vert = [
          [y, x],
          [y + 1, x],
          [y + 2, x],
          [y + 3, x],
        ];
        const diagDR = [
          [y, x],
          [y + 1, x + 1],
          [y + 2, x + 2],
          [y + 3, x + 3],
        ];
        const diagDL = [
          [y, x],
          [y + 1, x - 1],
          [y + 2, x - 2],
          [y + 3, x - 3],
        ];

        // find winner (only checking each win-possibility as needed)
        if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
          return true;
        }
      }
    }
  }

  // array of rows, each row is array of cells  (board[y][x])
}

//Player class that holds name and color for game over name and color of piece

class Player {
  constructor(color, hex) {
    this.name = color;
    this.color = hex;
  }
}

//convert named color to hex to be able to reverse in case of both same color

function hexConvert(str) {
  const ctx = document.createElement('canvas').getContext('2d');
  ctx.fillStyle = str;
  return ctx.fillStyle;
}

//add click listener to button to create 2 players for game, store hex and name

document.getElementById('start').addEventListener('click', () => {
  let p1 = new Player(
    document.getElementById('p1-color').value,
    hexConvert(`${document.getElementById('p1-color').value}`)
  );
  let p2 = new Player(
    document.getElementById('p2-color').value,
    hexConvert(`${document.getElementById('p2-color').value}`)
  );

  new Game(p1, p2);
});
