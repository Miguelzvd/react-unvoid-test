"use client";

import { Button } from "@/components/Button";
import { Board } from "@/components/Board";
import { useState } from "react";

export default function Home() {
  const [rows, setRows] = useState(6);
  const [cols, setCols] = useState(6);
  const [showBoard, setShowBoard] = useState(false);

  const handlePlayClick = () => {
    if (rows >= 6 && rows <= 12 && cols >= 6 && cols <= 12) {
      setShowBoard(true);
    } else {
      alert("Dimensões inválidas. Use valores entre 6 e 12.");
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-[#100F11]">
      <Board rows={rows} cols={cols} />
    </div>
  );
}
