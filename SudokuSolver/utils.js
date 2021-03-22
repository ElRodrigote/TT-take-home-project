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
  