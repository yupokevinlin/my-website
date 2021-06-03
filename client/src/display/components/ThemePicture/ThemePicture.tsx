import React, {useEffect, useState} from "react";
import {createStyles, Theme, useTheme, withWidth} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import Snowfall from "react-snowfall";
import clsx from "clsx";
import {Breakpoint} from "@material-ui/core/styles/createBreakpoints";
import WinterPicture from "./WinterPicture/WinterPicture";

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
      height: "100vh",
      width: "100%",
      mouseEvents: "none",
      userDrag: "none",
      userSelect: "none",
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-end",
    },
  }),
);

const ThemePicture: React.FC<ThemePictureProps> = (props) => {
  const theme: Theme = useTheme();
  const classes = useStyles();

  const {
    width
  } = props;


  return (
    <div className={classes.themePictureRoot}>
      <WinterPicture width={width} handleLoad={() => {console.log("winter")}}/>
    </div>
  );
};

export default withWidth()(ThemePicture);

