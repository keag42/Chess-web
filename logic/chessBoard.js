class chessBoard {
    constructor() {
        this.roundCount = 0;

        let pawns = { //todo add values
            "black" : ["pawn1", "pawn2"],
            "white" : ["pawn1", "pawn2"]
        };

        let rooks = {
            "black" :["rook1", "rook2", "rook3"],
            "white" :["rook1", "rook2", "rook3"]
        };

        let horses= {
          "black" : ["horse1", "horse2", "horse3"],
          "white" : ["horse1", "horse2", "horse3"]
        };

        let bishop = {
            "black" : ["bishop1", "bishop2", "bishop3"],
            "white" : ["bishop1", "bishop2", "bishop3"],
        };

        let queen= {
            "black" : "queen1",
            "white" : "queen2",
        };

        let king = {
            "black" : "king",
            "white" : "king",
        }

    }
}