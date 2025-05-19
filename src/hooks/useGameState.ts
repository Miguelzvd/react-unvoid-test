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
  captured?: Position;
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
        const directions = [
          [1, 0],
          [-1, 0],
          [0, 1],
          [0, -1],
          [1, 1],
          [1, -1],
          [-1, 1],
          [-1, -1],
        ];

        directions.forEach(([dx, dy]) => {
          for (let step = 1; step <= 3; step++) {
            const newRow = row + dx * step;
            const newCol = col + dy * step;

            if (newRow < 0 || newRow >= rows || newCol < 0 || newCol >= cols)
              break;

            const targetKey = `${newRow}-${newCol}`;
            const target = boardState[targetKey];

            if (!target) {
              moves.push({ row: newRow, col: newCol });
            } else if (target.color !== color) {
              const jumpRow = newRow + dx;
              const jumpCol = newCol + dy;
              const jumpKey = `${jumpRow}-${jumpCol}`;

              if (
                jumpRow >= 0 &&
                jumpRow < rows &&
                jumpCol >= 0 &&
                jumpCol < cols &&
                !boardState[jumpKey]
              ) {
                moves.push({
                  row: jumpRow,
                  col: jumpCol,
                  captured: { row: newRow, col: newCol },
                });
              }
              break;
            } else {
              break;
            }
          }
        });
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
            if (!targetPiece || targetPiece.color !== color) {
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
              if (!targetPiece || targetPiece.color !== color) {
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
    const pieceAtClickedPosition =
      boardState[`${row}-${col}`] || getInitialPosition(row, col);

    if (selectedPiece) {
      const move = possibleMoves.find((m) => m.row === row && m.col === col);

      if (move) {
        const newBoardState = { ...boardState };
        const fromKey = `${selectedPiece.row}-${selectedPiece.col}`;
        const toKey = `${row}-${col}`;
        const pieceToMove =
          newBoardState[fromKey] ||
          getInitialPosition(selectedPiece.row, selectedPiece.col);

        if (pieceToMove) {
          if (move.captured) {
            const capturedKey = `${move.captured.row}-${move.captured.col}`;
            delete newBoardState[capturedKey];
          } else if (
            newBoardState[toKey] &&
            newBoardState[toKey].color !== pieceToMove.color
          ) {
            delete newBoardState[toKey];
          }

          delete newBoardState[fromKey];
          newBoardState[toKey] = pieceToMove;
          setBoardState(newBoardState);
          setCurrentTurn(currentTurn === "white" ? "black" : "white");
        }
      }

      setSelectedPiece(null);
      setPossibleMoves([]);
    } else if (
      pieceAtClickedPosition &&
      pieceAtClickedPosition.color === currentTurn
    ) {
      setSelectedPiece({ row, col });
      const moves = getPossibleMoves(row, col, pieceAtClickedPosition);
      setPossibleMoves(moves);
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
