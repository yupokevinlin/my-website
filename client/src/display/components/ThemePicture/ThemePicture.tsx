import React, {useRef} from "react";
import {createStyles, Theme, useTheme, withWidth} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import {Breakpoint} from "@material-ui/core/styles/createBreakpoints";
import SpringPicture from "./SpringPicture/SpringPicture";
import SummerPicture from "./SummerPicture/SummerPicture";
import AutumnPicture from "./AutumnPicture/AutumnPicture";
import WinterPicture from "./WinterPicture/WinterPicture";
import {ThemePictureLoad, ThemePictureSeason} from "./types";
import clsx from "clsx";

export type ThemePictureProps = ThemePictureDataProps & ThemePictureStyleProps & ThemePictureEventProps;

export interface ThemePictureDataProps {
  season: ThemePictureSeason;
}

export interface ThemePictureStyleProps {
  width: Breakpoint;
}

export interface ThemePictureEventProps {
  handleLoadComplete(): void;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    themePictureRoot: {
      width: "100%",
      mouseEvents: "none",
      userDrag: "none",
      userSelect: "none",
      height: "100vh",
      maxHeight: "-webkit-fill-available",
      minHeight: "-webkit-fill-available",
      overflow: "hidden",
    },
    pictureWrapper: {
      position: "relative",
      width: "100%",
      height: "100%",
      opacity: 1,
      transition: theme.transitions.create("opacity", {
        easing: theme.transitions.easing.sharp,
        duration: 500,
      }),
    },
    pictureWrapperHidden: {
      opacity: 0,
    },
  }),
);

const ThemePicture: React.FC<ThemePictureProps> = (props) => {
  const theme: Theme = useTheme();
  const classes = useStyles();

  const {
    width,
    season,
    handleLoadComplete,
  } = props;

  const themePictureLoad: React.MutableRefObject<ThemePictureLoad> = useRef({
    spring: false,
    summer: false,
    autumn: false,
    winter: false,
  });

  const isAllLoaded = (loadStatus: ThemePictureLoad): boolean => {
    return loadStatus.spring && loadStatus.summer && loadStatus.autumn && loadStatus.winter;
  };

  const handleSpringLoadComplete = (): void => {
    themePictureLoad.current = {
      ...themePictureLoad.current,
      spring: true,
    }
    if (isAllLoaded(themePictureLoad.current)) {
      handleLoadComplete();
    }
  };
  const handleSummerLoadComplete = (): void => {
    themePictureLoad.current = {
      ...themePictureLoad.current,
      summer: true,
    }
    if (isAllLoaded(themePictureLoad.current)) {
      handleLoadComplete();
    }
  };
  const handleAutumnLoadComplete = (): void => {
    themePictureLoad.current = {
      ...themePictureLoad.current,
      autumn: true,
    }
    if (isAllLoaded(themePictureLoad.current)) {
      handleLoadComplete();
    }
  };
  const handleWinterLoadComplete = (): void => {
    themePictureLoad.current = {
      ...themePictureLoad.current,
      winter: true,
    }
    if (isAllLoaded(themePictureLoad.current)) {
      handleLoadComplete();
    }
  };

  return (
    <div className={classes.themePictureRoot}>
      <div className={clsx(classes.pictureWrapper, {
        [classes.pictureWrapperHidden]: season !== ThemePictureSeason.SPRING
      })}>
        <SpringPicture width={width} handleLoad={handleSpringLoadComplete}/>
      </div>
      <div className={clsx(classes.pictureWrapper, {
        [classes.pictureWrapperHidden]: season !== ThemePictureSeason.SUMMER
      })} style={{top: "-100%"}}>
        <SummerPicture width={width} handleLoad={handleSummerLoadComplete}/>
      </div>
      <div className={clsx(classes.pictureWrapper, {
        [classes.pictureWrapperHidden]: season !== ThemePictureSeason.AUTUMN
      })} style={{top: "-200%"}}>
        <AutumnPicture width={width} handleLoad={handleAutumnLoadComplete}/>
      </div>
      <div className={clsx(classes.pictureWrapper, {
        [classes.pictureWrapperHidden]: season !== ThemePictureSeason.WINTER
      })} style={{top: "-300%"}}>
        <WinterPicture width={width} handleLoad={handleWinterLoadComplete}/>
      </div>
    </div>
  );
};

export default withWidth()(ThemePicture);

