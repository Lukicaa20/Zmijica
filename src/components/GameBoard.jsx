import React, { useState, useEffect, useRef } from "react";

function GameBoard({ counter, setCounter, checked }) {
  //Lokalne varijable
  const squareSize = 10;
  const speed = squareSize;
  const canvasSize = 400;

  //useState varijable
  const canvasRef = useRef(null);
  const [position, setPosition] = useState({
    x: 200,
    y: 200,
  });
  const [direction, setDirection] = useState({ x: 0, y: 0 });
  const [tail, setTail] = useState([]);
  const [food, setFood] = useState({ x: 100, y: 100 });

  // useEffect za crtanje grida

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    context.strokeStyle = "#ddd";
    context.lineWidth = 0;

    for (let x = 0; x <= canvasSize; x += squareSize) {
      // Vertikalne linije
      context.beginPath();
      context.moveTo(x, 0);
      context.lineTo(x, canvasSize);
      context.stroke();

      // Horizontalne linije
      context.beginPath();
      context.moveTo(0, x);
      context.lineTo(canvasSize, x);
      context.stroke();
    }
  }, []);

  // useEffect koji koristimo radi aktiviranja event listenera koji igraču mijenjaju smjer, handleKeyDown funkciju možemo napisati i van useEffect funkcije i ponašat će se isto.

  useEffect(() => {
    const handleKeyDown = (event) => {
      setDirection((prevDirection) => {
        let newDirection;
        switch (event.key) {
          case "ArrowUp":
            newDirection = { x: 0, y: -speed };
            break;
          case "ArrowDown":
            newDirection = { x: 0, y: speed };
            break;
          case "ArrowLeft":
            newDirection = { x: -speed, y: 0 };
            break;
          case "ArrowRight":
            newDirection = { x: speed, y: 0 };
            break;
          default:
            return prevDirection;
        }

        if (
          tail.length === 1 &&
          (newDirection.x === -prevDirection.x ||
            newDirection.y === -prevDirection.y)
        ) {
          setTail([]);
          setCounter(0);
          setPosition({
            x: 200,
            y: 200,
          });
          alert("Game over :(");
          return prevDirection;
        }

        if (
          newDirection.x !== prevDirection.x ||
          newDirection.y !== prevDirection.y
        ) {
          return newDirection;
        }

        return prevDirection;
      });
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [tail, speed]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    const gameLoop = () => {
      setPosition((prevPosition) => {
        const newX = prevPosition.x + direction.x;
        const newY = prevPosition.y + direction.y;

        return {
          x: newX,
          y: newY,
        };
      });

      /* If provjere */

      //Ova funkcija je po meni jako zahtjevna jer uvijek newTail.pop spriječava rast repa u nedogled

      //Kako se funkcija gameLoop izvršava, svaki svojim izvršavanjem stvorila bi novi kvadratić. Tu stavljamo if provjeru koja spriječava rast repa tako što prati counter ondosno koliko je hrane zmijica pojela
      setTail((prevTail) => {
        const newTail = [{ x: position.x, y: position.y }, ...prevTail];
        if (newTail.length > counter) {
          newTail.pop();
        }

        //Provjera jel se dijelovi repa poklapaju sa hranom, ako da onda premjesti hranu

        let overlap = newTail.some(
          (segment) => segment.x === food.x && segment.y === food.y
        );

        if (overlap) {
          setFood({
            x:
              Math.floor(Math.random() * (canvas.width / squareSize)) *
              squareSize,
            y:
              Math.floor(Math.random() * (canvas.height / squareSize)) *
              squareSize,
          });
        }
        return newTail;
      });

      //Provjera jeli se zmija zabila u svoja tijelo

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
            x: 200,
            y: 200,
          });
          alert("Game over :(");
        }
      });
    };

    // Provjera jel zmija udarila u rub ploče
    if (
      position.x < 0 ||
      position.x > canvas.width - squareSize ||
      position.y < 0 ||
      position.y > canvas.height - squareSize
    ) {
      setCounter(0);
      setDirection({ x: 0, y: 0 });
      setPosition({
        x: 200,
        y: 200,
      });
      setTail([]);
      alert("Game over :(");
    }

    //Provjera jel kocka od zmije preklapa sa kockom hrane
    if (
      position.x < food.x + squareSize &&
      position.x + squareSize > food.x &&
      position.y < food.y + squareSize &&
      position.y + squareSize > food.y
    ) {
      setFood({
        x: Math.floor(Math.random() * (canvas.width / squareSize)) * squareSize,
        y:
          Math.floor(Math.random() * (canvas.height / squareSize)) * squareSize,
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

    // Easy/Hard mode

    if (checked) {
      const intervalId = setInterval(gameLoop, 1000 / 30); // 30 FPS
      return () => clearInterval(intervalId);
    } else {
      const intervalId = setInterval(gameLoop, 1000 / 20); // 20 FPS
      return () => clearInterval(intervalId);
    }
  }, [direction, food, tail, counter]);

  return (
    <canvas
      ref={canvasRef}
      width={canvasSize}
      height={canvasSize}
      style={{ border: "1px solid black", background: "black" }}
    />
  );
}

export default GameBoard;
