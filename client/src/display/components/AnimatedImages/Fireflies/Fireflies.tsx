import React, {useEffect, useState} from "react";
import {createStyles, Theme, useTheme, withWidth} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import {Breakpoint} from "@material-ui/core/styles/createBreakpoints";

export type FirefliesProps = FirefliesDataProps & FirefliesStyleProps & FirefliesEventProps;

export interface FirefliesDataProps {

}

export interface FirefliesStyleProps {
  width: Breakpoint;
}

export interface FirefliesEventProps {

}

export interface FireflyData {
  top: string;
  left: string;
  type: "1" | "2";
  animationDelay: string;
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
      zIndex: 0,
    },
    fireflyContainer: {
      height: "100%",
      width: "100%",
      display: "block",
      position: "relative",
      top: "0%",
      left: "0%",
      zIndex: 1,
    },
    firefly1: {
      height: "4px",
      width: "4px",
      borderRadius: "50%",
      animation: "$flash 10s linear infinite",
      position: "absolute",
      transition: "top 30s, left 30s",
    },
    firefly2: {
      height: "5px",
      width: "5px",
      borderRadius: "50%",
      animation: "$flash 8s linear infinite",
      position: "absolute",
      transition: "top 30s, left 30s",
    },
    "@keyframes flash": {
      "0%": {
        opacity: 0,
        boxShadow: "0 0 0 0 #ffff00",
        backgroundColor: "#00000000",
      },
      "5%": {
        opacity: 1,
        boxShadow: "0 0 10px 4px #ffff00",
        backgroundColor: "#ffffaa",
      },
      "20%": {
        opacity: 0,
        boxShadow: "0 0 0 0 #ffff00",
        backgroundColor: "#ffffaa",
      },
      "100%": {
        opacity: 0,
        boxShadow: "0 0 0 0 #ffff00",
        backgroundColor: "#ffffaa",
      },
    },
  }),
);

const Fireflies: React.FC<FirefliesProps> = (props) => {
  const theme: Theme = useTheme();
  const classes = useStyles();

  const {
    width,
  } = props;

  const [fireflyArray, setFireflyArray] = useState<Array<FireflyData>>([]);
  const [isFirstRender, setIsFirstRender] = useState<boolean>(true);

  const getCount = (): number => {
    switch (width) {
      case "xl":
      case "lg": {
        return 50;
      }
      case "md": {
        return 40;
      }
      case "sm":
      case "xs": {
        return 30;
      }
    }
  };

  useEffect(() => {
    const newFireflyArray: Array<FireflyData> = [];
    const count: number = getCount();
    for (let i = 0; i < count; i++) {
      const type: "1" | "2" = Math.random() > 0.5 ? "1" : "2";
      const animationDelay: string = type === "1" ? `${Math.random() * 10}s` : `${Math.random() * 8}s`;
      const top: string = `${Math.random() * 95}%`;
      const left: string = `${Math.random() * 95}%`;
      newFireflyArray.push({
        type: type,
        animationDelay: animationDelay,
        top: top,
        left: left,
      });
    }
    setFireflyArray(newFireflyArray);
    setTimeout(() => {
      setFireflyArray(prevState => prevState.map((firefly) => ({
        ...firefly,
        top: `${Math.random() * 95}%`,
        left: `${Math.random() * 95}%`,
      })));
    }, 500);
    setInterval(() => {
      setFireflyArray(prevState => prevState.map((firefly) => ({
        ...firefly,
        top: `${Math.random() * 95}%`,
        left: `${Math.random() * 95}%`,
      })));
    }, 25000);
  }, []);

  useEffect(() => {
    if (isFirstRender) {
      setIsFirstRender(false);
    } else {
      const count: number = getCount();
      const numberDifference: number = count - fireflyArray.length;
      if (numberDifference > 0) {
        const newFireflyArray: Array<FireflyData> = [];
        for (let i = 0; i < numberDifference; i++) {
          const type: "1" | "2" = Math.random() > 0.5 ? "1" : "2";
          const animationDelay: string = type === "1" ? `${Math.random() * 10}s` : `${Math.random() * 8}s`;
          const top: string = `${Math.random() * 95}%`;
          const left: string = `${Math.random() * 95}%`;
          newFireflyArray.push({
            type: type,
            animationDelay: animationDelay,
            top: top,
            left: left,
          });
        }
        setFireflyArray(prevState => [...prevState, ...newFireflyArray]);
      }
      if (numberDifference < 0) {
        setFireflyArray(prevState => prevState.filter((firefly, index) => index < count - 1));
      }
    }
  }, [width]);

  return (
    <div className={classes.root}>
      <div className={classes.fireflyContainer}>
        {
          fireflyArray.map((firefly, index) => (
            <div className={firefly.type === "1" ? classes.firefly1 : classes.firefly2} key={`firefly-${index}`} style={{left: firefly.left, top: firefly.top, animationDelay: firefly.animationDelay,}}/>
          ))
        }
      </div>
      <div className={classes.contentWrapper}>
        {
          props.children
        }
      </div>
    </div>
  );
};

export default withWidth()(Fireflies);

