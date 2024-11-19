"use client";

import { useState } from "react";
import SnakeGrid from "@/components/SnakeGrid";
import StartMenu from "@/components/StartMenu";

export default function Home() {

  const [gameStarted, setGameStarted] = useState(false);
  const [difficulty, setDifficulty] = useState("easy");
  const [speed, setSpeed] = useState(200);

  const handleStartGame = (selectedDifficulty) => {

    setGameStarted(true);
    setDifficulty(selectedDifficulty);

    if (selectedDifficulty === "easy") {
      setSpeed(200);
    } else if (selectedDifficulty === "medium") {
      setSpeed(150);
    } else if (selectedDifficulty === "hard") {
      setSpeed(100);
    }
  };

  const handleMainMenuClick = () =>{
    setGameStarted(false);
  }

  return (
    <>
      {gameStarted ? (
        <main>
          <SnakeGrid
          onMainMenu={handleMainMenuClick}
            speed={speed} />
        </main>
      ) : (
        <StartMenu onStartGame={handleStartGame} />
      )}
    </>
  );
}

