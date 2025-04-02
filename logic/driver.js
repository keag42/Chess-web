
document.addEventListener("DOMContentLoaded", () => {
    const board = document.getElementById("chessboard");
    let chessboardArray = [];

    for (let row = 0; row < 8; row++) {
        let rowArray = [];
        for (let col = 0; col < 8; col++) {
            const square = document.createElement("div");
            square.classList.add("square", (row + col) % 2 === 0 ? "light" : "dark");
            square.dataset.row = row;
            square.dataset.col = col;

            // Add click event listener
            square.addEventListener('click', function() {
                const clickedRow = parseInt(this.dataset.row);
                const clickedCol = parseInt(this.dataset.col);
                const chessNotation = String.fromCharCode(97 + clickedCol) + (clickedRow + 1);
                console.log(`Array indices: [${clickedRow}, ${clickedCol}], Chess notation: ${chessNotation}`);
            });

            board.appendChild(square);
            rowArray.push(square);
        }
        chessboardArray.push(rowArray);
    }

    // Rest of your existing code...
});
