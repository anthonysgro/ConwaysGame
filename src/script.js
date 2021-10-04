// Your code here
const table = document.querySelector('table');
const addRowBtn = document.getElementById('add-row');
const deleteRowBtn = document.getElementById('delete-row');
const addColumnBtn = document.getElementById('add-column');
const deleteColumnBtn = document.getElementById('delete-column');
const colorPicker = document.querySelector('input');
const fillGridBtn = document.getElementById('fill-grid');
const fillEmptyBtn = document.getElementById('fill-empty-squares');
const clearGridBtn = document.getElementById('clear-grid');
const stampSelector = document.getElementById('stamp');
const penSizeElement = document.getElementById('penSize');
const conwaysGameBtn = document.getElementById('conways-game');
const conwaysGameSpeed = document.getElementById('speed');

let mouseDown = false;

let conwaysGame = false;
var conwaysRun;

//initialized board
function initBoard() {
  for (let i = 0; i < 40; i++) {
    makeRow();
  }
}

//makes row
function makeRow() {
  let newRow = document.createElement('tr');
  let numColumns = 60;

  if (table.firstChild) {
    let firstRow = table.firstChild;
    numColumns = [...firstRow.children].length;
  }

  for (let i = 0; i < numColumns; i++) {
    let tableCell = document.createElement('td');
    newRow.appendChild(tableCell);
  }
  table.appendChild(newRow);
}

//deletes row
function deleteRow() {
  let rows = [...table.children]
  if (rows.length) {
    table.removeChild(rows[rows.length - 1]);
  }
}

//makes column
function makeColumn() {
  [...table.children].forEach(row => {
    const td = document.createElement('td');
    row.appendChild(td);
  })
}

//deletes column
function deleteColumn() {
  let rows = [...table.children]
  rows.forEach((row) => {
    const children = [...row.children];
    row.removeChild(children[children.length - 1])
  })
}

//changes cell color
function changeColorDrag(cell, size) {
  let board = [];
  [...table.children].forEach(row => {
    board.push([...row.children])
  })

  let x1 = 0;
  let y1 = 0;

  for (let rowCoord = 0; rowCoord < board.length; rowCoord++) {
    for (let colCoord = 0; colCoord < board[rowCoord].length; colCoord++) {
      if (board[rowCoord][colCoord] === cell) {
        x1 = rowCoord;
        y1 = colCoord;
      }
    }
  }

  for (let rowCoord = 0; rowCoord < board.length; rowCoord++) {
    for (let colCoord = 0; colCoord < board[rowCoord].length; colCoord++) {
      if (distance(x1, y1, rowCoord, colCoord) < size) {
        board[rowCoord][colCoord].style.backgroundColor = colorPicker.value
        board[rowCoord][colCoord].className = colorPicker.value;
      }
    }
  }

  // cell.style.backgroundColor = colorPicker.value;
  // cell.className = colorPicker.value;
}

//distance function
function distance(x1, y1, x2, y2) {
  let dist = Math.sqrt((x2-x1)**2 + (y2 - y1)**2);
  return dist;
}

//fills everything
function fillAll() {
  const rows = [...table.children];

  rows.forEach((row) => {
    [...row.children].forEach((cell) => {
      cell.style.backgroundColor = colorPicker.value;
      cell.className = colorPicker.value;
    });
  });
}

//clears grid to default css color
function clearAll() {
  const rows = [...table.children];

  rows.forEach((row) => {
    [...row.children].forEach((cell) => {
      cell.className = '';
      cell.removeAttribute('style');
    });
  });
}

//manages stamp input selection
function stampValue() {
  if (stampSelector.value === 'off') {
    return penSizeValue();
  } else if (stampSelector.value === 'normal') {
    return 1;
  } else if (stampSelector.value === 'square') {
    return (Math.sqrt(2) + .1);
  } else if (stampSelector.value === 'bigboiSquare')
    return (2*(Math.sqrt(2)) + .1);
}

//manages pen size slider input selection
function penSizeValue() {
  return penSizeElement.value;
}

//runs conways game
function runConwaysGame() {
  const rows = [...table.children];
  let coloredCells = [];

  //iterates through the rows and columns to get all colored cells
  rows.forEach((row) => {
    [...row.children].forEach((cell) => {
      if (cell.className != '') {
        coloredCells.push(cell);
      }
    });
  });

  //changes all colored cells to current color selected (for funsies)
  // coloredCells.forEach(cell => {
  //   changeColorDrag(cell, 1);
  // })

  //multidim array to go through every cell
  let board = [];
  [...table.children].forEach(row => {
    board.push([...row.children])
  })

  for (let rowCoord = 0; rowCoord < board.length; rowCoord++) {
    for (let colCoord = 0; colCoord < board[rowCoord].length; colCoord++) {
      let adjCellColored = numColoredAdjacent(board, coloredCells, board[rowCoord][colCoord]);

      //if dead cell with exactly 3 adjacent, come to life, reproduction
      if (!coloredCells.includes(board[rowCoord][colCoord]) && adjCellColored === 3) {
        changeColorDrag(board[rowCoord][colCoord], 1);
      }
      
      //if colored cell with less than 2 adjacent colored cells, it dies
      else if (coloredCells.includes(board[rowCoord][colCoord]) && adjCellColored < 2) {
        board[rowCoord][colCoord].className = '';
        board[rowCoord][colCoord].removeAttribute('style');
      }

      //if colored cell with more than 3 adjacent colors cells, dies from overpopulation
      else if (coloredCells.includes(board[rowCoord][colCoord]) && adjCellColored > 3) {
        board[rowCoord][colCoord].className = '';
        board[rowCoord][colCoord].removeAttribute('style');
      }
    }
  }
}

function numColoredAdjacent(board, coloredCells, cell) {
  let adjacentColored = 0;

  let x1 = 0;
  let y1 = 0;

  for (let rowCoord = 0; rowCoord < board.length; rowCoord++) {
    for (let colCoord = 0; colCoord < board[rowCoord].length; colCoord++) {
      if (board[rowCoord][colCoord] === cell) {
        x1 = rowCoord;
        y1 = colCoord;
      }
    }
  }

  for (let rowCoord = 0; rowCoord < board.length; rowCoord++) {
    for (let colCoord = 0; colCoord < board[rowCoord].length; colCoord++) {
      if (distance(x1, y1, rowCoord, colCoord) < (Math.sqrt(2) + .01) && coloredCells.includes(board[rowCoord][colCoord]) && board[rowCoord][colCoord] !== cell) {
        adjacentColored++;
      }
    }
  }

  return adjacentColored;
}

conwaysGameBtn.addEventListener('click', () => {
  conwaysGame = !conwaysGame;

  if (conwaysGame) {
    runConwaysGame();
    conwaysGameBtn.style.backgroundColor = 'red';
    conwaysRun = window.setInterval(runConwaysGame, conwaysGameSpeed.value);
  } else {
    conwaysGameBtn.style.backgroundColor = '';
    window.clearInterval(conwaysRun);
  }
})

conwaysGameSpeed.addEventListener('change', ()=> {
  window.clearInterval(conwaysRun);
  if (conwaysGame) {
    runConwaysGame();
    conwaysRun = window.setInterval(runConwaysGame, conwaysGameSpeed.value);
  }
})

//color picker event
colorPicker.addEventListener('change', (ev) => {
});

//mouse release event
table.addEventListener('mouseup', (ev) => {
  if (ev.target.tagName === 'TD') {
    mouseDown = false;
  }
});

//mouse down event
table.addEventListener('mousedown', (ev) => {
  if (ev.target.tagName === 'TD') {
    changeColorDrag(ev.target, stampValue());
    mouseDown = true;
  }
});

//draggable colors event
table.addEventListener('mouseover', (ev) => {
  if (ev.target.tagName === 'TD' && mouseDown) {
    changeColorDrag(ev.target, stampValue());
  }
});

//fills all empty cells w selected color
fillEmptyBtn.addEventListener('click', () => {
  const rows = [...table.children];

  rows.forEach((row) => {
    [...row.children].forEach((cell) => {
      if (!cell.className) {
        cell.className = colorPicker.value;
        cell.style.backgroundColor = colorPicker.value;
      }
    });
  });
})

//clears entire grid
clearGridBtn.addEventListener('click', clearAll);

//fills entire grid with color
fillGridBtn.addEventListener('click', fillAll);

//adds a row
addRowBtn.addEventListener('click', makeRow);

deleteRowBtn.addEventListener('click', deleteRow);

addColumnBtn.addEventListener('click', makeColumn);

deleteColumnBtn.addEventListener('click', deleteColumn);

initBoard();