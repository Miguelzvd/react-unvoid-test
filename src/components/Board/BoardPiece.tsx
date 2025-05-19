import React from "react";

interface BoardPieceProps {
  type: "developer" | "designer" | "product_owner";
  color: "white" | "black";
}

export const BoardPiece: React.FC<BoardPieceProps> = ({ type, color }) => {
  const getPieceImage = () => {
    return `/chess/${color}/${type}.png`;
  };

  return (
    <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-14 md:h-14 z-10 relative">
      <img
        src={getPieceImage()}
        alt={`${color} ${type}`}
        className="w-full h-full object-contain"
      />
    </div>
  );
};
