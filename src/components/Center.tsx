import React from "react";

interface CenterProps {
  children: React.ReactNode;
}

const Center: React.FC<CenterProps> = ({ children }) => (
  <div className="w-screen h-screen flex items-center justify-center border border-red-500">
    {children}
  </div>
);

export default Center;
