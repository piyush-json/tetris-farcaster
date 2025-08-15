import React from "react";

interface StatusRowProps {
  title: string;
  value: React.ReactNode;
  padding?: number;
  margin?: number;
  borderSize?: number;
  portrait?: boolean;
  backgroundColor?: string;
}

const StatusRow: React.FC<StatusRowProps> = ({
  title,
  value,
  padding = 15,
  margin = 10,
  borderSize = 3,
  portrait = false,
  backgroundColor = "black",
}) => (
  <div
    className={`transition-colors duration-500 border-white text-white font-sans mb-[${margin}px]`}
    style={{
      backgroundColor,
      borderWidth: borderSize,
      width: !portrait ? "100%" : undefined,
      padding: portrait ? `${padding}px ${padding / 2}px` : `${padding}px 0`,
    }}
  >
    <div className="w-full text-center">{title}</div>
    <div className="w-full text-center">{value}</div>
  </div>
);

export default StatusRow;
