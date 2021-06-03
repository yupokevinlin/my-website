import {Breakpoint} from "@material-ui/core/styles/createBreakpoints";

export const getSnowflakeCount = (width: Breakpoint): number => {
  switch (width) {
    case "xl": {
      return 500;
    }
    case "lg": {
      return 500;
    }
    case "md": {
      return 400;
    }
    case "sm": {
      return 300;
    }
    case "xs": {
      return 200;
    }
  }
};

export const getSnowflakeRadius = (width: Breakpoint): [number, number] => {
  switch (width) {
    case "xl": {
      return [0.5, 5];
    }
    case "lg": {
      return [0.5, 5];
    }
    case "md": {
      return [0.4, 4];
    }
    case "sm": {
      return [0.3, 3];
    }
    case "xs": {
      return [0.2, 2];
    }
  }
};
