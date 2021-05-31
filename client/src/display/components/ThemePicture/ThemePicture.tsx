import React, {useState} from "react";
import {createStyles, Theme, useTheme} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import Snowfall from "react-snowfall";
import clsx from "clsx";

export type ThemePictureProps = ThemePictureDataProps & ThemePictureStyleProps & ThemePictureEventProps;

export interface ThemePictureDataProps {

}

export interface ThemePictureStyleProps {

}

export interface ThemePictureEventProps {

}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    themePictureRoot: {
      height: "100%",
      width: "100%",
      opacity: 1,
    },
    themePictureRootNotLoaded: {
      opacity: 0,
    },
    themePicture: {
      width: "100%",
      height: "100%",
      background: "linear-gradient(0deg, #ffffff 50%, #e4ecf4 80%, #91b4d2 100%)",
    },
  }),
);

const ThemePicture: React.FC<ThemePictureProps> = (props) => {
  const theme: Theme = useTheme();
  const classes = useStyles();

  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  const {

  } = props;

  const handleLoad = (): void => {
    setIsLoaded(true);
  };

  return (
    <div className={clsx(classes.themePictureRoot, {
      [classes.themePictureRootNotLoaded]: !isLoaded,
    })}>
      <Snowfall color={"#fff"} snowflakeCount={500}/>
      <img className={classes.themePicture} src={"./resources/winter.svg"} onLoad={handleLoad}/>
    </div>
  );
};

export default ThemePicture;

