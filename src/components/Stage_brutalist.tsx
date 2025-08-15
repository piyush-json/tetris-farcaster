"use client";
import React, { useEffect, useRef } from "react";
import useWindowDimensions from "../hooks/useWindowDimensions";
import LoseGame from "./LoseGame";
import { type Player, type Pixel } from "../lib/utils";

interface StageProps {
  lose: boolean;
  restartClick: () => void;
  stopClick: () => void;
  map: Pixel[][];
  player: Player;
  hint: Player;
  status: { lines: number; score: number; level: number };
  paused: boolean;
  onBlur: () => void;
  onFocus: () => void;
  onKeyUp: (event: React.KeyboardEvent) => void;
  onKeyDown: (event: React.KeyboardEvent) => void;
  onClick: () => void;
}

interface PixelComponentProps {
  fill: number;
  color?: string;
  hint?: boolean;
  size: number;
  topBloco?: boolean;
  zIndex?: number;
}

// Brutalist pixel component - pure geometric shapes
const PixelComponent: React.FC<PixelComponentProps> = ({
  fill,
  color = "#000",
  hint = false,
  size,
  topBloco = false,
  zIndex = 0,
}) => {
  if (hint) {
    return (
      <div
        className="border-4 border-white bg-transparent"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          zIndex: zIndex,
        }}
      />
    );
  }

  return (
    <div
      className="border-2 border-black"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: fill ? color : "#000",
        zIndex: zIndex,
        boxShadow: fill && topBloco ? "4px 4px 0px #ffffff" : "none",
      }}
    />
  );
};

const Stage: React.FC<StageProps> = ({
  lose,
  restartClick,
  stopClick,
  map,
  player,
  hint,
  status,
  paused: _paused, // eslint-disable-line @typescript-eslint/no-unused-vars
  onBlur,
  onFocus,
  onKeyUp,
  onKeyDown,
  onClick,
  ...others
}) => {
  const { width, height } = useWindowDimensions();
  const stageRef = useRef<HTMLDivElement>(null);

  // Mobile-optimized pixel size
  const pixelSize = Math.min(width / 12, height / 20);
  const isPortrait = height > width;

  useEffect(() => {
    if (!lose && stageRef.current) {
      stageRef.current.focus();
    }
  }, [lose]);

  return (
    <div className="w-screen h-screen bg-black flex flex-col items-center justify-center font-mono">
      {/* Brutalist Header */}
      <div className="w-full bg-white text-black p-2 text-center">
        <div className="text-lg font-black tracking-widest">TETRIS</div>
        <div className="flex justify-between text-sm font-bold">
          <span>SCORE: {status.score}</span>
          <span>LEVEL: {status.level}</span>
          <span>LINES: {status.lines}</span>
        </div>
      </div>

      {/* Game Stage */}
      <div
        ref={stageRef}
        tabIndex={0}
        {...others}
        onBlur={onBlur}
        onFocus={onFocus}
        onKeyUp={onKeyUp}
        onKeyDown={onKeyDown}
        onClick={onClick}
        className="bg-black border-4 border-white focus:outline-none focus:border-red-500 mb-4 mt-4"
        style={{
          width: `${pixelSize * 10}px`,
          height: `${pixelSize * 18}px`,
        }}
      >
        {map?.map((row, y) => (
          <div
            key={`stage-row-${y}`}
            className="flex"
            style={{ height: `${pixelSize}px` }}
          >
            {row.map((pixel, x) => {
              const playerFill =
                player.bloco.bloco[y - player.pos[0]] &&
                player.bloco.bloco[y - player.pos[0]][x - player.pos[1]];
              const playerHint =
                hint.bloco.bloco[y - hint.pos[0]] &&
                hint.bloco.bloco[y - hint.pos[0]][x - hint.pos[1]];
              const topBloco =
                (playerFill || pixel.fill) &&
                (!player.bloco.bloco[y - player.pos[0] - 1] ||
                  !player.bloco.bloco[y - player.pos[0] - 1][
                    x - player.pos[1]
                  ]) &&
                (!map[y - 1] || !map[y - 1][x].fill);
              const zIndex = !playerFill && !pixel.fill && playerHint ? 99 : y;

              return (
                <PixelComponent
                  key={`stage-pixel-${x}`}
                  fill={pixel.fill || playerFill}
                  color={playerFill ? player.bloco.color : pixel.color}
                  hint={!!(!pixel.fill && !playerFill && playerHint)}
                  size={pixelSize}
                  topBloco={!!topBloco}
                  zIndex={zIndex}
                />
              );
            })}
          </div>
        ))}
      </div>

      {/* Mobile Controls */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <button
          onTouchStart={() => onKeyDown({ keyCode: 37 } as React.KeyboardEvent)}
          className="bg-white text-black border-4 border-black px-6 py-4 font-black text-xl active:bg-gray-200 shadow-[4px_4px_0px_#000000]"
        >
          ←
        </button>
        <button
          onTouchStart={() => onKeyDown({ keyCode: 38 } as React.KeyboardEvent)}
          className="bg-white text-black border-4 border-black px-6 py-4 font-black text-xl active:bg-gray-200 shadow-[4px_4px_0px_#000000]"
        >
          ↻
        </button>
        <button
          onTouchStart={() => onKeyDown({ keyCode: 39 } as React.KeyboardEvent)}
          className="bg-white text-black border-4 border-black px-6 py-4 font-black text-xl active:bg-gray-200 shadow-[4px_4px_0px_#000000]"
        >
          →
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 w-full max-w-xs">
        <button
          onTouchStart={() => onKeyDown({ keyCode: 40 } as React.KeyboardEvent)}
          className="bg-red-500 text-white border-4 border-black px-6 py-4 font-black text-xl active:bg-red-700 shadow-[4px_4px_0px_#000000]"
        >
          DROP
        </button>
        <button
          onTouchStart={() => onKeyDown({ keyCode: 32 } as React.KeyboardEvent)}
          className="bg-yellow-400 text-black border-4 border-black px-6 py-4 font-black text-xl active:bg-yellow-600 shadow-[4px_4px_0px_#000000]"
        >
          SLAM
        </button>
      </div>

      {lose && (
        <LoseGame
          portrait={isPortrait}
          restartClick={restartClick}
          stopClick={stopClick}
          status={status}
          pixelSize={pixelSize}
          theme3d={false}
        />
      )}
    </div>
  );
};

export default Stage;
