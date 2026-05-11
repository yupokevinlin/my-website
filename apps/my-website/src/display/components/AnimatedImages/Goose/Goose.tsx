import React from "react";
import { Breakpoint } from "@/components/types";

export interface GooseProps {
  width: Breakpoint;
}

const gooseBirdBase =
  "w-20 min-w-[80px] h-[55px] min-h-[55px] select-none bg-cover bg-clip-border";

const Goose: React.FC<GooseProps> = (props) => {
  const { width } = props;
  const isSmXs: boolean = /xs|sm/.test(width);

  const groupAnim = isSmXs
    ? "goose-move-small 15s linear infinite, goose-sine 3s ease alternate infinite"
    : "goose-move 20s linear infinite, goose-sine 3s ease alternate infinite";

  const bgGoose = {
    background: "url(./resources/animations/goose.svg) no-repeat",
    backgroundSize: "cover",
  };
  const animForward = "bird-animate 0.5s steps(6) infinite";
  const animBackward = "bird-animate-opposite 0.5s steps(6) infinite";

  return (
    <div
      className="relative flex flex-col items-center justify-center flex-nowrap h-[135px] w-[200px]"
      style={{ animation: groupAnim }}
    >
      <div
        className={gooseBirdBase}
        style={{
          ...bgGoose,
          animation: animForward,
          transform: "translate(120px, 80px)",
          zIndex: 1,
        }}
      />
      <div
        className={gooseBirdBase}
        style={{
          ...bgGoose,
          animation: animBackward,
          transform: "translate(60px, 40px)",
          zIndex: 2,
        }}
      />
      <div
        className={gooseBirdBase}
        style={{ ...bgGoose, animation: animForward, zIndex: 3 }}
      />
      <div
        className={gooseBirdBase}
        style={{
          ...bgGoose,
          animation: animBackward,
          transform: "translate(60px, -40px)",
          zIndex: 4,
        }}
      />
      <div
        className={gooseBirdBase}
        style={{
          ...bgGoose,
          animation: animForward,
          transform: "translate(120px, -80px)",
          zIndex: 5,
        }}
      />
    </div>
  );
};

export default Goose;

