import React from "react";
import {createStyles, Theme, useTheme, withWidth} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
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
      height: "calc(100vh - 58px)",
      width: "100%",
      mouseEvents: "none",
      userDrag: "none",
      userSelect: "none",
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-end",
      [theme.breakpoints.up("md")]: {
        height: "100vh",
      },
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

