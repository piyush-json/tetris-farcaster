import React from "react";

interface LoseGameProps {
  pixelSize: number;
  portrait: boolean;
  theme3d: boolean;
  restartClick: () => void;
  stopClick: () => void;
  status: { score: number; level: number; lines: number };
}

const LoseGame: React.FC<LoseGameProps> = ({
  pixelSize: _pixelSize, // eslint-disable-line @typescript-eslint/no-unused-vars
  portrait: _portrait, // eslint-disable-line @typescript-eslint/no-unused-vars
  theme3d: _theme3d, // eslint-disable-line @typescript-eslint/no-unused-vars
  restartClick,
  stopClick,
  status,
}) => {
  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 w-screen h-screen z-50 bg-black bg-opacity-90 flex justify-center items-center font-mono">
      <div className="bg-black border-4 border-white text-white flex flex-col max-w-sm w-full mx-4">
        {/* Compact Title */}
        <div className="bg-red-500 text-white p-3 text-center border-b-2 border-white">
          <div className="text-2xl font-black tracking-widest">GAME OVER</div>
        </div>

        {/* Compact Stats */}
        <div className="p-4 space-y-2">
          <div className="bg-white text-black p-2 text-center border-2 border-black">
            <div className="text-lg font-black">SCORE: {status.score}</div>
          </div>
          <div className="bg-white text-black p-2 text-center border-2 border-black">
            <div className="text-lg font-black">LEVEL: {status.level}</div>
          </div>
          <div className="bg-white text-black p-2 text-center border-2 border-black">
            <div className="text-lg font-black">LINES: {status.lines}</div>
          </div>
        </div>

        {/* Compact Buttons */}
        <div className="p-3 space-y-3 border-t-2 border-white">
          <button
            onClick={restartClick}
            className="w-full bg-green-500 text-white border-2 border-white p-3 text-lg font-black active:bg-green-700 shadow-[2px_2px_0px_#ffffff] select-none"
          >
            RESTART
          </button>
          <button
            onClick={stopClick}
            className="w-full bg-red-500 text-white border-2 border-white p-3 text-lg font-black active:bg-red-700 shadow-[2px_2px_0px_#ffffff] select-none"
          >
            QUIT
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoseGame;
