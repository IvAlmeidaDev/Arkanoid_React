// GameCanvas.jsx
import { useEffect, useRef } from "react";
import { createGame } from "../game/initgame";

export default function GameCanvas({ onExit, setHudData, onVictory, onGameOver }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const game = createGame(canvas, { onExit, setHudData, onVictory, onGameOver });
    game.start();

    return () => game.destroy();
  }, []);

  return (
  <div className="game-wrapper">
    <canvas
      ref={canvasRef}
      width={800}
      height={600}
      className="game-canvas"
    />
  </div>
);
}