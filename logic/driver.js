let pieceSelected = false; // Flag to check if a piece is selected
let chessboardArray = [];  // Declare it globally

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
                const chessNotation = String.fromCharCode(97 + clickedCol) + (clickedRow + 1);

                // console.log(` you chose: \nArray indices: [${clickedRow}, ${clickedCol}] \nChess notation: ${chessNotation}`);
                //console.log(`Current place: [${clickedRow}, ${clickedCol}]`)

                //movePiece(clickedRow, clickedCol, clickedRow+1, clickedCol, square);
                selectedPiece(clickedRow, clickedCol, square);
            });

        }
        chessboardArray.push(rowArray);  // Add the row array to the main chessboard array
    }

    let a1Square = chessboardArray[0][0]; // Row 0, Column 0 (a1)
    //console.log(a1Square);  // It will log the div element for a1

    // Example: Access square at row 7, col 7 (h8)
    let h8Square = chessboardArray[7][7]; // Row 7, Column 7 (h8)
   // console.log(h8Square);  // It will log the div element for h8
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
            img.src = `../css/img/${piece}.svg`;  // Image path based on piece name
            img.alt = piece.split("-")[1];  // Alt text as the piece color (W/B)
            square.appendChild(img);  // Append the image to the square
        }
    }
}
//Helper Function Selected Piece, when you select a piece it will start the process of finding its moves

function selectedPiece(currentRow, currentCol, square) {
    if(pieceSelected) return;
    const sourceSquare = chessboardArray[currentRow][currentCol];
    let pieceName;
    let color;
    if(sourceSquare.querySelector("img")) {

        const imageEl = sourceSquare.querySelector("img");
        if (imageEl) {
            const src = imageEl.src;
            const fileName = src.substring(src.lastIndexOf('/') + 1); // e.g., "king-W.svg"
            // This regex captures the piece name and a single letter for color (W or B)
            const match = fileName.match(/^(.*)-([WB])\.svg$/);
            if(match) {
                pieceName = match[1]; //gets piece Name
                color = match[2];
            } else {
                console.error("Filename does not match expected pattern:", fileName);
            }

        } //gets piece name & color and saves them

    }//checks if not empty

    if(pieceName === "pawn"){
        console.log("Pawn selected");
        pawnMove(currentRow, currentCol, sourceSquare, square);
    }
    else if(pieceName === "rook"){
        console.log("Rook selected");
        //todo add rook method
    }
    else if(pieceName === "horse"){
        console.log("HORSE selected");
        //todo add horse method
    }
    else if(pieceName === "bishop"){
        console.log("Bishop selected");
        //todo add bishop method
    }
    else if(pieceName === "king"){
        console.log("King selected");
        //todo add king method
    }
    else if(pieceName === "queen"){
        console.log("Queen selected");
        //todo add queen method
    }
}

//maybe>>???
function isEnemy(targetRow, targetCol){
    const targetSquare = chessboardArray[targetRow][targetCol];
    if(targetSquare.querySelector("img")) { //checks if it is empty
        console.log(targetSquare.querySelector("img").src.endsWith("B.svg") ? "Black" : "White");
    }
}



function pawnMove(currentRow, currentCol, sourceSquare, square) {
    pieceSelected = true;
    let thisSquare = chessboardArray[currentRow][currentCol].querySelector("img");
    let isWhite = thisSquare.src.endsWith("B.svg")  ;
    let direction = isWhite ? 1 : -1;
    const pawn = chessboardArray[currentRow][currentCol].querySelector("img");

    const forwardMove = chessboardArray[currentRow + direction][currentCol];
    if (!chessboardArray[currentRow + direction][currentCol].querySelector("img")) { // If there's no piece in front, it's a valid move

        var forwardMoveElement = document.createElement("img");  // Create an <img> element
        forwardMoveElement.src = `../css/img/possibleMove.svg`;  // Image path based on piece name
        forwardMoveElement.alt = "move";
        forwardMoveElement.style.width = "45px";  // Set width to 50px
        forwardMoveElement.style.height = "45px"
        forwardMove.appendChild(forwardMoveElement);  // Append the image to the square

        forwardMoveElement.addEventListener('click', forwardMoveFunc);

    }

    const rightAttack = chessboardArray[currentRow + direction][currentCol + 1];
    if (rightAttack.querySelector("img") ) {
        rightAttack.classList.add("highlight-attack");
        rightAttack.addEventListener('click', rightAttackFunc);
    }

    const leftAttack = chessboardArray[currentRow + direction][currentCol - 1];
    if (leftAttack.querySelector("img")) {
        leftAttack.classList.add("highlight-attack");
        leftAttack.addEventListener('click', leftAttackFunc);
    }

    function pawnMoved(){
        console.log(`Pawn moved t0 [${currentRow + direction}, ${currentCol + 1}]`);
        RemoveHighlight();
        removeEventListeners()
        pieceSelected = false; //lets you select a piece again
        console.log('  ');
    }
    function forwardMoveFunc (){
        forwardMove.removeChild(forwardMoveElement); // this removes the indicator on the square
        setTimeout(() => {
            forwardMove.appendChild(pawn);
            console.log("Pawn moved after delay..");
        }, 5);// adds timer so that you dont click the pawn at the same time
        pawnMoved();
        forwardMoveElement.removeEventListener('click', arguments.callee); // Remove the event listener after the move
    }
    function rightAttackFunc (){
        this.removeChild(rightAttack.querySelector("img"));
        this.appendChild(pawn); // Move the pawn to the target square
        console.log("Pawn takes: ?");
        rightAttack.removeEventListener('click', arguments.callee); // Remove the event listener after the move
        pawnMoved();
    }
    function leftAttackFunc (){
            this.removeChild(leftAttack.querySelector("img"));
            this.appendChild(pawn); // Move the pawn to the target square
            console.log("Pawn takes: ?");
            pawnMoved();
            leftAttack.removeEventListener('click', arguments.callee); // Remove the event listener after the move
    }
    function removeEventListeners() {
        // Remove listeners for forward move
        forwardMove.removeEventListener('click', forwardMoveFunc);

        // Remove listeners for right attack
        rightAttack.removeEventListener('click', rightAttackFunc);

        // Remove listeners for left attack
        leftAttack.removeEventListener('click', leftAttackFunc);
    }
}
function RemoveHighlight() {
    chessboardArray.forEach((row) => {
        row.forEach((square) => {
            // Remove highlight class if present
            square.classList.remove("highlight-attack");

            // Remove any possibleMove indicators (optional: check the 'alt' or src)
            const indicators = square.querySelectorAll("img");
            indicators.forEach((img) => {
                if (img.alt === "move") {
                    square.removeChild(img);
                }
            });
        });
    });
}

