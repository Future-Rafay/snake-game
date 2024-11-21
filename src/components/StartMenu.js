import React, { useState } from 'react';

const StartMenu = ({ onStartGame }) => {
    const [difficulty, setDifficulty] = useState("easy");
    // localStorage.clear();   

    const handleStartClick = () => {
        onStartGame(difficulty);
    };

    return (
        <div
            className="flex flex-col items-center justify-center h-screen w-full bg-cover bg-center"
            style={{ backgroundImage: "url('/images/bg-snake-game.png')" }}
        >
            <h1 className="text-white text-4xl xs:text-5xl font-bold mb-4 animate-bounce">Snake Game</h1>
            <p className="text-lg 3xs:text-center 3xs:text-sm text-white sm:text-xl font-semibold mb-8 animate-pulse">Use the arrow keys or WASD to move the snake</p>

            <button
                className="text-sm 3xs:px-4 3xs:py-2 sm:px-6 sm:py-3 sm:text-xl text-white bg-blue-500 rounded-lg shadow-md hover:bg-green-600 transition duration-300"
                onClick={handleStartClick}
            >
                Start Game  
            </button>

            <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="mt-4 text-sm 3xs:px-4 3xs:py-2 sm:px-6 sm:py-3  sm:text-xl text-white bg-yellow-500 rounded-lg shadow-md hover:bg-green-600 transition duration-300"
            >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
            </select>
        </div>
    );
};

export default StartMenu;


