const cells = document.querySelectorAll('.cell')
const columns = Array.from(Array(7).keys()) // Adjust the number of columns if needed
let currentPlayer = 'blue'
let gameEnded = false

// Hover effect for columns
function handleColumnHover(event) {
  if (gameEnded) return;

  const hoveredCell = event.target.closest('.cell');
  if (!hoveredCell) return;

  const columnIndex = Array.from(hoveredCell.parentNode.children).indexOf(hoveredCell) % columns.length;

  const columnCells = Array.from(cells).filter(cell => parseInt(cell.getAttribute('data-x')) === columnIndex);

  // Remove the 'hover-red' and 'hover-blue' IDs from all cells in the grid
  cells.forEach(cell => {
    cell.removeAttribute('id');
  });

  // Add the 'hover-red' or 'hover-blue' ID to the bottom-most unoccupied cell in the column
  const bottomUnoccupiedCell = columnCells.reverse().find(cell => !cell.classList.contains('red') && !cell.classList.contains('blue'));
  if (bottomUnoccupiedCell) {
    bottomUnoccupiedCell.setAttribute('id', `hover-${currentPlayer}`);
  }
}


// Function to handle cell click
function handleCellClick(event) {
  if (gameEnded) return

  const clickedCell = event.target.closest('.cell')
  if (!clickedCell) return

  const columnIndex = Array.from(clickedCell.parentNode.children).indexOf(clickedCell) % columns.length

  const columnCells = Array.from(cells).filter((_, index) => index % columns.length === columnIndex)

  // Remove the hover IDs from the previously clicked cell
  const previouslyClickedCell = document.querySelector('#hover-red, #hover-blue')
  if (previouslyClickedCell) {
    previouslyClickedCell.removeAttribute('id')
  }

  // Find the lowest unoccupied cell in the column
  let lowestUnoccupiedCell = null
  for (let i = columnCells.length - 1; i >= 0; i--) {
    const cell = columnCells[i]
    if (!cell.classList.contains('red') && !cell.classList.contains('blue')) {
      lowestUnoccupiedCell = cell
      break
    }
  }

  if (lowestUnoccupiedCell) {
    // Update the class of the lowest unoccupied cell
    lowestUnoccupiedCell.classList.add(currentPlayer)

    // Swap the current player and assign the next color class
    currentPlayer = currentPlayer === 'red' ? 'blue' : 'red'

    // Update the UI to reflect the currentPlayer
    const playerIndicator = document.getElementById('player-indicator')
    playerIndicator.textContent = `Current Player: ${currentPlayer}`

    // Remove the hover IDs from the previously hovered cell
    const previouslyHoveredCell = document.querySelector('#hover-red, #hover-blue')
    if (previouslyHoveredCell) {
      previouslyHoveredCell.removeAttribute('id')
    }

    // Add the hover ID to the bottom-most unoccupied cell in the column
    const bottomUnoccupiedCell = columnCells.reverse().find(cell => !cell.classList.contains('red') && !cell.classList.contains('blue'))
    if (bottomUnoccupiedCell) {
      bottomUnoccupiedCell.setAttribute('id', `hover-${currentPlayer}`)
    }

        // Update the grid's shadow color based on the currentPlayer
        const grid = document.querySelector('.grid');
        grid.style.boxShadow = `0 0 10px ${currentPlayer === 'red' ? 'red' : 'cyan'}`; // Set the shadow color to red or cyan

    checkWin(lowestUnoccupiedCell) // Check for a win after each click
  }
}

// Attach event listeners to cells for click and hover effects
cells.forEach(cell => {
  cell.addEventListener('click', handleCellClick)
  cell.addEventListener('mouseover', handleColumnHover)
  cell.addEventListener('mouseleave', handleColumnLeave)
})

// Remove hover effect when the mouse leaves a column
function handleColumnLeave(event) {
  if (gameEnded) return

  cells.forEach(cell => {
    cell.removeAttribute('id')
  })
}

// Function to check for a win
function checkWin(lastPlacedCell) {
  const currentColor = lastPlacedCell.classList[1] // Assuming the color class is the second class
  const rowIndex = Array.from(cells).indexOf(lastPlacedCell) % columns.length
  const columnIndex = Math.floor(Array.from(cells).indexOf(lastPlacedCell) / columns.length)

  // Check for horizontal win
  let consecutiveCount = 0
  for (let i = rowIndex; i < cells.length; i += columns.length) {
    const cell = cells[i]
    if (cell.classList.contains(currentColor)) {
      consecutiveCount++
      if (consecutiveCount === 4) {
        displayWinMessage(currentColor)
        return
      }
    } else {
      consecutiveCount = 0
    }
  }

  // Check for vertical win
  consecutiveCount = 0
  for (let i = columnIndex * columns.length; i < (columnIndex + 1) * columns.length; i++) {
    const cell = cells[i]
    if (cell.classList.contains(currentColor)) {
      consecutiveCount++
      if (consecutiveCount === 4) {
        displayWinMessage(currentColor)
        return
      }
    } else {
      consecutiveCount = 0
    }
  }
    // Check for diagonal wins
    const diagonalLines = []

    // Diagonal lines from top-left to bottom-right
    for (let x = 0; x <= 3; x++) {
      for (let y = 0; y <= 3; y++) {
        const line = []
        for (let i = 0; i < 4; i++) {
          const cellX = x + i
          const cellY = y + i
          const cell = document.querySelector(`.cell[data-x="${cellX}"][data-y="${cellY}"]`)
          line.push(cell)
        }
        diagonalLines.push(line)
      }
    }
  
    // Diagonal lines from top-right to bottom-left
    for (let x = 3; x <= 6; x++) {
      for (let y = 0; y <= 3; y++) {
        const line = []
        for (let i = 0; i < 4; i++) {
          const cellX = x - i
          const cellY = y + i
          const cell = document.querySelector(`.cell[data-x="${cellX}"][data-y="${cellY}"]`)
          line.push(cell)
        }
        diagonalLines.push(line)
      }
    }
  
    // Iterate over the diagonal lines and check for a win
    for (const line of diagonalLines) {
      const matchedCells = line.filter((cell) => cell.classList.contains(currentColor))
      if (matchedCells.length === 4) {
        displayWinMessage(currentColor)
        return
      }
    }
}


// Function to display the win message and end the game
function displayWinMessage(winningColor) {
  const winMessage = document.getElementById('win-message')
  winMessage.textContent = `${winningColor} wins!`
  gameEnded = true
}

document.addEventListener('DOMContentLoaded', function() {
  const startScreen = document.querySelector('.start-screen')
  const startButton = document.querySelector('.start-screen button')

  startButton.addEventListener('click', function() {
    startScreen.classList.add('hidden')
  })
})
