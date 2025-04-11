let pieceSelected = false; // Flag to check if a piece is selected
let chessboardArray = [];  // Declare it globally
let moveTurnWhite = true;
document.addEventListener("DOMContentLoaded", () => {
    const board = document.getElementById("chessboard");
    // Create the chessboard grid and store references in the 2D array
    for (let row = 0; row < 8; row++) {
        let rowArray = []; // Temporary array for the current row
        for (let col = 0; col < 8; col++) {
            const square = document.createElement("div");

            // add piece
            generatePieces(row, col, square);

            square.classList.add("square", (row + col) % 2 === 0 ? "light" : "dark");
            square.dataset.row = row;   // Store row in the div
            square.dataset.col = col;   // Store column in the div
            board.appendChild(square);
            rowArray.push(square);  // Add the square to the current row array

            square.addEventListener('click', function() {
                const clickedRow = parseInt(this.dataset.row);
                const clickedCol = parseInt(this.dataset.col);
                //const chessNotation = String.fromCharCode(97 + clickedCol) + (clickedRow + 1);
                selectedPiece(clickedRow, clickedCol, square);
            });

        }
        chessboardArray.push(rowArray);  // Add the row array to the main chessboard array
    }

});


function generatePieces(row, col, square) {
    // Define piece setup for both white and black pieces
    const pieces = {
        0: ["rook-B", "horse-B", "bishop-B", "queen-B", "king-B", "bishop-B", "horse-B", "rook-B"],  // Black pieces row (0)
        1: ["pawn-B", "pawn-B", "pawn-B", "pawn-B", "pawn-B", "pawn-B", "pawn-B", "pawn-B"],          // Black pawns row (1)
        6: ["pawn-W", "pawn-W", "pawn-W", "pawn-W", "pawn-W", "pawn-W", "pawn-W", "pawn-W"],          // White pawns row (6)
        7: ["rook-W", "horse-W", "bishop-W", "queen-W", "king-W", "bishop-W", "horse-W", "rook-W"],  // White pieces row (7)
    };

    // Check if the row has a piece setup

    if (pieces[row]) {
        //   testing
            //console.log("piece: " + pieces[row]);
            //console.log("row: " + row);
            //console.log(`[${row}][${col}]: ` + pieces[row][col]);
        //   \testing
        const piece = pieces[row][col];
        if (piece) {
            const img = document.createElement("img");
            img.src = `img/${piece}.svg`;  // Image path based on piece name
            img.alt = piece.split("-")[1];  // Alt text as the piece color (W/B)
            square.appendChild(img);  // Append the image to the square
        }
    }

    //TODO FOR TESTING ONLY.
     removeAllPawns();
}
//Helper Function Selected Piece, when you select a piece it will start the process of finding its moves

function selectedPiece(currentRow, currentCol) {
    if(pieceSelected) return;
    const curTile = chessboardArray[currentRow][currentCol].querySelector("img"); //current tile
    let pieceName;
    let isWhite;

    if(curTile) {
        let url = curTile.src;
        const fileName = url.substring(url.lastIndexOf('/') + 1); // e.g., "king-W.svg"
        // This regex captures the piece name and a single letter for color (W or B)
        const match = fileName.match(/^(.*)-([WB])\.svg$/);
        isWhite =  url.endsWith("B.svg");

        if(isWhite === !moveTurnWhite) {
            if (match) pieceName = match[1];
            else console.error("Filename does not match expected pattern:", fileName);
            window[`${pieceName}Move`](currentRow, currentCol, isWhite, curTile);
            console.log(`%c${pieceName} selected`, 'color: lightblue;');
        }
        else showMessage(`It's ${moveTurnWhite ? "white" : "black"}'s turn`);

    }//checks if not empty
}

function isEnemy(targetSquare, isWhite){
    let targetPiece = targetSquare.querySelector("img");
    if(targetPiece) { //checks if it is empty
        if(targetPiece.src.endsWith("W.svg") === isWhite){
            return true;
        }
    }
    return false;
}

function pawnMove(currentRow, currentCol, isWhite, piece) {
    pieceSelected = true;
    let direction = isWhite ? 1 : -1;
    let moveIndicator= createMoveIndicator();
    let rightAttack;
    let leftAttack;
    let forwardMove;
    let leftAttackMade = false;
    let rightAttackMade = false;
    let moveCounter = 0;


    if(currentRow + direction >= 0 && currentRow + direction < 8) {
        forwardMove = chessboardArray[currentRow + direction][currentCol];
        if (!forwardMove.querySelector("img") && currentRow + direction <= 8 && currentRow + direction >= 0 ) {
            forwardMove.appendChild(moveIndicator);  // Append the image to the square
            let forwardMoveFuncHandler = () => forwardMoveFunc();
            moveIndicator.addEventListener('click', forwardMoveFuncHandler);
            moveCounter++;
        }
    }

//if there's no piece in front & its not off the board
    if(currentRow + direction >= 0 && currentRow + direction < 8) { // if the forward move is on the board
        if (currentCol + 1 < 8) {
            rightAttack = chessboardArray[currentRow + direction][currentCol + 1];
            if (rightAttack.querySelector("img") && isEnemy(rightAttack, isWhite)) {
                rightAttack.classList.add("highlight-attack");
                rightAttack.addEventListener('click', rightAttackFunc);
                moveCounter++;
                rightAttackMade = true;
            } //if space is not empty and it's an enemy piece
        }
        if (currentCol - 1 >= 0) {
            leftAttack = chessboardArray[currentRow + direction][currentCol - 1];
            if (leftAttack.querySelector("img") && isEnemy(leftAttack, isWhite)) {
                leftAttack.classList.add("highlight-attack");
                leftAttack.addEventListener('click', leftAttackFunc);
                moveCounter++;
                leftAttackMade = true;
            } //if space is not empty and it's an enemy piece
        }
    }
    if(moveCounter === 0){
        pieceSelected = false;
        console.log("%cThis piece has no where to go..", 'color: red;');
    }

    function pawnMoved(){
        console.log(`%cPawn moved to [${currentRow + direction}, ${currentCol + 1}]`, 'color: lightgreen;');
        RemoveHighlight();
        removeEventListeners()
        pieceSelected = false; //lets you select a piece again
        console.log('  ');
    }
    function forwardMoveFunc (){
        forwardMove.removeChild(moveIndicator); // this removes the indicator on the square
        setTimeout(() => {
            forwardMove.appendChild(piece);
            // console.log("Pawn moved after delay...");
        }, 5);// adds timer so that you don't click the pawn at the same time
         pawnMoved();
    }
    function rightAttackFunc (){
        this.removeChild(rightAttack.querySelector("img"));
        this.appendChild(piece); // Move the pawn to the target square
        console.log("Pawn takes: ?");
        pawnMoved();
    }
    function leftAttackFunc (){
            this.removeChild(leftAttack.querySelector("img"));
            this.appendChild(piece); // Move the pawn to the target square
            console.log("Pawn takes: ?");
            pawnMoved();
    }
    function removeEventListeners() {
        // Remove listeners for forward move
        forwardMove.removeEventListener('click', forwardMoveFunc);

        // Remove listeners for right attack
        if(rightAttackMade) {
            rightAttack.removeEventListener('click', rightAttackFunc);
        }

        // Remove listeners for left attack
        if(leftAttackMade) {
            leftAttack.removeEventListener('click', leftAttackFunc);
        }
    }
}
function rookMove(currentRow, currentCol, isWhite, piece) {
    pieceSelected = true;
    const directionArray = [
        { dr: -1, dc: 0 }, // Up
        { dr: 1, dc: 0 },  // Down
        { dr: 0, dc: -1 }, // Left
        { dr: 0, dc: 1 }   // Right
    ];

    extendedDirectionMove(currentRow, currentCol, isWhite, piece, directionArray);
}
function bishopMove(currentRow, currentCol, isWhite, piece){
    pieceSelected = true;

    const directionArray = [
        {dr: -1, dc: -1}, //Up-Left
        {dr: -1, dc: 1},  //Up-Right
        {dr: 1, dc: -1},  //Down-Left
        {dr: 1, dc: 1}    //Down-Right
    ];
    extendedDirectionMove(currentRow, currentCol, isWhite, piece, directionArray);
}
function queenMove(currentRow, currentCol, isWhite, piece){
    pieceSelected = true;
    const directionArray = [
        {dr: -1, dc: -1}, //Up-Left
        {dr: -1, dc: 0},  //Up
        {dr: -1, dc: 1},  //Up-Right
        {dr: 0, dc: -1},  //Left
        {dr: 0, dc: 1},   //Right
        {dr: 1, dc: -1},  //Down-Left
        {dr: 1, dc: 0},   //Down
        {dr: 1, dc: 1}    //Down-Right
    ];
    extendedDirectionMove(currentRow, currentCol, isWhite, piece, directionArray);
}
function kingMove(currentRow, currentCol, isWhite, piece){
    pieceSelected = true;
    const directionArray = [
        {dr: -1, dc: -1}, //Up-Left
        {dr: -1, dc: 0},  //Up
        {dr: -1, dc: 1},  //Up-Right
        {dr: 0, dc: -1},  //Left
        {dr: 0, dc: 1},   //Right
        {dr: 1, dc: -1},  //Down-Left
        {dr: 1, dc: 0},   //Down
        {dr: 1, dc: 1}    //Down-Right
    ];
    singleDirectionMove(currentRow, currentCol, isWhite, piece, directionArray);
}
function horseMove(currentRow, currentCol, isWhite, piece){
    pieceSelected = true;
    const directionArray = [
        {dr: -2, dc: -1}, // Up-Left
        {dr: -2, dc: 1},  // Up-Right
        {dr: -1, dc: -2}, // Left-Up
        {dr: -1, dc: 2},  // Right-Up
        {dr: 1, dc: -2},  // Left-Down
        {dr: 1, dc: 2},   // Right-Down
        {dr: 2, dc: -1},  // Down-Left
        {dr: 2, dc: 1}    // Down-Right
    ]
    singleDirectionMove(currentRow, currentCol, isWhite, piece, directionArray);
}
// window.pawnMove = pawnMove;
// window.rookMove = rookMove;
// window.bishopMove = bishopMove;
// window.horseMove = horseMove;
// window.queenMove = queenMove;
// window.kingMove = kingMove;


// MOVEMENT HELPERS
let handlerArray = [];
function extendedDirectionMove(currentRow, currentCol, isWhite, piece, directionArray){
    let moveChoicesCount = 0;
    directionArray.forEach(({dr, dc}) => {
        for (let step = 1; step < 8; step++) {
            const newRow = currentRow + dr * step;
            const newCol = currentCol + dc * step;
            if (newRow < 0 || newRow >= 8 || newCol < 0 || newCol >= 8) break; // Boundary check
            const targetSquare = chessboardArray[newRow][newCol];
            const piecePresent = targetSquare.querySelector("img");
            const handler = () => moveHandler(newRow, newCol, isWhite, handlerArray, piece);

            if (piecePresent) {
                if (isEnemy(targetSquare, isWhite)) {
                    targetSquare.classList.add("highlight-attack");
                    targetSquare.addEventListener('click', handler);
                    handlerArray.push({square: targetSquare, handler});
                    moveChoicesCount++;
                }
                break; // stop this direction if there is a piece
            }
            else {
                const moveIndicator = createMoveIndicator();
                targetSquare.appendChild(moveIndicator);
                targetSquare.addEventListener('click', handler);
                handlerArray.push({square: targetSquare, handler});
                moveChoicesCount++;
            }
        }
    });
    if(moveChoicesCount === 0){
        pieceSelected = false;
        console.log("%cThis piece has no where to go..", 'color: red;');
    }

}
function singleDirectionMove(currentRow, currentCol, isWhite, piece, directionArray) {
    let moveChoicesCount = 0;

    directionArray.forEach(({dr, dc}) => {
        const newRow = currentRow + dr;
        const newCol = currentCol + dc;

        if (newRow < 0 || newRow >= 8 || newCol < 0 || newCol >= 8) return; // Boundary check
        const targetSquare = chessboardArray[newRow][newCol];
        const piecePresent = targetSquare.querySelector("img");
        const handler = () => moveHandler(newRow, newCol, isWhite, handlerArray, piece);
        if (piecePresent) {
            if (isEnemy(targetSquare, isWhite)) {
                targetSquare.classList.add("highlight-attack");
                targetSquare.addEventListener('click', handler);
                handlerArray.push({square: targetSquare, handler});
                moveChoicesCount++;
            }
        }
        else {
            const moveIndicator = createMoveIndicator();
            targetSquare.appendChild(moveIndicator);
            targetSquare.addEventListener('click', handler);
            handlerArray.push({square: targetSquare, handler});
            moveChoicesCount++;
        }
    });
    if(moveChoicesCount === 0){
        pieceSelected = false;
        console.log("%cThis piece has no where to go..", 'color: red;');
    }
}

moveHandler = (targetRow, targetCol, isWhite, handlerArray, piece) => {
    const targetSquare = chessboardArray[targetRow][targetCol];
    let attackedPieceName = ifEnemyTakePiece(targetSquare, isWhite);
    let isAttack = attackedPieceName != null;

    RemoveHighlight(); // Remove all move indicators and attack highlights
    removeEventAllListeners(handlerArray);
    movePieceToSquare(targetSquare, piece);
    pieceMoved(piece, targetRow, targetCol, isAttack, attackedPieceName);
    pieceSelected = false; // Reset selection flag

    moveTurnWhite = !moveTurnWhite; //switch turns
};


//HELPER FUNCTIONS
function showMessage(message) {
    const msgDiv = document.createElement("div");
    msgDiv.textContent = message;
    msgDiv.className = "message-popup";
    document.body.appendChild(msgDiv);
    setTimeout(() => msgDiv.remove(), 2000);
}

function RemoveHighlight() {
    chessboardArray.forEach((row) => {
        row.forEach((square) => {
            // Remove highlight class if present
            square.classList.remove("highlight-attack"); // if I remove this the whole board doesn't load wtf
            const indicators = square.querySelectorAll("img");
            indicators.forEach((img) => {
                if (img.alt === "move") {
                    square.removeChild(img);
                }
            });
        });
    });
}
function createMoveIndicator(){
    let moveIndicator = document.createElement("img");  // Create an <img> element
    moveIndicator.src = `img/possibleMove.svg`;  // Image path based on piece name
    moveIndicator.alt = "move";
    moveIndicator.style.width = "45px";  // Set width to 50px
    moveIndicator.style.height = "45px"
    return moveIndicator;
}
function pieceMoved(piece, newRow, newCol, isAttack, attackedPieceName) {
    let [, pieceName] = piece.src.substring(piece.src.lastIndexOf('/') + 1).match(/^(.*)-[WB]\.svg$/) || [];
    if(isAttack){
        console.log(`%c${pieceName} %ctakes ->  %c${attackedPieceName}`, `color: lightgreen`, '', 'color: salmon;');
    }
    else {
        console.log(`%c${pieceName} moved to [${newRow}, ${newCol}]`, 'color: lightgreen;');
    }
    RemoveHighlight();
    pieceSelected = false; //lets you select a piece again
    console.log('  ');
}

function removeEventAllListeners(handlerArray) {
    handlerArray.forEach(({ square, handler }) => { // Remove all event listeners
        square.removeEventListener('click', handler);
    });
} // only to be called in move handling functions
function movePieceToSquare(targetSquare, piece) {
    setTimeout(() => { // Move the rook to the target square
        targetSquare.appendChild(piece);
    }, 5);
} // only to be called in move handling functions
function ifEnemyTakePiece(targetSquare, isWhite){
    if (targetSquare.querySelector("img") && isEnemy(targetSquare, isWhite)) { // Capture enemy piece if present
        let pieceName = getPieceName(targetSquare);
        targetSquare.removeChild(targetSquare.querySelector("img"));
        return pieceName;
    }
} // only to be called in move handling functions
function getPieceName(targetSquare){
    let curTile = targetSquare.querySelector("img");
    if(curTile) {
        let url = curTile.src;
        const fileName = url.substring(url.lastIndexOf('/') + 1); // e.g., "king-W.svg"
        // This regex captures the piece name and a single letter for color (W or B)
        const match = fileName.match(/^(.*)-([WB])\.svg$/);
        if(match) return match[1];
        else console.error("Filename does not match expected pattern:", fileName);
    }//checks if not empty
}


// development helper functions
function removeAllPawns() {
    chessboardArray.forEach(row => {
        row.forEach(square => {
            const img = square.querySelector("img");
            if (img && img.src.includes("pawn")) {
                square.removeChild(img);
            }
        });
    });
    console.log("%cAll pawns removed for development", "color: orange;");
}