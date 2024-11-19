import React, { useState } from 'react';

const StartMenu = ({ onStartGame }) => {
    const [difficulty, setDifficulty] = useState("easy");

    const handleStartClick = () => {
        onStartGame(difficulty);
    };

    return (
        <div
            className="flex flex-col items-center justify-center h-screen w-full bg-cover bg-center"
            style={{ backgroundImage: "url('/images/bg-snake-game.png')" }}
        >
            <h1 className="text-white text-5xl font-extrabold mb-4 animate-bounce">Snake Game</h1>
            <p className="text-xl font-semibold mb-8 animate-pulse">Use the arrow keys or WASD to move the snake</p>
            <button
                className="px-6 py-3 text-xl text-white bg-green-500 rounded-lg shadow-md hover:bg-green-600 transition duration-300"

                onClick={handleStartClick}
            >   
                Start Game
            </button>
            <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="mt-4 px-6 py-3 text-xl text-white bg-green-500 rounded-lg shadow-md hover:bg-green-600 transition duration-300"
            >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
            </select>
        </div>
    );
};

export default StartMenu;


