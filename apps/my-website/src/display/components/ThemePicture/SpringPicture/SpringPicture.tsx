import React, { useEffect } from "react";
import { Breakpoint } from "@/components/types";
import BlueJayPigeon from "../../AnimatedImages/BlueJayPigeon/BlueJayPigeon";

export interface SpringPictureProps {
  width: Breakpoint;
  handleLoad(): void;
}

const SpringPicture: React.FC<SpringPictureProps> = (props) => {
  const { width, handleLoad } = props;

  useEffect(() => {
    const image: HTMLImageElement = document.createElement("img");
    image.src = "./resources/seasons/spring.svg";
    image.onload = () => { handleLoad(); };
  }, []);

  return (
    <div
      className="w-full h-full select-none bg-cover bg-no-repeat bg-scroll"
      style={{
        backgroundImage: "url(./resources/seasons/spring.svg), linear-gradient(0deg, #ffffff 50%, #76d0ff 80%, #47bfff 100%)",
        backgroundPosition: "70% 70%",
      }}
    >
      <BlueJayPigeon width={width}/>
    </div>
  );
};

export default SpringPicture;
