import React, { useEffect } from "react";
import Fireflies from "../../AnimatedImages/Fireflies/Fireflies";

export interface SummerPictureProps {
  handleLoad(): void;
}

const SummerPicture: React.FC<SummerPictureProps> = (props) => {
  const { handleLoad } = props;

  useEffect(() => {
    const image: HTMLImageElement = document.createElement("img");
    image.src = "./resources/seasons/summer.svg";
    image.onload = () => { handleLoad(); };
  }, []);

  return (
    <Fireflies>
      <div
        className="w-full h-full select-none bg-cover bg-no-repeat bg-scroll"
        style={{
          backgroundImage: "url(./resources/seasons/summer.svg), linear-gradient(0deg, #e54009 0%, #e54009 58%, #f29939 63%, #919191 65%, #4a5b7b 75%, #0c0c15 100%)",
          backgroundPosition: "70% 70%",
        }}
      />
    </Fireflies>
  );
};

export default SummerPicture;
