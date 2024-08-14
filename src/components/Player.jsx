import React, { useState } from "react";
import { FaReact } from "react-icons/fa";

const Player = ({ counter }) => {
  const [isEditable, setIsEditable] = useState(false);
  const [playerName, setPlayerName] = useState("Mile");

  const handleEditSave = () => {
    setIsEditable((edit) => !edit);
  };

  const handleChange = (e) => {
    setPlayerName(e.target.value);
  };

  return (
    <div className="container">
      <h1>
        Luka's <FaReact /> snake game
      </h1>

      {isEditable ? (
        <div>
          <input type="text" value={playerName} onChange={handleChange} />
          <button onClick={handleEditSave}>Save</button>
        </div>
      ) : (
        <div>
          <p>Player:{playerName}</p>
          <button onClick={handleEditSave}>Edit</button>
        </div>
      )}
      <p>Score:{counter}</p>
    </div>
  );
};

export default Player;
