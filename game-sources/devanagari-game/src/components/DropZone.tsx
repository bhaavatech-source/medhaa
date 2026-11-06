import React from "react";

type DropZoneProps = {
  expectedChar: string;
  onCorrectDrop: () => void;
  onWrongDrop: () => void;
  feedback: "idle" | "correct" | "wrong";
};

const DropZone: React.FC<DropZoneProps> = ({
  expectedChar,
  onCorrectDrop,
  onWrongDrop,
  feedback
}) => {
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedChar = e.dataTransfer.getData("text/plain");
    if (!droppedChar) return;
    if (droppedChar === expectedChar) {
      onCorrectDrop();
    } else {
      onWrongDrop();
    }
  };

  return (
    <div
      className={`drop-zone drop-zone-${feedback}`}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <p>Drop the correct letter here</p>
      <div className="expected-char-preview">{expectedChar}</div>
    </div>
  );
};

export default DropZone;