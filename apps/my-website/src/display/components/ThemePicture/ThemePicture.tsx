import React, { useRef } from "react";
import { Breakpoint } from "@/components/types";
import SpringPicture from "./SpringPicture/SpringPicture";
import SummerPicture from "./SummerPicture/SummerPicture";
import AutumnPicture from "./AutumnPicture/AutumnPicture";
import WinterPicture from "./WinterPicture/WinterPicture";
import { ThemePictureLoad, ThemePictureSeason } from "./types";
import clsx from "clsx";
import OverlayText from "./OverlayText/OverlayText";
import useWidth from "../../../hooks/useWidth";

export interface ThemePictureProps {
  season: ThemePictureSeason;
  handleLoadComplete(): void;
}

const ThemePicture: React.FC<ThemePictureProps> = (props) => {
  const width: Breakpoint = useWidth();
  const { season, handleLoadComplete } = props;

  const themePictureLoad: React.MutableRefObject<ThemePictureLoad> = useRef({
    spring: false,
    summer: false,
    autumn: false,
    winter: false,
  });

  const isAllLoaded = (loadStatus: ThemePictureLoad): boolean =>
    loadStatus.spring && loadStatus.summer && loadStatus.autumn && loadStatus.winter;

  const handleSpringLoadComplete = (): void => {
    themePictureLoad.current = { ...themePictureLoad.current, spring: true };
    if (isAllLoaded(themePictureLoad.current)) handleLoadComplete();
  };
  const handleSummerLoadComplete = (): void => {
    themePictureLoad.current = { ...themePictureLoad.current, summer: true };
    if (isAllLoaded(themePictureLoad.current)) handleLoadComplete();
  };
  const handleAutumnLoadComplete = (): void => {
    themePictureLoad.current = { ...themePictureLoad.current, autumn: true };
    if (isAllLoaded(themePictureLoad.current)) handleLoadComplete();
  };
  const handleWinterLoadComplete = (): void => {
    themePictureLoad.current = { ...themePictureLoad.current, winter: true };
    if (isAllLoaded(themePictureLoad.current)) handleLoadComplete();
  };

  const pictureWrapperBase = "relative w-full h-full transition-opacity duration-500";

  return (
    <div className="w-full select-none h-screen overflow-hidden" style={{ maxHeight: "-webkit-fill-available", minHeight: "-webkit-fill-available" }}>
      <OverlayText width={width}>
        <div className={clsx(pictureWrapperBase, season !== ThemePictureSeason.SPRING && "opacity-0")}>
          <SpringPicture width={width} handleLoad={handleSpringLoadComplete}/>
        </div>
        <div className={clsx(pictureWrapperBase, season !== ThemePictureSeason.SUMMER && "opacity-0")} style={{ top: "-100%" }}>
          <SummerPicture handleLoad={handleSummerLoadComplete}/>
        </div>
        <div className={clsx(pictureWrapperBase, season !== ThemePictureSeason.AUTUMN && "opacity-0")} style={{ top: "-200%" }}>
          <AutumnPicture width={width} handleLoad={handleAutumnLoadComplete}/>
        </div>
        <div className={clsx(pictureWrapperBase, season !== ThemePictureSeason.WINTER && "opacity-0")} style={{ top: "-300%" }}>
          <WinterPicture width={width} handleLoad={handleWinterLoadComplete}/>
        </div>
      </OverlayText>
    </div>
  );
};

export default ThemePicture;

