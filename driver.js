let pieceSelected = false; // Flag to check if a piece is selected
let moveTurnWhite = true;
let chessboardArray = [];  // Declare it globally
let handlerArray = [];
let roundCounter = 0; // Counter for rounds
let roundArray = [];

// CNTRL+SHIFT+'-' to close all functions
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


    if (pieces[row]) {

        const piece = pieces[row][col];
        if (piece) {
            const img = document.createElement("img");
            img.src = `img/${piece}.svg`;  // Image path based on piece name
            img.alt = piece.split("-")[1];  // Alt text as the piece color (W/B)
            square.appendChild(img);  // Append the image to the square
        }
    }

     // removeAllPawns(); //TODO FOR TESTING ONLY.
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
        isWhite =  url.endsWith("W.svg");

        if(isWhite === moveTurnWhite) {
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
        if(targetPiece.src.endsWith("W.svg") !== isWhite){
            return true;
        }
    }
    return false;
}

function pawnMove(currentRow, currentCol, isWhite, piece) {
    pieceSelected = true;
    const moveIndicator = createMoveIndicator(); // Reuse moveIndicator
    let direction = isWhite ? -1 : 1;
    let firstSquare = isWhite ? 6 : 1;  // Correct starting positions for pawns
    let isLegal = false;
    let rightSquare;
    let leftSquare;
    let forwardSquare;
    let forwardJump;
    let moveChoicesCount = 0;

    // Check left diagonal (capture enemy piece)
    if (currentCol - 1 >= 0 && currentRow + direction >= 0 && currentRow + direction < 8) {
        leftSquare = chessboardArray[currentRow + direction][currentCol - 1];
        if (isEnemy(leftSquare, isWhite)) {
            let handler = () => moveHandler(currentRow + direction, currentCol - 1, isWhite, handlerArray, piece);
            leftSquare.classList.add("highlight-attack");
            leftSquare.addEventListener('click', handler);
            handlerArray.push({square: leftSquare, handler});
            moveChoicesCount++;
        }
    }

    // Check right diagonal (capture enemy piece)
    if (currentCol + 1 < 8 && currentRow + direction >= 0 && currentRow + direction < 8) {
        rightSquare = chessboardArray[currentRow + direction][currentCol + 1];
        if (isEnemy(rightSquare, isWhite)) {
            let handler = () => moveHandler(currentRow + direction, currentCol + 1, isWhite, handlerArray, piece);
            rightSquare.classList.add("highlight-attack");
            rightSquare.addEventListener('click', handler);
            handlerArray.push({square: rightSquare, handler});
            moveChoicesCount++;
        }
    }

    // Check single forward move
    if (currentRow + direction >= 0 && currentRow + direction < 8) {
        forwardSquare = chessboardArray[currentRow + direction][currentCol];
        if (!forwardSquare.querySelector("img")) {
            let handler = () => moveHandler(currentRow + direction, currentCol, isWhite, handlerArray, piece);
            forwardSquare.appendChild(moveIndicator);
            forwardSquare.addEventListener('click', handler);
            handlerArray.push({square: forwardSquare, handler});
            isLegal = true;
            moveChoicesCount++;
        }
    }

    // Check two-square forward move (pawn jump)
        if (currentRow === firstSquare) {
            // Calculate position two squares ahead
            const twoSquaresAhead = currentRow + (2 * direction);
            if (twoSquaresAhead >= 0 && twoSquaresAhead < 8) {
                forwardJump = chessboardArray[twoSquaresAhead][currentCol];
                // Ensure both squares are empty
                if ((!forwardSquare.querySelector("img") || isLegal) && !forwardJump.querySelector("img")) {
                    let handler = () => moveHandler(twoSquaresAhead, currentCol, isWhite, handlerArray, piece);
                    forwardJump.appendChild(moveIndicator.cloneNode(true)); // Use clone of moveIndicator
                    forwardJump.addEventListener('click', handler);
                    handlerArray.push({square: forwardJump, handler});
                    moveChoicesCount++;
                    isLegal = false;
                }
            }
        }



    // If no moves are available
    if (moveChoicesCount === 0) {
        pieceSelected = false;
        console.log("%cThis piece has no where to go..", 'color: red;');
    }
}
/**
 * Handles the movement of a rook on the chessboard.
 * Rooks can move in straight lines along rows and columns.
 *
 * This function sets up the directional movement (up, down, left, right)
 * and delegates to `extendedDirectionMove` for processing valid move options.
 *
 * @param {number} currentRow - The current row of the selected piece (0–7).
 * @param {number} currentCol - The current column of the selected piece (0–7).
 * @param {boolean} isWhite - Indicates if the selected piece is white.
 * @param {HTMLElement} piece - The DOM element representing the selected piece.
 *
 * @returns {void}
 */
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
/**
 * Handles the movement of a bishop on the chessboard.
 * Bishops move diagonally across the board.
 *
 * This function sets up the directional movement (up-left, up-right, down-left, down-right)
 * and delegates to `extendedDirectionMove` for processing valid move options.
 *
 * @param {number} currentRow - The current row of the selected piece (0–7).
 * @param {number} currentCol - The current column of the selected piece (0–7).
 * @param {boolean} isWhite - Indicates if the selected piece is white.
 * @param {HTMLElement} piece - The DOM element representing the selected piece.
 *
 * @returns {void}
 */
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
/**
 * Handles the movement of a queen on the chessboard.
 * Queens can move horizontally, vertically, or diagonally.
 *
 * This function sets up the directional movement (all 8 directions)
 * and delegates to `extendedDirectionMove` for processing valid move options.
 *
 * @param {number} currentRow - The current row of the selected piece (0–7).
 * @param {number} currentCol - The current column of the selected piece (0–7).
 * @param {boolean} isWhite - Indicates if the selected piece is white.
 * @param {HTMLElement} piece - The DOM element representing the selected piece.
 *
 * @returns {void}
 */
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
/**
 * Handles the movement of a king on the chessboard.
 * Kings can move one square in any direction.
 *
 * This function sets up the directional movement (all 8 directions)
 * and delegates to `singleDirectionMove` for processing valid move options.
 *
 * @param {number} currentRow - The current row of the selected piece (0–7).
 * @param {number} currentCol - The current column of the selected piece (0–7).
 * @param {boolean} isWhite - Indicates if the selected piece is white.
 * @param {HTMLElement} piece - The DOM element representing the selected piece.
 *
 * @returns {void}
 */
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
/**
 * Handles the movement of a knight (horse) on the chessboard.
 * Knights move in an "L" shape: two squares in one direction and one square perpendicular.
 *
 * This function sets up the directional movement (all 8 possible L-shaped moves)
 * and delegates to `singleDirectionMove` for processing valid move options.
 *
 * @param {number} currentRow - The current row of the selected piece (0–7).
 * @param {number} currentCol - The current column of the selected piece (0–7).
 * @param {boolean} isWhite - Indicates if the selected piece is white.
 * @param {HTMLElement} piece - The DOM element representing the selected piece.
 *
 * @returns {void}
 */
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

/**
 * Handles movement logic for pieces that can move multiple steps in a direction,
 * such as rooks, bishops, and queens.
 *
 * Iterates through each direction in `directionArray`, extending step by step
 * until it hits the board boundary, a friendly piece, or an enemy piece.
 * Highlights valid move and attack squares, attaches movement event handlers,
 * and tracks the number of legal move options.
 *
 * Stops extending in a direction once a piece is encountered (to simulate blocking).
 *
 * @param {number} currentRow - The current row of the selected piece (0–7).
 * @param {number} currentCol - The current column of the selected piece (0–7).
 * @param {boolean} isWhite - Indicates if the selected piece is white.
 * @param {HTMLElement} piece - The DOM element representing the selected piece.
 * @param {{dr: number, dc: number}[]} directionArray - Array of direction vectors (`dr`, `dc`) representing movement directions.
 *
 * @returns {void}
 */
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
/**
 * Handles movement logic for pieces that move in a single-step directional pattern.
 *
 * Iterates through each direction in `directionArray`, checks if the move is within bounds,
 * and determines whether the target square is empty or contains an enemy piece.
 * Highlights valid moves or attacks, attaches event handlers for movement,
 * and counts how many valid move options exist.
 *
 * If no valid moves are found, it disables the selection of the piece.
 *
 * @param {number} currentRow - The current row of the selected piece (0–7).
 * @param {number} currentCol - The current column of the selected piece (0–7).
 * @param {boolean} isWhite - Indicates if the selected piece is white.
 * @param {HTMLElement} piece - The DOM element representing the selected piece.
 * @param {{dr: number, dc: number}[]} directionArray - Array of direction objects, each with `dr` (delta row) and `dc` (delta column) for movement.
 *
 * @returns {void}
 */
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

/**
 * Handles the movement of a piece to the target square.
 * This includes capturing enemy pieces, updating the board,
 * and switching turns between players.
 *
 * This function performs the following tasks:
 * - Removes all move indicators and attack highlights.
 * - Removes all event listeners attached to the handler.
 * - Moves the piece to the target square.
 * - Updates the game state, including piece movement and turn changes.
 *
 * @param {number} targetRow - The target row where the piece is to be moved.
 * @param {number} targetCol - The target column where the piece is to be moved.
 * @param {boolean} isWhite - Indicates if the piece being moved is white.
 * @param {Array} handlerArray - Array of handler objects used to manage event listeners.
 * @param {HTMLElement} piece - The DOM element representing the piece being moved.
 *
 * @returns {void}
 */
moveHandler = (targetRow, targetCol, isWhite, handlerArray, piece) => {
    const targetSquare = chessboardArray[targetRow][targetCol];
    let attackedPieceName = ifEnemyTakePiece(targetSquare, isWhite);
    let isAttack = attackedPieceName != null;

    RemoveHighlight(); // Remove all move indicators and attack highlights
    removeEventAllListeners(handlerArray);
    movePieceToSquare(targetSquare, piece);
    pieceMoved(piece, targetRow, targetCol, isAttack, attackedPieceName);
    if(piece.src.endsWith("pawn-W.svg") || piece.src.endsWith("pawn-B.svg")) {
        pawnPromotion(targetRow, piece, isWhite);
    }
    pieceSelected = false; // Reset selection flag
    document.getElementById("turn").innerHTML = `Turn: ${moveTurnWhite ?  "Black" : "White" }`;
    moveTurnWhite = !moveTurnWhite; //switch turns
    roundCounter++;

    saveJSON(); // save json func
}

//HELPER FUNCTIONS
/**
 * Saves the current state of the chessboard by capturing information about all pieces
 * and their positions in a specific round.
 * 
 * The function performs the following operations:
 * 1. Creates a temporary array to store the current board state
 * 2. Iterates through the entire chessboard array (8x8)
 * 3. For each square containing a piece:
 *    - Records the current round number
 *    - Captures the piece's image source (which indicates piece type and color)
 *    - Stores the piece's position (row and column)
 * 4. Adds the complete board state to the main roundArray
 * 
 * @function saveJSON
 * 
 * @global {Array} chessboardArray - 2D array representing the chessboard
 * @global {number} roundCounter - Current round number in the game
 * @global {Array} roundArray - Array storing the history of board states
 * 
 * @example
 * // After a piece moves
 * saveJSON();
 * // This will add an array of all piece positions to roundArray
 * 
 * @returns {void}
 */
function saveJSON() {
    let tempRoundArray = [];
    for(let i = 0; i < chessboardArray.length; i++){
        for(let j = 0; j < chessboardArray[i].length; j++){
            if(chessboardArray[i][j].querySelector("img")){
                tempRoundArray.push({
                    "round": roundCounter,
                    "piece": chessboardArray[i][j].querySelector("img").src,
                    "position": {
                        "row": i,
                        "col": j
                    }
                });
            }
        }
    }
    roundArray.push(tempRoundArray);
}
/**
 * Displays a message to the user in the form of a popup.
 * The popup appears for 2 seconds before being removed from the DOM.
 *
 * @param {string} message - The message to be displayed in the popup.
 *
 * @returns {void}
 */
function showMessage(message) {
    const msgDiv = document.createElement("div");
    msgDiv.textContent = message;
    msgDiv.className = "message-popup";
    document.body.appendChild(msgDiv);
    setTimeout(() => msgDiv.remove(), 2000);
}
/**
 * Removes all move indicators and attack highlights from the chessboard.
 * It searches through each square and removes any highlighting or move indicators.
 *
 * @returns {void}
 */
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
/**
 * Creates a move indicator image element to visually represent a valid move square.
 * This indicator is appended to the target square during piece movement processing.
 *
 * @returns {HTMLElement} - The created move indicator image element.
 */
function createMoveIndicator(){
    let moveIndicator = document.createElement("img");  // Create an <img> element
    moveIndicator.src = `img/possibleMove.svg`;  // Image path based on piece name
    moveIndicator.alt = "move";
    moveIndicator.style.width = "45px";  // Set width to 50px
    moveIndicator.style.height = "45px"
    return moveIndicator;
}
/**
 * Logs the movement of a piece to the console, including attack actions.
 * If a piece attacks another piece, it logs the attack with color coding for clarity.
 *
 * @param {HTMLElement} piece - The DOM element representing the moved piece.
 * @param {number} newRow - The target row where the piece has been moved.
 * @param {number} newCol - The target column where the piece has been moved.
 * @param {boolean} isAttack - Indicates if the move was an attack.
 * @param {string|null} attackedPieceName - The name of the piece that was attacked, if any.
 *
 * @returns {void}
 */
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
/**
 * Removes all click event listeners from the handler array.
 * This is typically used after a move has been processed to clean up event listeners.
 *
 * @param {Array} handlerArray - Array of handler objects, each containing a square and a handler function.
 *
 * @returns {void}
 */
function removeEventAllListeners(handlerArray) {
    handlerArray.forEach(({ square, handler }) => { // Remove all event listeners
        square.removeEventListener('click', handler);
    });
} // only to be called in move handling functions
/**
 * Moves the piece to the target square with a small delay.
 * The piece is appended to the target square after a short timeout.
 *
 * @param {HTMLElement} targetSquare - The square where the piece will be moved to.
 * @param {HTMLElement} piece - The DOM element representing the piece being moved.
 *
 * @returns {void}
 */
function movePieceToSquare(targetSquare, piece) {
    setTimeout(() => { // Move the rook to the target square
        targetSquare.appendChild(piece);
    }, 5);
} // only to be called in move handling functions
/**
 * Checks if the target square contains an enemy piece and removes it if so.
 * If an enemy piece is present, it is removed and its name is returned.
 *
 * @param {HTMLElement} targetSquare - The square to check for an enemy piece.
 * @param {boolean} isWhite - Indicates if the piece being moved is white.
 *
 * @returns {string|null} - The name of the captured piece, or null if no piece was captured.
 */
function ifEnemyTakePiece(targetSquare, isWhite){
    if (targetSquare.querySelector("img") && isEnemy(targetSquare, isWhite)) { // Capture enemy piece if present
        let pieceName = getPieceName(targetSquare);
        targetSquare.removeChild(targetSquare.querySelector("img"));
        return pieceName;
    }
} // only to be called in move handling functions
/**
 * Checks if the target square contains an enemy piece and removes it if so.
 * If an enemy piece is present, it is removed and its name is returned.
 *
 * @param {HTMLElement} targetSquare - The square to check for an enemy piece.
 *
 * @returns {string|null} - The name of the captured piece, or null if no piece was captured.
 */
function getPieceName(targetSquare) {
    let curTile = targetSquare.querySelector("img");
    if (curTile) {
        let url = curTile.src;
        const fileName = url.substring(url.lastIndexOf('/') + 1); // e.g., "king-W.svg"
        // This regex captures the piece name and a single letter for color (W or B)
        const match = fileName.match(/^(.*)-([WB])\.svg$/);
        if (match) return match[1];
        //else console.error("Filename does not match expected pattern:", fileName);
    }//checks if not empty
}

function pawnPromotion(row, piece, isWhite) {
    // Check if a promotion dialog is already open
    if (document.querySelector(".promotion-overlay")) {
        return; // Exit if already open
    }

    // Only trigger promotion if the pawn reaches the last row
    if (row === 0 || row === 7) {
        // Create the overlay
        const overlay = document.createElement("div");
        overlay.classList.add("promotion-overlay");

        // Create the promotion menu
        const promotionDiv = document.createElement("div");
        promotionDiv.classList.add("promotion");

        // Create inner HTML for the promotion menu
        promotionDiv.innerHTML = `
            <h2>Promote your pawn!</h2>
            <button class="promotion-button" data-piece="queen">Queen</button>
            <button class="promotion-button" data-piece="rook">Rook</button>
            <button class="promotion-button" data-piece="bishop">Bishop</button>
            <button class="promotion-button" data-piece="horse">Knight</button>
        `;

        // Add the promotion menu to the overlay
        overlay.appendChild(promotionDiv);

        // Append the overlay to the document body
        document.body.appendChild(overlay);

        // Add event listeners to the buttons
        const buttons = promotionDiv.querySelectorAll(".promotion-button");
        buttons.forEach(button => {
            button.addEventListener("click", () => {
                const newPiece = button.dataset.piece;
                piece.src = `img/${newPiece}-${isWhite ? "W" : "B"}.svg`;
                // Remove the overlay after a selection is made
                document.body.removeChild(overlay);
            });
        });
    }
}

// development helper functions
/**
 * Removes all pawn pieces from the chessboard.
 *
 * Iterates through the `chessboardArray` and removes any `<img>` elements
 * whose `src` includes "pawn".
 *
 * allows for piece testing without always having to move the pawns everytime it reloads
 *
 * @returns {void}
 */
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