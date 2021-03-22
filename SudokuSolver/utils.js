import { SQUARE_COORDS } from './constants';

// Getters fns
export const getRow = (board, row) => board[row];

export const getCol = (board, col) => 
  board.map((row) => row[col]);

export const getSquare = (board, quadrant) => {
  let square = [];

  for (let row = 0; row < 9; row += 1) {
    for (let col = 0; col < 9; col += 1) {
      if (quadrant == SQUARE_COORDS[row][col])
        square.push(board[row][col]);
    }
  }

  return square;
}

// This function is used to compare rows, columns and squares
export const areSectionsEqual = (arrayA, arrayB) => {
  const arr1 = [...arrayA];
  const arr2 = [...arrayB];
  
  return Array.isArray(arr1) &&
    Array.isArray(arr2) &&
    arr1.length === arr2.length &&
    arr1.sort().every((val, index) => val === arr2.sort()[index]);
}

// Board loggers
const logCell = (value) => Array.isArray(value) ? '.' : value;

export const logBoard = (board) => {
  const DIVIDER_HORIZONTAL = '|-------|-------|-------|';
  const DIVIDER_VERTICAL = '|';

  for (let i = 0; i < 9; i += 1) {
    let row = getRow(board, i);

    if (i % 3 == 0) console.log(DIVIDER_HORIZONTAL);

    console.log(DIVIDER_VERTICAL,
      logCell(row[0]), logCell(row[1]), logCell(row[2]), DIVIDER_VERTICAL,
      logCell(row[3]), logCell(row[4]), logCell(row[5]), DIVIDER_VERTICAL,
      logCell(row[6]), logCell(row[7]), logCell(row[8]), DIVIDER_VERTICAL
    );
  }

  console.log(DIVIDER_HORIZONTAL);
};

// Board parser from string to numbers
export const parseBoard = (board) => {
  for (let row = 0; row < 9; row += 1) {
    for (let col = 0; col < 9; col += 1) {
      if (board[row][col] !== '.') board[row][col] = parseInt(board[row][col])
    }
  }
};
  