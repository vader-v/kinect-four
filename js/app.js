const cells = document.querySelectorAll('.cell')
const columns = Array.from(Array(7).keys()) // Adjust the number of columns if needed
let currentPlayer = 'player1'
let gameEnded = false
let currentColors = {
  color1: 'blue', // Default color for Player 1
  color2: 'red' // Default color for Player 2
}

// Hover effect for columns
function handleColumnHover(event) {
  if (window.innerWidth <= 900 || gameEnded) return

  const hoveredCell = event.target.closest('.cell')
  if (!hoveredCell) return

  const columnIndex = Array.from(hoveredCell.parentNode.children).indexOf(hoveredCell) % columns.length

  const columnCells = Array.from(cells).filter(cell => parseInt(cell.getAttribute('data-x')) === columnIndex)

  // Reset the styles of all cells
  cells.forEach(cell => {
    cell.removeAttribute('id')
    cell.style.opacity = '1'
    cell.style.backgroundColor = ''
  })

  // Add the hover ID to the bottom-most unoccupied cell in the column
  const bottomUnoccupiedCell = columnCells.reverse().find(cell => !cell.classList.contains('player1') && !cell.classList.contains('player2'))
  if (bottomUnoccupiedCell) {
    const hoverColor = currentPlayer === 'player1' ? currentColors.color1 : currentColors.color2
    bottomUnoccupiedCell.id = `hover-${currentPlayer}`
    bottomUnoccupiedCell.style.backgroundColor = hoverColor
    bottomUnoccupiedCell.style.opacity = '0.7' // Set the opacity of the hovered cell to 0.7
  }
}

function handleCellClick(event) {
  if (gameEnded) return

  const clickedCell = event.target.closest('.cell')
  if (!clickedCell) return

  const columnIndex = Array.from(clickedCell.parentNode.children).indexOf(clickedCell) % columns.length

  const columnCells = Array.from(cells).filter((_, index) => index % columns.length === columnIndex)

  // Remove the hover IDs from the previously clicked cell
  const previouslyClickedCell = document.querySelector('#hover-player1, #hover-player2')
  if (previouslyClickedCell) {
    previouslyClickedCell.removeAttribute('id')
  }

  // Find the lowest unoccupied cell in the column
  let lowestUnoccupiedCell = null
  for (let i = columnCells.length - 1; i >= 0; i--) {
    const cell = columnCells[i]
    if (!cell.classList.contains('player1') && !cell.classList.contains('player2')) {
      lowestUnoccupiedCell = cell
      break
    }
  }

  if (lowestUnoccupiedCell) {
    // Remove the hover class and styles from the clicked cell
    clickedCell.classList.remove(`hover-${currentPlayer}`)
    clickedCell.style.backgroundColor = ''
    clickedCell.style.opacity = '1'

    // Update the background color of the lowest unoccupied cell
    lowestUnoccupiedCell.classList.add(currentPlayer)
    lowestUnoccupiedCell.style.backgroundColor = currentPlayer === 'player1' ? currentColors.color1 : currentColors.color2

    checkWin(lowestUnoccupiedCell) // Check for a win after each click
    if(gameEnded) return
    // Swap the current player and assign the next color class
    currentPlayer = currentPlayer === 'player1' ? 'player2' : 'player1'

    // Update the UI to reflect the currentPlayer
    const playerIndicator = document.getElementById('player-indicator')
    playerIndicator.textContent = `Current Player: ${currentPlayer}`

    // Remove the hover IDs from the previously hovered cell
    const previouslyHoveredCell = document.querySelector('#hover-player1, #hover-player2')
    if (previouslyHoveredCell) {
      previouslyHoveredCell.removeAttribute('id')
    }

    // Add the hover ID to the bottom-most unoccupied cell in the column
    const bottomUnoccupiedCell = columnCells.reverse().find(
      cell => !cell.classList.contains('player1') && !cell.classList.contains('player2')
    )
    if (bottomUnoccupiedCell) {
      bottomUnoccupiedCell.style.backgroundColor = currentPlayer === 'player1' ? currentColors.color1 : currentColors.color2
      bottomUnoccupiedCell.setAttribute('id', `hover-${currentPlayer}`)
    }

    // Update the grid's shadow color based on the currentPlayer
    const grid = document.querySelector('.grid')
    grid.style.boxShadow = `0 0 10px ${currentPlayer === 'player1' ? currentColors.color1 : currentColors.color2}`

    checkWin(lowestUnoccupiedCell) // Check for a win after each click
  }
}

// Attach event listeners to cells for click and hover effects
cells.forEach(cell => {
  cell.addEventListener('click', handleCellClick)
  cell.addEventListener('mouseover', handleColumnHover)
  cell.addEventListener('mouseleave', handleColumnLeave)
})

function handleColumnLeave(event) {
  if (gameEnded) return

  const columnCells = Array.from(event.currentTarget.parentNode.children)

  columnCells.forEach(cell => {
    cell.style.backgroundColor = '' // Remove the background color
    cell.style.opacity = '1' // Reset the opacity
    cell.removeAttribute('id')
  })
}

function checkWin(lastPlacedCell) {
  const currentColor = lastPlacedCell.classList[1] // Assuming the color class is the second class
  const rowIndex = Array.from(cells).indexOf(lastPlacedCell) % columns.length
  const columnIndex = Math.floor(Array.from(cells).indexOf(lastPlacedCell) / columns.length)

  // Check for horizontal win
  let consecutiveCount = 0
  for (let x = 0; x < columns.length; x++) {
    const cell = document.querySelector(`.cell[data-x="${x}"][data-y="${columnIndex}"]`)
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
  for (let y = 0; y < columns.length; y++) {
    const cell = document.querySelector(`.cell[data-x="${rowIndex}"][data-y="${y}"]`)
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
  for (let x = 0; x <= columns.length - 4; x++) {
    for (let y = 0; y <= columns.length - 4; y++) {
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
  for (let x = 3; x <= columns.length - 1; x++) {
    for (let y = 0; y <= columns.length - 4; y++) {
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
    const matchedCells = line.filter(cell => cell.classList.contains(currentColor))
    if (matchedCells.length === 4) {
      displayWinMessage(currentColor)
      return
    }
  }
}


// Function to display the win message and end the game
function displayWinMessage(winningColor) {
  const winMessage = document.getElementById('win-message')
  winMessage.textContent = `Player ${currentPlayer === 'player1' ? '1' : '2'} wins!`

  const winnerMessageDiv = document.querySelector('.winner-message')
  winnerMessageDiv.classList.remove('hidden')

  gameEnded = true
}


  const startScreen = document.querySelector('.start-screen')
  const startButton = document.querySelector('.start-screen button')
  const resetButton = document.getElementById('reset-button')
  const ingameResetButton = document.getElementById('ingame-reset-button')
  const changeColorsButton = document.getElementById('change-colors-button')
  const colorSelection = document.querySelector('.color-selection')
  const colorSelectionForm = document.getElementById('color-selection-form')
  const player1ColorPicker = document.getElementById('player1-color-picker')
  const player2ColorPicker = document.getElementById('player2-color-picker')


  startButton.addEventListener('click', function() {
    startScreen.classList.add('hidden')
  })

  resetButton.addEventListener('click', function() {
    resetGame()
  })


  ingameResetButton.addEventListener('click', function() {
    resetGame()
  })

  colorSelectionForm.addEventListener('submit', function(event) {
    event.preventDefault()
  
    const player1Color = player1ColorPicker.value
    const player2Color = player2ColorPicker.value
  
    if (!validateColors(player1Color, player2Color)) {
      return
    }
  
    currentColors.color1 = player1Color
    currentColors.color2 = player2Color
  
    resetGame()
  })


  function resetGame() {
    cells.forEach(cell => {
      cell.classList.remove('clicked', 'player1', 'player2')
      cell.removeAttribute('id')
      cell.style.backgroundColor = ''
      cell.style.opacity = '1'
    })
  
    currentPlayer = 'player1'

    const root = document.documentElement;
    root.style.setProperty('--color1', currentColors.color1)
    root.style.setProperty('--color2', currentColors.color2)
  
    const playerIndicator = document.getElementById('player-indicator')
    playerIndicator.textContent = 'Current Player: Player 1'
  
    const winnerMessageDiv = document.querySelector('.winner-message')
    winnerMessageDiv.classList.add('hidden')
  
    gameEnded = false
  }

  function selectColors() {
    colorSelection.classList.remove('hidden')
  }

  const colorErrorMessage = document.getElementById('color-error-message')

  function validateColors(color1, color2) {
    const colorDifferenceThreshold = 50 // Adjust the threshold as needed

    // Convert color strings to RGB values
    const rgb1 = hexToRgb(color1)
    const rgb2 = hexToRgb(color2)

        // Check if either color is white
        if (color1 === '#ffffff' || color2 === '#ffffff') {
          colorErrorMessage.textContent = 'Please choose a color other than white.'
          return false
        }

    // Calculate the color difference
    const colorDifference = Math.abs(rgb1.r - rgb2.r) +
      Math.abs(rgb1.g - rgb2.g) +
      Math.abs(rgb1.b - rgb2.b)

    // Check if either color is white
    if (color1 === '#ffffff' || color2 === '#ffffff') {
      colorErrorMessage.textContent = 'Please choose a color other than white.'
      return false
    }

    if (colorDifference < colorDifferenceThreshold) {
      colorErrorMessage.textContent = 'Please choose colors that are visually distinct from each other.'
      return false
    }

    colorErrorMessage.textContent = '' // Clear the error message if colors are valid
    return true
  }

  function hexToRgb(hex) {
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i
    hex = hex.replace(shorthandRegex, function (m, r, g, b) {
      return r + r + g + g + b + b
    })

    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null
  }