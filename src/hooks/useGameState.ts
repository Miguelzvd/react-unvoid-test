import { useState, useEffect } from "react";

export type PieceType = "developer" | "designer" | "product_owner";
export type PieceColor = "white" | "black";

interface Piece {
  type: PieceType;
  color: PieceColor;
}

export interface Position {
  row: number;
  col: number;
  captured?: Position;
}

export const useGameState = (rows: number, cols: number) => {
  const [selectedPiece, setSelectedPiece] = useState<Position | null>(null);
  const [possibleMoves, setPossibleMoves] = useState<Position[]>([]);
  const [currentTurn, setCurrentTurn] = useState<PieceColor>("white");
  const [boardState, setBoardState] = useState<Record<string, Piece>>({});
  const [winner, setWinner] = useState<PieceColor | null>(null);

  const getInitialPieceAtPosition = (
    row: number,
    col: number,
    rows: number,
    cols: number
  ): Piece | null => {
    const lastRow = rows - 1;

    if (row === 0) {
      if (col === cols - 3) return { type: "designer", color: "black" };
      if (col === cols - 2) return { type: "developer", color: "black" };
      if (col === cols - 1) return { type: "product_owner", color: "black" };
    }

    if (row === lastRow) {
      if (col === 0) return { type: "product_owner", color: "white" };
      if (col === 1) return { type: "developer", color: "white" };
      if (col === 2) return { type: "designer", color: "white" };
    }

    return null;
  };

  useEffect(() => {
    const initialBoardState: Record<string, Piece> = {};
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const piece = getInitialPieceAtPosition(r, c, rows, cols);
        if (piece) {
          initialBoardState[`${r}-${c}`] = piece;
        }
      }
    }
    setBoardState(initialBoardState);
  }, [rows, cols]);

  const checkWinCondition = (
    currentBoardState: Record<string, Piece>,
    lastPlayer: PieceColor
  ) => {
    const opponentColor = lastPlayer === "white" ? "black" : "white";
    const opponentPieces = Object.values(currentBoardState).filter(
      (piece) => piece.color === opponentColor
    );
    if (opponentPieces.length === 0) {
      setWinner(lastPlayer);
    }
  };

  const getPossibleMoves = (
    row: number,
    col: number,
    piece: Piece,
    currentBoardState: Record<string, Piece>
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
            const target = currentBoardState[targetKey];

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
                !currentBoardState[jumpKey]
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
            const targetPiece = currentBoardState[`${newRow}-${newCol}`];
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
              const targetPiece = currentBoardState[`${newRow}-${newCol}`];
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
    if (winner) return; // Prevent moves if game is over

    const pieceAtClickedPosition =
      boardState[`${row}-${col}`] ||
      getInitialPieceAtPosition(row, col, rows, cols);

    if (selectedPiece) {
      const move = possibleMoves.find((m) => m.row === row && m.col === col);

      if (move) {
        const newBoardState = { ...boardState };
        const fromKey = `${selectedPiece.row}-${selectedPiece.col}`;
        const toKey = `${row}-${col}`;
        const pieceToMove =
          newBoardState[fromKey] ||
          getInitialPieceAtPosition(
            selectedPiece.row,
            selectedPiece.col,
            rows,
            cols
          );

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

          const nextTurn = currentTurn === "white" ? "black" : "white";
          setCurrentTurn(nextTurn);
          checkWinCondition(newBoardState, currentTurn); // Check win for the player who just moved
        }
      }

      setSelectedPiece(null);
      setPossibleMoves([]);
    } else if (
      pieceAtClickedPosition &&
      pieceAtClickedPosition.color === currentTurn
    ) {
      setSelectedPiece({ row, col });
      const moves = getPossibleMoves(
        row,
        col,
        pieceAtClickedPosition,
        boardState
      );
      setPossibleMoves(moves);
    }
  };

  return {
    selectedPiece,
    possibleMoves,
    currentTurn,
    boardState,
    handlePieceClick,
    getInitialPieceAtPosition,
    winner,
  };
};
