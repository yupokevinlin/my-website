import React from "react";
import { Paper, IconButton, Typography } from "@/components";
import MaterialIcon, { MaterialIconNames } from "../MaterialIcon/MaterialIcon";

export interface TopBarProps {
  handleDrawerOpen(): void;
}

const TopBar: React.FC<TopBarProps> = (props) => {
  const { handleDrawerOpen } = props;

  return (
    <Paper
      className="relative z-[1] w-full flex flex-row items-center justify-start h-[57px] sm:h-[67px]"
      square
      elevation={1}
      style={{ boxShadow: "0px 2px 4px -1px rgba(0,0,0,0.2),0px 4px 5px 0px rgba(0,0,0,0.14),0px 1px 10px 0px rgba(0,0,0,0.12)" }}
    >
      <IconButton
        edge="start"
        className="!flex !items-center !justify-center !m-0 !w-[33px] !h-[33px] !ml-[11px] sm:!w-[39px] sm:!h-[39px] sm:!ml-[13px]"
        color="inherit"
        onClick={handleDrawerOpen}
      >
        <MaterialIcon
          iconName={MaterialIconNames.Menu}
          className="!text-[22px] sm:!text-[26px]"
          style={{ color: "var(--primary-main)" }}
        />
      </IconButton>
      <div className="h-full flex flex-col items-center justify-center w-[calc(100%-66px)] sm:w-[calc(100%-78px)]">
        <Typography
          className="!select-none !font-normal !text-[23px] !leading-[23px] !h-[23px] !mb-1 sm:!text-[26px] sm:!leading-[26px] sm:!h-[26px] sm:!mb-[5px]"
          style={{ color: "var(--primary-main)" }}
        >
          Kevin Lin
        </Typography>
        <Typography
          className="!select-none !font-light !text-[13px] !leading-[13px] !h-[13px] sm:!text-[15px] sm:!leading-[15px] sm:!h-[15px]"
          style={{ color: "var(--secondary-main)" }}
        >
          Full Stack Developer
        </Typography>
      </div>
    </Paper>
  );
};

export default TopBar;
