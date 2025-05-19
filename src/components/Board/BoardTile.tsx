import React from "react";

interface BoardTileProps {
  row: number;
  col: number;
  children?: React.ReactNode;
}

export const BoardTile: React.FC<BoardTileProps> = ({ row, col, children }) => {
  const isLight = (row + col) % 2 === 0;
  const bgColor = isLight
    ? "bg-gradient-to-b from-[rgba(250,250,250,0.6)] to-[rgba(255,255,255,0.3)]"
    : "bg-gradient-to-b from-[rgba(250,250,250,0.15)] to-[rgba(255,255,255,0.05)]";

  return (
    <div
      className={`w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-22 lg:h-22 
        ${bgColor}
        flex items-center justify-center
        transition-all duration-200
        hover:opacity-90`}
    >
      {children}
    </div>
  );
};
