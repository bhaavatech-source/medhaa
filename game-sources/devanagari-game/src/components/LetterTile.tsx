import React from "react";
import { speak } from "../speech";

type LetterTileProps = {
  char: string;
  label: string;
  sublabel?: string;
  size?: "normal" | "large";
};

const LetterTile: React.FC<LetterTileProps> = ({
  char, label, sublabel, size = "normal"
}) => {
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData("text/plain", char);
    e.dataTransfer.effectAllowed = "move";
    speak(char);  // ← speak when dragged
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onClick={() => speak(char)}  // ← speak when clicked too
      className={`letter-tile ${size === "large" ? "letter-tile-large" : ""}`}
      title="🔊 Click or drag to hear"
    >
      <span className="letter-char">{label}</span>
      {sublabel && <span className="letter-roman">{sublabel}</span>}
    </div>
  );
};

export default LetterTile;