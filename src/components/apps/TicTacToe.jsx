import React, { useState } from 'react';

const Square = ({ value, onClick }) => (
  <button
    className="w-full aspect-square bg-gray-100 border-2 border-gray-300 rounded-lg flex items-center justify-center text-4xl font-bold text-gray-900 transition-colors duration-200 hover:bg-gray-200"
    onClick={onClick}
  >
    {value}
  </button>
);


const TicTacToe = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const winner = calculateWinner(board);
  const isDraw = !winner && board.every(square => square !== null);

  const handleClick = (i) => {
    if (winner || board[i]) {
      return;
    }

    const newBoard = board.slice();
    newBoard[i] = isXNext ? 'X' : 'O';

    setBoard(newBoard);
    setIsXNext(!isXNext);
  };

  const handleReset = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
  };

  let status;
  if (winner) {
    status = `Winner: ${winner}`;
  } else if (isDraw) {
    status = 'It\'s a Draw!';
  } else {
    status = `Next player: ${isXNext ? 'X' : 'O'}`;
  }

  return (
    <div className="w-full h-full bg-white p-6 flex flex-col items-center">
      <div className="flex-shrink-0 text-center mb-4">
        <h2 className="text-3xl font-bold text-gray-900">Tic Tac Toe</h2>
        <div className="text-xl text-gray-700 mt-2">{status}</div>
      </div>

      <div className="flex-grow w-full flex items-center justify-center">
        <div className="w-full max-w-sm">
            <div className="grid grid-cols-3 gap-3">
                {board.map((value, i) => (
                <Square key={i} value={value} onClick={() => handleClick(i)} />
                ))}
            </div>
        </div>
      </div>

      <div className="flex-shrink-0 mt-4">
        <button
            onClick={handleReset}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-200"
        >
            Reset Game
        </button>
      </div>
    </div>
  );
};

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

export default TicTacToe;
