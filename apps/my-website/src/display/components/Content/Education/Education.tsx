import React from "react";
import { Paper, Typography, Link } from "@/components";
import NavigationUtils from "../../../../helpers/NavigationUtils";

const Education: React.FC = () => {
  const titleClass    = "!cursor-pointer !font-light !font-[Roboto,sans-serif] !text-[4vw] !h-[4vw] !leading-[4vw] !mt-[0.4vw] !mb-[2.2vw] sm:!text-[23px] sm:!h-[23px] sm:!leading-[23px] sm:!mt-[3px] sm:!mb-[18px] md:!text-[30px] md:!h-[30px] md:!leading-[30px] md:!mt-[3.6px] md:!mb-[19px] lg:!text-[37px] lg:!h-[37px] lg:!leading-[37px] lg:!mt-[4px] lg:!mb-[22px]";
  const subTitleClass = "!font-normal !text-[3.3vw] !h-[3.3vw] !leading-[3.3vw] !mb-[3.3vw] !ml-[0.1vw] sm:!text-[19px] sm:!h-[19px] sm:!leading-[19px] sm:!mb-[19px] sm:!ml-[1px] md:!text-[21px] md:!h-[21px] md:!leading-[21px] md:!mb-[21px] md:!ml-[2px] lg:!text-[23px] lg:!h-[23px] lg:!leading-[23px] lg:!mb-[23px] lg:!ml-[2px]";
  const textClass     = "!font-light !text-[3.3vw] !h-[3.3vw] !leading-[3.3vw] !mt-[2.4vw] !ml-[0.1vw] sm:!text-[19px] sm:!h-[19px] sm:!leading-[19px] sm:!mt-[12px] sm:!ml-[1px] md:!text-[21px] md:!h-[21px] md:!leading-[21px] md:!mt-[13px] md:!ml-[2px] lg:!text-[23px] lg:!h-[23px] lg:!leading-[23px] lg:!mt-[15px] lg:!ml-[2px]";
  const imageClass    = "h-[12vw] w-[12vw] mr-[6vw] sm:h-[75px] sm:w-[75px] sm:mr-[37.5px] md:h-[84px] md:w-[84px] md:mr-[42px] lg:h-[94px] lg:w-[94px] lg:mr-[47px]";

  return (
    <div className="w-full flex flex-col items-center justify-center content-grid-bg h-[70vw] sm:h-[456px] md:h-[513px] lg:h-[570px]">
      <Paper
        className="flex flex-col items-center justify-center h-[60vw] w-[95vw] sm:h-[376px] sm:w-[90%] md:h-[423px] md:w-[90%] lg:h-[470px] lg:w-[80%]"
        elevation={3}
      >
        <div className="flex flex-row items-start justify-start w-[90%] h-[50vw] sm:h-[296px] md:h-[333px] lg:h-[370px]">
          <div className="flex flex-col items-start justify-start h-full w-max">
            <img src="./resources/images/education/ubc.svg" className={imageClass} alt="UBC"/>
          </div>
          <div className="flex flex-col items-start justify-start h-full w-max">
            <Link className={titleClass} style={{ color: "var(--primary-main)" }} onClick={() => NavigationUtils.goToWebsite("https://www.ubc.ca")}>
              UNIVERSITY OF BRITISH COLUMBIA
            </Link>
            <Typography className={subTitleClass} style={{ color: "var(--secondary-main)" }}>Vancouver, British Columbia, Canada</Typography>
            <Typography className={textClass} style={{ color: "var(--secondary-dark)" }}>• Bachelor of Science in Chemistry</Typography>
            <Typography className={textClass} style={{ color: "var(--secondary-dark)" }}>• President's Entrance Scholarship</Typography>
          </div>
        </div>
      </Paper>
    </div>
  );
};

export default Education;

