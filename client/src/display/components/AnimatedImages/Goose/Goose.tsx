import React from "react";
import {createStyles, Theme, useTheme} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import {Breakpoint} from "@material-ui/core/styles/createBreakpoints";

export type GooseProps = GooseDataProps & GooseStyleProps & GooseEventProps;

export interface GooseDataProps {

}

export interface GooseStyleProps {
  width: Breakpoint;
}

export interface GooseEventProps {

}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    gooseGroup: {
      position: "relative",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      flexWrap: "nowrap",
      height: "135px",
      width: "200px",
      [theme.breakpoints.up("xs")]: {
        animation: "$moveSmallScreen 15s linear infinite, $sine 3s ease alternate infinite",
      },
      [theme.breakpoints.up("md")]: {
        animation: "$move 20s linear infinite, $sine 3s ease alternate infinite",
      },
    },
    goose1: {
      animation: "$animate .5s steps(6) infinite",
      width: "80px",
      minWidth: "80px",
      height: "55px",
      minHeight: "55px",
      background: "url(./resources/animations/goose.svg) no-repeat",
      backgroundSize: "cover",
      backgroundClip: "border-box",
      mouseEvents: "none",
      userDrag: "none",
      userSelect: "none",
    },
    goose2: {
      animation: "$animateOpposite .5s steps(6) infinite",
      width: "80px",
      minWidth: "80px",
      height: "55px",
      minHeight: "55px",
      background: "url(./resources/animations/goose.svg) no-repeat",
      backgroundSize: "cover",
      backgroundClip: "border-box",
      mouseEvents: "none",
      userDrag: "none",
      userSelect: "none",
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
        left: "110vw",
      },
      to: {
        left: "-60vw",
      }
    },
    "@keyframes moveSmallScreen": {
      from: {
        left: "110vw",
      },
      to: {
        left: "-100vw",
      }
    },
    "@keyframes sine": {
      from: {
        top: "-10px",
      },
      to: {
        top: "10px",
      }
    },
  }),
);

const Goose: React.FC<GooseProps> = (props) => {
  const theme: Theme = useTheme();
  const classes = useStyles();

  const {

  } = props;

  return (
    <div className={classes.gooseGroup}>
      <div className={classes.goose1} style={{transform: "translate(120px, 80px)", zIndex: 1,}}/>
      <div className={classes.goose2} style={{transform: "translate(60px, 40px)", zIndex: 2,}}/>
      <div className={classes.goose1} style={{zIndex: 3,}}/>
      <div className={classes.goose2} style={{transform: "translate(60px, -40px)", zIndex: 4,}}/>
      <div className={classes.goose1} style={{transform: "translate(120px, -80px)", zIndex: 5,}}/>
    </div>
  );
};

export default Goose;

