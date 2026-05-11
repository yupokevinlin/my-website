import React from "react";
import Typography from "@/components/Typography";
import { Breakpoint } from "@/components/types";

export interface OverlayTextRowProps {
  text: string;
  index: number;
  width: Breakpoint;
}

const OverlayTextRow: React.FC<OverlayTextRowProps> = (props) => {
  const { text, index, width } = props;

  const getMarginLeft = (w: Breakpoint, i: number): string => {
    switch (w) {
      case "xl":
      case "lg":
        return `${i * 3}vw`;
      case "md":
        return `${i * 3.8}vw`;
      case "sm":
        return `${i * 5}vw`;
      case "xs":
      default:
        return `${i * 7.5}vw`;
    }
  };

  const firstChar: string = text.charAt(0).toUpperCase();
  const restText: string = text.substring(1).toLowerCase();
  const marginLeft: string = getMarginLeft(width, index);

  return (
    <div
      className="h-max w-max flex flex-row items-end justify-start mb-[1.27vw] sm:mb-[0.91vw] md:mb-[0.65vw] lg:mb-[0.5vw]"
      style={{ marginLeft }}
    >
      <Typography
        className="!font-medium !text-center !border-solid !box-content !text-[4.07vw] !leading-[4.59vw] !h-[4.59vw] !w-[4.59vw] !mr-[0.5vw] !border-[0.5vw] sm:!text-[2.91vw] sm:!leading-[3.28vw] sm:!h-[3.28vw] sm:!w-[3.28vw] sm:!mr-[0.36vw] sm:!border-[0.36vw] md:!text-[2.08vw] md:!leading-[2.34vw] md:!h-[2.34vw] md:!w-[2.34vw] md:!mr-[0.26vw] md:!border-[0.26vw] lg:!text-[1.60vw] lg:!leading-[1.80vw] lg:!h-[1.80vw] lg:!w-[1.80vw] lg:!mr-[0.2vw] lg:!border-[0.2vw]"
        style={{
          color: "var(--primary-contrast)",
          backgroundColor: "var(--primary-main)",
          borderColor: "var(--primary-contrast)",
        }}
      >
        {firstChar}
      </Typography>
      <Typography
        className="!font-normal !text-center !text-[4.07vw] !leading-[4.84vw] !tracking-[0.127vw] sm:!text-[2.91vw] sm:!leading-[3.46vw] sm:!tracking-[0.091vw] md:!text-[2.08vw] md:!leading-[2.47vw] md:!tracking-[0.065vw] lg:!text-[1.60vw] lg:!leading-[1.90vw] lg:!tracking-[0.05vw]"
        style={{ color: "var(--primary-contrast)" }}
      >
        {restText}
      </Typography>
    </div>
  );
};

export default OverlayTextRow;

