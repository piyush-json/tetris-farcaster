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
  onClick: (event: React.MouseEvent) => void;
}

interface PixelComponentProps {
  fill: number;
  color?: string;
  hint?: boolean;
  size: number;
  topBloco?: boolean;
  zIndex?: number;
}

// Compact pixel component for mobile
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
        className="border border-white bg-transparent"
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
      className="border border-black"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: fill ? color : "#000",
        zIndex: zIndex,
        boxShadow: fill && topBloco ? "1px 1px 0px #ffffff" : "none",
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

  // Mobile-optimized pixel size - make it bigger since no buttons
  const availableHeight = height; // Much less reserved space since no buttons
  const availableWidth = width - 20; // Reduced margins

  const pixelSizeByHeight = Math.floor(availableHeight / 18);
  const pixelSizeByWidth = Math.floor(availableWidth / 10);
  const pixelSize = Math.min(pixelSizeByHeight, pixelSizeByWidth, 35); // Increased max size significantly

  const isPortrait = height > width;

  useEffect(() => {
    if (!lose && stageRef.current) {
      stageRef.current.focus();
    }
  }, [lose]);

  return (
    <div className="w-screen h-screen bg-black flex flex-col items-center justify-start font-mono overflow-hidden">
      {/* Compact Header */}
      <div className="w-full bg-white text-black p-0.5 text-center">
        <div className="text-xs font-black tracking-wider">TETRIS</div>
        <div className="flex justify-between text-[10px] font-bold selectable px-2">
          <span>SCORE: {status.score}</span>
          <span>LV: {status.level}</span>
          <span>LINES: {status.lines}</span>
        </div>
      </div>

      {/* Game Stage */}
      <div className="flex-1 flex items-center justify-center py-1 relative">
        {/* Instructions overlay for mobile */}
        {/* <div className="absolute top-4 left-4 right-4 z-50 bg-black bg-opacity-75 text-white text-xs p-2 rounded border border-white">
          <div className="text-center font-bold">TOUCH CONTROLS</div>
          <div className="text-center">
            Drag ← → to move • Tap to rotate • Drag ↓ to drop • Fast drag ↓ to
            slam
          </div>
        </div> */}

        <div
          ref={stageRef}
          tabIndex={0}
          {...others}
          onBlur={onBlur}
          onFocus={onFocus}
          onKeyUp={onKeyUp}
          onKeyDown={onKeyDown}
          onClick={onClick}
          className="bg-black border-2 border-white focus:outline-none focus:border-red-500 touch-none"
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
                const zIndex =
                  !playerFill && !pixel.fill && playerHint ? 99 : y;

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
