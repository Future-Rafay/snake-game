"use client";
import { useEffect, useRef, useState } from "react";
import { useSwipeable } from 'react-swipeable';

const grid_Size = 20;

let gameStartSound, gameOverSound, collisionSound, speedIncrease, eatSound , highScoreSound;

if (typeof window !== 'undefined') {

    eatSound = new Audio('/sounds/eatingApple.mp3')
    gameStartSound = new Audio('/sounds/gameStartSound.mp3');
    gameOverSound = new Audio('/sounds/game-over3.mp3');
    collisionSound = new Audio('/sounds/collisionSound.mp3');
    speedIncrease = new Audio('/sounds/speedIncrease.mp3');
    highScoreSound = new Audio('/sounds/highScoreSound.mp3');
}

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

const SnakeGrid = ({ speed, onMainMenu, difficulty }) => {

    //////////////////////////////////////////////////////////////////

    const handlers = useSwipeable({
        onSwipedUp: () => setDirection("UP"),
        onSwipedDown: () => setDirection("DOWN"),
        onSwipedLeft: () => setDirection("LEFT"),
        onSwipedRight: () => setDirection("RIGHT"),
        preventDefaultTouchmoveEvent: true,
        trackTouch: true,
    });
    //////////////////////////////////////////////////////////////////
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
    const [showCongratulation, setShowCongratulation] = useState(false);
    const [directionChangeAllowed, setDirectionChangeAllowed] = useState(true);
    const [paused, setPaused] = useState(false);
    const intervalRef = useRef(null); // Store the interval ID
    const gameGridRef = useRef(null);

    useEffect(() => {
        if (score > 0 && score % 5 === 0) { // Adjust speed every 10 points
            setIncreaseSpeed((prevSpeed) => Math.max(prevSpeed - 10, 50));
            speedIncrease.play(),
                setSpeedIncreased(true);
            setTimeout(() => setSpeedIncreased(false), 1500
            );

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

        setShowCongratulation(false);
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
        // Fetch the highest score for the current difficulty from localStorage
        const storedHighestScore = localStorage.getItem(`highestScore_${difficulty}`);
        if (storedHighestScore) {
            setHighestScore(parseInt(storedHighestScore, 10));
        }
        gameStartSound.play();
        generateFood();
        focusGameGrid();
    }, [difficulty]);

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
            clearInterval(intervalRef.current);
            if (showCongratulation) {
                highScoreSound.play();
            } else {
                collisionSound.play();
                collisionSound.onended = () => {
                    gameOverSound.play();
                };
            }
        }
        // Add the new head to the snake
        newSnake.unshift(snakeHead);

        // Check if the snake eats the food
        if (snakeHead.x === food.x && snakeHead.y === food.y) {

            setScore(score + 1);
            eatSound.play();
            setTimeout(() => {
                eatSound.pause();
                eatSound.currentTime = 0;
            }, 700);
            generateFood();
        } else {
            newSnake.pop();
        }

        setSnake(newSnake)
        setDirectionChangeAllowed(true);
    }

    useEffect(() => {
        // Update the highest score when the score exceeds the current highest score
        if (score > highestScore) {
            setHighestScore(score);
            localStorage.setItem(`highestScore_${difficulty}`, score);
            setShowCongratulation(true);
        }
    }, [score, highestScore, difficulty]);

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

    const [backgroundSize, setBackgroundSize] = useState("40px");
    const [cellWidth, setCellWidth] = useState("40px");
    const [cellHeight, setCellHeight] = useState("40px");

    const updateDimensions = () => {
        const width = window.innerWidth;

        // Update background size
        if (width >= 320 && width <= 480) setBackgroundSize("16px");
        else if (width >= 480 && width <= 640) setBackgroundSize("22px");
        else if (width >= 640 && width <= 768) setBackgroundSize("25px");
        else if (width >= 768 && width <= 1024) setBackgroundSize("24px");
        else if (width >= 1024 && width <= 1280) setBackgroundSize("28px");
        else if (width >= 1280 && width <= 1536) setBackgroundSize("32px");
        else setBackgroundSize("40px");

        // Update cell width and height
        if (width >= 430 && width <= 480) {
            setCellWidth("14px");
            setCellHeight("14px");
        } else if (width >= 480 && width <= 640) {
            setCellWidth("22px");
            setCellHeight("22px");
        } else if (width >= 640 && width <= 768) {
            setCellWidth("25px");
            setCellHeight("25px");
        } else if (width >= 768 && width <= 1024) {
            setCellWidth("26px");
            setCellHeight("26px");
        } else if (width >= 1024 && width <= 1280) {
            setCellWidth("28px");
            setCellHeight("28px");
        } else if (width >= 1280 && width <= 1536) {
            setCellWidth("32px");
            setCellHeight("32px");
        } else {
            setCellWidth("40px");
            setCellHeight("40px");
        }
    };

    useEffect(() => {
        updateDimensions();

        // Attach the resize event listener
        window.addEventListener("resize", updateDimensions);
        // Cleanup on unmount
        return () => window.removeEventListener("resize", updateDimensions);
    }, []);

    return (
        <div>
            <div className="flex flex-col min-h-screen justify-center items-center">
                {speedIncreased && (
                    <div className="absolute inset-0 flex items-center justify-center z-50">
                        <h1 className="text-4xl font-bold text-yellow-400 animate-scale-up">
                            Speed Increase!
                        </h1>
                    </div>
                )}

                <div
                    {...handlers}
                    ref={gameGridRef}
                    onKeyDown={handleKeyPress}
                    tabIndex={0}
                    autoFocus
                    className="grid grid-cols-20 grid-rows-20 border-2 xs:border-4 2xl:border-6 border-solid border-black bg-no-repeat bg-cover"
                    style={{
                        backgroundImage: "url(/images/bg-game3.jpg)",
                    }}
                >
                    {gameOver && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 text-white">
                            {showCongratulation && (
                                <div className="absolute inset-0 flex flex-col items-center justify-center z-50 bg-opacity-80 bg-gradient-to-br from-purple-700 to-pink-500 text-white">
                                    <h1 className="text-6xl font-extrabold mb-4 glow-text custom-fly-in">
                                        🎉 New High Score! 🎉
                                    </h1>
                                    <p className="text-3xl font-semibold custom-fade-in">
                                        Score: {score}
                                    </p>
                                    <button
                                        className="mt-8 px-8 py-4 text-2xl font-semibold bg-green-500 rounded hover:bg-green-700 z-30 animate-bounce"
                                        onClick={resetGame}
                                    >
                                        Play Again
                                    </button>

                                    <button
                                        className="mt-8 px-8 py-4 text-2xl font-semibold bg-orange-500 rounded hover:bg-orange-700 z-30 animate-bounce"
                                        onClick={onMainMenu}
                                    >
                                        Main Menu
                                    </button>
                                </div>
                            )}


                            <h1 className="text-6xl font-bold mb-4 custom-fade-in">GAME OVER!</h1>
                            <button
                                className="px-8 py-4 text-2xl font-semibold bg-green-500 rounded hover:bg-green-700 z-30"
                                onClick={resetGame}
                            >
                                Play Again
                            </button>

                            <button
                                className="mt-8 px-8 py-4 text-2xl font-semibold bg-orange-500 rounded hover:bg-orange-700 z-30"
                                onClick={onMainMenu}
                            >
                                Main Menu
                            </button>
                        </div>
                    )}
                    {/* <div className="absolute top-4 left-4 bg-slate-300 p-4 rounded shadow">
                        <p className="xxs:text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl text-xs font-bold text-gray-700">Score</p>
                        <p className="text-2xl font-extrabold text-green-600">{score}</p>
                        <p className="xxs:text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl text-xs font-bold text-gray-700">Highest Score in <span className="text-2xl font-bold text-orange-600">{difficulty}</span> difficulty</p>
                        <p className="text-2xl font-extrabold text-blue-600">{highestScore}</p>
                    </div> */}
                    <div className="absolute top-4 left-4 bg-green-100 p-4 rounded-lg shadow-lg border border-green-300">
                        {/* Score Label */}
                        <p className="xxs:text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl text-sm font-semibold text-green-700">
                            Current Score
                        </p>
                        <p className="text-xl sm:text-2xl md:text-3xl font-extrabold text-green-800">{score}</p>

                        {/* Highest Score Label */}
                        <p className="mt-2 xxs:text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl text-sm font-semibold text-green-700">
                            Highest Score in{" "}
                            <span className="text-base sm:text-lg md:text-xl font-bold text-orange-600">{difficulty}</span> difficulty
                        </p>
                        <p className="text-xl sm:text-2xl md:text-3xl font-extrabold text-blue-600">{highestScore}</p>
                    </div>
                    <button
                        className="absolute top-4 right-44 px-6 py-3 bg-yellow-500 text-xl font-semibold text-white rounded shadow hover:bg-yellow-600 transition"
                        onClick={togglePause}
                    >
                        {paused ? "Resume" : "Pause"}
                    </button>
                    <button
                        className="absolute top-4 right-4 px-6 py-3 bg-red-500 text-xl font-semibold text-white rounded shadow hover:bg-red-600 transition"
                        onClick={onMainMenu}
                    >
                        Main Menu
                    </button>

                    {Array.from({ length: grid_Size }).map((_, y) => (
                        <div key={y} className="flex">
                            {Array.from({ length: grid_Size }).map((_, x) => {

                                const isSnakeBody = snake.some((snakeBody) => snakeBody.x === x && snakeBody.y === y);
                                const isHead = isSnakeBody && snake[0].x === x && snake[0].y === y;

                                return (
                                    <div
                                        key={x}
                                        className={`${isSnakeBody && isHead ? "bg-[#8cc43f]" : ""}`}
                                        style={{
                                            width: cellWidth,
                                            height: cellHeight,
                                            backgroundImage: isHead ? "url('/images/snakebodyYellow.png')" : isSnakeBody ? "url('/images/snakeHeadYellow.png')" : food.x === x && food.y === y ? `url('${foodImage}')` : 'none',
                                            backgroundSize: backgroundSize,
                                            backgroundPosition: "center",
                                            borderRadius: isHead ? '20%' : isSnakeBody ? '40%' : '0%',
                                            transform: isHead ? getSnakeHeadRotation() : 'none',
                                        }}
                                    ></div>
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default SnakeGrid;
