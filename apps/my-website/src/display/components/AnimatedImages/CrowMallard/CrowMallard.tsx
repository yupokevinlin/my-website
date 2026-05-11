import React from "react";
import { Breakpoint } from "@/components/types";

export interface CrowMallardProps {
  width: Breakpoint;
}

const birdBase = "relative left-[-30%] w-20 min-w-[80px] h-[55px] min-h-[55px] select-none bg-cover bg-clip-border";

const CrowMallard: React.FC<CrowMallardProps> = (props) => {
  const { width } = props;
  const isSmXs: boolean = /xs|sm/.test(width);
  const dur = isSmXs ? "10s" : "20s";

  const crowAnim    = `bird-animate .5s steps(10) infinite, crow-move ${dur} linear infinite, crow-sine 2.5s ease alternate infinite`;
  const mallardAnim = `bird-animate .4s steps(7) infinite,  crow-move ${dur} linear infinite, mallard-sine 2s ease alternate infinite`;

  return (
    <React.Fragment>
      <div
        className={birdBase}
        style={{ background: "url(./resources/animations/crow.svg) no-repeat", backgroundSize: "cover", animation: crowAnim, animationDelay: "2s", transform: isSmXs ? "translateY(5vh)" : "translateY(10vh)" }}
      />
      <div
        className={birdBase}
        style={{ background: "url(./resources/animations/mallard.svg) no-repeat", backgroundSize: "cover", animation: mallardAnim, animationDelay: isSmXs ? "5s" : "3.5s", transform: isSmXs ? "translateY(calc(-55px + 10vh))" : "translateY(calc(-55px + 20vh))" }}
      />
      {!isSmXs ? (
        <React.Fragment>
          <div
            className={birdBase}
            style={{ background: "url(./resources/animations/crow.svg) no-repeat", backgroundSize: "cover", animation: crowAnim, animationDelay: "10s", transform: "translateY(calc(-110px + 5vh))" }}
          />
          <div
            className={birdBase}
            style={{ background: "url(./resources/animations/mallard.svg) no-repeat", backgroundSize: "cover", animation: mallardAnim, animationDelay: "12.5s", transform: "translateY(calc(-165px + 15vh))" }}
          />
        </React.Fragment>
      ) : null}
    </React.Fragment>
  );
};

export default CrowMallard;

