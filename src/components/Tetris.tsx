"use client";
import React, { useEffect, useState } from "react";
import StartPage from "./StartPage";
import Game from "./Game";
import { useMiniKit } from "@coinbase/onchainkit/minikit";

const Tetris: React.FC = () => {
  const { setFrameReady, isFrameReady } = useMiniKit();

  const [running, setRunning] = useState(false);
  useEffect(() => {
    if (!isFrameReady) {
      setFrameReady();
    }
  }, [setFrameReady, isFrameReady]);
  return running ? (
    <Game stopClick={() => setRunning(false)} />
  ) : (
    <StartPage startClick={() => setRunning(true)} />
  );
};

export default Tetris;
