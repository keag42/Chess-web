document.addEventListener("DOMContentLoaded", () => {
    const board = document.getElementById("chessboard");
    let chessboardArray = [];  // 2D array to store references to squares

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
        //testing
        //console.log("piece: " + pieces[row]);
        //console.log("row: " + row);
        console.log(`[${row}][${col}]: ` + pieces[row][col]);
        // - ---- ----- ----\testing
        const piece = pieces[row][col];
        if (piece) {
            const img = document.createElement("img");
            img.src = `../css/img/${piece}.svg`;  // Image path based on piece name
            img.alt = piece.split("-")[1];  // Alt text as the piece color (W/B)
            square.appendChild(img);  // Append the image to the square
        }
    }
}
