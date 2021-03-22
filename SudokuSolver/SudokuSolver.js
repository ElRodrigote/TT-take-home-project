import {
  areSectionsEqual,
  getCol,
  getRow,
  getSquare
} from './utils';

import { DECIMAL_ARRAY, SQUARE_COORDS } from './constants';

// This function assigns either the only possible value 
// or an array of possible values
const findPossibleValues = (board, row, col) => {
  const usedValues = [
    ...getRow(board, row),
    ...getCol(board, col),
    ...getSquare(board, SQUARE_COORDS[row][col])
  ];
  const possibleValues = DECIMAL_ARRAY.filter((number => !usedValues.includes(number)));
  
  if (possibleValues.length === 1) {
      // If there is only one valid possibility, fill it in
      board[row][col] = possibleValues[0];
      return true;
  } else {
      board[row][col] = possibleValues;
      return false;
  }
};

/* This function checks for cell possibilities regarding the
 * row, column and square where it's placed, and tries to set
 * the corresponding value to that cell.  
 */ 
const getAppearsOnceInSection = (board, possibilities, section, row, col) => {
  let isCellUpdated = false;

  for (i = 0; i < possibilities.length; i++) {
    const possibility = possibilities[i];
    let possibilityCounter = 0;

    section.forEach(cell => {
        if (Array.isArray(cell)) {
            if (cell.includes(possibility)) possibilityCounter += 1;
        } else {
            if (cell === possibility) possibilityCounter += 1;
        }
    })

    if (possibilityCounter === 1) {
        board[row][col] = possibility;
        isCellUpdated = true;
        break;
    }
  }

  return isCellUpdated;
};

/* This function checks if every row, column and square complies
 * with Sudoku game rules for winning
 */
const isBoardSolved = (board) => {
  let isValidSolution = true;

  for (let rowNum = 0; rowNum < 9 && isValidSolution; rowNum += 1) {
      if (!areSectionsEqual(DECIMAL_ARRAY, getRow(board, rowNum))) isValidSolution = false;
  }

  for (let col = 0; col < 9 && isValidSolution; col += 1) {
      if (!areSectionsEqual(DECIMAL_ARRAY, getCol(board, col))) isValidSolution = false;
  }

  for (let square = 1; square < 9 && isValidSolution; square += 1) {
      if (!areSectionsEqual(DECIMAL_ARRAY, getSquare(board, square))) isValidSolution = false;
  }

  return isValidSolution;
};

// Bruteforce-ish solver for medium-hard and hard sudokus
const backtrackSolver = (board) => {
  /* Create an array deep clone from our multi-dimensional board array
   * for recursion purposes.  
   */
  const boardClone = JSON.parse(JSON.stringify(board));

  for (let row = 0; row < 9; row += 1) {
    for (let col = 0; col < 9; col += 1) {
      // Find possibilities for empty cells
      if (boardClone[row][col] === '.') {
        findPossibleValues(boardClone, row, col);

        // Early return in case all the possibilities were single values
        if (isBoardSolved(boardClone)) return boardClone;

        const cell = boardClone[row][col];

        // Iterate over the possible values for the cell, and use recursion
        if (Array.isArray(cell)) {
          for (let index = 0; index < cell.length; index += 1) {
            // Create a board decision tree for recursions
            let recursiveBoard = JSON.parse(JSON.stringify(boardClone));
            recursiveBoard[row][col] = cell[index];

            const completedBoard = backtrackSolver(recursiveBoard);

            if (completedBoard) return completedBoard;
          }

          // Found a dead end.
          return false;
        }
      }
    }
  }

  return false;
};

/* Constraint model based algorithm, applying one value constraint.
 * Apply the rules of Sudoku and fills all cells we are 100% certain
 * only one value can apply for it. Solves most easy and medium Sudokus.
 */
const constraintSolver = (board) => {
  let isCellUpdated = false

  // Convert every empty cell into its possibilities
  for (let row = 0; row < 9; row += 1) {
    for (let col = 0; col < 9; col += 1) {
      if (board[row][col] === '.')
        isCellUpdated = findPossibleValues(board, row, col) || isCellUpdated;
    }
  }

  // Fill in empty cells with a single possibility for it.
  for (let row = 0; row < 9; row += 1) {
    for (let col = 0; col < 9; col += 1) {
      if (Array.isArray(board[row][col])) {
        let possibilities = board[row][col];

        isCellUpdated =
          getAppearsOnceInSection(board, possibilities, getRow(board, row), row, col) ||
          getAppearsOnceInSection(board, possibilities, getCol(board, col), row, col) ||
          getAppearsOnceInSection(board, possibilities, getSquare(board, SQUARE_COORDS[row][col]), row, col) || isCellUpdated;
      }
    }
  }

  // Reset prior empty cells. Needed due to the amount of mutations.
  for (let row = 0; row < 9; row += 1) {
    for (let col = 0; col < 9; col += 1) {
      if (Array.isArray(board[row][col])) board[row][col] = '.';
    }
  }

  return isCellUpdated;
}

const parseBoard = (board) => {
  for (let row = 0; row < 9; row += 1) {
    for (let col = 0; col < 9; col += 1) {
      if (board[row][col] !== '.') board[row][col] = parseInt(board[row][col])
    }
  }
};

const sudokuSolver = (board) => {
  parseBoard(board);

  let boardSolved = false;
  let boardUpdated = true;

  /* Constraint Solver algorithm will crack most easy and medium boards,
   * although it may not crack most of the hard sudokus. But mixing this
   * algorithm prior to using brute force with Backtrack Solver, fills
   * some of the empty cells and eases the Backtrack work, if needed. 
   */
  while (boardUpdated && !boardSolved) {
    boardUpdated = constraintSolver(board);
    boardSolved = isBoardSolved(board);
  }

  // Hard-Evil need brute force to finish off.  
  if (!boardSolved) {
    board = backtrackSolver(board);
    boardSolved = isBoardSolved(board);
  }

  return board;
}

const logCell = (value) => Array.isArray(value) ? '.' : value;

const logBoard = (board) => {
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

// Test cases
let easyBoard = [
  ["5","3",".",".","7",".",".",".","."],
  ["6",".",".","1","9","5",".",".","."],
  [".","9","8",".",".",".",".","6","."],
  ["8",".",".",".","6",".",".",".","3"],
  ["4",".",".","8",".","3",".",".","1"],
  ["7",".",".",".","2",".",".",".","6"],
  [".","6",".",".",".",".","2","8","."],
  [".",".",".","4","1","9",".",".","5"],
  [".",".",".",".","8",".",".","7","9"]
];

let mediumBoard = [
  [".",".",".",".","6",".",".",".","."],
  [".","5",".",".",".",".","9","7","."],
  [".",".","2",".",".","5",".",".","."],
  [".",".",".","2",".",".",".","8","."],
  [".","7","4",".",".",".",".",".","."],
  [".","8","5",".","4",".","2",".","1"],
  [".",".","1",".",".","7",".",".","."],
  ["6",".",".",".",".","4",".",".","."],
  ["9","2",".","6",".",".","1",".","."]
];

let hardBoard = [
  [".",".",".",".",".",".",".",".","."],
  [".",".",".",".",".",".","9",".","."],
  ["9","7",".","3",".",".",".",".","."],
  [".","1",".",".","6",".","5",".","."],
  [".",".","4","7",".","8",".",".","2"],
  [".",".",".",".",".","2",".",".","6"],
  [".","3","1",".",".","4",".",".","."],
  [".",".",".","8",".",".","1","6","7"],
  [".","8","7",".",".",".",".",".","."]
];
    

console.log('Difficulty - Easy');
logBoard(easyBoard);
console.log('Solving...');
logBoard(sudokuSolver(easyBoard));
console.log('Solved!');

console.log('Difficulty - Medium');
logBoard(mediumBoard);
console.log('Solving...');
logBoard(sudokuSolver(mediumBoard));
console.log('Solved!');

console.log('Difficulty - Hard');
logBoard(hardBoard);
console.log('Solving...');
logBoard(sudokuSolver(hardBoard));
console.log('Solved!');
