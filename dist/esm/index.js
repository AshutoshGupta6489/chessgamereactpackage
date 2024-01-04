import React, { useRef, useState, useEffect } from 'react';

function styleInject(css, ref) {
  if ( ref === void 0 ) ref = {};
  var insertAt = ref.insertAt;

  if (!css || typeof document === 'undefined') { return; }

  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';

  if (insertAt === 'top') {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }

  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}

var css_248z = "/* ChessBoard.css */\n\nbody,\nhtml {\n    height: 100%;\n    margin: 0;\n}\n\n.chess-board {\n    display: grid;\n    grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;\n    grid-template-rows: 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;\n    height: 100%;\n}\n\n.board-row {\n    display: flex;\n}\n\n.rotate {\n    rotate: 180deg;\n}\n\n.selected {\n    width: 100%;\n    height: 100%;\n    background-color: rgb(60, 82, 38);\n    display: flex;\n    align-items: center;\n    justify-content: center;\n}\n\n.validPos {\n    background-color: rgb(93 126 58 / 61%);\n    width: 100%;\n    height: 100%;\n    display: flex;\n    align-items: center;\n    justify-content: center;\n}\n\n.enemyInRange {\n    background-color: rgb(255 0 0 / 62%);\n    width: 100%;\n    height: 100%;\n    display: flex;\n    align-items: center;\n    justify-content: center;\n}\n\n.board-cell {\n    width: 100%;\n    height: 100%;\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    font-size: 6vw;\n    font-weight: 900;\n}\n\n.light {\n    background-color: #f0d9b5;\n}\n\n.dark {\n    background-color: #b58863;\n}";
styleInject(css_248z);

const chessboardinit = [
    ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
    ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
    ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'],
];
const ChessBoard = ({ boardSide = "w", setBoardData = chessboardinit, getBoardData = (data) => { }, history = (data) => { } }) => {
    const moveshistory = useRef([]);
    const [clickCount, setClickCount] = useState(1);
    const [selectedPos, setSelectedPos] = useState(["", -1, -1]);
    const [starting, setStarting] = useState("");
    const validPosList = useRef();
    const underAttack = useRef();
    const resetPostion = useRef();
    const black = { 'P': `♙`, 'R': `♖`, 'N': `♘`, 'B': `♗`, 'Q': `♕`, 'K': `♔` };
    const white = { 'p': `♟`, 'r': `♜`, 'n': `♞`, 'b': `♝`, 'q': `♛`, 'k': `♚` };
    const [board, setBoard] = useState(setBoardData);
    useEffect(() => {
        const chessboardCoordinates = generateChessboardCoordinates();
        validPosList.current = chessboardCoordinates;
        underAttack.current = new Map(chessboardCoordinates);
        resetPostion.current = new Map(chessboardCoordinates);
        setStarting(boardSide);
    }, []);
    useEffect(() => {
        setBoard(setBoardData);
    }, [setBoardData]);
    const generateChessboardCoordinates = () => {
        const coordinates = new Map();
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const coordinate = `${row}${col}`;
                coordinates.set(coordinate, false);
            }
        }
        return coordinates;
    };
    function selectionMode(piece, rowIndex, colIndex) {
        let check = piece || clickCount !== 1;
        if (check) {
            if (clickCount === 1) {
                setSelectedPos([piece, rowIndex, colIndex]);
                validPos(piece, rowIndex, colIndex);
                setClickCount(2);
            }
            else {
                updateBoard(piece, rowIndex, colIndex);
            }
        }
    }
    function updateBoard(data, i, j) {
        let enemylist = selectedPos[0] in black ? white : black;
        setClickCount(1);
        if (validPosList.current.get(`${i}${j}`)) {
            setBoard(oldBoard => {
                oldBoard[selectedPos[1]][selectedPos[2]] = data in enemylist ? "" : data;
                oldBoard[i][j] = selectedPos[0];
                return oldBoard;
            });
            moveshistory.current.push(JSON.parse(JSON.stringify(board)));
            getBoardData(board);
            history(moveshistory.current);
        }
        setSelectedPos(["", -1, -1]);
        validPosList.current = new Map(resetPostion.current);
        underAttack.current = new Map(resetPostion.current);
    }
    function validPos(data, i, j) {
        let enemylist = data in black ? white : black;
        if (data === "p" || data === "P") {
            if (data === "P") {
                if (validPosList.current.has(`${i - 1}${j}`)) {
                    validPosList.current.set(`${i - 1}${j}`, board[i - 1][j] === "");
                }
                if (i === 6 && validPosList.current.has(`${i - 2}${j}`)) {
                    if (validPosList.current.get(`${i - 1}${j}`)) {
                        validPosList.current.set(`${i - 2}${j}`, board[i - 2][j] === "");
                    }
                }
                if (validPosList.current.has(`${i - 1}${j - 1}`)) {
                    validPosList.current.set(`${i - 1}${j - 1}`, board[i - 1][j - 1] in enemylist);
                    underAttack.current.set(`${i - 1}${j - 1}`, board[i - 1][j - 1] in enemylist);
                }
                if (validPosList.current.has(`${i - 1}${j + 1}`)) {
                    validPosList.current.set(`${i - 1}${j + 1}`, board[i - 1][j + 1] in enemylist);
                    underAttack.current.set(`${i - 1}${j + 1}`, board[i - 1][j + 1] in enemylist);
                }
            }
            else {
                if (validPosList.current.has(`${i + 1}${j}`)) {
                    validPosList.current.set(`${i + 1}${j}`, board[i + 1][j] === "");
                }
                if (i === 1 && validPosList.current.has(`${i + 2}${j}`)) {
                    if (validPosList.current.get(`${i + 1}${j}`)) {
                        validPosList.current.set(`${i + 2}${j}`, board[i + 2][j] === "");
                    }
                }
                if (validPosList.current.has(`${i + 1}${j - 1}`)) {
                    validPosList.current.set(`${i + 1}${j - 1}`, board[i + 1][j - 1] in enemylist);
                    underAttack.current.set(`${i + 1}${j - 1}`, board[i + 1][j - 1] in enemylist);
                }
                if (validPosList.current.has(`${i + 1}${j + 1}`)) {
                    validPosList.current.set(`${i + 1}${j + 1}`, board[i + 1][j + 1] in enemylist);
                    underAttack.current.set(`${i + 1}${j + 1}`, board[i + 1][j + 1] in enemylist);
                }
            }
        }
        if (data === "K" || data === "k") {
            if (validPosList.current.has(`${i - 1}${j}`)) {
                underAttack.current.set(`${i - 1}${j}`, board[i - 1][j] in enemylist);
                validPosList.current.set(`${i - 1}${j}`, board[i - 1][j] === "" || (board[i - 1][j] in enemylist));
            }
            if (validPosList.current.has(`${i + 1}${j}`)) {
                underAttack.current.set(`${i + 1}${j}`, board[i + 1][j] in enemylist);
                validPosList.current.set(`${i + 1}${j}`, board[i + 1][j] === "" || (board[i + 1][j] in enemylist));
            }
            if (validPosList.current.has(`${i}${j + 1}`)) {
                underAttack.current.set(`${i}${j + 1}`, board[i][j + 1] in enemylist);
                validPosList.current.set(`${i}${j + 1}`, board[i][j + 1] === "" || (board[i][j + 1] in enemylist));
            }
            if (validPosList.current.has(`${i}${j - 1}`)) {
                underAttack.current.set(`${i}${j - 1}`, board[i][j - 1] in enemylist);
                validPosList.current.set(`${i}${j - 1}`, board[i][j - 1] === "" || (board[i][j - 1] in enemylist));
            }
            if (validPosList.current.has(`${i - 1}${j - 1}`)) {
                underAttack.current.set(`${i - 1}${j - 1}`, board[i - 1][j - 1] in enemylist);
                validPosList.current.set(`${i - 1}${j - 1}`, board[i - 1][j - 1] === "" || (board[i - 1][j - 1] in enemylist));
            }
            if (validPosList.current.has(`${i + 1}${j + 1}`)) {
                underAttack.current.set(`${i + 1}${j + 1}`, board[i + 1][j + 1] in enemylist);
                validPosList.current.set(`${i + 1}${j + 1}`, board[i + 1][j + 1] === "" || (board[i + 1][j + 1] in enemylist));
            }
            if (validPosList.current.has(`${i - 1}${j + 1}`)) {
                underAttack.current.set(`${i - 1}${j + 1}`, board[i - 1][j + 1] in enemylist);
                validPosList.current.set(`${i - 1}${j + 1}`, board[i - 1][j + 1] === "" || (board[i - 1][j + 1] in enemylist));
            }
            if (validPosList.current.has(`${i + 1}${j - 1}`)) {
                underAttack.current.set(`${i + 1}${j - 1}`, board[i + 1][j - 1] in enemylist);
                validPosList.current.set(`${i + 1}${j - 1}`, board[i + 1][j - 1] === "" || (board[i + 1][j - 1] in enemylist));
            }
        }
        if (data === "N" || data === "n") {
            if (validPosList.current.has(`${i + 2}${j + 1}`)) {
                underAttack.current.set(`${i + 2}${j + 1}`, board[i + 2][j + 1] in enemylist);
                validPosList.current.set(`${i + 2}${j + 1}`, board[i + 2][j + 1] === "" || (board[i + 2][j + 1] in enemylist));
            }
            if (validPosList.current.has(`${i + 2}${j - 1}`)) {
                underAttack.current.set(`${i + 2}${j - 1}`, board[i + 2][j - 1] in enemylist);
                validPosList.current.set(`${i + 2}${j - 1}`, board[i + 2][j - 1] === "" || (board[i + 2][j - 1] in enemylist));
            }
            if (validPosList.current.has(`${i - 2}${j - 1}`)) {
                underAttack.current.set(`${i - 2}${j - 1}`, board[i - 2][j - 1] in enemylist);
                validPosList.current.set(`${i - 2}${j - 1}`, board[i - 2][j - 1] === "" || (board[i - 2][j - 1] in enemylist));
            }
            if (validPosList.current.has(`${i - 2}${j + 1}`)) {
                underAttack.current.set(`${i - 2}${j + 1}`, board[i - 2][j + 1] in enemylist);
                validPosList.current.set(`${i - 2}${j + 1}`, board[i - 2][j + 1] === "" || (board[i - 2][j + 1] in enemylist));
            }
            if (validPosList.current.has(`${i + 1}${j + 2}`)) {
                underAttack.current.set(`${i + 1}${j + 2}`, board[i + 1][j + 2] in enemylist);
                validPosList.current.set(`${i + 1}${j + 2}`, board[i + 1][j + 2] === "" || (board[i + 1][j + 2] in enemylist));
            }
            if (validPosList.current.has(`${i - 1}${j + 2}`)) {
                underAttack.current.set(`${i - 1}${j + 2}`, board[i - 1][j + 2] in enemylist);
                validPosList.current.set(`${i - 1}${j + 2}`, board[i - 1][j + 2] === "" || (board[i - 1][j + 2] in enemylist));
            }
            if (validPosList.current.has(`${i - 1}${j - 2}`)) {
                underAttack.current.set(`${i - 1}${j - 2}`, board[i - 1][j - 2] in enemylist);
                validPosList.current.set(`${i - 1}${j - 2}`, board[i - 1][j - 2] === "" || (board[i - 1][j - 2] in enemylist));
            }
            if (validPosList.current.has(`${i + 1}${j - 2}`)) {
                underAttack.current.set(`${i + 1}${j - 2}`, board[i + 1][j - 2] in enemylist);
                validPosList.current.set(`${i + 1}${j - 2}`, board[i + 1][j - 2] === "" || (board[i + 1][j - 2] in enemylist));
            }
        }
        if (data === "B" || data === "b" || data === "Q" || data === "q") {
            let k = i;
            let l = j;
            for (let c = 0; c < 4; c++) {
                k = i;
                l = j;
                while (validPosList.current.has(`${k}${l}`)) {
                    validPosList.current.set(`${k}${l}`, board[k][l] === "" || (board[k][l] in enemylist));
                    if (k !== i && l !== j && board[k][l] !== "") {
                        if (board[k][l] in enemylist) {
                            underAttack.current.set(`${k}${l}`, board[k][l] in enemylist);
                        }
                        break;
                    }
                    if (c === 0) {
                        k += 1;
                        l += 1;
                    }
                    if (c === 1) {
                        k -= 1;
                        l -= 1;
                    }
                    if (c === 2) {
                        k += 1;
                        l -= 1;
                    }
                    if (c === 3) {
                        k -= 1;
                        l += 1;
                    }
                }
            }
        }
        if (data === "R" || data === "r" || data === "Q" || data === "q") {
            let k = i;
            let l = j;
            for (let c = 0; c < 4; c++) {
                k = i;
                l = j;
                if (c === 0) {
                    k += 1;
                }
                if (c === 1) {
                    k -= 1;
                }
                if (c === 2) {
                    l -= 1;
                }
                if (c === 3) {
                    l += 1;
                }
                while (validPosList.current.has(`${k}${l}`)) {
                    validPosList.current.set(`${k}${l}`, board[k][l] === "" || (board[k][l] in enemylist));
                    if (board[k][l] !== "") {
                        if (board[k][l] in enemylist) {
                            underAttack.current.set(`${k}${l}`, board[k][l] in enemylist);
                        }
                        break;
                    }
                    if (c === 0) {
                        k += 1;
                    }
                    if (c === 1) {
                        k -= 1;
                    }
                    if (c === 2) {
                        l -= 1;
                    }
                    if (c === 3) {
                        l += 1;
                    }
                }
            }
        }
    }
    return (React.createElement("div", { className: `chess-board ${starting === 'b' && "rotate"}` }, board.map((row, rowIndex) => {
        let a = [];
        {
            row.map((piece, colIndex) => (a.push(React.createElement("div", { onClick: () => { selectionMode(piece, rowIndex, colIndex); }, key: colIndex, className: `board-cell ${((rowIndex + colIndex) % 2 === 0) ? 'light' : 'dark'}` },
                React.createElement("div", { className: `${((String(selectedPos[1]) + selectedPos[2] === String(rowIndex) + colIndex) ||
                        validPosList.current && validPosList.current.get(String(rowIndex) + colIndex))
                        && `${validPosList.current.get(String(rowIndex) + colIndex) ? "validPos" : "selected"}`}` },
                    React.createElement("div", { className: `${starting === 'b' && "rotate"} ${underAttack.current && (underAttack.current.get(String(rowIndex) + colIndex) && "enemyInRange")}` }, piece in black ? black[piece] : white[piece]))))));
        }
        return a;
    })));
};

export { ChessBoard };
//# sourceMappingURL=index.js.map
