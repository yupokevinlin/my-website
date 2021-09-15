import React, {useEffect} from "react";
import {createStyles, Theme, useTheme} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import {Breakpoint} from "@material-ui/core/styles/createBreakpoints";
import Fireflies from "../../AnimatedImages/Fireflies/Fireflies";

export type SummerPictureProps = SummerPictureDataProps & SummerPictureStyleProps & SummerPictureEventProps;

export interface SummerPictureDataProps {

}

export interface SummerPictureStyleProps {
  width: Breakpoint;
}

export interface SummerPictureEventProps {
  handleLoad(): void;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    summerPicture: {
      width: "100%",
      height: "100%",
      backgroundImage: "url(./resources/seasons/summer.svg), linear-gradient(0deg, #e54009 0%, #e54009 58%, #f29939 63%, #919191 65%, #4a5b7b 75%, #0c0c15 100%)",
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

const SummerPicture: React.FC<SummerPictureProps> = (props) => {
  const theme: Theme = useTheme();
  const classes = useStyles();

  const {
    width,
    handleLoad,
  } = props;

  useEffect(() => {
    const image: HTMLImageElement = document.createElement("img");
    image.src = "./resources/seasons/summer.svg";
    image.onload = () => {
      handleLoad();
    };
  }, []);

  return (
    <Fireflies>
      <div className={classes.summerPicture}/>
    </Fireflies>
  );
};

export default SummerPicture;

