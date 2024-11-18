"use client";

import { useEffect, useRef, useState } from "react";
import SnakeGrid from "@/components/SnakeGrid";
import StartMenu from "@/components/StartMenu"; 

export default function Home() {
  const [gameStarted, setGameStarted] = useState(false);
  const gridRef = useRef(null);

  const handleStartGame = () => {
    setGameStarted(true); 
  };

  useEffect(() => {
    if (gameStarted && gridRef.current) {
      gridRef.current.focus(); // Focus the grid element
    }
  }, [gameStarted]);


  return (
    <main className="flex flex-col min-h-screen p-4 justify-center items-center">
      {gameStarted ? (
        <SnakeGrid gridRef={gridRef} /> 
      ) : (
        <StartMenu onStartGame={handleStartGame} />
      )}
    </main>
    );
  }