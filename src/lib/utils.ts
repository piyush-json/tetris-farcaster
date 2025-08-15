// Tetris game utility functions
export interface Pixel {
  fill: number;
  color: string;
}

export interface Block {
  bloco: number[][];
  color?: string;
}

export interface Player {
  pos: [number, number];
  bloco: Block;
  next?: Block;
}

export const PrintPlayerInMap = (player: Player, map: Pixel[][]): Pixel[][] => {
  if (!player || !player.bloco || !player.bloco.bloco || !map) {
    return map;
  }

  const newMap = map.map((arr) => arr.slice());
  for (let y = 0; y < player.bloco.bloco.length; y++) {
    for (let x = 0; x < player.bloco.bloco[y].length; x++) {
      if (player.bloco.bloco[y][x] === 1) {
        const pixelY = player.pos[0] + y;
        const pixelX = player.pos[1] + x;
        if (
          pixelY >= 0 &&
          pixelY < newMap.length &&
          pixelX >= 0 &&
          pixelX < newMap[0].length &&
          newMap[pixelY] &&
          newMap[pixelY][pixelX]
        ) {
          newMap[pixelY][pixelX] = {
            fill: 1,
            color: player.bloco.color || "#fff",
          };
        }
      }
    }
  }
  return newMap;
};
