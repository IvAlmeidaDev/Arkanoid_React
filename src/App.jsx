import { useState } from "react";
import HomeScreen from "./components/title";
import GameCanvas from "./components/game-canvas";
import HUD from "./components/hud";
import LaunchOverlay from "./components/launch-overlay"
import PauseButton from "./components/pause-button";
import TouchControls from "./components/touch-controls";
import './App.css';
import './components/title.css';

import VictoryScreen from "./components/victory";
import GameOverScreen from "./components/game_over";

export default function App() {

  const [screen, setScreen] = useState("home");
  
  const [hudData, setHudData] = useState({
    score: 0,
    lives: 3,
    level: 1,
    ballAttached: true,
    paused:false
  });

  const handleExit = () => {
    setScreen("home");
  };

  return (
    <>
      {screen === "home" && (
        <HomeScreen
          onStart={() => setScreen("playing")}
        />
      )}

{screen === "playing" && (
  
<>
    <PauseButton
    paused={hudData.paused}
    onToggle={() => {
      window.dispatchEvent(
        new CustomEvent("togglePause")
      );
    }}
  />


  <div className="game-layout">

    <HUD
      score={hudData.score}
      lives={hudData.lives}
      level={hudData.level}
    />

    <div className="game-container">

      {hudData.ballAttached && (
        <LaunchOverlay />
      )}



      <GameCanvas
        onExit={handleExit}
        setHudData={setHudData}
        onVictory={() => setScreen("victory")}
        onGameOver={() => setScreen("gameover")}
      />

    </div>

    <TouchControls />
    
  </div>

</>
)}

      {screen === "victory" && (
  <VictoryScreen
    score={hudData.score}
    onContinue={() => {
      setScreen("home");
    }}
  />
)}

{screen === "gameover" && (
  <GameOverScreen
    score={hudData.score}
    onRetry={() => {

      setHudData({
        score: 0,
        lives: 3,
        level: 1
      });

      setScreen("playing");
    }}
  />
)}

    </>
  );
}