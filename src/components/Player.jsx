import React, { useState } from "react";
import { FaReact } from "react-icons/fa";
import { Switch } from "@mui/material";

const Player = ({
  counter,
  playerName,
  setPlayerName,
  setChecked,
  checked,
  best,
}) => {
  const [isEditable, setIsEditable] = useState(false);

  const handleEditSave = () => {
    setIsEditable((edit) => !edit);
  };

  const handleChange = (e) => {
    setPlayerName(e.target.value);
  };

  const handleChecked = () => {
    setChecked((checked) => !checked);
  };

  return (
    <div className="container">
      <h1>
        Luka's <FaReact /> snake game
      </h1>

      {isEditable ? (
        <div className="save-div">
          <input
            className="input"
            type="text"
            value={playerName}
            onChange={handleChange}
          />
          <button className="save-btn" onClick={handleEditSave}>
            Save
          </button>
        </div>
      ) : (
        <div className="edit-div">
          <p className="player">Player: {playerName}</p>
          <button className="edit-btn" onClick={handleEditSave}>
            Edit
          </button>
        </div>
      )}
      <p className="score">Score: {counter}</p>
      <p className="hi-score">
        Hi-score:{playerName} {best.score}
      </p>
      <div className="switch">
        {checked ? "Hard" : "Easy"}
        <Switch onChange={handleChecked} />
      </div>
    </div>
  );
};

export default Player;
