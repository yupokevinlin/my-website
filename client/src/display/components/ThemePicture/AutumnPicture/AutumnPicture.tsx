import React, {useEffect} from "react";
import {createStyles, Theme, useTheme} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import {Breakpoint} from "@material-ui/core/styles/createBreakpoints";
import Goose from "../../AnimatedImages/Goose/Goose";

export type AutumnPictureProps = AutumnPictureDataProps & AutumnPictureStyleProps & AutumnPictureEventProps;

export interface AutumnPictureDataProps {

}

export interface AutumnPictureStyleProps {
  width: Breakpoint;
}

export interface AutumnPictureEventProps {
  handleLoad(): void;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    autumnPicture: {
      width: "100%",
      height: "100%",
      backgroundImage: "url(./resources/seasons/autumn.svg), linear-gradient(0deg, #ffffff 50%, #76d0ff 80%, #47bfff 100%)",
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

const AutumnPicture: React.FC<AutumnPictureProps> = (props) => {
  const theme: Theme = useTheme();
  const classes = useStyles();

  const {
    width,
    handleLoad,
  } = props;

  useEffect(() => {
    const image: HTMLImageElement = document.createElement("img");
    image.src = "./resources/seasons/autumn.svg";
    image.onload = () => {
      handleLoad();
    };
  }, []);

  return (
    <React.Fragment>
      <div className={classes.autumnPicture}>
        <Goose/>
      </div>
    </React.Fragment>
  );
};

export default AutumnPicture;

