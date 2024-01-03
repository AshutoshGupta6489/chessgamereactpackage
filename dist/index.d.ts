import React from 'react';

interface ChessBoardProps {
    boardSide?: "w" | "b";
    setBoardData: string[][];
    getBoardData: (data: string[][]) => void;
}
declare const ChessBoard: React.FC<ChessBoardProps>;

export { ChessBoard };
