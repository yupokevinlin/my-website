import React from "react";
import { Paper, Typography, Button } from "@/components";
import MaterialIcon, { MaterialIconNames } from "../../MaterialIcon/MaterialIcon";
import NavigationUtils from "../../../../helpers/NavigationUtils";

const Contact: React.FC = () => {
  const titleClass      = "!font-light !text-[4vw] !h-[4vw] !leading-[4vw] !mt-[0.4vw] !mb-[2.2vw] sm:!text-[23px] sm:!h-[23px] sm:!leading-[23px] sm:!mt-[3px] sm:!mb-[18px] md:!text-[30px] md:!h-[30px] md:!leading-[30px] md:!mt-[3.6px] md:!mb-[19.3px] lg:!text-[37px] lg:!h-[37px] lg:!leading-[37px] lg:!mt-[4px] lg:!mb-[22px]";
  const subTitleClass   = "!font-normal !text-[3.3vw] !h-[3.3vw] !leading-[3.3vw] !mb-[3.3vw] !ml-[0.1vw] sm:!text-[19px] sm:!h-[19px] sm:!leading-[19px] sm:!mb-[19px] sm:!ml-[1px] md:!text-[21px] md:!h-[21px] md:!leading-[21px] md:!mb-[21px] md:!ml-[2px] lg:!text-[23px] lg:!h-[23px] lg:!leading-[23px] lg:!mb-[23px] lg:!ml-[2px]";
  const buttonRowClass  = "!flex !flex-row !items-center !justify-start !h-[8vw] !w-[60vw] !mb-[6vw] sm:!h-10 sm:!w-[320px] sm:!mb-8 md:!h-[45px] md:!w-[360px] md:!mb-9 lg:!h-[50px] lg:!w-[400px] lg:!mb-10";
  const buttonIconClass = "!text-white !h-[5.5vw] !w-[5.5vw] !ml-[11vw] sm:!h-[29px] sm:!w-[29px] sm:!ml-[70px] md:!h-8 md:!w-8 md:!ml-[80px] lg:!h-9 lg:!w-9 lg:!ml-[100px]";
  const buttonTextClass = "!text-white !text-[3.6vw] !leading-[3.6vw] !ml-[3.6vw] sm:!text-[19px] sm:!leading-[19px] sm:!ml-[19px] md:!text-[22px] md:!leading-[22px] md:!ml-[22px] lg:!text-[24px] lg:!leading-[24px] lg:!ml-[24px]";

  return (
    <div className="w-full flex flex-col items-center content-grid-bg justify-start h-[123vw] sm:justify-center sm:h-[640px] md:h-[720px] lg:h-[800px]">
      <Paper
        className="flex flex-col items-center justify-center h-[90vw] w-[95vw] mt-[5vw] sm:h-[560px] sm:w-[90%] sm:mt-0 md:h-[630px] md:w-[90%] lg:h-[700px] lg:w-[80%]"
        elevation={3}
      >
        <div className="flex flex-row items-start justify-start w-[90%] h-[80vw] sm:h-[480px] md:h-[540px] lg:h-[600px]">
          <div className="flex flex-col items-start justify-start h-full w-max">
            <Typography className={titleClass} style={{ color: "var(--primary-main)" }}>LinkedIn</Typography>
            <Typography className={subTitleClass} style={{ color: "var(--secondary-main)" }}>https://www.linkedin.com/in/kevinyupolin</Typography>
            <Button variant="contained" className={buttonRowClass} style={{ backgroundColor: "#0072b1" }} onClick={() => NavigationUtils.goToWebsite("https://www.linkedin.com/in/kevinyupolin")}>
              <MaterialIcon iconName={MaterialIconNames.LinkedIn} className={buttonIconClass}/>
              <Typography className={buttonTextClass}>Connect</Typography>
            </Button>

            <Typography className={titleClass} style={{ color: "var(--primary-main)" }}>E Mail</Typography>
            <Typography className={subTitleClass} style={{ color: "var(--secondary-main)" }}>kevinyupolin@gmail.com</Typography>
            <Button variant="contained" className={buttonRowClass} style={{ backgroundColor: "#ea4335" }} onClick={() => NavigationUtils.sendEmail("kevinyupolin@gmail.com")}>
              <MaterialIcon iconName={MaterialIconNames.Mail} className={buttonIconClass}/>
              <Typography className={buttonTextClass}>Contact</Typography>
            </Button>

            <Typography className={titleClass} style={{ color: "var(--primary-main)" }}>GitHub</Typography>
            <Typography className={subTitleClass} style={{ color: "var(--secondary-main)" }}>https://github.com/yupokevinlin</Typography>
            <Button variant="contained" className={buttonRowClass} style={{ backgroundColor: "#24292e" }} onClick={() => NavigationUtils.goToWebsite("https://github.com/yupokevinlin")}>
              <MaterialIcon iconName={MaterialIconNames.Github} className={buttonIconClass}/>
              <Typography className={buttonTextClass}>View</Typography>
            </Button>
          </div>
        </div>
      </Paper>
    </div>
  );
};

export default Contact;

