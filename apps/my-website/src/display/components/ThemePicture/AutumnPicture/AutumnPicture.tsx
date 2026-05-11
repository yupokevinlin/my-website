import React, { useEffect } from "react";
import { Breakpoint } from "@/components/types";
import Goose from "../../AnimatedImages/Goose/Goose";
import CrowMallard from "../../AnimatedImages/CrowMallard/CrowMallard";

export interface AutumnPictureProps {
  width: Breakpoint;
  handleLoad(): void;
}

const AutumnPicture: React.FC<AutumnPictureProps> = (props) => {
  const { width, handleLoad } = props;

  useEffect(() => {
    const image: HTMLImageElement = document.createElement("img");
    image.src = "./resources/seasons/autumn.svg";
    image.onload = () => { handleLoad(); };
  }, []);

  return (
    <div
      className="w-full h-full select-none bg-cover bg-no-repeat bg-scroll"
      style={{
        backgroundImage: "url(./resources/seasons/autumn.svg), linear-gradient(0deg, #ffffff 50%, #76d0ff 80%, #47bfff 100%)",
        backgroundPosition: "70% 70%",
      }}
    >
      <Goose width={width}/>
      <CrowMallard width={width}/>
    </div>
  );
};

export default AutumnPicture;

