import { useState } from "react";

export type PieceType = "developer" | "designer" | "product_owner";
export type PieceColor = "white" | "black";

interface Piece {
  type: PieceType;
  color: PieceColor;
}

interface Position {
  row: number;
  col: number;
}

export const useGameState = (rows: number, cols: number) => {
  const [selectedPiece, setSelectedPiece] = useState<Position | null>(null);
  const [possibleMoves, setPossibleMoves] = useState<Position[]>([]);
  const [currentTurn, setCurrentTurn] = useState<PieceColor>("white");
  const [boardState, setBoardState] = useState<Record<string, Piece>>({});

  const getInitialPosition = (row: number, col: number): Piece | null => {
    if (row === 0) {
      if (col === cols - 3) return { type: "designer", color: "black" };
      if (col === cols - 2) return { type: "developer", color: "black" };
      if (col === cols - 1) return { type: "product_owner", color: "black" };
    }

    if (row === 5) {
      if (col === 0) return { type: "product_owner", color: "white" };
      if (col === 1) return { type: "developer", color: "white" };
      if (col === 2) return { type: "designer", color: "white" };
    }

    return null;
  };

  const getPossibleMoves = (
    row: number,
    col: number,
    piece: Piece
  ): Position[] => {
    const moves: Position[] = [];
    const { type, color } = piece;

    switch (type) {
      case "developer":
        for (let i = -3; i <= 3; i++) {
          for (let j = -3; j <= 3; j++) {
            if (i === 0 && j === 0) continue;
            const newRow = row + i;
            const newCol = col + j;
            if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols) {
              const targetPiece = boardState[`${newRow}-${newCol}`];
              if (!targetPiece) {
                moves.push({ row: newRow, col: newCol });
              }
            }
          }
        }
        break;

      case "designer":
        const knightMoves = [
          [-2, -1],
          [-2, 1],
          [-1, -2],
          [-1, 2],
          [1, -2],
          [1, 2],
          [2, -1],
          [2, 1],
        ];
        for (const [i, j] of knightMoves) {
          const newRow = row + i;
          const newCol = col + j;
          if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols) {
            const targetPiece = boardState[`${newRow}-${newCol}`];
            if (!targetPiece) {
              moves.push({ row: newRow, col: newCol });
            }
          }
        }
        break;

      case "product_owner":
        for (let i = -1; i <= 1; i++) {
          for (let j = -1; j <= 1; j++) {
            if (i === 0 && j === 0) continue;
            const newRow = row + i;
            const newCol = col + j;
            if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols) {
              const targetPiece = boardState[`${newRow}-${newCol}`];
              if (!targetPiece) {
                moves.push({ row: newRow, col: newCol });
              }
            }
          }
        }
        break;
    }

    return moves;
  };

  const handlePieceClick = (row: number, col: number) => {
    const piece = boardState[`${row}-${col}`] || getInitialPosition(row, col);

    if (piece && piece.color === currentTurn) {
      setSelectedPiece({ row, col });
      const moves = getPossibleMoves(row, col, piece);
      setPossibleMoves(moves);
    } else if (selectedPiece) {
      const isValidMove = possibleMoves.some(
        (move) => move.row === row && move.col === col
      );

      if (isValidMove) {
        const newBoardState = { ...boardState };
        const pieceKey = `${selectedPiece.row}-${selectedPiece.col}`;
        const piece =
          boardState[pieceKey] ||
          getInitialPosition(selectedPiece.row, selectedPiece.col);

        if (piece) {
          delete newBoardState[pieceKey];
          newBoardState[`${row}-${col}`] = piece;
          setBoardState(newBoardState);
          setCurrentTurn(currentTurn === "white" ? "black" : "white");
        }
      }

      setSelectedPiece(null);
      setPossibleMoves([]);
    }
  };

  return {
    selectedPiece,
    possibleMoves,
    currentTurn,
    boardState,
    handlePieceClick,
    getInitialPosition,
  };
};
