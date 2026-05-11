import React from "react";
import Typography from "@/components/Typography";
import { ScrollNavigationDrawerMenuItemName } from "../ScrollNavigation/ScrollNavigationDrawer/ScrollNavigationDrawerMenuItem/types";

export interface SectionWrapperProps {
  name: ScrollNavigationDrawerMenuItemName;
  children?: React.ReactNode;
}

const SectionWrapper: React.FC<SectionWrapperProps> = (props) => {
  const { name } = props;

  return (
    <div className="flex flex-col items-center justify-start h-max w-full">
      <div
        className="w-full flex flex-row items-center justify-center h-[46px] sm:h-[57px] md:h-[86px] md:justify-start lg:h-[96px]"
        style={{ backgroundColor: "var(--primary-main)" }}
      >
        <Typography
          className="!font-extralight !select-none !text-[23px] !leading-[23px] !ml-[23px] sm:!text-[27px] sm:!leading-[27px] sm:!ml-[27px] md:!text-[38px] md:!leading-[38px] md:!ml-[38px] lg:!text-[42px] lg:!leading-[42px] lg:!ml-[42px]"
          style={{ color: "var(--primary-contrast)" }}
          variant="h3"
        >
          {name.toUpperCase()}
        </Typography>
      </div>
      {props.children}
    </div>
  );
};

export default SectionWrapper;
