import React from 'react';

interface ChessBoardProps {
    boardSide?: "w" | "b";
    setBoardData: string[][];
    getBoardData: (data: string[][]) => void;
    history?: (data: string[][][]) => void;
    moveBackCount?: number;
}
declare const ChessBoard: React.FC<ChessBoardProps>;

export { ChessBoard };
