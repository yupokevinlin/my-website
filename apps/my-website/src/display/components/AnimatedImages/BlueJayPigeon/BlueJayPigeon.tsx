import React from "react";
import { Breakpoint } from "@/components/types";

export interface BlueJayPigeonProps {
  width: Breakpoint;
}

const birdBase = "relative left-[-30%] w-20 min-w-[80px] h-[55px] min-h-[55px] select-none bg-cover bg-clip-border";

const BlueJayPigeon: React.FC<BlueJayPigeonProps> = (props) => {
  const { width } = props;
  const isSmXs: boolean = /xs|sm/.test(width);

  const bjLeftAnim  = `bird-animate .5s steps(7) infinite, bird-move-left  ${isSmXs ? "10s" : "20s"} linear infinite, bird-sine-bluejay 3s ease alternate infinite`;
  const bjRightAnim = `bird-animate .5s steps(7) infinite, bird-move-right ${isSmXs ? "10s" : "20s"} linear infinite, bird-sine-bluejay 3s ease alternate infinite`;
  const pgLeftAnim  = `bird-animate .4s steps(9) infinite, bird-move-left  ${isSmXs ? "10s" : "20s"} linear infinite, bird-sine-bluejay 2s ease alternate infinite`;
  const pgRightAnim = `bird-animate .4s steps(9) infinite, bird-move-right ${isSmXs ? "10s" : "20s"} linear infinite, bird-sine-bluejay 2s ease alternate infinite`;

  return (
    <React.Fragment>
      <div
        className={birdBase}
        style={{ background: "url(./resources/animations/bluejayLeft.svg) no-repeat", backgroundSize: "cover", animation: bjLeftAnim, animationDelay: "0s", transform: isSmXs ? "translateY(5vh)" : "translateY(10vh)" }}
      />
      <div
        className={birdBase}
        style={{ background: "url(./resources/animations/bluejayRight.svg) no-repeat", backgroundSize: "cover", animation: bjRightAnim, animationDelay: isSmXs ? "5s" : "3s", transform: isSmXs ? "translateY(calc(-55px + 22vh))" : "translateY(calc(-55px + 25vh))" }}
      />
      {!isSmXs ? (
        <React.Fragment>
          <div
            className={birdBase}
            style={{ background: "url(./resources/animations/bluejayLeft.svg) no-repeat", backgroundSize: "cover", animation: bjLeftAnim, animationDelay: "7s", transform: "translateY(calc(-110px + 40vh))" }}
          />
          <div
            className={birdBase}
            style={{ background: "url(./resources/animations/pigeonLeft.svg) no-repeat", backgroundSize: "cover", animation: pgLeftAnim, animationDelay: "10s", transform: "translateY(calc(-165px + 10vh))" }}
          />
        </React.Fragment>
      ) : null}
      <div
        className={birdBase}
        style={{ background: "url(./resources/animations/pigeonRight.svg) no-repeat", backgroundSize: "cover", animation: pgRightAnim, animationDelay: "11s", transform: isSmXs ? "translateY(calc(-110px + 20vh))" : "translateY(calc(-220px + 20vh))" }}
      />
    </React.Fragment>
  );
};

export default BlueJayPigeon;

