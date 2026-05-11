import React from "react";
import OverlayTextRow from "./OverlayTextRow/OverlayTextRow";
import { Breakpoint } from "@/components/types";

export interface OverlayTextProps {
  width: Breakpoint;
  children?: React.ReactNode;
}

const OverlayText: React.FC<OverlayTextProps> = (props) => {
  const { width } = props;

  return (
    <div className="h-full w-full">
      <div className="h-full w-full block relative top-0 left-0 z-0">
        <div className="relative h-max w-max backdrop-blur-[4px] top-[5vh] left-[5vw] py-[1vh] px-[1vw]">
          <OverlayTextRow text="Adaptive" index={0} width={width} />
          <OverlayTextRow text="Passionate" index={1} width={width} />
          <OverlayTextRow text="Innovative" index={2} width={width} />
        </div>
      </div>
      <div className="h-full w-full relative top-[-100%] left-0 z-[-1]">
        {props.children}
      </div>
    </div>
  );
};

export default OverlayText;

