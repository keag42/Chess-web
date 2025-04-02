class ChessBoard {
    constructor() {
        this.roundCount = 0;

        this.board = this.initializeBoard();
        this.pieces = this.initializePieces();

        this.pawns = {
            "black": ["pawn1", "pawn2", "pawn3", "pawn4", "pawn5", "pawn6", "pawn7", "pawn8"],
            "white": ["pawn1", "pawn2", "pawn3", "pawn4", "pawn5", "pawn6", "pawn7", "pawn8"]
        };

        this.rooks = {
            "black": ["rook1", "rook2"],
            "white": ["rook1", "rook2"]
        };

        this.knights = {
            "black": ["knight1", "knight2"],
            "white": ["knight1", "knight2"]
        };

        this.bishops = {
            "black": ["bishop1", "bishop2"],
            "white": ["bishop1", "bishop2"]
        };

        this.queen = {
            "black": "queen",
            "white": "queen"
        };

        this.king = {
            "black": "king",
            "white": "king"
        };
        function initializeBoard() {
            let board = [];
            for (let i = 0; i < 8; i++) {
                board.push(new Array(8).fill(null)); // Each row is an array of 8 "null" values
            }
            return board;
        }

        // Defines all pieces and their initial positions
        function initializePieces() {
            return {
                "pawns": {
                    "black": this.placeRow("pawn", 1, "black"),  // Pawns on row 1 (Black)
                    "white": this.placeRow("pawn", 6, "white")   // Pawns on row 6 (White)
                },
                "rooks": {
                    "black": this.placePieces(["rook1", "rook2"], [[0, 0], [0, 7]], "black"),
                    "white": this.placePieces(["rook1", "rook2"], [[7, 0], [7, 7]], "white")
                },
                "knights": {
                    "black": this.placePieces(["knight1", "knight2"], [[0, 1], [0, 6]], "black"),
                    "white": this.placePieces(["knight1", "knight2"], [[7, 1], [7, 6]], "white")
                },
                "bishops": {
                    "black": this.placePieces(["bishop1", "bishop2"], [[0, 2], [0, 5]], "black"),
                    "white": this.placePieces(["bishop1", "bishop2"], [[7, 2], [7, 5]], "white")
                },
                "queen": {
                    "black": this.placePiece("queen", [0, 3], "black"),
                    "white": this.placePiece("queen", [7, 3], "white")
                },
                "king": {
                    "black": this.placePiece("king", [0, 4], "black"),
                    "white": this.placePiece("king", [7, 4], "white")
                }
            };
        }

        // Helper method to place a row of pawns
        function placeRow(pieceName, row, color) {
            let positions = [];
            for (let col = 0; col < 8; col++) {
                this.board[row][col] = `${color}_${pieceName}${col + 1}`;
                console.log(`${color}_${pieceName}${col + 1}`);
                positions.push([row, col]);
            }
            return positions;
        }

        // Helper method to place multiple pieces
        function placePieces(names, positions, color) {
            let placedPieces = [];
            for (let i = 0; i < names.length; i++) {
                this.board[positions[i][0]][positions[i][1]] = `${color}_${names[i]}`;
                placedPieces.push(positions[i]);
            }
            return placedPieces;
        }

    }
}