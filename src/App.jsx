import React, { useEffect } from "react";
import GameBoard from "./components/GameBoard";
import { useState } from "react";
import Player from "./components/Player";

const App = () => {
  const [counter, setCounter] = useState(0);
  const [playerName, setPlayerName] = useState("Mile");
  const [best, setBest] = useState(0);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (counter > best) {
      setBest(counter);
    }

    localStorage.setItem("player", playerName);
    localStorage.setItem("hiscore", best);
  }, [counter]);

  return (
    <>
      <div className="player">
        <Player
          counter={counter}
          playerName={playerName}
          setPlayerName={setPlayerName}
          best={best}
          setChecked={setChecked}
          checked={checked}
        />
      </div>
      <div className="game">
        <GameBoard
          counter={counter}
          setCounter={setCounter}
          setBest={setBest}
          checked={checked}
        />
      </div>
    </>
  );
};

export default App;
