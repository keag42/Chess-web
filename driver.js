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
            img.src = `img/${piece}.svg`;  // Image path based on piece name
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
    let isWhite;
    let piece;
    if(sourceSquare.querySelector("img")) {
        const imageEl = sourceSquare.querySelector("img").src;
        const fileName = imageEl.substring(imageEl.lastIndexOf('/') + 1); // e.g., "king-W.svg"
        // This regex captures the piece name and a single letter for color (W or B)
        const match = fileName.match(/^(.*)-([WB])\.svg$/);
        isWhite =  chessboardArray[currentRow][currentCol].querySelector("img").src.endsWith("B.svg");
        piece = chessboardArray[currentRow][currentCol].querySelector("img");
        if(match) pieceName = match[1]; //gets piece Name
        else console.error("Filename does not match expected pattern:", fileName);
    }//checks if not empty

    if(pieceName === "pawn"){
        console.log("Pawn selected");
        pawnMove(currentRow, currentCol, isWhite, piece);
    }
    else if(pieceName === "rook"){
        console.log("Rook selected");
        rookMove(currentRow, currentCol, isWhite, piece);
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
    let leftAttackMade = false;
    let rightAttackMade = false;
    const forwardMove = chessboardArray[currentRow + direction][currentCol];

    if (!forwardMove.querySelector("img")) { // If there's no piece in front, it's a valid move
        forwardMove.appendChild(moveIndicator);  // Append the image to the square
        moveIndicator.addEventListener('click', forwardMoveFunc);
    }
    if(currentCol + 1 < 8) {
        rightAttack = chessboardArray[currentRow + direction][currentCol + 1];
        if (rightAttack.querySelector("img") && isEnemy(rightAttack, isWhite)) {
            rightAttack.classList.add("highlight-attack");
            rightAttack.addEventListener('click', rightAttackFunc);
            rightAttackMade = true;
        } //if space is not empty and its a enemy piece
    }
    if(currentCol - 1 >= 0) {
        leftAttack = chessboardArray[currentRow + direction][currentCol - 1];
        if (leftAttack.querySelector("img") && isEnemy(leftAttack, isWhite)) {
            leftAttack.classList.add("highlight-attack");
            leftAttack.addEventListener('click', leftAttackFunc);
            leftAttackMade = true;
        } //if space is not empty and its a enemy piece
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
            // console.log("Pawn moved after delay..");
        }, 5);// adds timer so that you dont click the pawn at the same time
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
    pieceSelected = true; // flag so that no other piece can be selected, must be set to false after piece has been moved
    let moveIndicator;
    
    let forwardHandlers = []; // store both the square and handler

    let backwordMove;
    let rightMove;
    let leftMove;
    
    //forwardMove
    let forwardMove;
    let forwardMoveMade = false;
   // let forwardArray = [];
    
    for(let i = 1; i < 8; i++){
        if (currentRow + i >= 8)  break;//if it's out of bounds stop execution

        forwardMove = chessboardArray[currentRow + i][currentCol];
        const forwardClone = forwardMove;
        
        if(forwardMove.querySelector("img")) { //if there's a piece there
            if(isEnemy(forwardMove, isWhite)) {
                forwardMove.classList.add("highlight-attack");
                forwardMove.addEventListener('click', () => forwardMoveFunc(forwardMove));
                forwardArray.push(forwardMove);
            }
            break; // stop checking
        }
        else{ //no piece present & not out of bounds
            let moveIndicator = createMoveIndicator(); // only the visual part
            forwardMove.appendChild(moveIndicator);

            // forwardMove.classList.add("highlight-move");
            let handler = () => forwardMoveFunc(currentRow + i, currentCol, moveIndicator);
            forwardMove.addEventListener('click', handler);
           // forwardArray.push(forwardMove);
            forwardHandlers.push({ square: forwardMove, handler });
        }

    }


    

    if(currentRow - 1 >= 0) {
        backwordMove = chessboardArray[currentRow - 1][currentCol];
    } // backward move
    if(currentCol + 1 < 8) {
        rightMove = chessboardArray[currentRow][currentCol - 1];
    } // right move
    if(currentCol - 1 >= 0) {
        leftMove = chessboardArray[currentRow][currentCol + 1];
    } // left move


   // this was working so just commented for now
       //      if (!forwardMove.querySelector("img")) { // If there's no piece in front, it's a valid move
       //          forwardMove.appendChild(moveIndicator);  // Append the image to the square
       //          forwardMove.addEventListener('click', forwardMoveFunc);
       //      }
       //      else{
       //      }



    function forwardMoveFunc(row, col, moveIndicator) {
        const forwardMove = chessboardArray[row][col];

        // Remove the indicator
        if (moveIndicator && forwardMove.contains(moveIndicator)) {
            forwardMove.removeChild(moveIndicator);
        }

        // Move the piece after a short delay
        setTimeout(() => {
            forwardMove.appendChild(piece);
        }, 5);

        for (let { square, handler } of forwardHandlers) {
            square.removeEventListener('click', handler);
        }
        pieceMoved();
    }
} //end of rook move
 // ------------------------------------------------------------------------------




//HELPER FUNCTIONS
function RemoveHighlight() {
    chessboardArray.forEach((row) => {
        row.forEach((square) => {
            // Remove highlight class if present
            square.classList.remove("highlight-attack"); // if i remove this the whole board doesn't load wtf
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
function pieceMoved(){
   // console.log(`%c${piece} moved to [${currentRow + direction}, ${currentCol + 1}]`, 'color: lightgreen;');
    console.log('%cPiece moved', 'color: lightgreen');
    RemoveHighlight();
    pieceSelected = false; //lets you select a piece again
    console.log('  ');
}