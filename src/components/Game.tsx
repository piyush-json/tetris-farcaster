import React, { useState, useEffect, useCallback } from "react";
import { useDrag } from "react-use-gesture";
import Stage from "./Stage";
import { useInterval } from "../hooks/useInterval";
import {
  PrintPlayerInMap,
  type Player,
  type Block,
  type Pixel,
} from "../lib/utils";

const STAGE_HEIGHT = 18;
const STAGE_WIDTH = 10;

const createInitialMap = (): Pixel[][] =>
  [...new Array(STAGE_HEIGHT)].map(() =>
    [...new Array(STAGE_WIDTH)].map(() => ({ fill: 0, color: "#000" })),
  );

// Brutalist high-contrast colors
const colors = [
  "#FF0000", // Pure red
  "#00FF00", // Pure green
  "#0000FF", // Pure blue
  "#FFFF00", // Pure yellow
  "#FF00FF", // Pure magenta
  "#00FFFF", // Pure cyan
  "#FFFFFF", // Pure white
];

const I: Block = {
  bloco: [
    [0, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ],
};
const O: Block = {
  bloco: [
    [1, 1],
    [1, 1],
  ],
};
const T: Block = {
  bloco: [
    [0, 0, 0],
    [1, 1, 1],
    [0, 1, 0],
  ],
};
const J: Block = {
  bloco: [
    [0, 1, 0],
    [0, 1, 0],
    [1, 1, 0],
  ],
};
const L: Block = {
  bloco: [
    [0, 1, 0],
    [0, 1, 0],
    [0, 1, 1],
  ],
};
const S: Block = {
  bloco: [
    [0, 1, 1],
    [1, 1, 0],
    [0, 0, 0],
  ],
};
const Z: Block = {
  bloco: [
    [1, 1, 0],
    [0, 1, 1],
    [0, 0, 0],
  ],
};

const getRandomBloco = (): Block => {
  const blocos = [I, O, T, J, L, S, Z];
  const bloco = structuredClone(
    blocos[Math.floor(Math.random() * blocos.length)],
  );
  bloco.color = colors[Math.floor(Math.random() * colors.length)];
  return bloco;
};

const getRandomPlayer = (player?: Player): Player => {
  let bloco, next;
  if (player && player.next) {
    bloco = JSON.parse(JSON.stringify(player.next));
    next = getRandomBloco();
  } else {
    bloco = getRandomBloco();
    next = getRandomBloco();
  }
  // Calculate proper center position based on piece width
  const pieceWidth = bloco.bloco[0] ? bloco.bloco[0].length : 2;
  const centerX = Math.floor((STAGE_WIDTH - pieceWidth) / 2);
  const pos: [number, number] = [0, centerX];
  return { pos, bloco, next };
};

interface GameProps {
  stopClick: () => void;
}

const Game: React.FC<GameProps> = ({ stopClick }) => {
  const [map, setMap] = useState(createInitialMap());
  const [player, setPlayer] = useState<Player | undefined>();
  const [down, setDown] = useState(false);
  const [pause, setPause] = useState(false);
  const [tick, setTick] = useState(Date.now());
  const [hintPlayer, setHintPlayer] = useState<Player | undefined>();
  const [spaceReleased, setSpaceReleased] = useState(true);
  const [lines, setlines] = useState(0);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [dragX, setDragX] = useState(0);
  const [dragY, setDragY] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  // Initialize the first player when component mounts
  useEffect(() => {
    if (!player && !gameOver) {
      setPlayer(getRandomPlayer());
    }
  }, [player, gameOver]);

  useEffect(() => {
    const levelBaseScore = 1000;
    const nextLevel = level + 1;
    const nextLevelScore =
      (levelBaseScore * nextLevel * nextLevel * nextLevel) / 5;
    if (score >= nextLevelScore) setLevel(level + 1);
  }, [level, score]);

  const restartGame = () => {
    setMap(createInitialMap());
    setlines(0);
    setScore(0);
    setLevel(1);
    setGameOver(false);
    setPlayer(getRandomPlayer());
    setPause(false);
  };

  const loseGame = () => {
    setGameOver(true);
  };

  const drop = () => {
    if (!player) {
      setPlayer(getRandomPlayer());
      return;
    }
    setPlayer((player) => {
      if (!player) return player;
      const newPos = getNewPlayerPos("down");
      if (player.pos[0] === newPos[0] && player.pos[1] === newPos[1]) {
        // Player can't move down anymore, place it on the map
        setMap((map) => {
          const mapWithPlayer = PrintPlayerInMap(player, map);
          const mapCleared = checkMap(mapWithPlayer);
          return mapCleared;
        });
        const newPlayer = getRandomPlayer(player);
        if (!validatePosition(newPlayer.pos, newPlayer.bloco)) {
          loseGame();
          return player; // Return current player to avoid crash
        }
        return newPlayer;
      }
      return { ...player, pos: newPos };
    });
  };

  const rotatePlayer = () => {
    if (!player || !player.bloco || !player.bloco.bloco) return;

    const clonedPlayer = structuredClone(player);
    let mtrx = clonedPlayer.bloco.bloco.map((_, index: number) =>
      clonedPlayer.bloco.bloco.map((column: number[]) => column[index]),
    );
    mtrx = mtrx.map((row: number[]) => row.reverse());

    const rotatedBloco = { ...player.bloco, bloco: mtrx };
    if (validatePosition(player.pos, rotatedBloco))
      setPlayer({ ...player, bloco: rotatedBloco });
  };

  const keyUp = ({ keyCode }: React.KeyboardEvent) => {
    if (pause || gameOver) return;
    const THRESHOLD = 80;
    if (keyCode === 40) {
      setDown(false);
      if (Date.now() - tick <= THRESHOLD) drop();
    }
    if (keyCode === 32) setSpaceReleased(true);
  };

  const forwardDown = () => {
    if (pause || gameOver) return;
    setPlayer((player) => {
      if (!player || !hintPlayer) return player;
      const playerCopy = JSON.parse(JSON.stringify(player));
      playerCopy.pos = [...hintPlayer.pos];
      setMap((map) => {
        const mapWithPlayer = PrintPlayerInMap(playerCopy, map);
        const mapCleared = checkMap(mapWithPlayer);
        return mapCleared;
      });
      const newPlayer = getRandomPlayer(player);
      if (!validatePosition(newPlayer.pos, newPlayer.bloco)) {
        loseGame();
        return player; // Return current player to avoid crash
      }
      return newPlayer;
    });
  };

  const keyDown = ({ keyCode }: React.KeyboardEvent) => {
    if (pause || gameOver) return;
    switch (keyCode) {
      case 37:
        setPlayer((player) =>
          player ? { ...player, pos: getNewPlayerPos("left") } : player,
        );
        break;
      case 38:
        rotatePlayer();
        break;
      case 39:
        setPlayer((player) =>
          player ? { ...player, pos: getNewPlayerPos("right") } : player,
        );
        break;
      case 40:
        setTick(Date.now());
        setDown(true);
        break;
      case 32:
        if (spaceReleased) {
          setSpaceReleased(false);
          forwardDown();
        }
        break;
      default:
        break;
    }
  };

  const checkMap = useCallback(
    (map: Pixel[][]): Pixel[][] => {
      if (!map || map.length === 0) return map;

      const rowsClear: number[] = [];
      map.forEach((row, y) => {
        if (!row || row.length === 0) return;

        let clear = true;
        row.forEach((pixel) => {
          if (!pixel || pixel.fill === 0) clear = false;
        });
        if (clear) rowsClear.push(y);
      });

      if (rowsClear.length > 0) {
        const newMap = map.map((row) => [...row]); // Deep copy

        // Remove cleared rows from bottom to top to avoid index issues
        rowsClear
          .sort((a, b) => b - a)
          .forEach((rowIndex) => {
            // Remove the cleared row
            newMap.splice(rowIndex, 1);
            // Add a new empty row at the top
            newMap.unshift(
              [...new Array(STAGE_WIDTH)].map(() => ({
                fill: 0,
                color: "#000",
              })),
            );
          });

        setlines((quant) => quant + rowsClear.length);
        const bonusLevel = 100 * (level * level);
        const bonusRows = 40 * (rowsClear.length * rowsClear.length - 1);
        setScore(
          (score) => score + 300 * rowsClear.length + bonusRows + bonusLevel,
        );
        return newMap;
      }
      return map;
    },
    [level],
  );

  const validatePosition = useCallback(
    (pos: [number, number], bloco: Block) => {
      if (!bloco || !bloco.bloco || !pos) return false;

      for (let y = 0; y < bloco.bloco.length; y++)
        for (let x = 0; x < bloco.bloco[y].length; x++)
          if (bloco.bloco[y][x] === 1) {
            const mapY = pos[0] + y;
            const mapX = pos[1] + x;
            if (
              mapY >= STAGE_HEIGHT ||
              mapY < 0 ||
              mapX < 0 ||
              mapX >= STAGE_WIDTH ||
              !map[mapY] ||
              !map[mapY][mapX] ||
              map[mapY][mapX].fill === 1
            )
              return false;
          }
      return true;
    },
    [map],
  );

  const calculateHintPlayer = useCallback(
    (player: Player): Player => {
      if (!player || !player.bloco) {
        return player;
      }

      const hintBloco = structuredClone(player.bloco);
      let hintPosition: [number, number] = [...player.pos];
      while (
        validatePosition([hintPosition[0] + 1, hintPosition[1]], hintBloco)
      )
        hintPosition = [hintPosition[0] + 1, hintPosition[1]];
      return { pos: hintPosition, bloco: hintBloco, next: player.next };
    },
    [validatePosition],
  );

  const getNewPlayerPos = useCallback(
    (movement: "down" | "left" | "right") => {
      let newPos: [number, number] = player ? [...player.pos] : [0, 0];
      if (!player) return newPos;
      if (movement === "down") newPos = [player.pos[0] + 1, player.pos[1]];
      if (movement === "left") newPos = [player.pos[0], player.pos[1] - 1];
      if (movement === "right") newPos = [player.pos[0], player.pos[1] + 1];
      if (!validatePosition(newPos, player.bloco)) return player.pos;
      return newPos;
    },
    [player, validatePosition],
  );

  useInterval(
    () => {
      drop();
    },
    pause || gameOver ? null : down ? 50 : Math.max(50, 450 - (level - 1) * 20),
  );

  useEffect(() => {
    if (!player) return;
    setHintPlayer(calculateHintPlayer(player));
  }, [player, calculateHintPlayer]);

  const bind = useDrag(
    ({ down, movement: [mx, my], velocity }) => {
      if (pause || gameOver) return;

      const THRESHOLD = 20;
      const FORCE_THRESHOLD = 1;
      if (down) {
        if (Math.abs(mx - dragX) > THRESHOLD) {
          if (mx - dragX > 0)
            setPlayer((player) =>
              player ? { ...player, pos: getNewPlayerPos("right") } : player,
            );
          else
            setPlayer((player) =>
              player ? { ...player, pos: getNewPlayerPos("left") } : player,
            );
          setDragX(mx);
        }
        if (Math.abs(my - dragY) > THRESHOLD) {
          if (velocity > FORCE_THRESHOLD) {
            if (spaceReleased) {
              setSpaceReleased(false);
              forwardDown();
            }
          } else if (my - dragY > 0) drop();
          setDragY(my);
        }
      } else {
        setDragX(0);
        setDragY(0);
        setSpaceReleased(true);
      }
    },
    { filterTaps: true, lockDirection: true },
  );

  if (!player || !map || !hintPlayer)
    return (
      <div className="w-screen h-screen bg-black flex items-center justify-center">
        <div className="text-white text-6xl font-black animate-pulse">
          LOADING
        </div>
      </div>
    );
  return (
    <Stage
      lose={gameOver}
      restartClick={restartGame}
      stopClick={stopClick}
      map={map}
      player={player}
      hint={hintPlayer}
      paused={pause}
      status={{ lines, score, level }}
      onBlur={() => {}} // Removed auto-pause on blur
      onFocus={() => {}} // Removed auto-resume on focus
      onKeyUp={keyUp}
      onKeyDown={keyDown}
      onClick={() => rotatePlayer()}
      {...bind()}
    />
  );
};

export default Game;
