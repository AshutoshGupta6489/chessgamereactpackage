
import './ChessBoardStyle.css';
import React, { useEffect, useRef, useState } from 'react';
interface ChessBoardProps {
    boardSide?: "w" | "b";
    setBoardData: string[][];
    getBoardData: (data: string[][]) => void;
}
const ChessBoard: React.FC<ChessBoardProps> = ({ boardSide = "w", setBoardData = [
    ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
    ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
    ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'],
], getBoardData = (data: string[][]) => { } }) => {
    const [clickCount, setClickCount] = useState<number>(1);
    const [selectedPos, setSelectedPos] = useState<[string, number, number]>(["", -1, -1]);
    const [starting, setStarting] = useState<String>("")
    const validPosList = useRef<any>();
    const underAttack = useRef<any>();
    const resetPostion = useRef<any>();
    const black: Record<string, string> = { 'P': `♙`, 'R': `♖`, 'N': `♘`, 'B': `♗`, 'Q': `♕`, 'K': `♔` }
    const white: Record<string, string> = { 'p': `♟`, 'r': `♜`, 'n': `♞`, 'b': `♝`, 'q': `♛`, 'k': `♚` }
    const [board, setBoard] = useState<string[][]>(setBoardData);
    useEffect(() => {
        const chessboardCoordinates = generateChessboardCoordinates();
        validPosList.current = chessboardCoordinates;
        underAttack.current = new Map(chessboardCoordinates);
        resetPostion.current = new Map(chessboardCoordinates);
        setStarting(boardSide)
    }, []);
    useEffect(() => {
        setBoard(setBoardData)
    }, [setBoardData])
    const generateChessboardCoordinates = (): any => {
        const coordinates: any = new Map();
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const coordinate = `${row}${col}`;
                coordinates.set(coordinate, false);
            }
        }
        return coordinates;
    };
    function selectionMode(piece: string, rowIndex: number, colIndex: number) {
        let check = piece || clickCount !== 1
        if (check) {
            if (clickCount === 1) {
                setSelectedPos([piece, rowIndex, colIndex])
                validPos(piece, rowIndex, colIndex)
                setClickCount(2)
            } else {
                updateBoard(piece, rowIndex, colIndex)
            }
        }
    }
    function updateBoard(data: string, i: number, j: number) {
        let enemylist = selectedPos[0] in black ? white : black;
        setClickCount(1)
        if (validPosList.current.get(`${i}${j}`)) {
            setBoard(oldBoard => {
                oldBoard[selectedPos[1]][selectedPos[2]] = data in enemylist ? "" : data
                oldBoard[i][j] = selectedPos[0]
                return oldBoard
            })
            getBoardData(board)
        }
        setSelectedPos(["", -1, -1])
        validPosList.current = new Map(resetPostion.current)
        underAttack.current = new Map(resetPostion.current)
    }
    function validPos(data: string, i: number, j: number) {
        let enemylist = data in black ? white : black;
        if (data === "p" || data === "P") {
            if (data === "P") {
                if (i === 6 && validPosList.current.has(`${i - 2}${j}`)) {
                    validPosList.current.set(`${i - 2}${j}`, board[i - 2][j] === "")
                }
                if (validPosList.current.has(`${i - 1}${j}`)) {
                    validPosList.current.set(`${i - 1}${j}`, board[i - 1][j] === "")
                }
                if (validPosList.current.has(`${i - 1}${j - 1}`)) {
                    validPosList.current.set(`${i - 1}${j - 1}`, board[i - 1][j - 1] in enemylist)
                    underAttack.current.set(`${i - 1}${j - 1}`, board[i - 1][j - 1] in enemylist)
                }
                if (validPosList.current.has(`${i - 1}${j + 1}`)) {
                    validPosList.current.set(`${i - 1}${j + 1}`, board[i - 1][j + 1] in enemylist)
                    underAttack.current.set(`${i - 1}${j + 1}`, board[i - 1][j + 1] in enemylist)
                }
            } else {
                if (i === 1 && validPosList.current.has(`${i + 2}${j}`)) {
                    validPosList.current.set(`${i + 2}${j}`, board[i + 2][j] === "")
                }
                if (validPosList.current.has(`${i + 1}${j}`)) {
                    validPosList.current.set(`${i + 1}${j}`, board[i + 1][j] === "")
                }
                if (validPosList.current.has(`${i + 1}${j - 1}`)) {
                    validPosList.current.set(`${i + 1}${j - 1}`, board[i + 1][j - 1] in enemylist)
                    underAttack.current.set(`${i + 1}${j - 1}`, board[i + 1][j - 1] in enemylist)
                }
                if (validPosList.current.has(`${i + 1}${j + 1}`)) {
                    validPosList.current.set(`${i + 1}${j + 1}`, board[i + 1][j + 1] in enemylist)
                    underAttack.current.set(`${i + 1}${j + 1}`, board[i + 1][j + 1] in enemylist)
                }
            }
        }
        if (data === "K" || data === "k") {
            if (validPosList.current.has(`${i - 1}${j}`)) {
                underAttack.current.set(`${i - 1}${j}`, board[i - 1][j] in enemylist)
                validPosList.current.set(`${i - 1}${j}`, board[i - 1][j] === "" || (board[i - 1][j] in enemylist))
            }

            if (validPosList.current.has(`${i + 1}${j}`)) {
                underAttack.current.set(`${i + 1}${j}`, board[i + 1][j] in enemylist)
                validPosList.current.set(`${i + 1}${j}`, board[i + 1][j] === "" || (board[i + 1][j] in enemylist))
            }
            if (validPosList.current.has(`${i}${j + 1}`)) {
                underAttack.current.set(`${i}${j + 1}`, board[i][j + 1] in enemylist)
                validPosList.current.set(`${i}${j + 1}`, board[i][j + 1] === "" || (board[i][j + 1] in enemylist))
            }
            if (validPosList.current.has(`${i}${j - 1}`)) {
                underAttack.current.set(`${i}${j - 1}`, board[i][j - 1] in enemylist)
                validPosList.current.set(`${i}${j - 1}`, board[i][j - 1] === "" || (board[i][j - 1] in enemylist))
            }
            if (validPosList.current.has(`${i - 1}${j - 1}`)) {
                underAttack.current.set(`${i - 1}${j - 1}`, board[i - 1][j - 1] in enemylist)
                validPosList.current.set(`${i - 1}${j - 1}`, board[i - 1][j - 1] === "" || (board[i - 1][j - 1] in enemylist))
            }
            if (validPosList.current.has(`${i + 1}${j + 1}`)) {
                underAttack.current.set(`${i + 1}${j + 1}`, board[i + 1][j + 1] in enemylist)
                validPosList.current.set(`${i + 1}${j + 1}`, board[i + 1][j + 1] === "" || (board[i + 1][j + 1] in enemylist))
            }
            if (validPosList.current.has(`${i - 1}${j + 1}`)) {
                underAttack.current.set(`${i - 1}${j + 1}`, board[i - 1][j + 1] in enemylist)
                validPosList.current.set(`${i - 1}${j + 1}`, board[i - 1][j + 1] === "" || (board[i - 1][j + 1] in enemylist))
            }
            if (validPosList.current.has(`${i + 1}${j - 1}`)) {
                underAttack.current.set(`${i + 1}${j - 1}`, board[i + 1][j - 1] in enemylist)
                validPosList.current.set(`${i + 1}${j - 1}`, board[i + 1][j - 1] === "" || (board[i + 1][j - 1] in enemylist))
            }
        }
        if (data === "N" || data === "n") {
            if (validPosList.current.has(`${i + 2}${j + 1}`)) {
                underAttack.current.set(`${i + 2}${j + 1}`, board[i + 2][j + 1] in enemylist)
                validPosList.current.set(`${i + 2}${j + 1}`, board[i + 2][j + 1] === "" || (board[i + 2][j + 1] in enemylist))
            }
            if (validPosList.current.has(`${i + 2}${j - 1}`)) {
                underAttack.current.set(`${i + 2}${j - 1}`, board[i + 2][j - 1] in enemylist)
                validPosList.current.set(`${i + 2}${j - 1}`, board[i + 2][j - 1] === "" || (board[i + 2][j - 1] in enemylist))
            }
            if (validPosList.current.has(`${i - 2}${j - 1}`)) {
                underAttack.current.set(`${i - 2}${j - 1}`, board[i - 2][j - 1] in enemylist)
                validPosList.current.set(`${i - 2}${j - 1}`, board[i - 2][j - 1] === "" || (board[i - 2][j - 1] in enemylist))
            }
            if (validPosList.current.has(`${i - 2}${j + 1}`)) {
                underAttack.current.set(`${i - 2}${j + 1}`, board[i - 2][j + 1] in enemylist)
                validPosList.current.set(`${i - 2}${j + 1}`, board[i - 2][j + 1] === "" || (board[i - 2][j + 1] in enemylist))
            }
            if (validPosList.current.has(`${i + 1}${j + 2}`)) {
                underAttack.current.set(`${i + 1}${j + 2}`, board[i + 1][j + 2] in enemylist)
                validPosList.current.set(`${i + 1}${j + 2}`, board[i + 1][j + 2] === "" || (board[i + 1][j + 2] in enemylist))
            }
            if (validPosList.current.has(`${i - 1}${j + 2}`)) {
                underAttack.current.set(`${i - 1}${j + 2}`, board[i - 1][j + 2] in enemylist)
                validPosList.current.set(`${i - 1}${j + 2}`, board[i - 1][j + 2] === "" || (board[i - 1][j + 2] in enemylist))
            }
            if (validPosList.current.has(`${i - 1}${j - 2}`)) {
                underAttack.current.set(`${i - 1}${j - 2}`, board[i - 1][j - 2] in enemylist)
                validPosList.current.set(`${i - 1}${j - 2}`, board[i - 1][j - 2] === "" || (board[i - 1][j - 2] in enemylist))
            }
            if (validPosList.current.has(`${i + 1}${j - 2}`)) {
                underAttack.current.set(`${i + 1}${j - 2}`, board[i + 1][j - 2] in enemylist)
                validPosList.current.set(`${i + 1}${j - 2}`, board[i + 1][j - 2] === "" || (board[i + 1][j - 2] in enemylist))
            }
        }
        if (data === "B" || data === "b" || data === "Q" || data === "q") {
            let k = i
            let l = j
            for (let c = 0; c < 4; c++) {
                k = i
                l = j
                while (validPosList.current.has(`${k}${l}`)) {
                    validPosList.current.set(`${k}${l}`, board[k][l] === "" || (board[k][l] in enemylist))
                    if (k !== i && l !== j && board[k][l] !== "") {
                        if (board[k][l] in enemylist) {
                            underAttack.current.set(`${k}${l}`, board[k][l] in enemylist)
                        }
                        break;
                    }
                    if (c === 0) {
                        k += 1
                        l += 1
                    }
                    if (c === 1) {
                        k -= 1
                        l -= 1
                    }
                    if (c === 2) {
                        k += 1
                        l -= 1
                    }
                    if (c === 3) {
                        k -= 1
                        l += 1
                    }
                }
            }
        }
        if (data === "R" || data === "r" || data === "Q" || data === "q") {
            let k = i
            let l = j
            for (let c = 0; c < 4; c++) {
                k = i
                l = j
                if (c === 0) {
                    k += 1
                }
                if (c === 1) {
                    k -= 1
                }
                if (c === 2) {
                    l -= 1
                }
                if (c === 3) {
                    l += 1
                }
                while (validPosList.current.has(`${k}${l}`)) {
                    validPosList.current.set(`${k}${l}`, board[k][l] === "" || (board[k][l] in enemylist))
                    if (board[k][l] !== "") {
                        if (board[k][l] in enemylist) {
                            underAttack.current.set(`${k}${l}`, board[k][l] in enemylist)
                        }
                        break
                    }
                    if (c === 0) {
                        k += 1
                    }
                    if (c === 1) {
                        k -= 1
                    }
                    if (c === 2) {
                        l -= 1
                    }
                    if (c === 3) {
                        l += 1
                    }
                }
            }
        }
    }
    return (
        <div className={`chess-board ${starting === 'b' && "rotate"}`}>
            {board.map((row, rowIndex) => {
                let a: any[] = []
                {
                    row.map((piece, colIndex) => (
                        a.push(
                            <div
                                onClick={() => { selectionMode(piece, rowIndex, colIndex) }}
                                key={colIndex}
                                className={`board-cell ${((rowIndex + colIndex) % 2 === 0) ? 'light' : 'dark'}`}>
                                <div
                                    className={`${((String(selectedPos[1]) + selectedPos[2] === String(rowIndex) + colIndex) ||
                                        validPosList.current && validPosList.current.get(String(rowIndex) + colIndex))
                                        && `${validPosList.current.get(String(rowIndex) + colIndex) ? "validPos" : "selected"}`
                                        }`}>
                                    <div className={`${starting === 'b' && "rotate"} ${underAttack.current && (underAttack.current.get(String(rowIndex) + colIndex) && "enemyInRange")}`}>
                                        {piece in black ? black[piece] : white[piece]}
                                    </div>
                                </div>
                            </div>
                        )
                    ))
                }
                return a
            }
            )}
        </div>
    );
};

export default ChessBoard;
