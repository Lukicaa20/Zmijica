import React, { useState, useEffect, useRef } from "react";

function GameBoard() {
  const canvasRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [direction, setDirection] = useState({ x: 0, y: 0 });
  const squareSize = 20;
  const speed = 5;
  const [tail, SetTail] = useState([]);
  const [food, setFood] = useState({ x: 200, y: 200 });
  const [dist, setDist] = useState(0);

  useEffect(() => {
    const handleKeyDown = (event) => {
      switch (event.key) {
        case "ArrowUp":
          setDirection({ x: 0, y: -speed });
          break;
        case "ArrowDown":
          setDirection({ x: 0, y: speed });
          break;
        case "ArrowLeft":
          setDirection({ x: -speed, y: 0 });
          break;
        case "ArrowRight":
          setDirection({ x: speed, y: 0 });
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    const gameLoop = () => {
      setPosition((prevPosition) => {
        const newX = prevPosition.x + direction.x;
        const newY = prevPosition.y + direction.y;

        if (
          prevPosition.x < 0 + squareSize / 2 ||
          prevPosition.x > canvas.width - squareSize
        ) {
          setDirection({ x: 0, y: 0 });
        } else if (
          prevPosition.y < 0 ||
          prevPosition.y > canvas.height - squareSize
        ) {
          setDirection({ x: 0, y: 0 });
        }
        // Clear the canvas
        context.clearRect(0, 0, canvas.width, canvas.height);

        // Draw the square at the new position
        context.fillStyle = "green";
        context.fillRect(newX, newY, squareSize, squareSize);

        return { x: newX, y: newY };
      });
    };

    const distance = () => {
      const x1 = position.x + squareSize / 2;
      const y1 = position.y + squareSize / 2;
      const x2 = food.x + squareSize / 2;
      const y2 = food.y + squareSize / 2;

      const distan = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
      setDist(distan);
    };

    distance();

    if (dist < 20) {
      setFood({
        x: Math.floor(Math.random() * 401),
        y: Math.floor(Math.random() * 401),
      });
    }

    const intervalId = setInterval(gameLoop, 1000 / 10); // 30 FPS

    return () => clearInterval(intervalId);
  }, [direction, position]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context2 = canvas.getContext("2d");

    // Draw the square at the new position
    context2.fillStyle = "blue";
    context2.fillRect(food.x, food.y, squareSize, squareSize);
  }, [position]);

  return (
    <canvas
      ref={canvasRef}
      width={400}
      height={400}
      style={{ border: "1px solid black" }}
    />
  );
}

export default GameBoard;
