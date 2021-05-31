import React from "react";
import {createStyles, Theme, useTheme} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import Snowfall from "react-snowfall";

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

  const {

  } = props;

  return (
    <div className={classes.themePictureRoot}>
      <Snowfall color={"#fff"} snowflakeCount={500}/>
      <img className={classes.themePicture} src={"./resources/winter.svg"}/>
    </div>
  );
};

export default ThemePicture;

