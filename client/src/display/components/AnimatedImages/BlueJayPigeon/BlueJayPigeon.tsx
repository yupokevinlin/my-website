import React from "react";
import {createStyles, Theme, useTheme} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";

export type BlueJayPigeonProps = BlueJayPigeonDataProps & BlueJayPigeonStyleProps & BlueJayPigeonEventProps;

export interface BlueJayPigeonDataProps {

}

export interface BlueJayPigeonStyleProps {

}

export interface BlueJayPigeonEventProps {

}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    blueJay1: {
      position: "relative",
      left: "-30%",
      width: "80px",
      minWidth: "80px",
      height: "55px",
      minHeight: "55px",
      background: "url(./resources/animations/bluejayLeft.svg) no-repeat",
      backgroundSize: "cover",
      backgroundClip: "border-box",
      mouseEvents: "none",
      userDrag: "none",
      userSelect: "none",
      animation: "$animate .5s steps(7) infinite, $moveLeft 15s linear infinite, $sineBlueJay 3s ease alternate infinite",
      [theme.breakpoints.up("sm")]: {
        animation: "$animate .5s steps(7) infinite, $moveLeft 20s linear infinite, $sineBlueJay 3s ease alternate infinite",
      },
    },
    blueJay2: {
      position: "relative",
      left: "-30%",
      width: "80px",
      minWidth: "80px",
      height: "55px",
      minHeight: "55px",
      background: "url(./resources/animations/bluejayRight.svg) no-repeat",
      backgroundSize: "cover",
      backgroundClip: "border-box",
      mouseEvents: "none",
      userDrag: "none",
      userSelect: "none",
      animation: "$animate .5s steps(7) infinite, $moveRight 15s linear infinite, $sineBlueJay 3s ease alternate infinite",
      [theme.breakpoints.up("sm")]: {
        animation: "$animate .5s steps(7) infinite, $moveRight 20s linear infinite, $sineBlueJay 3s ease alternate infinite",
      },
    },
    pigeon1: {
      position: "relative",
      left: "-30%",
      width: "80px",
      minWidth: "80px",
      height: "55px",
      minHeight: "55px",
      background: "url(./resources/animations/pigeonLeft.svg) no-repeat",
      backgroundSize: "cover",
      backgroundClip: "border-box",
      mouseEvents: "none",
      userDrag: "none",
      userSelect: "none",
      animation: "$animate .4s steps(9) infinite, $moveLeft 15s linear infinite, $sineBlueJay 2s ease alternate infinite",
      [theme.breakpoints.up("sm")]: {
        animation: "$animate .4s steps(9) infinite, $moveLeft 20s linear infinite, $sineBlueJay 2s ease alternate infinite",
      },
    },
    pigeon2: {
      position: "relative",
      left: "-30%",
      width: "80px",
      minWidth: "80px",
      height: "55px",
      minHeight: "55px",
      background: "url(./resources/animations/pigeonRight.svg) no-repeat",
      backgroundSize: "cover",
      backgroundClip: "border-box",
      mouseEvents: "none",
      userDrag: "none",
      userSelect: "none",
      animation: "$animate .4s steps(9) infinite, $moveRight 15s linear infinite, $sineBlueJay 2s ease alternate infinite",
      [theme.breakpoints.up("sm")]: {
        animation: "$animate .4s steps(9) infinite, $moveRight 20s linear infinite, $sineBlueJay 2s ease alternate infinite",
      },
    },
    "@keyframes animate": {
      from: {
        backgroundPosition: "0 0",
      },
      to: {
        backgroundPosition: "100% 0",
      },
    },
    "@keyframes animateOpposite": {
      from: {
        backgroundPosition: "100% 0",
      },
      to: {
        backgroundPosition: "0 0",
      },
    },
    "@keyframes moveLeft": {
      from: {
        left: "110vw",
      },
      to: {
        left: "-80vw",
      },
    },
    "@keyframes moveRight": {
      from: {
        left: "-80vw",
      },
      to: {
        left: "110vw",
      },
    },
    "@keyframes sineBlueJay": {
      from: {
        top: "-20px",
      },
      to: {
        top: "20px",
      },
    },
    "@keyframes sinePigeon": {
      from: {
        top: "-40px",
      },
      to: {
        top: "40px",
      },
    },
  }),
);

const BlueJayPigeon: React.FC<BlueJayPigeonProps> = (props) => {
  const theme: Theme = useTheme();
  const classes = useStyles();

  const {

  } = props;

  return (
    <React.Fragment>
      <div className={classes.blueJay1} style={{animationDelay: "0s", transform: "translateY(10vh)"}}/>
      <div className={classes.blueJay2} style={{animationDelay: "3s", transform: "translateY(calc(-55px + 25vh))"}}/>
      <div className={classes.blueJay1} style={{animationDelay: "7s", transform: "translateY(calc(-110px + 40vh))"}}/>
      <div className={classes.pigeon1} style={{animationDelay: "10s", transform: "translateY(calc(-165px + 10vh))"}}/>
      <div className={classes.pigeon2} style={{animationDelay: "11s", transform: "translateY(calc(-220px + 20vh))"}}/>
    </React.Fragment>
  );
};

export default BlueJayPigeon;

