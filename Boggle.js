const boggleFinder = (matrix, word) => {
  let wordExists = false;

  // Iterate over the given matrix
  for (let row = 0; row < matrix.length; row += 1) {
    for (let col = 0; col < matrix[0].length; col += 1) {
      // Do DFS search for the word, on first character in the word
      if (characterFinder(matrix, word, row, col, 0)) wordExists = true;
    }
  }

  return wordExists;
};

const characterFinder = (matrix, word, row, col, currPos) => {
  const rows = matrix.length;
  const columns = matrix[0].length;
  const nextChar = currPos + 1;

  // Out of boundaries early returns
  if (row < 0 || row >= rows
   || col < 0 || col >= columns
  ) return false;

  // If lookup character found in current position
  if (matrix[row][col] === word.charAt(currPos)) {
    // Copy the found char, flag it to avoid re-using it and let
    // let the DFS do the search
    const cachedChar = matrix[row][col];

    matrix[row][col] = 0;
  	// Check if it's the last character in the word
    if (currPos === word.length - 1) return true
    
    // Else, check with DFS the four adjacent tiles
    // for the next character in the word
    if (
      characterFinder(matrix, word, row - 1, col, nextChar) || // Up
      characterFinder(matrix, word, row, col + 1, nextChar) || // Right
      characterFinder(matrix, word, row + 1, col, nextChar) || // Down
      characterFinder(matrix, word, row, col - 1, nextChar)    // Left
    ) return true;

    // Reset the currChar value
    matrix[row][col] = cachedChar
  }

  return false;
};