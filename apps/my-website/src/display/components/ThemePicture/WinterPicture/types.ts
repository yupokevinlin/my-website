import { Breakpoint } from "@/components/types";

export const getSnowflakeCount = (width: Breakpoint): number => {
  switch (width) {
    case "xl":
    case "lg":
      return 500;
    case "md":
      return 400;
    case "sm":
      return 300;
    case "xs":
    default:
      return 200;
  }
};

export const getSnowflakeRadius = (width: Breakpoint): [number, number] => {
  switch (width) {
    case "xl":
    case "lg":
      return [0.5, 5];
    case "md":
      return [0.4, 4];
    case "sm":
      return [0.3, 3];
    case "xs":
    default:
      return [0.2, 2];
  }
};

export const getSnowflakeSpeed = (width: Breakpoint): [number, number] => {
  switch (width) {
    case "xl":
    case "lg":
    case "md":
      return [0.5, 3];
    case "sm":
    case "xs":
    default:
      return [0.5, 1];
  }
};

export const getSnowflakeWind = (width: Breakpoint): [number, number] => {
  switch (width) {
    case "xl":
    case "lg":
    case "md":
      return [-0.5, 2];
    case "sm":
    case "xs":
    default:
      return [-0.5, 1];
  }
};

