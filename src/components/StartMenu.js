import React from 'react';

const StartMenu = ({ onStartGame }) => {
    return (
        <div
            className="flex flex-col items-center justify-center h-screen w-full bg-cover bg-center"
            style={{ backgroundImage: "url('/images/bg-snake-game.png')" }}
        >
            <h1 className="text-white text-5xl mb-4">Snake Game</h1>
            <p className="text-white text-xl mb-8">Use the arrow keys or WASD to move the snake</p>
            <button
                className="px-6 py-3 text-xl text-white bg-green-500 rounded-lg shadow-md hover:bg-green-600 transition duration-300"
                onClick={onStartGame}
            >
                Start Game
            </button>
        </div>
    );
};

export default StartMenu;
