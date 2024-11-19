"use client";
import { useEffect, useRef, useState } from "react";

const grid_Size = 20;

const eatSound = new Audio('/sounds/eatingApple.mp3');
const gameStartSound = new Audio('/sounds/gameStartSound.mp3')
const gameOverSound = new Audio('/sounds/game-over3.mp3');
const collisionSound = new Audio('/sounds/collisionSound.mp3')

const foodImages = [
    '/images/Apple.png',
    '/images/burgur.png',
    '/images/chicken.png',
    '/images/cookie.png',
    '/images/mango.png',
    '/images/meat.png',
    '/images/mutton.png',
    '/images/tomato.png'
];

const getRandomFoodImage = () => {
    const randomIndex = Math.floor(Math.random() * foodImages.length);
    return foodImages[randomIndex];
};

const SnakeGrid = ({ speed, onMainMenu }) => {

    const [snake, setSnake] = useState([
        { x: 3, y: 1 }, // Head
        { x: 2, y: 1 }, // Body
        { x: 1, y: 1 }, // Body
    ])

    const [food, setFood] = useState({})
    const [foodImage, setFoodImage] = useState(getRandomFoodImage());
    const [direction, setDirection] = useState("RIGHT")
    const [gameOver, setGameOver] = useState(false)
    const [IncreaseSpeed, setIncreaseSpeed] = useState(speed);
    const [speedIncreased, setSpeedIncreased] = useState(false);
    const [score, setScore] = useState(0);
    const [highestScore, setHighestScore] = useState(0);
    const [directionChangeAllowed, setDirectionChangeAllowed] = useState(true);
    const [paused, setPaused] = useState(false); // Paused state
    const intervalRef = useRef(null); // Store the interval ID
    const gameGridRef = useRef(null); // Reference for the grid div

    useEffect(() => {
        if (score > 0 && score % 5 === 0) { // Adjust speed every 10 points
            setIncreaseSpeed((prevSpeed) => Math.max(prevSpeed - 10, 50));
            setSpeedIncreased(true);
            setTimeout(() => setSpeedIncreased(false), 1500);

        }
    }, [score]);

    const generateFood = () => {
        const x = Math.floor(Math.random() * grid_Size);
        const y = Math.floor(Math.random() * grid_Size);
        setFood({ x, y })
        setFoodImage(getRandomFoodImage());
    }

    const resetGame = () => {
        clearInterval(intervalRef.current); // Clear any active interval
        setSnake([
            { x: 3, y: 1 },
            { x: 2, y: 1 },
            { x: 1, y: 1 },
        ]);

        gameStartSound.play();
        setDirection("RIGHT");
        setGameOver(false);
        setIncreaseSpeed(speed)
        setScore(0);
        generateFood();
        focusGameGrid(); // Ensure the grid gets focused
        setPaused(false);
    };

    const focusGameGrid = () => {
        if (gameGridRef.current) {
            gameGridRef.current.focus();
        }
    };

    useEffect(() => {
        const storedHighestScore = localStorage.getItem("highestScore");
        if (storedHighestScore) {
            setHighestScore(parseInt(storedHighestScore, 10));
        }
        gameStartSound.play();
        generateFood();
        focusGameGrid();
    }, [])

    const moveSnake = () => {
        if (gameOver || paused) {
            return;
        }

        const newSnake = [...snake];
        const snakeHead = { ...newSnake[0] };

        if (direction === "UP") {
            snakeHead.y -= 1;
        }
        if (direction === "DOWN") {
            snakeHead.y += 1;
        }
        if (direction === "LEFT") {
            snakeHead.x -= 1;
        }
        if (direction === "RIGHT") {
            snakeHead.x += 1;
        }

        // Check for collisions with walls or itself
        if (
            snakeHead.x < 0 ||
            snakeHead.x > grid_Size - 1 ||
            snakeHead.y < 0 ||
            snakeHead.y > grid_Size - 1 ||

            newSnake.some((snakeBody) => snakeBody.x === snakeHead.x && snakeBody.y === snakeHead.y)
        ) {
            setGameOver(true);
            collisionSound.play();
            collisionSound.onended = () => {
                gameOverSound.play();
            };
            clearInterval(intervalRef.current);

            if (score > highestScore) {
                setHighestScore(score);
                localStorage.setItem("highestScore", score);
            }
            return;
        }
        // Add the new head to the snake
        newSnake.unshift(snakeHead);

        // Check if the snake eats the food
        if (snakeHead.x === food.x && snakeHead.y === food.y) {

            setScore(score + 1);
            eatSound.play();
            generateFood();
        } else {
            // Remove the tail segment if no food is eaten
            newSnake.pop();
        }

        setSnake(newSnake)
        setDirectionChangeAllowed(true);
    }

    useEffect(() => {
        if (!gameOver && !paused) {

            intervalRef.current = setInterval(moveSnake, IncreaseSpeed);
        }
        return () => clearInterval(intervalRef.current);
    }, [snake, direction, gameOver, paused]);

    const handleKeyPress = (event) => {
        if (paused || !directionChangeAllowed) {
            return;
        }

        let newDirection = direction; // Keep the current direction as default

        if ((event.key === "ArrowUp" || event.key === "w") && direction !== "DOWN") {
            newDirection = "UP";
        }
        if ((event.key === "ArrowDown" || event.key === "s") && direction !== "UP") {
            newDirection = "DOWN";
        }
        if ((event.key === "ArrowLeft" || event.key === "a") && direction !== "RIGHT") {
            newDirection = "LEFT";
        }
        if ((event.key === "ArrowRight" || event.key === "d") && direction !== "LEFT") {
            newDirection = "RIGHT";
        }

        if (newDirection !== direction) {
            setDirection(newDirection);
            setDirectionChangeAllowed(false);
        }
    }

    const getSnakeHeadRotation = () => {
        switch (direction) {
            case "UP":
                return "rotate(90deg)";
            case "RIGHT":
                return "rotate(180deg)";
            case "DOWN":
                return "rotate(270deg)";
            case "LEFT":
                return "rotate(0deg)";
            default:
                return "rotate(0deg)";
        }
    };

    const togglePause = () => {
        setPaused(prev => !prev); // Toggle pause state
    };

    return (
        <div className="flex flex-col min-h-screen p-4 justify-center items-center">
            {speedIncreased && (
                <div className="absolute inset-0 flex items-center justify-center z-50">
                    <h1 className="text-4xl font-bold text-yellow-400 animate-scale-up">
                        Speed Increase!
                    </h1>
                </div>
            )}
            <div
                ref={gameGridRef}
                onKeyDown={handleKeyPress}
                tabIndex={0}
                autoFocus
                className="grid grid-cols-20 grid-rows-20 border-8 border-solid border-black bg-no-repeat bg-cover"
                style={{
                    backgroundImage: "url(/images/bg-game3.jpg)",
                }}
            >
                {gameOver && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 text-white">
                        <h1 className="text-6xl font-bold mb-4 animate-bounce">GAME OVER!</h1>
                        <button
                            className="px-8 py-4 text-2xl font-semibold bg-green-500 rounded hover:bg-green-700"
                            onClick={resetGame}
                        >
                            Play Again
                        </button>
                        <button
                            className="mt-8 px-8 py-4 text-2xl font-semibold bg-orange-500 rounded hover:bg-orange-700"
                            onClick={onMainMenu}
                        >
                            Main Menu
                        </button>
                    </div>
                )}
                <div className="absolute top-4 left-4 bg-slate-300 p-4 rounded shadow">
                    <p className="text-xl font-bold text-gray-700">Score</p>
                    <p className="text-2xl font-extrabold text-green-600">{score}</p>
                    <p className="text-xl font-bold text-gray-700">Highest Score</p>
                    <p className="text-2xl font-extrabold text-blue-600">{highestScore}</p>
                </div>
                <button
                    className="absolute top-4 right-4 px-6 py-3 bg-yellow-500 text-xl font-semibold text-white rounded shadow hover:bg-yellow-600 transition"
                    onClick={togglePause}
                >
                    {paused ? "Resume" : "Pause"}
                </button>

                {Array.from({ length: grid_Size }).map((_, y) => (
                    <div key={y} className="flex">
                        {Array.from({ length: grid_Size }).map((_, x) => {

                            const isSnakeBody = snake.some((snakeBody) => snakeBody.x === x && snakeBody.y === y);
                            const isHead = isSnakeBody && snake[0].x === x && snake[0].y === y;

                            return (
                                <div
                                    key={x}
                                    className={`w-10 h-10 anim ${isSnakeBody && !isHead ? "bg-[#8cc43f]" : ""
                                        }`}
                                    style={{
                                        backgroundImage: isHead ? "url('/images/snakeHead.png')" : isSnakeBody ? "url('/images/snakeBody.png')" : food.x === x && food.y === y ? `url('${foodImage}')` : 'none',
                                        backgroundSize: "40px 40px",
                                        backgroundPosition: "center",
                                        backgroundRepeat: "no-repeat",
                                        borderRadius: isHead ? '30%' : isSnakeBody ? '40%' : 'none',
                                        transform: isHead ? getSnakeHeadRotation() : 'none',
                                    }}
                                ></div>
                            );
                        })}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default SnakeGrid;
