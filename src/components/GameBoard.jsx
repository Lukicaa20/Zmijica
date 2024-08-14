import React, { useState, useEffect, useRef } from "react";

function GameBoard({ counter, setCounter }) {
  //useState varijable
  const canvasRef = useRef(null);
  const [position, setPosition] = useState({
    x: 200 - 10 / 2,
    y: 200 - 10 / 2,
  });
  const [direction, setDirection] = useState({ x: 0, y: 0 });
  const [tail, setTail] = useState([]);
  const [food, setFood] = useState({ x: 100, y: 100 });

  //Lokalne varijable
  const squareSize = 10;
  const speed = squareSize;

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

      setTail((prevTail) => {
        const newTail = [{ x: position.x, y: position.y }, ...prevTail];
        if (newTail.length > counter) {
          newTail.pop();
        }
        return newTail;
      });

      tail.map((segment) => {
        if (
          position.x < segment.x + squareSize &&
          position.x + squareSize > segment.x &&
          position.y < segment.y + squareSize &&
          position.y + squareSize > segment.y
        ) {
          setTail([]);
          setCounter(0);
          setDirection({ x: 0, y: 0 });
          setPosition({
            x: 200 - 10 / 2,
            y: 200 - 10 / 2,
          });
        }
      });
    };

    /* If provjere */

    // Provjera jel igrač udario u rub ploče
    if (
      position.x < 0 ||
      position.x > canvas.width - squareSize ||
      position.y < 0 ||
      position.y > canvas.height - squareSize
    ) {
      setCounter(0);
      setDirection({ x: 0, y: 0 });
      setPosition({
        x: 200 - 10 / 2,
        y: 200 - 10 / 2,
      });
      setTail([]);
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
      setCounter((prevCounter) => {
        return prevCounter + 1;
      });
    }

    context.clearRect(0, 0, canvas.width, canvas.height);

    //Igrač

    context.fillStyle = "white";
    context.fillRect(position.x, position.y, squareSize, squareSize);

    //Hrana

    context.fillStyle = "red";
    context.fillRect(food.x, food.y, squareSize, squareSize);

    //Rep
    context.fillStyle = "white";
    tail.forEach((segment) => {
      context.fillRect(segment.x, segment.y, squareSize, squareSize);
    });

    // Mislio sam da se možda može samo na kraju pozvati funkcija gameLoop() i da će ju dependency list od useEffecta(npr [position]) osvježavati ali zbog prebrzog render aplikacija je počela divljati
    const intervalId = setInterval(gameLoop, 1000 / 10); // 20 FPS

    return () => clearInterval(intervalId);
  }, [direction, position, food, tail, counter]);

  return (
    <canvas
      ref={canvasRef}
      width={400}
      height={400}
      style={{ border: "1px solid black", background: "black" }}
    />
  );
}

export default GameBoard;
