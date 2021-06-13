import React, {useEffect} from "react";
import {createStyles, Theme, useTheme} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import {Breakpoint} from "@material-ui/core/styles/createBreakpoints";
import BlueJayPigeon from "../../AnimatedImages/BlueJayPigeon/BlueJayPigeon";

export type SpringPictureProps = SpringPictureDataProps & SpringPictureStyleProps & SpringPictureEventProps;

export interface SpringPictureDataProps {

}

export interface SpringPictureStyleProps {
  width: Breakpoint;
}

export interface SpringPictureEventProps {
  handleLoad(): void;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    springPicture: {
      width: "100%",
      height: "100%",
      backgroundImage: "url(./resources/seasons/spring.svg), linear-gradient(0deg, #ffffff 50%, #76d0ff 80%, #47bfff 100%)",
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

const SpringPicture: React.FC<SpringPictureProps> = (props) => {
  const theme: Theme = useTheme();
  const classes = useStyles();

  const {
    width,
    handleLoad,
  } = props;

  useEffect(() => {
    const image: HTMLImageElement = document.createElement("img");
    image.src = "./resources/seasons/spring.svg";
    image.onload = () => {
      handleLoad();
    };
  }, []);

  return (
    <React.Fragment>
      <div className={classes.springPicture}>
        <BlueJayPigeon/>
      </div>
    </React.Fragment>
  );
};

export default SpringPicture;
