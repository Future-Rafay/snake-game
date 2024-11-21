"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSwipeable } from 'react-swipeable';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPause } from '@fortawesome/free-solid-svg-icons';
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import { faHome } from '@fortawesome/free-solid-svg-icons';

const grid_Size = 20;

let gameStartSound, gameOverSound, collisionSound, speedIncrease, eatSound, highScoreSound;

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
        onSwipedUp: () => setDirection('UP'),
        onSwipedDown: () => setDirection('DOWN'),
        onSwipedLeft: () => setDirection('LEFT'),
        onSwipedRight: () => setDirection('RIGHT'),
        preventDefaultTouchmoveEvent: true,
        trackTouch: true,
      });
      useEffect(() => {
        // Disable scrolling on mobile
        const handleTouchMove = (e) => {
          e.preventDefault();
        };
      
        // Add event listener to prevent scrolling
        document.body.addEventListener('touchmove', handleTouchMove, { passive: false });
      
        return () => {
          // Clean up the event listener
          document.body.removeEventListener('touchmove', handleTouchMove);
        };
      }, []);
      
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

    const generateFood = useCallback(() => {
        const x = Math.floor(Math.random() * grid_Size);
        const y = Math.floor(Math.random() * grid_Size);
        setFood({ x, y });
        setFoodImage(getRandomFoodImage());
    }, []);

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
    }, [generateFood, difficulty]);


    const moveSnake = useCallback(() => {
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
            newSnake.some(
                (snakeBody) => snakeBody.x === snakeHead.x && snakeBody.y === snakeHead.y
            )
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

        setSnake(newSnake);
        setDirectionChangeAllowed(true);
    }, [
        gameOver,
        paused,
        snake,
        direction,
        food,
        score,
        showCongratulation,
        generateFood,
        setScore,
        setDirectionChangeAllowed,
    ]);

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
    }, [IncreaseSpeed, moveSnake, snake, direction, gameOver, paused]);

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
        if (width >= 320 && width < 430) setBackgroundSize("14px"); // 3xs
        else if (width >= 430 && width < 480) setBackgroundSize("18px"); // 2xs
        else if (width >= 480 && width < 640) setBackgroundSize("20px"); // xs
        else if (width >= 640 && width < 768) setBackgroundSize("24px"); // sm
        else if (width >= 768 && width < 1024) setBackgroundSize("26px"); // md
        else if (width >= 1024 && width < 1280) setBackgroundSize("28px"); // lg
        else if (width >= 1280 && width < 1536) setBackgroundSize("32px"); // xl
        else setBackgroundSize("40px"); // 2xl and beyond

        // Update cell width and height
        if (width >= 320 && width < 430) {
            setCellWidth("14px"); // 3xs
            setCellHeight("14px");
        } else if (width >= 430 && width < 480) {
            setCellWidth("18px"); // 2xs
            setCellHeight("18px");
        } else if (width >= 480 && width < 640) {
            setCellWidth("20px"); // xs
            setCellHeight("20px");
        } else if (width >= 640 && width < 768) {
            setCellWidth("24px"); // sm
            setCellHeight("24px");
        } else if (width >= 768 && width < 1024) {
            setCellWidth("26px"); // md
            setCellHeight("26px");
        } else if (width >= 1024 && width < 1280) {
            setCellWidth("28px"); // lg
            setCellHeight("28px");
        } else if (width >= 1280 && width < 1536) {
            setCellWidth("32px"); // xl
            setCellHeight("32px");
        } else {
            setCellWidth("40px"); // 2xl
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
            <div className="flex flex-col min-h-screen justify-center items-center" id="container"
            {...handlers}  
            style={{
                width: '100vw',
                height: '100vh',
                position: 'relative',
                overflow: 'hidden', // Make sure the container doesn't allow scrolling
              }}>

                {speedIncreased && (
                    <div className="absolute inset-0 flex items-center justify-center z-50">
                        <h1 className="text-4xl font-bold text-yellow-400 animate-scale-up">
                            Speed Increase!
                        </h1>
                    </div>
                )}

                <div
                    // {...handlers}   
                    ref={gameGridRef}
                    onKeyDown={handleKeyPress}
                    tabIndex={0}
                    autoFocus
                    className="grid grid-cols-20 grid-rows-20 outline-none" id="playground"
                >
                    {gameOver && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 text-white">
                            {showCongratulation && (
                                <div className="absolute inset-0 flex flex-col items-center justify-center z-50 bg-opacity-80 bg-gradient-to-br from-purple-700 to-pink-500 text-white">
                                    <h1
                                        className="text-sm 3xs:text-2xl 2xs:text-3xl xs:text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-2 lg:mb-4 glow-text custom-fly-in"
                                    >
                                        🎉 New High Score! 🎉
                                    </h1>
                                    <p
                                        className="3xs:mb-10 text-xs 3xs:text-lg 2xs:mb-8 xs:text-xl sm:text-xl lg:text-2xl font-semibold custom-fade-in"
                                    >
                                        Score: {score}
                                    </p>
                                    <button
                                        className="px-4 py-1 3xs:px-4 3xs:py-2 3xs:text-xs 2xs:px-5 xs:text-base sm:px-6 sm:text-lg lg:px-8 lg:py-4 lg:text-xl  text-xs font-semibold bg-green-500 rounded hover:bg-green-700 z-30"
                                        onClick={resetGame}
                                    >
                                        Play Again
                                    </button>

                                    <button
                                        className="mt-2 px-4 py-1 3xs:mt-4 3xs:px-4 3xs:py-2 3xs:text-xs 2xs:px-5 2xs:mt-6 xs:text-base sm:px-6 sm:text-lg lg:px-8 lg:py-4 lg:text-xl lg:mt-8 text-xs font-semibold bg-orange-500 rounded hover:bg-orange-700 z-30"
                                        onClick={onMainMenu}
                                    >
                                        Main Menu
                                    </button>
                                </div>
                            )}


                            <h1 className="text-xl 3xs:text-2xl 2xs:text-4xl xs:text-5xl sm:text-6xl lg:text-7xl z-10 font-bold mb-6 custom-fade-in">GAME OVER!</h1>
                            <button
                                className="px-4 py-2 3xs:px-4 3xs:py-2 3xs:text-xs 2xs:px-5 xs:text-base sm:px-6 sm:text-lg lg:px-8 lg:py-4 lg:text-xl  text-xs font-semibold bg-green-500 rounded hover:bg-green-700 z-30"
                                onClick={resetGame}
                            >
                                Play Again
                            </button>

                            <button
                                className="mt-2 px-4 py-2 3xs:mt-4 3xs:px-4 3xs:py-2 3xs:text-xs 2xs:px-5 2xs:mt-6 xs:text-base sm:px-6 sm:text-lg lg:px-8 lg:py-4 lg:text-xl lg:mt-8 text-xs font-semibold bg-orange-500 rounded hover:bg-orange-700 z-30"
                                onClick={onMainMenu}
                            >
                                Main Menu
                            </button>
                        </div>
                    )}
                    <div className="absolute top-4 sm:top-2 2xl:p-4 xl:top-4 left-4 bg-transparent rounded">
                        <p className="xxs:text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl text-xs font-bold text-[#a0ab97]">Score</p>
                        <p className="text-xl xl:text-2xl font-extrabold text-green-600">{score}</p>
                        <p className="xxs:text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl text-xs font-bold text-[#a0ab97] md:absolute md:top-16 lg:top-16 xl:relative xl:top-0">Highest Score in <span className="font-bold text-orange-600">{difficulty}</span> difficulty</p>
                        <p className="text-xl xl:text-2xl font-extrabold text-blue-600 md:absolute md:top-44 lg:top-44 xl:relative xl:top-0">{highestScore}</p>
                    </div>
                    <button
                        className="absolute top-16 right-4 px-4 py-2 text-sm 3xs:px-5 2xs:px-5 2xs:py-2 2xs:text-base sm:px-6 sm:py-3 sm:right-20 sm:top-4  sm:text-lg bg-yellow-500 font-semibold text-white rounded shadow hover:bg-yellow-600 transition"
                        onClick={togglePause}
                    >
                        {paused ? <FontAwesomeIcon icon={faPlay} /> : <FontAwesomeIcon icon={faPause} />}
                    </button>
                    <button
                        className="absolute top-4 right-4 px-4 py-2 text-sm 2xs:px-4 2xs:py-2 2xs:text-base sm:px-5 sm:right-3 sm:py-3  sm:text-lg bg-red-500 font-semibold text-white rounded shadow hover:bg-red-600 transition"
                        onClick={onMainMenu}
                    >
                        <FontAwesomeIcon icon={faHome} />
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
