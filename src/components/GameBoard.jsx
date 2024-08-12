import React, { useState, useEffect, useRef } from "react";

function GameBoard() {
  const canvasRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [direction, setDirection] = useState({ x: 0, y: 0 });
  const squareSize = 20;
  const speed = 5;
  const [tail, SetTail] = useState([]);
  const [food, setFood] = useState({ x: 200, y: 200 });

  // useEffect koji koristimo radi aktiviranja event listenera koji igraču mijenjaju smjer, handleKeyDown funkciju možemo napisati i van useEffect funkcije i ponašat će se isto.
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

        return { x: newX, y: newY };
      });

      /* If provjere */

      // Provjera jel igrač udario u rub ploče
      if (
        position.x < 0 ||
        position.x > canvas.width - squareSize ||
        position.y < 0 ||
        position.y > canvas.height - squareSize
      ) {
        return { x: 0, y: 0 };
      }

      //Provjera jel kocka od igrača preklapa sa kockom hrane
      if (
        position.x < food.x + squareSize &&
        position.x + squareSize > food.x &&
        position.y < food.y + squareSize &&
        position.y + squareSize > food.y
      ) {
        setFood({
          x: Math.floor(Math.random() * (canvas.width - squareSize)),
          y: Math.floor(Math.random() * (canvas.height - squareSize)),
        });
      }
    };

    context.clearRect(0, 0, canvas.width, canvas.height);

    //Igrač

    context.fillStyle = "green";
    context.fillRect(position.x, position.y, squareSize, squareSize);

    //Hrana

    const context2 = canvas.getContext("2d");

    context2.fillStyle = "blue";
    context2.fillRect(food.x, food.y, squareSize, squareSize);

    // Mislio sam da se možda može samo na kraju pozvati funkcija gameLoop() i da će ju dependency list od useEffecta(npr [position]) osvježavati ali zbog prebrzog render aplikacija je počela divljati
    const intervalId = setInterval(gameLoop, 1000 / 10); // 30 FPS

    return () => clearInterval(intervalId);
  }, [direction, position, food]);

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
