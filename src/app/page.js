"use client";

import { useEffect, useRef, useState } from "react";
import SnakeGrid from "@/components/SnakeGrid";
import StartMenu from "@/components/StartMenu"; 

export default function Home() {
  const [gameStarted, setGameStarted] = useState(false);

  const handleStartGame = () => {
    setGameStarted(true); 
  };

  return (
    <main className="flex flex-col min-h-screen p-4 justify-center items-center">
      {gameStarted ? (
        <SnakeGrid /> 
      ) : (
        <StartMenu onStartGame={handleStartGame} />
      )}
    </main>
    );
  } 