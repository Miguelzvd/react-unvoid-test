import React, { useState, useEffect } from "react";
import { BoardRow } from "./BoardRow";
import { useGameState } from "../../hooks/useGameState";

interface BoardProps {
  rows: number;
  cols: number;
  onSquareClick?: (row: number, col: number) => void;
  className?: string;
}

export const Board: React.FC<BoardProps> = ({ rows, cols, className = "" }) => {
  const {
    selectedPiece,
    possibleMoves,
    currentTurn,
    boardState,
    handlePieceClick,
    winner,
  } = useGameState(rows, cols);

  if (rows < 6 || rows > 12 || cols < 6 || cols > 12) {
    return (
      <div className="text-red-500">
        Invalid board dimensions. Use values between 6 and 12.
      </div>
    );
  }

  return (
    <div
      className={`flex flex-col items-center justify-center min-h-screen ${className}`}
    >
      <div className="mb-4 text-xl font-bold text-white">
        {winner
          ? `Winner: ${winner === "white" ? "White" : "Black"}`
          : `Current turn: ${currentTurn === "white" ? "White" : "Black"}`}
      </div>
      <div className="w-full max-w-[90vmin] aspect-square p-4 rounded-lg overflow-hidden">
        <div
          className="w-full h-full grid"
          style={{ gridTemplateRows: `repeat(${rows}, 1fr)` }}
        >
          {Array.from({ length: rows }, (_, rowIndex) => (
            <div key={rowIndex} className="flex">
              <BoardRow
                rowIndex={rowIndex}
                cols={cols}
                boardState={boardState}
                selectedPiece={selectedPiece}
                possibleMoves={possibleMoves}
                handlePieceClick={handlePieceClick}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
