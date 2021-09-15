import React from "react";
import {createStyles, Theme, useTheme} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import {Breakpoint} from "@material-ui/core/styles/createBreakpoints";

export type CrowMallardProps = CrowMallardDataProps & CrowMallardStyleProps & CrowMallardEventProps;

export interface CrowMallardDataProps {

}

export interface CrowMallardStyleProps {
  width: Breakpoint;
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
      [theme.breakpoints.up("xs")]: {
        animation: "$animate .5s steps(10) infinite, $move 10s linear infinite, $sineCrow 2.5s ease alternate infinite",
      },
      [theme.breakpoints.up("md")]: {
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
      [theme.breakpoints.up("xs")]: {
        animation: "$animate .4s steps(7) infinite, $move 10s linear infinite, $sineMallard 2s ease alternate infinite",
      },
      [theme.breakpoints.up("md")]: {
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
        left: "-60vw",
      },
      to: {
        left: "130vw",
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
    width,
  } = props;

  const isSmXs: boolean = /xs|sm/.test(width);

  return (
    <React.Fragment>
      <div className={classes.crow} style={{animationDelay: "2s", transform: isSmXs ? "translateY(5vh)" : "translateY(10vh)"}}/>
      <div className={classes.mallard} style={{animationDelay: isSmXs ? "5s" : "3.5s", transform: isSmXs ? "translateY(calc(-55px + 10vh))" : "translateY(calc(-55px + 20vh))"}}/>
      {
        !isSmXs ? (
          <React.Fragment>
            <div className={classes.crow} style={{animationDelay: "10s", transform: isSmXs ? "translateY(calc(-110px + 5vh))" : "translateY(calc(-110px + 5vh))"}}/>
            <div className={classes.mallard} style={{animationDelay: "12.5s", transform: isSmXs ? "translateY(calc(-165px + 15vh))" : "translateY(calc(-165px + 15vh))"}}/>
          </React.Fragment>
        ) : null
      }
    </React.Fragment>
  );
};

export default CrowMallard;

