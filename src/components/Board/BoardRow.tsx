import { BoardPiece } from "./BoardPiece";
import { BoardTile } from "./BoardTile";

interface BoardRowProps {
  rowIndex: number;
  cols: number;
}

interface PiecePosition {
  type: "developer" | "designer" | "product_owner";
  color: "white" | "black";
}

export const BoardRow: React.FC<BoardRowProps> = ({ rowIndex, cols }) => {
  const getPieceAtPosition = (
    row: number,
    col: number
  ): PiecePosition | null => {
    if (row === 0) {
      if (col === 0) return { type: "designer", color: "black" };
      if (col === 1) return { type: "developer", color: "black" };
      if (col === 2) return { type: "product_owner", color: "black" };
    }

    if (row === 5) {
      if (col === 0) return { type: "product_owner", color: "white" };
      if (col === 1) return { type: "developer", color: "white" };
      if (col === 2) return { type: "designer", color: "white" };
    }

    return null;
  };

  const squares = [];
  for (let j = 0; j < cols; j++) {
    const piece = getPieceAtPosition(rowIndex, j);
    squares.push(
      <BoardTile key={`${rowIndex}-${j}`} row={rowIndex} col={j}>
        {piece && <BoardPiece type={piece.type} color={piece.color} />}
      </BoardTile>
    );
  }

  return <div className="flex">{squares}</div>;
};
