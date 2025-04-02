class Pieces{
   constructor(chessBoard, posX, posY, name, isWhiteSide){
    //chessBoard object
       this.chessBoard = chessBoard;
    // position
        this.positionX = posX
        this.positionY = posY;
    // type + name consolidated
        this.name = name;
    // side whitee ?
        this.isWhiteSide = isWhiteSide;
    // move count //todo should i add  ?
   }
   getPiecePosition = () =>  [this.positionX, this.positionY]; // 2 intsr
   getName = () =>  this.name; //string
   getIsWhiteSide = () =>  this.isWhiteSide; //boolean


}