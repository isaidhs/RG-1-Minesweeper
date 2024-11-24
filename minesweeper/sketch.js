let board;
let cols = 10;
let rows = 10;
let w = 40;
let totalBees = 10;


function setup() {
    createCanvas(400, 400);

    board = createBoard(cols, rows);
    board = placeBees(board, totalBees, cols, rows);

    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            countBees(board, board[i][j]);
        }
    }
}

function createBoard(cols, rows) {
    let arr2D = [];
    for (let i=0;i<cols;i++ ){
        let row = [];
        for(let j = 0; j<rows;j++){
            row.push(createTile(i,j,w));
        }
        arr2D.push(row);
    }
    return arr2D; //TODO implement this function
}

function createTile(i, j, w) {
    let Tile = {
        i:i,
        j:j,
        x:i*w,
        y:j*w,
        w:w,
        neighborCount:0,
        bee:false,
        revealed:false
    }
    return Tile; //TODO implement this function
}

function placeBees(board, totalBees, cols, rows) {
    // Map
    let allCoordinates = [];
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            allCoordinates.push([i,j]);
        }   
    }

    // Swap Index
    for (let i = allCoordinates.length - 1; i >= 0; i--) {
        let initialIndex = i;
        let randomTargetIndex = Math.floor(Math.random() * (initialIndex+1));
        [allCoordinates[initialIndex], allCoordinates[randomTargetIndex]] = [allCoordinates[randomTargetIndex], allCoordinates[initialIndex]];
    }   

    // Place Bees
    for (let i = 0; i < totalBees; i++) {
        let x = allCoordinates[i][0];
        let y = allCoordinates[i][1];
        board[x][y].bee= true;
    }
    return board; //TODO implement this function
}

function countBees(board, tile) {
    if (tile.bee === true) {
        tile.neighborCount = -1;
    }
    else{
        let x = tile.i;
        let y = tile.j;

        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                if (i==0 && j==0) {
                    continue;
                }

                let neighborX = x + i;
                let neighborY = y + j;
                if(neighborX >= 0 && neighborX < cols && neighborY >= 0 && neighborY < rows) {
                    if (board[neighborX][neighborY].bee == true) {
                        tile.neighborCount = tile.neighborCount + 1;
                    }
                }
            }   
        }
    }
}

function draw() {
    background(255);
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            drawTile(board[i][j]);
        }
    }
}

function drawTile(tile) {
    stroke(0);
    noFill();
    rect(tile.x, tile.y, tile.w, tile.w);

    if (tile.revealed) {
        if (tile.bee) {
            drawBeeTile(tile);
        } else {
            drawNumberTile(tile);
        }
    }
}

function drawBeeTile(tile) {
    fill(125);
    ellipse(tile.x + tile.w * 0.5, tile.y + tile.w * 0.5, tile.w * 0.5);
}

function drawNumberTile(tile) {
    fill(200);
    rect(tile.x, tile.y, tile.w, tile.w);
    if (tile.neighborCount > 0) {
        textAlign(CENTER, CENTER);
        fill(0);
        text(tile.neighborCount, tile.x + tile.w * 0.5, tile.y + tile.w - 18);
    }
}

function reveal(tile) {
    tile.revealed = true;
    if (tile.neighborCount == 0) {
        floodFill(tile);
    }
}

function floodFill(tile) {
    for (let xoff = -1; xoff <= 1; xoff++) {
        for (let yoff = -1; yoff <= 1; yoff++) {
            let i = tile.i + xoff;
            let j = tile.j + yoff;

            if (
                i >= 0 &&
                i < cols &&
                j >= 0 &&
                j < rows &&
                !board[i][j].revealed
            ) {
                reveal(board[i][j]);
            }
        }
    }
}

function mousePressed() {
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            if (isUnderMouse(board[i][j], mouseX, mouseY)) {
                reveal(board[i][j]);
                if (board[i][j].bee) {
                    gameOver(board);
                }
            }
        }
    }
}

function isUnderMouse(tile, x, y) {
    if (x >= tile.x && x <= tile.x + tile.w && y >= tile.y && y <= tile.y + tile.w) {
        return true;
    }
    return false; //TODO implement this function
}

function gameOver(board) {
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            board[i][j].revealed = true;
        }
    }
}

module.exports = {
    createBoard,
    createTile,
    placeBees,
    countBees,
    reveal,
    floodFill,
    gameOver,
    isUnderMouse,
};
