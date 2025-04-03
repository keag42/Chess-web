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
            //add piece

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
                movePiece(clickedRow, clickedCol, clickedRow+1, clickedCol, square);
            });

        }
        chessboardArray.push(rowArray);  // Add the row array to the main chessboard array
    }

    let a1Square = chessboardArray[0][0]; // Row 0, Column 0 (a1)
    console.log(a1Square);  // It will log the div element for a1

    // Example: Access square at row 7, col 7 (h8)
    let h8Square = chessboardArray[7][7]; // Row 7, Column 7 (h8)
    console.log(h8Square);  // It will log the div element for h8
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

function movePiece(currentRow, currentCol, targetRow, targetCol) {
    const sourceSquare = chessboardArray[currentRow][currentCol];
    const targetSquare = chessboardArray[targetRow][targetCol];

    // Get the image element from the source square
    const pieceImage = sourceSquare.querySelector("img");
    if (!pieceImage) {
        console.log("No piece to move!");
        return;
    }

    if(targetSquare.querySelector("img")) { //checks if it is empty
        console.log("Target square is occupied!");
        // -testing-
            const imageEl = targetSquare.querySelector("img");
            if (imageEl) {
                const src = imageEl.src;
                const fileName = src.substring(src.lastIndexOf('/') + 1); // e.g., "king-W.svg"
                // This regex captures the piece name and a single letter for color (W or B)
                const match = fileName.match(/^(.*)-([WB])\.svg$/);
                if(match) {
                    const pieceName = match[1];
                    const color = match[2];
                    console.log(color === "W" ? "White" : "Black",  pieceName, `[${targetRow}, ${targetCol}]`);
                } else {
                    console.error("Filename does not match expected pattern:", fileName);
                }
            }

        // ^testing^
        return;
    }

    // Remove the piece from the source square
    sourceSquare.removeChild(pieceImage);

    // Append the piece to the target square
    targetSquare.appendChild(pieceImage);
    console.log(`Moved piece from [${currentRow}, ${currentCol}] to [${targetRow}, ${targetCol}]`);
}


//maybe>>???
function isEnemy(targetRow, targetCol){
    const targetSquare = chessboardArray[targetRow][targetCol];
    if(targetSquare.querySelector("img")) { //checks if it is empty
        console.log(targetSquare.querySelector("img").src.endsWith("B.svg") ? "Black" : "White");
    }
}

function pawnMove(currentRow, currentCol) {
    let isWhite = chessboardArray[currentRow][currentCol].querySelector("img").src.endsWith("B.svg");

    let currentSquare = chessboardArray[currentRow][currentCol];
    //true if something is there
    let targetPieceF1 = chessboardArray[currentRow + 1][currentCol].querySelector("img"); //check's 1-Forward
    let ValidfowardMove1 = targetPieceF1.querySelector("img"); //check's 1-Forward

    //maybe i shold check if its empty and if so check the attack else dont
    let targetLeftAttack = chessboardArray[currentRow + 1][currentCol - 1];
    let leftAttack = !(targetLeftAttack.querySelector("img") && isEnemy(currentSquare, targetLeftAttack)); //check's Attack-Left

    let targetRightAttack = chessboardArray[currentRow + 1][currentCol + 1];
    let rightAttack = targetRightAttack.querySelector("img"); //check's Attack-Right


    //VERy very temporary test isEnemy() only in this scope //todo refactor this when there's a chance
    function isEnemy(currentSquare, targetSquare) {
        let currentPiece = currentSquare.querySelector("img").src.endsWith("B.svg")? "Black" : "White";
        let targetPiece = targetSquare.querySelector("img").src.endsWith("B.svg")? "Black" : "White";
        if(currentPiece === targetPiece) {
            console.log("Same Team!");
            return false;
        }
        else if(currentPiece !== targetPiece) {
            console.log("is enemy!");
            return false;
        }

    }
}