import React from "react";
import {createStyles, Theme, useTheme} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import OverlayTextRow from "./OverlayTextRow/OverlayTextRow";
import {Breakpoint} from "@material-ui/core/styles/createBreakpoints";

export type OverlayTextProps = OverlayTextDataProps & OverlayTextStyleProps & OverlayTextEventProps;

export interface OverlayTextDataProps {

}

export interface OverlayTextStyleProps {
  width: Breakpoint;
}

export interface OverlayTextEventProps {

}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      height: "100%",
      width: "100%",
    },
    contentWrapper: {
      height: "100%",
      width: "100%",
      position: "relative",
      top: "-100%",
      left: "0%",
      zIndex: -1,
    },
    overlayTextContainer: {
      height: "100%",
      width: "100%",
      display: "block",
      position: "relative",
      top: "0%",
      left: "0%",
      zIndex: 0,
    },
    overlayTextWrapper: {
      position: "relative",
      height: "max-content",
      width: "max-content",
      backdropFilter: "blur(4px)",
      top: "5vh",
      left: "5vw",
      paddingTop: "1vh",
      paddingBottom: "1vh",
      paddingLeft: "1vw",
      paddingRight: "1vw",
    },
  }),
);

const OverlayText: React.FC<OverlayTextProps> = (props) => {
  const theme: Theme = useTheme();
  const classes = useStyles();

  const {
    width,
  } = props;

  return (
    <div className={classes.root}>
      <div className={classes.overlayTextContainer}>
        <div className={classes.overlayTextWrapper}>
          <OverlayTextRow text={"Adaptive"} index={0} width={width}/>
          <OverlayTextRow text={"Passionate"} index={1} width={width}/>
          <OverlayTextRow text={"Innovative"} index={2} width={width}/>
        </div>
      </div>
      <div className={classes.contentWrapper}>
        {
          props.children
        }
      </div>
    </div>
  );
};

export default OverlayText;

