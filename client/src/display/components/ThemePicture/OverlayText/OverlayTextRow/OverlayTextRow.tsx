import React from "react";
import {createStyles, Theme, useTheme} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import {Breakpoint} from "@material-ui/core/styles/createBreakpoints";

export type OverlayTextRowProps = OverlayTextRowDataProps & OverlayTextRowStyleProps & OverlayTextRowEventProps;

export interface OverlayTextRowDataProps {
  text: string;
  index: number;
}

export interface OverlayTextRowStyleProps {
  width: Breakpoint;
}

export interface OverlayTextRowEventProps {

}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      height: "max-content",
      width: "max-content",
      display: "flex",
      flexDirection: "row",
      alignItems: "flex-end",
      justifyContent: "flex-start",
      [theme.breakpoints.up("xs")]: {
        marginBottom: "1.27vw",
      },
      [theme.breakpoints.up("sm")]: {
        marginBottom: "0.91vw",
      },
      [theme.breakpoints.up("md")]: {
        marginBottom: "0.65vw",
      },
      [theme.breakpoints.up("lg")]: {
        marginBottom: "0.5vw",
      },
    },
    firstChar: {
      fontWeight: 500,
      color: theme.palette.primary.contrastText,
      backgroundColor: theme.palette.primary.main,
      borderStyle: "solid",
      borderColor: theme.palette.primary.contrastText,
      textAlign: "center",
      [theme.breakpoints.up("xs")]: {
        fontSize: "4.07vw",
        lineHeight: "4.59vw",
        height: "4.59vw",
        width: "4.59vw",
        marginRight: "0.50vw",
        borderWidth: "0.50vw",
      },
      [theme.breakpoints.up("sm")]: {
        fontSize: "2.91vw",
        lineHeight: "3.28vw",
        height: "3.28vw",
        width: "3.28vw",
        marginRight: "0.36vw",
        borderWidth: "0.36vw",
      },
      [theme.breakpoints.up("md")]: {
        fontSize: "2.08vw",
        lineHeight: "2.34vw",
        height: "2.34vw",
        width: "2.34vw",
        marginRight: "0.26vw",
        borderWidth: "0.26vw",
      },
      [theme.breakpoints.up("lg")]: {
        fontSize: "1.60vw",
        lineHeight: "1.80vw",
        height: "1.80vw",
        width: "1.80vw",
        marginRight: "0.2vw",
        borderWidth: "0.2vw",
      },
    },
    restText: {
      fontWeight: 400,
      color: theme.palette.primary.contrastText,
      textAlign: "center",
      [theme.breakpoints.up("xs")]: {
        fontSize: "4.07vw",
        lineHeight: "4.84vw",
        letterSpacing: "0.127vw",
      },
      [theme.breakpoints.up("sm")]: {
        fontSize: "2.91vw",
        lineHeight: "3.46vw",
        letterSpacing: "0.091vw",
      },
      [theme.breakpoints.up("md")]: {
        fontSize: "2.08vw",
        lineHeight: "2.47vw",
        letterSpacing: "0.065vw",
      },
      [theme.breakpoints.up("lg")]: {
        fontSize: "1.60vw",
        lineHeight: "1.90vw",
        letterSpacing: "0.05vw",
      },
    },
  }),
);

const OverlayTextRow: React.FC<OverlayTextRowProps> = (props) => {
  const theme: Theme = useTheme();
  const classes = useStyles();

  const {
    text,
    index,
    width,
  } = props;

  const getMarginLeft = (width: Breakpoint, index: number): string => {
    switch (width) {
      case "xl":
      case "lg": {
        return `${index * 3}vw`;
      }
      case "md": {
        return `${index * 3.8}vw`;
      }
      case "sm": {
        return `${index * 5}vw`;
      }
      case "xs": {
        return `${index * 7.5}vw`;
      }
    }
  };

  const firstChar: string = text.charAt(0).toUpperCase();
  const restText: string = text.substring(1).toLowerCase();

  const marginLeft: string = getMarginLeft(width, index);

  return (
    <div className={classes.root} style={{marginLeft: marginLeft}}>
      <Typography className={classes.firstChar}>
        {
          firstChar
        }
      </Typography>
      <Typography className={classes.restText}>
        {
          restText
        }
      </Typography>
    </div>
  );
};

export default OverlayTextRow;

