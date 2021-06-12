import React, {useEffect} from "react";
import {createStyles, Theme, useTheme} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import {Breakpoint} from "@material-ui/core/styles/createBreakpoints";
import Snowfall from "react-snowfall";
import {getSnowflakeCount, getSnowflakeRadius} from "./types";

export type WinterPictureProps = WinterPictureDataProps & WinterPictureStyleProps & WinterPictureEventProps;

export interface WinterPictureDataProps {

}

export interface WinterPictureStyleProps {
  width: Breakpoint;
}

export interface WinterPictureEventProps {
  handleLoad(): void;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    winterPicture: {
      width: "100%",
      height: "100%",
      backgroundImage: "url(./resources/seasons/winter.svg), linear-gradient(0deg, #ffffff 50%, #e4ecf4 80%, #91b4d2 100%)",
      backgroundRepeat: "no-repeat",
      backgroundPositionX: "70%",
      backgroundPositionY: "70%",
      backgroundAttachment: "scroll",
      backgroundClip: "border-box",
      backgroundOrigin: "padding-box",
      backgroundSize: "cover",
      mouseEvents: "none",
      userDrag: "none",
      userSelect: "none",
    },
  }),
);

const WinterPicture: React.FC<WinterPictureProps> = (props) => {
  const theme: Theme = useTheme();
  const classes = useStyles();

  const {
    width,
    handleLoad,
  } = props;

  useEffect(() => {
    const image: HTMLImageElement = document.createElement("img");
    image.src = "./resources/seasons/winter.svg";
    image.onload = () => {
      handleLoad();
    };
  }, []);

  const snowflakeCount: number = getSnowflakeCount(width);
  const snowflakeRadius: [number, number] = getSnowflakeRadius(width);

  return (
    <React.Fragment>
      <div className={classes.winterPicture}>
        <Snowfall color={"#fff"} snowflakeCount={snowflakeCount} radius={snowflakeRadius}/>
      </div>
    </React.Fragment>
  );
};

export default WinterPicture;

