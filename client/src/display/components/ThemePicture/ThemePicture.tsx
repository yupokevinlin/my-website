import React, {useState} from "react";
import {createStyles, Theme, useTheme, withWidth} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import Snowfall from "react-snowfall";
import clsx from "clsx";
import {Breakpoint} from "@material-ui/core/styles/createBreakpoints";

export type ThemePictureProps = ThemePictureDataProps & ThemePictureStyleProps & ThemePictureEventProps;

export interface ThemePictureDataProps {

}

export interface ThemePictureStyleProps {
  width: Breakpoint;
}

export interface ThemePictureEventProps {

}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    themePictureRoot: {
      height: "100%",
      width: "100%",
      opacity: 1,
      mouseEvents: "none",
      userDrag: "none",
      userSelect: "none",
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-end",
    },
    themePictureRootNotLoaded: {
      opacity: 0,
    },
    themePicture: {
      width: "100%",
      height: "auto",
      background: "linear-gradient(0deg, #ffffff 50%, #e4ecf4 80%, #91b4d2 100%)",
      mouseEvents: "none",
      userDrag: "none",
      userSelect: "none",
    },
  }),
);

const ThemePicture: React.FC<ThemePictureProps> = (props) => {
  const theme: Theme = useTheme();
  const classes = useStyles();

  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  const {
    width
  } = props;

  const handleLoad = (): void => {
    setIsLoaded(true);
  };

  const getSnowflakeCount = (width: Breakpoint): number => {
    switch (width) {
      case "xl": {
        return 500;
      }
      case "lg": {
        return 500;
      }
      case "md": {
        return 400;
      }
      case "sm": {
        return 300;
      }
      case "xs": {
        return 200;
      }
    }
  };

  const getRadius = (width: Breakpoint): [number, number] => {
    switch (width) {
      case "xl": {
        return [0.5, 5];
      }
      case "lg": {
        return [0.5, 5];
      }
      case "md": {
        return [0.4, 4];
      }
      case "sm": {
        return [0.3, 3];
      }
      case "xs": {
        return [0.2, 2];
      }
    }
  };

  return (
    <div className={clsx(classes.themePictureRoot, {
      [classes.themePictureRootNotLoaded]: !isLoaded,
    })}>
      <Snowfall color={"#fff"} snowflakeCount={getSnowflakeCount(width)} radius={getRadius(width)}/>
      <img className={classes.themePicture} src={"./resources/winter.svg"} onLoad={handleLoad}/>
    </div>
  );
};

export default withWidth()(ThemePicture);

