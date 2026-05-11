import React from "react";
import Paper from "@/components/Paper";
import Typography from "@/components/Typography";

const squareSizeClass = "h-[3.6vw] w-[3.6vw] mr-[1.2vw] sm:h-[19px] sm:w-[19px] sm:mr-[6px] md:h-[21px] md:w-[21px] md:mr-[7px] lg:h-[23px] lg:w-[23px] lg:mr-[8px]";

const Languages: React.FC = () => {
  const squaresArray: Array<number> = new Array(5).fill(0);

  const titleClass  = "!font-light !text-[4vw] !h-[4vw] !leading-[4vw] !mt-[0.4vw] !mb-[1.2vw] sm:!text-[23px] sm:!h-[23px] sm:!leading-[23px] sm:!mt-[3px] sm:!mb-[9px] md:!text-[30px] md:!h-[30px] md:!leading-[30px] md:!mt-[3.6px] md:!mb-[9.3px] lg:!text-[37px] lg:!h-[37px] lg:!leading-[37px] lg:!mt-[4px] lg:!mb-[11px]";
  const subTitleClass = "!font-normal !text-[3.3vw] !h-[3.3vw] !leading-[3.3vw] !mb-[3.3vw] !ml-[0.1vw] sm:!text-[19px] sm:!h-[19px] sm:!leading-[19px] sm:!mb-[19px] sm:!ml-[1px] md:!text-[21px] md:!h-[21px] md:!leading-[21px] md:!mb-[21px] md:!ml-[2px] lg:!text-[23px] lg:!h-[23px] lg:!leading-[23px] lg:!mb-[23px] lg:!ml-[2px]";
  const textClass   = "!font-light !text-[3.3vw] !h-[3.3vw] !leading-[3.3vw] !mt-[1.2vw] !ml-[0.1vw] sm:!text-[19px] sm:!h-[19px] sm:!leading-[19px] sm:!mt-[6px] sm:!ml-[1px] md:!text-[21px] md:!h-[21px] md:!leading-[21px] md:!mt-[6.5px] md:!ml-[2px] lg:!text-[23px] lg:!h-[23px] lg:!leading-[23px] lg:!mt-[7.5px] lg:!ml-[2px]";
  const spacerClass = "h-[3.4vw] sm:h-8 md:h-[47px] lg:h-[53px]";
  const squaresWrapperClass = "flex flex-row items-center justify-start w-max h-[3.6vw] ml-[0.1vw] mb-[1vw] sm:h-[19px] sm:ml-[1px] sm:mb-1 md:h-[21px] md:ml-[2px] md:mb-[5px] lg:h-[23px] lg:ml-[2px] lg:mb-[5px]";

  return (
    <div
      className="w-full flex flex-col items-center justify-center content-grid-bg h-[86vw] sm:h-[580px] md:h-[670px] lg:h-[750px]"
    >
      <Paper
        className="flex flex-col items-center justify-center h-[76vw] w-[95vw] sm:h-[500px] sm:w-[90%] md:h-[580px] md:w-[90%] lg:h-[650px] lg:w-[80%]"
        elevation={3}
      >
        <div className="flex flex-row items-start justify-start w-[90%] h-[66vw] sm:h-[420px] md:h-[490px] lg:h-[550px]">
          <div className="flex flex-col items-start justify-start h-full w-max">
            <Typography className={titleClass} style={{ color: "var(--primary-main)" }}>English</Typography>
            <div className={squaresWrapperClass}>
              {squaresArray.map((_, i) => (
                <div key={i} className={squareSizeClass} style={{ backgroundColor: "var(--primary-main)", boxShadow: `inset 0 0 0 1.5px var(--secondary-dark)` }}/>
              ))}
            </div>
            <Typography className={subTitleClass} style={{ color: "var(--secondary-main)" }}>Fluent</Typography>
            <div className={spacerClass}/>
            <Typography className={titleClass} style={{ color: "var(--primary-main)" }}>Mandarin</Typography>
            <div className={squaresWrapperClass}>
              {squaresArray.map((_, i) => (
                <div key={i} className={squareSizeClass} style={{ backgroundColor: "var(--primary-main)", boxShadow: `inset 0 0 0 1.5px var(--secondary-dark)` }}/>
              ))}
            </div>
            <Typography className={subTitleClass} style={{ color: "var(--secondary-main)" }}>Fluent</Typography>
            <div className={spacerClass}/>
            <Typography className={titleClass} style={{ color: "var(--primary-main)" }}>French</Typography>
            <div className={squaresWrapperClass}>
              {squaresArray.map((_, i) => (
                <div key={i} className={squareSizeClass} style={{ backgroundColor: i > 2 ? "var(--bg-paper)" : "var(--primary-main)", boxShadow: `inset 0 0 0 1.5px var(--secondary-dark)` }}/>
              ))}
            </div>
            <Typography className={subTitleClass} style={{ color: "var(--secondary-main)" }}>Proficient</Typography>
            <Typography className={textClass} style={{ color: "var(--secondary-dark)" }}>• Alliance Française - DELF A1 Certification</Typography>
          </div>
        </div>
      </Paper>
    </div>
  );
};

export default Languages;

