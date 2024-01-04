# Chess Board React Component

## Overview

This is a React component that provides a customizable and interactive chess board for your web application. You can easily integrate this component into your React project and use it to create a chess-playing interface.

## Usage

```jsx
import React, { useState } from 'react';
import ChessBoard from './ChessBoard'; // Import the ChessBoard component

const App = () => {
  const [data, setData] = useState([
    ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
    ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
    ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'],
  ]);

  // Callback function to receive updated board data
  const getData = (updatedData) => {
    console.log('Updated Board Data:', updatedData);
  };
  const getHistory = (updatedData) => {
    console.log('Updated Board Data:', updatedData);
  };

  return (
    <ChessBoard
      boardSide='b' // 'b' for black, 'w' for white
      setBoardData={data}
      getBoardData={(data) => {
        getData(data);
      }}
      history={(data) => {
        getHistory(data);
      }}
    />
  );
};

export default App;
```
## Features

- **Interactive Interface**: Click on chess pieces to select and move them on the board.
- **Piece Movement Validation**: The component validates legal moves based on the rules of chess.
- **Visual Feedback**: Highlights selected pieces and valid move positions.
- **Support for White and Black Side**: Specify whether the board should start with the white or black side facing the user.
- **History**: history support

## Usage

Props
- **boardSide (optional)**: Specifies whether the board should start with the white ("w") or black ("b") side facing the user. Default is white.
- **setBoardData**: Provides the initial configuration of the chess board. It should be a 2D array representing the pieces on the board.
- **getBoardData**: Callback function that receives the updated board data whenever a move is made. You can use this function to track the state of the chess board.