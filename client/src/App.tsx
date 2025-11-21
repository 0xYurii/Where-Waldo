import React, { useState } from "react";
import "./App.css";

function App() {
  const [clickData, setClickData] = useState<{ x: number; y: number } | null>(
    null,
  );

  const handleImageClick = (e: React.MouseEvent<HTMLImageElement>) => {
    const img = e.currentTarget;

    const pixelX = e.nativeEvent.offsetX;
    const pixelY = e.nativeEvent.offsetY;

    const width = img.width;
    const height = img.height;

    const percentX = (pixelX / width) * 100;
    const percentY = (pixelY / height) * 100;

    console.log(
      `CLICKED! X: ${percentX.toFixed(2)}%, Y: ${percentY.toFixed(2)}%`,
    );

    setClickData({ x: percentX, y: percentY });
  };

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h1>Where's Brian?</h1>

      <div style={{ position: "relative", display: "inline-block" }}>
        <img
          src="../public/game-map.jpeg"
          alt="Game Map"
          onClick={handleImageClick}
          style={{
            cursor: "crosshair",
            maxWidth: "100%",
            border: "2px solid white",
          }}
        />

        {clickData && (
          <div
            style={{
              position: "absolute",
              left: `${clickData.x}%`,
              top: `${clickData.y}%`,
              width: "20px",
              height: "20px",
              border: "2px solid red",
              borderRadius: "50%",
              transform: "translate(-50%, -50%)",
              pointerEvents: "none",
            }}
          />
        )}
      </div>

      {clickData && (
        <div style={{ marginTop: "10px", fontFamily: "monospace" }}>
          Last Click: X: {clickData.x.toFixed(4)}%, Y: {clickData.y.toFixed(4)}%
        </div>
      )}
    </div>
  );
}

export default App;
