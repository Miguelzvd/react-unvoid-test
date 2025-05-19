import React from "react";

interface BoardTileProps {
  row: number;
  col: number;
  children?: React.ReactNode;
  isSelected?: boolean;
  isPossibleMove?: boolean;
  onClick?: () => void;
}

export const BoardTile: React.FC<BoardTileProps> = ({
  row,
  col,
  children,
  isSelected = false,
  isPossibleMove = false,
  onClick,
}) => {
  const isLight = (row + col) % 2 === 0;
  const bgColor = isLight
    ? "bg-gradient-to-b from-[rgba(250,250,250,0.6)] to-[rgba(255,255,255,0.3)]"
    : "bg-gradient-to-b from-[rgba(250,250,250,0.15)] to-[rgba(255,255,255,0.05)]";

  const getTileStyle = () => {
    if (isSelected) {
      return "bg-blue-500 bg-opacity-50";
    }
    if (isPossibleMove) {
      return "bg-green-500 bg-opacity-30";
    }
    return bgColor;
  };

  return (
    <div
      className={`w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-22 lg:h-22
        ${getTileStyle()}
        flex items-center justify-center
        transition-all duration-200
        hover:opacity-90
        cursor-pointer`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};
