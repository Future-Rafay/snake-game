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
  return (
    <main className="flex flex-col min-h-screen p-4 justify-center items-center">
      {gameStarted ? (
        <>
          <div className="flex items-center justify-between w-full max-w-md mb-4">
            <p className="text-lg font-bold">Difficulty: {difficulty}</p>
          </div>
          <SnakeGrid 
            speed={speed} />
        </>
      ) : (
        <StartMenu onStartGame={handleStartGame} />
      )}
    </main>
  );
}

