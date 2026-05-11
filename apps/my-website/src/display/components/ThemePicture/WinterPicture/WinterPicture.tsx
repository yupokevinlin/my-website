import React, { useEffect } from "react";
import { Breakpoint } from "@/components/types";
import { getSnowflakeCount, getSnowflakeRadius, getSnowflakeSpeed, getSnowflakeWind } from "./types";
import dynamic from "next/dynamic";

export interface WinterPictureProps {
  width: Breakpoint;
  handleLoad(): void;
}

const ReactSnowfall = dynamic(() => import("react-snowfall"), { ssr: false });

const WinterPicture: React.FC<WinterPictureProps> = (props) => {
  const { width, handleLoad } = props;

  useEffect(() => {
    const image: HTMLImageElement = document.createElement("img");
    image.src = "./resources/seasons/winter.svg";
    image.onload = () => { handleLoad(); };
  }, []);

  return (
    <div
      className="w-full h-full select-none bg-cover bg-no-repeat bg-scroll"
      style={{
        backgroundImage: "url(./resources/seasons/winter.svg), linear-gradient(0deg, #ffffff 50%, #e4ecf4 80%, #91b4d2 100%)",
        backgroundPosition: "70% 70%",
      }}
    >
      <ReactSnowfall
        color="#fff"
        snowflakeCount={getSnowflakeCount(width)}
        radius={getSnowflakeRadius(width)}
        speed={getSnowflakeSpeed(width)}
        wind={getSnowflakeWind(width)}
      />
    </div>
  );
};

export default WinterPicture;

