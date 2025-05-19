import React from "react";
import { BoardRow } from "./BoardRow";

interface BoardProps {
  rows: number;
  cols: number;
}

export const Board: React.FC<BoardProps> = ({ rows, cols }) => {
  if (rows < 6 || rows > 12 || cols < 6 || cols > 12) {
    return (
      <div className="text-red-500">
        Dimensões do tabuleiro inválidas. Use valores entre 6 e 12.
      </div>
    );
  }

  const renderBoard = () => {
    const boardRows = [];
    for (let i = 0; i < rows; i++) {
      boardRows.push(<BoardRow key={i} rowIndex={i} cols={cols} />);
    }
    return boardRows;
  };

  return (
    <div className="flex items-center justify-center min-h-screen ">
      <div className="container mx-auto p-4  rounded-lg overflow-hidden">
        {renderBoard()}
      </div>
    </div>
  );
};
