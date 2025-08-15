"use client";
import React, { useState } from "react";
import StartPage from "./StartPage";
import Game from "./Game";

const Tetris: React.FC = () => {
  const [running, setRunning] = useState(false);
  return running ? (
    <Game stopClick={() => setRunning(false)} />
  ) : (
    <StartPage startClick={() => setRunning(true)} />
  );
};

export default Tetris;
