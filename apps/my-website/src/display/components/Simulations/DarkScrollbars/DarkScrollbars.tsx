import React from "react";
import Scrollbars, { ScrollValues } from "@/components/Scrollbars";

export interface DarkScrollbarsProps {
  children?: React.ReactNode;
  onScrollFrame?(values: ScrollValues): void;
}

const WIDTH = "10px";

// The site's custom scrollbar (as on the home page), in light-on-dark colours
// for the /ray-tracing pages. Fills its parent, which must have a height.
const DarkScrollbars: React.FC<DarkScrollbarsProps> = ({ children, onScrollFrame }) => (
  <Scrollbars
    style={{ width: "100%", height: "100%" }}
    onScrollFrame={onScrollFrame}
    renderView={({ style, ...p }) => (
      <div {...p} style={{ ...style, overflowX: "hidden" }} className="scrollbars-view"/>
    )}
    renderTrackVertical={({ style, ...p }) => (
      <div {...p} style={{ ...style, width: WIDTH, bottom: "2px", top: "2px", right: "2px", display: "block", position: "absolute", zIndex: 30 }} className="track-vertical"/>
    )}
    renderThumbHorizontal={({ style, ...p }) => (
      <div {...p} style={{ ...style }} className="thumb-horizontal"/>
    )}
    renderThumbVertical={({ style, ...p }) => (
      <div {...p} style={{ ...style, width: WIDTH, backgroundColor: "rgba(255,255,255,0.19)", borderRadius: WIDTH }} className="thumb-vertical"/>
    )}
  >
    {children}
  </Scrollbars>
);

export default DarkScrollbars;
