import React from "react";
import {createStyles, Theme, useTheme} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";

export type CrowMallardProps = CrowMallardDataProps & CrowMallardStyleProps & CrowMallardEventProps;

export interface CrowMallardDataProps {

}

export interface CrowMallardStyleProps {

}

export interface CrowMallardEventProps {

}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    crow: {
      position: "relative",
      left: "-30%",
      width: "80px",
      minWidth: "80px",
      height: "55px",
      minHeight: "55px",
      background: "url(./resources/animations/crow.svg) no-repeat",
      backgroundSize: "cover",
      backgroundClip: "border-box",
      mouseEvents: "none",
      userDrag: "none",
      userSelect: "none",
      animation: "$animate .5s steps(10) infinite, $move 15s linear infinite, $sineCrow 2.5s ease alternate infinite",
      [theme.breakpoints.up("sm")]: {
        animation: "$animate .5s steps(10) infinite, $move 20s linear infinite, $sineCrow 2.5s ease alternate infinite",
      },
    },
    mallard: {
      position: "relative",
      left: "-30%",
      width: "80px",
      minWidth: "80px",
      height: "55px",
      minHeight: "55px",
      background: "url(./resources/animations/mallard.svg) no-repeat",
      backgroundSize: "cover",
      backgroundClip: "border-box",
      mouseEvents: "none",
      userDrag: "none",
      userSelect: "none",
      animation: "$animate .4s steps(7) infinite, $move 15s linear infinite, $sineMallard 2s ease alternate infinite",
      [theme.breakpoints.up("sm")]: {
        animation: "$animate .4s steps(7) infinite, $move 20s linear infinite, $sineMallard 2s ease alternate infinite",
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
    "@keyframes move": {
      from: {
        left: "-60%",
      },
      to: {
        left: "130%",
      },
    },
    "@keyframes sineCrow": {
      from: {
        top: "-10px",
      },
      to: {
        top: "10px",
      },
    },
    "@keyframes sineMallard": {
      from: {
        top: "-30px",
      },
      to: {
        top: "30px",
      },
    },
  }),
);

const CrowMallard: React.FC<CrowMallardProps> = (props) => {
  const theme: Theme = useTheme();
  const classes = useStyles();

  const {

  } = props;

  return (
    <React.Fragment>
      <div className={classes.crow} style={{animationDelay: "2s", transform: "translateY(50px)"}}/>
      <div className={classes.mallard} style={{animationDelay: "3.5s", transform: "translateY(50px)"}}/>
      <div className={classes.crow} style={{animationDelay: "10s", transform: "translateY(70px)"}}/>
      <div className={classes.mallard} style={{animationDelay: "12.5s", transform: "translateY(80px)"}}/>
    </React.Fragment>
  );
};

export default CrowMallard;

