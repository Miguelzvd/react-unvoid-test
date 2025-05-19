import { BoardTile } from "./BoardTile";
import { BoardPiece } from "./BoardPiece";
import { PieceType, PieceColor } from "../../hooks/useGameState";

interface Position {
  row: number;
  col: number;
}

interface Piece {
  type: PieceType;
  color: PieceColor;
}

interface BoardRowProps {
  rowIndex: number;
  cols: number;
  boardState: Record<string, Piece>;
  selectedPiece: Position | null;
  possibleMoves: Position[];
  getInitialPosition: (row: number, col: number) => Piece | null;
  handlePieceClick: (row: number, col: number) => void;
}

export const BoardRow: React.FC<BoardRowProps> = ({
  rowIndex,
  cols,
  boardState,
  selectedPiece,
  possibleMoves,
  getInitialPosition,
  handlePieceClick,
}) => {
  const renderTiles = () => {
    const tiles = [];
    for (let colIndex = 0; colIndex < cols; colIndex++) {
      const piece =
        boardState[`${rowIndex}-${colIndex}`] ||
        getInitialPosition(rowIndex, colIndex);
      const isSelected =
        selectedPiece?.row === rowIndex && selectedPiece?.col === colIndex;
      const isPossibleMove = possibleMoves.some(
        (move) => move.row === rowIndex && move.col === colIndex
      );

      tiles.push(
        <BoardTile
          key={`${rowIndex}-${colIndex}`}
          row={rowIndex}
          col={colIndex}
          isSelected={isSelected}
          isPossibleMove={isPossibleMove}
          onClick={() => handlePieceClick(rowIndex, colIndex)}
        >
          {piece && <BoardPiece type={piece.type} color={piece.color} />}
        </BoardTile>
      );
    }
    return tiles;
  };

  return <div className="flex">{renderTiles()}</div>;
};
