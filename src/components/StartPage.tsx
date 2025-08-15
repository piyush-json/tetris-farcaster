import React from "react";

interface StartPageProps {
  startClick: () => void;
}

const StartPage: React.FC<StartPageProps> = ({ startClick }) => {
  return (
    <div className="w-screen h-screen bg-black flex flex-col items-center justify-center font-mono overflow-hidden">
      {/* Mobile-optimized Title */}
      <div className="text-white text-4xl sm:text-8xl font-black tracking-widest mb-4 sm:mb-8 transform -skew-x-12 px-4 text-center">
        TETRIS
      </div>

      {/* Compact Subtitle */}
      <div className="text-white text-sm sm:text-xl font-bold mb-6 sm:mb-8 border-2 border-white px-3 py-2 text-center">
        HYPER BRUTAL EDITION
      </div>

      {/* Mobile-optimized Start Button */}
      <button
        onClick={startClick}
        className="bg-red-500 text-white border-4 sm:border-8 border-white px-8 sm:px-16 py-4 sm:py-8 text-2xl sm:text-4xl font-black tracking-widest active:bg-red-700 transform transition-all duration-100 shadow-[4px_4px_0px_#ffffff] sm:shadow-[8px_8px_0px_#ffffff] select-none"
      >
        START
      </button>

      {/* Smaller Decorative Elements for Mobile */}
      <div className="absolute top-2 left-2 w-8 h-8 sm:w-16 sm:h-16 bg-yellow-400 border-2 sm:border-4 border-black transform rotate-45"></div>
      <div className="absolute top-2 right-2 w-8 h-8 sm:w-16 sm:h-16 bg-blue-500 border-2 sm:border-4 border-black transform -rotate-45"></div>
      <div className="absolute bottom-2 left-2 w-8 h-8 sm:w-16 sm:h-16 bg-green-500 border-2 sm:border-4 border-black transform rotate-12"></div>
      <div className="absolute bottom-2 right-2 w-8 h-8 sm:w-16 sm:h-16 bg-purple-500 border-2 sm:border-4 border-black transform -rotate-12"></div>
    </div>
  );
};

export default StartPage;
