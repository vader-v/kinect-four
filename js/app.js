const cells = document.querySelectorAll('.cell');
let currentPlayer = 'red';

// Function to handle cell click event
function handleClick(event) {
  const cell = event.target.closest('.cell');
  if (!cell) return;
  
  console.log('Cell clicked:', cell);
  cell.classList.add(currentPlayer);
  currentPlayer = (currentPlayer === 'red') ? 'blue' : 'red';
}

// Attach click event listener to cells
cells.forEach((cell) => {
  cell.addEventListener('click', handleClick);
});
