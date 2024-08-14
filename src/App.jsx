import React from "react";
import GameBoard from "./components/GameBoard";
import { useState } from "react";
import Player from "./components/Player";

const App = () => {
  const [counter, setCounter] = useState(0);

  return (
    <>
      <div className="player">
        <Player player="Player" counter={counter} />
      </div>
      <div className="game">
        <GameBoard counter={counter} setCounter={setCounter} />
      </div>
    </>
  );
};

export default App;
