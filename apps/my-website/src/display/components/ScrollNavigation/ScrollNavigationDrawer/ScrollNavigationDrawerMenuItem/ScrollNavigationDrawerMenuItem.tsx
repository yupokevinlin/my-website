import React from "react";
import { ScrollNavigationDrawerMenuItemData, ScrollNavigationDrawerMenuItemName } from "./types";
import MaterialIcon from "../../../MaterialIcon/MaterialIcon";
import { Divider, Typography, ButtonBase } from "@/components";

export interface ScrollNavigationDrawerMenuItemProps {
  data: ScrollNavigationDrawerMenuItemData;
  handleMenuItemClick(name: ScrollNavigationDrawerMenuItemName): void;
}

const ScrollNavigationDrawerMenuItem: React.FC<ScrollNavigationDrawerMenuItemProps> = (props) => {
  const { data, handleMenuItemClick } = props;

  const handleButtonClick = (): void => {
    handleMenuItemClick(data.name);
  };

  return (
    <React.Fragment>
      <ButtonBase
        className="flex flex-row items-center !justify-start w-full h-[32px] sm:h-[38px] lg:h-[42px]"
        style={{ backgroundColor: "var(--bg-paper)" }}
        onClick={handleButtonClick}
      >
        <div
          className="h-full w-[5px] sm:w-[6px] lg:w-[7px] transition-colors duration-200 delay-300"
          style={{ backgroundColor: data.active ? data.color : "#ffffff00" }}
        />
        <MaterialIcon
          className="!h-[19px] !w-[19px] !ml-[13px] sm:!h-[27px] sm:!w-[27px] sm:!ml-[19px] lg:!h-[30px] lg:!w-[30px] lg:!ml-[21px]"
          iconName={data.icon}
          style={{ color: data.color }}
        />
        <Typography
          className="!text-[13px] !ml-[13px] sm:!text-[15px] sm:!ml-[15px] lg:!text-[17px] lg:!ml-[17px] transition-[font-weight] duration-200 delay-300"
          style={{ color: "var(--secondary-main)", fontWeight: data.active ? 500 : 300 }}
        >
          {data.name}
        </Typography>
      </ButtonBase>
      <Divider/>
    </React.Fragment>
  );
};

export default ScrollNavigationDrawerMenuItem;

