const grid = document.getElementById('game-grid');

// initialize game
document.addEventListener('DOMContentLoaded', function () {
    const gridHeight = 20;
    const gridWidth = 30;
    const corners = calculateCornerCoordinates(gridHeight, gridWidth);
    const startMouse = corners[0];
    const startCat = corners[3];
    const startCheese = corners[2];
    const startObstacle = [15, 10];

    generateLevel(gridHeight, gridWidth);
    drawAsset(startMouse, "mouse");
    drawAsset(startCat, "cat");
    drawAsset(startCheese, "cheese");
    drawAsset(startObstacle, "obstacle");
});

// Level Generator: creates a game grid based on a given height and width value
// * create rows accord. to height
// * in each row, create multiple cells accord. to width
function generateLevel(gridHeight, gridWidth) {
    for (let i = 0; i < gridHeight; i++) {
        var row = document.createElement('div');
        row.setAttribute('class', 'grid-row');
        for (let j = 0; j < gridWidth; j++) {
            var cell = document.createElement('div');
            cell.setAttribute('class', 'grid-cell outline empty');
            // give the cell attributes representing a coordinate system
            cell.dataset.x = j;
            cell.dataset.y = i;
            // append the cell to the row
            row.appendChild(cell);
        }
        // append the row to the grid
        grid.appendChild(row);
    }
}

// **********Asset Generation**********
function drawAsset(startPosition, assetType) {
    fillCell(startPosition[0], startPosition[1], assetType);
}

// **********Movement**********

// User controlled events
document.addEventListener('keydown', (event) => {
    var coordMouse = findCoordinates(1);
    var button = event.key;
    if (button === "ArrowDown") {
        moveCharacter(coordMouse, "down", "mouse");
    } else if (button === "ArrowUp") {
        moveCharacter(coordMouse, "up", "mouse");
    } else if (button === "ArrowLeft") {
        moveCharacter(coordMouse, "left", "mouse");
    } else if (button === "ArrowRight") {
        moveCharacter(coordMouse, "right", "mouse");
    }
}, false);

// Movement function
function moveCharacter(coordinates, moveDirection, characterType) {
    // first empty the current cell
    emptyCell(coordinates[0], coordinates[1], characterType);
    // then determine which coordinate needs to be incremented or decremented
    switch (moveDirection) {
        case "up":
            coordinates[1]--;
            break;
        case "down":
            coordinates[1]++;
            break;
        case "left":
            coordinates[0]--;
            break;
        case "right":
            coordinates[0]++;
            break;
    }
    // then fill cell at adjusted coord
    fillCell(coordinates[0], coordinates[1], characterType);
}

// **********Coordinate System Information**********

// Grid array generator: scans the game grid and creates an array which details what asset in each square
// gives the game state
// Identifiers for each character:
// empty = 0, mouse = 1, cat=2, obstacle=3, cheese=4
function createGridArray() {
    var gridArray = [];
    var rows = document.getElementsByClassName('grid-row');
    for (row of rows) {
        var gridRow = [];
        Array.from(row.children).forEach(function (cell) {
            if (cell.className.includes('empty')) {
                gridRow.push(0);
            } else if (cell.className.includes('mouse')) {
                gridRow.push(1);
            } else if (cell.className.includes('cat')) {
                gridRow.push(2);
            } else if (cell.className.includes('obstacle')) {
                gridRow.push(3);
            } else if (cell.className.includes('cheese')) {
                gridRow.push(4);
            }
        });
        gridArray.push(gridRow);
    }
    return gridArray;
}

// calculates the corner coordinates of the grid so that the level can be generated dynamically more easily
function calculateCornerCoordinates(gridHeight, gridWidth) {
    var corners = [];
    // top left
    corners.push([0, 0]);
    // top right
    corners.push([gridWidth - 1, 0]);
    // bottom right
    corners.push([gridWidth - 1, gridHeight - 1,]);
    // bottom left
    corners.push([0, gridHeight - 1]);
    return corners;
}

// calculates the coordinates of a requested asset
function findCoordinates(assetId) {

    var requestedCoordinates = [];
    var gameState = createGridArray();

    for (let i = 0; i < gameState.length; i++) {
        requestedCoordinates[0] = gameState[i].indexOf(assetId);
        if (requestedCoordinates[0] != -1) {
            requestedCoordinates[1] = i;
            break;
        }
    }

    return requestedCoordinates;
}


// **********DOM Manipulation**********
function fillCell(xCoord, yCoord, fillClass) {
    let targetCell = document.querySelector(`[data-x='${xCoord}'][data-y='${yCoord}']`)
    if (targetCell.className.includes('empty')) {
        targetCell.classList.remove('empty');
    }
    targetCell.classList.add(fillClass);
}
function emptyCell(xCoord, yCoord, emptyClass) {
    let targetCell = document.querySelector(`[data-x='${xCoord}'][data-y='${yCoord}']`)
    if (targetCell.className.includes(emptyClass)) {
        targetCell.classList.remove(emptyClass);
    }
    targetCell.classList.add('empty');
}
