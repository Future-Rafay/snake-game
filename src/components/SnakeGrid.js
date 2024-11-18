"use client";

import { useEffect, useState } from "react";

const grid_Size = 20

const SnakeGrid = () => {

    const [snake, setSnake] = useState([
        // Snake Head //
        { x: 3, y: 1 },
        // Snake Body
        { x: 2, y: 1 },
        { x: 1, y: 1 },
    ])
    const [food, setFood] = useState({})
    const [direction, setDirection] = useState("RIGHT")
    const [gameOver, setGameOver] = useState(false)

    const generateFood = () => {
        const x = Math.floor(Math.random() * grid_Size);
        const y = Math.floor(Math.random() * grid_Size);
        setFood({ x, y })
    }

    useEffect(() => {
        generateFood();
    }, [])

    const moveSnake = () => {
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

        if (
            snakeHead.x < 0 ||
            snakeHead.x > grid_Size ||
            snakeHead.y < 0 ||
            snakeHead.y > grid_Size ||

            newSnake.some((snakeBody) => snakeBody.x === snakeHead.x && snakeBody.y === snakeHead.y)
        ) {
            setGameOver(true);
            return;
        }

        newSnake.unshift(snakeHead);

        if (snakeHead.x === food.x && snakeHead.y === food.y) {
            generateFood();
        } else {
            newSnake.pop();
        }

        setSnake(newSnake)
    }

    useEffect(() => {
        const interval = setInterval(moveSnake, 100);
        return () => clearInterval(interval)
    }, [snake, direction])

    const handleKeyPress = (event) => {

        if ((event.key === "ArrowUp" || event.key === "w") && direction !== "DOWN") {
            setDirection("UP");
        }
        if ((event.key === "ArrowDown" || event.key === "s") && direction !== "UP") {
            setDirection("DOWN");
        }
        if ((event.key === "ArrowLeft" || event.key === "a") && direction !== "RIGHT") {
            setDirection("LEFT");
        }
        if ((event.key === "ArrowRight" || event.key === "d") && direction !== "LEFT") {
            setDirection("RIGHT");
        }
    }

    return (
        <>
            <div className="border-2 border-solid border-black">
                <div
                    onKeyDown={handleKeyPress}
                    tabIndex={0}
                    autoFocus
                    className="gird grid-cols-20 grid-rows-20">
                    {gameOver && (
                        <div className="absolute h-screen inset-0 flex items-center justify-center text-6xl font-bold">GAME OVER!</div>
                    )}
                    {Array.from({ length: grid_Size }).map((_, y) => (
                        <div key={y} className="flex">
                            {Array.from({ length: grid_Size }).map((_, x) => (
                                <div key={x} className={`w-10 h-10 rounded-2xl
                                    ${snake.some((snakeBody) => snakeBody.x === x && snakeBody.y === y) && "bg-green-500"}
                                    ${food.x === x && food.y === y && "bg-red-500"}
                                    
                                `}></div>
                            )

                            )}
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}

export default SnakeGrid;       