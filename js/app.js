document.addEventListener('DOMContentLoaded', function() {
  const cells = document.querySelectorAll('.cell');
  const columns = Array.from(Array(7).keys()); // Adjust the number of columns if needed
  let currentPlayer = 'red';

  // Function to handle cell click event
  function handleClick(event) {
    const clickedCell = event.target.closest('.cell');
    if (!clickedCell) return;

    const columnIndex = Array.from(clickedCell.parentNode.children).indexOf(clickedCell) % columns.length;

    const columnCells = Array.from(cells).filter((_, index) => index % columns.length === columnIndex);

    for (let i = columnCells.length - 1; i >= 0; i--) {
      const cell = columnCells[i];
      if (!cell.classList.contains('red') && !cell.classList.contains('blue')) {
        cell.classList.add(currentPlayer);
        break;
      }
    }

    currentPlayer = (currentPlayer === 'red') ? 'blue' : 'red';
  }

  // Attach click event listener to cells
  cells.forEach((cell) => {
    cell.addEventListener('click', handleClick);
  });
});
