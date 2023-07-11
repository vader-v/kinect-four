const cells = document.querySelectorAll('.cell');
const columns = Array.from(Array(7).keys()); // Adjust the number of columns if needed
let currentPlayer = 'blue';
let gameEnded = false;

function handleClick(event) {
  if (gameEnded) return; // Stop handling clicks if the game has ended

  const clickedCell = event.target.closest('.cell');
  if (!clickedCell) return;

  const columnIndex = Array.from(clickedCell.parentNode.children).indexOf(clickedCell) % columns.length;

  const columnCells = Array.from(cells).filter((_, index) => index % columns.length === columnIndex);

  // Find the lowest unoccupied cell in the column
  let lowestUnoccupiedCell = null;
  for (let i = columnCells.length - 1; i >= 0; i--) {
    const cell = columnCells[i];
    if (!cell.classList.contains('red') && !cell.classList.contains('blue')) {
      lowestUnoccupiedCell = cell;
      break;
    }
  }

  if (lowestUnoccupiedCell) {
    // Update the class of the lowest unoccupied cell
    lowestUnoccupiedCell.classList.remove('red', 'blue');
    lowestUnoccupiedCell.classList.add(currentPlayer);

    // Swap the current player and assign the next color class
    currentPlayer = currentPlayer === 'red' ? 'blue' : 'red';

    // Update the UI to reflect the currentPlayer
    const playerIndicator = document.getElementById('player-indicator');
    playerIndicator.textContent = `Current Player: ${currentPlayer}`;

    checkWin(lowestUnoccupiedCell); // Check for a win after each click
  }
}

// Function to check for a win
function checkWin(lastPlacedCell) {
  const row = lastPlacedCell.parentNode;
  const rowIndex = Array.from(row.children).indexOf(lastPlacedCell);
  const columnIndex = Array.from(cells).indexOf(lastPlacedCell) % columns.length;
  const currentColor = lastPlacedCell.classList[1]; // Assuming the color class is the second class

  // Check for horizontal win
  const rowCells = Array.from(row.children);
  let consecutiveCount = 0;
  for (let i = 0; i < rowCells.length; i++) {
    const cell = rowCells[i];
    if (cell.classList.contains(currentColor)) {
      consecutiveCount++;
      if (consecutiveCount === 4) {
        displayWinMessage(currentColor);
        return;
      }
    } else {
      consecutiveCount = 0;
    }
  }

  // Check for vertical win
  const columnCells = Array.from(cells).filter((_, index) => index % columns.length === columnIndex);
  consecutiveCount = 0;
  for (let i = 0; i < columnCells.length; i++) {
    const cell = columnCells[i];
    if (cell.classList.contains(currentColor)) {
      consecutiveCount++;
      if (consecutiveCount === 4) {
        displayWinMessage(currentColor);
        return;
      }
    } else {
      consecutiveCount = 0;
    }
  }
}

// Function to display the win message and end the game
function displayWinMessage(winningColor) {
  const winMessage = document.getElementById('win-message');
  winMessage.textContent = `${winningColor} wins!`;
  gameEnded = true;
}

// Attach click event listener to cells
cells.forEach((cell) => {
  cell.addEventListener('click', handleClick);
});
