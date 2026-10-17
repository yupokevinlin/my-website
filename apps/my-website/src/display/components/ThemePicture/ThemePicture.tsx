import React from "react";
import { Breakpoint } from "@/components/types";
import SpringPicture from "./SpringPicture/SpringPicture";
import SummerPicture from "./SummerPicture/SummerPicture";
import AutumnPicture from "./AutumnPicture/AutumnPicture";
import WinterPicture from "./WinterPicture/WinterPicture";
import { ThemePictureSeason } from "./types";
import clsx from "clsx";
import OverlayText from "./OverlayText/OverlayText";
import useWidth from "../../../hooks/useWidth";

export interface ThemePictureProps {
  season: ThemePictureSeason;
  // Called as each season's picture finishes loading
  handlePictureLoad(season: ThemePictureSeason): void;
}

const ThemePicture: React.FC<ThemePictureProps> = (props) => {
  const width: Breakpoint = useWidth();
  const { season, handlePictureLoad } = props;

  const pictureWrapperBase = "relative w-full h-full transition-opacity duration-500";

  return (
    <div className="w-full select-none h-screen overflow-hidden" style={{ maxHeight: "-webkit-fill-available", minHeight: "-webkit-fill-available" }}>
      <OverlayText width={width}>
        <div className={clsx(pictureWrapperBase, season !== ThemePictureSeason.SPRING && "opacity-0")}>
          <SpringPicture width={width} handleLoad={() => handlePictureLoad(ThemePictureSeason.SPRING)}/>
        </div>
        <div className={clsx(pictureWrapperBase, season !== ThemePictureSeason.SUMMER && "opacity-0")} style={{ top: "-100%" }}>
          <SummerPicture handleLoad={() => handlePictureLoad(ThemePictureSeason.SUMMER)}/>
        </div>
        <div className={clsx(pictureWrapperBase, season !== ThemePictureSeason.AUTUMN && "opacity-0")} style={{ top: "-200%" }}>
          <AutumnPicture width={width} handleLoad={() => handlePictureLoad(ThemePictureSeason.AUTUMN)}/>
        </div>
        <div className={clsx(pictureWrapperBase, season !== ThemePictureSeason.WINTER && "opacity-0")} style={{ top: "-300%" }}>
          <WinterPicture width={width} handleLoad={() => handlePictureLoad(ThemePictureSeason.WINTER)}/>
        </div>
      </OverlayText>
    </div>
  );
};

export default ThemePicture;

