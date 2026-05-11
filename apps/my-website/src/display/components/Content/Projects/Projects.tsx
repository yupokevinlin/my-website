import React from "react";
import Paper from "@/components/Paper";
import Typography from "@/components/Typography";
import Button from "@/components/Button";
import Link from "@/components/Link";
import ImageCarousel from "../../ImageCarousel/ImageCarousel";
import MaterialIcon, { MaterialIconNames } from "../../MaterialIcon/MaterialIcon";
import NavigationUtils from "../../../../helpers/NavigationUtils";

// Icon/title wrapper sizes for the projects top-bar
const iconWrapperClass = "flex flex-row items-center justify-center h-[6vw] w-[6vw] sm:h-[45px] sm:w-[45px] md:h-[50px] md:w-[50px] lg:h-[55px] lg:w-[55px]";
const titleWrapperClass = "flex flex-row items-center justify-start h-full w-[calc(100%-9vw)] ml-[3vw] sm:w-[calc(100%-67.5px)] sm:ml-[22.5px] md:w-[calc(100%-50px)] md:ml-[25px] lg:w-[calc(100%-82.5px)] lg:ml-[27.5px]";
const buttonWrapperClass = "flex flex-row items-center justify-evenly w-full h-[6.4vw] sm:h-8 md:h-9 lg:h-10";
const buttonClass = "!flex !flex-row !items-center !justify-center !h-full !w-[33vw] sm:!w-[180px] md:!w-[202px] lg:!w-[224px]";
const buttonIconClass = "!text-white !h-[4.4vw] !w-[4.4vw] sm:!h-[23.2px] sm:!w-[23.2px] md:!h-[25.6px] md:!w-[25.6px] lg:!h-[28.8px] lg:!w-[28.8px]";
const buttonTextClass = "!text-white !text-[2.88vw] !leading-[2.88vw] !ml-[2.88vw] sm:!text-[15.2px] sm:!leading-[15.2px] sm:!ml-[15.2px] md:!text-[17.6px] md:!leading-[17.6px] md:!ml-[17.6px] lg:!text-[19.2px] lg:!leading-[19.2px] lg:!ml-[19.2px]";

const Projects: React.FC = () => {
  return (
    <div className="w-full flex flex-col items-center justify-center h-max content-grid-bg">
      <div className="paper-spacer"/>

      {/* COVID-19 Tracker */}
      <Paper className="content-paper" elevation={3}>
        <div className="content-inner">
          <div className="flex flex-col items-start justify-start h-full w-full">
            <div className="content-top-bar">
              <div className={iconWrapperClass}>
                <img className="max-w-full max-h-full" src="./resources/images/projects/covid19TrackerAppIcon.svg" alt="COVID-19 Tracker App"/>
              </div>
              <div className={titleWrapperClass}>
                <Link className="content-font-link" style={{ color: "var(--primary-main)" }} onClick={() => NavigationUtils.goToWebsite("https://covid-19-tracker.app/")}>
                  COVID-19 TRACKER APP
                </Link>
              </div>
            </div>
          </div>
          <div className="content-divider"/>
          <Typography className="content-font-body !italic" style={{ color: "var(--secondary-dark)" }}>An interactive website to track the Covid-19 pandemic</Typography>
          <div className="text-spacer"/><div className="text-spacer"/>
          <Typography className="content-font-title" style={{ color: "var(--primary-dark)" }}>FRONT-END</Typography>
          <div className="text-spacer"/>
          <Typography className="content-font-body" style={{ color: "var(--secondary-dark)" }}>• React / Typescript / Material UI / Redux / Redux Saga</Typography>
          <div className="text-spacer"/>
          <Typography className="content-font-body" style={{ color: "var(--secondary-dark)" }}>• Map: ESRI</Typography>
          <div className="text-spacer"/>
          <Typography className="content-font-body" style={{ color: "var(--secondary-dark)" }}>• Charts: D3</Typography>
          <div className="text-spacer"/><div className="text-spacer"/>
          <Typography className="content-font-title" style={{ color: "var(--primary-dark)" }}>BACK-END</Typography>
          <div className="text-spacer"/>
          <Typography className="content-font-body" style={{ color: "var(--secondary-dark)" }}>• Node / Typescript / Express / Nginx</Typography>
          <div className="content-divider"/>
          <div className="text-spacer"/>
          <Paper className="h-max w-full" square elevation={3}>
            <ImageCarousel images={["/resources/images/projects/covid-19-tracker-app1.jpg", "/resources/images/projects/covid-19-tracker-app2.jpg", "/resources/images/projects/covid-19-tracker-app3.jpg"]}/>
          </Paper>
          <div className="text-spacer"/>
          <div className="content-divider"/>
          <div className="text-spacer"/>
          <div className={buttonWrapperClass}>
            <Button variant="contained" className={buttonClass} color="primary" onClick={() => NavigationUtils.goToWebsite("https://covid-19-tracker.app/")}>
              <MaterialIcon iconName={MaterialIconNames.ExternalLink} className={buttonIconClass}/><Typography className={buttonTextClass}>Visit</Typography>
            </Button>
            <Button variant="contained" className={buttonClass} color="primary" onClick={() => NavigationUtils.goToWebsite("https://github.com/yupokevinlin/covid-19-interactive-world-map")}>
              <MaterialIcon iconName={MaterialIconNames.Github} className={buttonIconClass}/><Typography className={buttonTextClass}>View</Typography>
            </Button>
          </div>
        </div>
      </Paper>
      <div className="paper-spacer"/>

      {/* Write My MP */}
      <Paper className="content-paper" elevation={3}>
        <div className="content-inner">
          <div className="flex flex-col items-start justify-start h-full w-full">
            <div className="content-top-bar">
              <div className={iconWrapperClass}>
                <img className="max-w-full max-h-full" src="./resources/images/projects/writeMyMPIcon.svg" alt="Write My MP"/>
              </div>
              <div className={titleWrapperClass}>
                <Link className="content-font-link" style={{ color: "var(--primary-main)" }} onClick={() => NavigationUtils.goToWebsite("https://writemymp.ca/")}>
                  WRITE MY MP
                </Link>
              </div>
            </div>
          </div>
          <div className="content-divider"/>
          <Typography className="content-font-body !italic" style={{ color: "var(--secondary-dark)" }}>A website to help Canadians contact their Members of Parliament</Typography>
          <div className="text-spacer"/><div className="text-spacer"/>
          <Typography className="content-font-title" style={{ color: "var(--primary-dark)" }}>FRONT-END</Typography>
          <div className="text-spacer"/>
          <Typography className="content-font-body" style={{ color: "var(--secondary-dark)" }}>• React / Typescript / Material UI / Redux / Redux Saga</Typography>
          <div className="text-spacer"/>
          <Typography className="content-font-body" style={{ color: "var(--secondary-dark)" }}>• Map: ESRI</Typography>
          <div className="text-spacer"/><div className="text-spacer"/>
          <Typography className="content-font-title" style={{ color: "var(--primary-dark)" }}>BACK-END</Typography>
          <div className="text-spacer"/>
          <Typography className="content-font-body" style={{ color: "var(--secondary-dark)" }}>• Node / Typescript / Express / Nginx</Typography>
          <div className="text-spacer"/>
          <Typography className="content-font-body" style={{ color: "var(--secondary-dark)" }}>• Data Scraping: Cheerio</Typography>
          <div className="content-divider"/>
          <div className="text-spacer"/>
          <Paper className="h-max w-full" square elevation={3}>
            <ImageCarousel images={["/resources/images/projects/writemymp1.jpg", "/resources/images/projects/writemymp2.jpg"]}/>
          </Paper>
          <div className="text-spacer"/>
          <div className="content-divider"/>
          <div className="text-spacer"/>
          <div className={buttonWrapperClass}>
            <Button variant="contained" className={buttonClass} color="primary" onClick={() => NavigationUtils.goToWebsite("https://writemymp.ca/")}>
              <MaterialIcon iconName={MaterialIconNames.ExternalLink} className={buttonIconClass}/><Typography className={buttonTextClass}>Visit</Typography>
            </Button>
            <Button variant="contained" className={buttonClass} color="primary" onClick={() => NavigationUtils.goToWebsite("https://github.com/yupokevinlin/write-my-mp")}>
              <MaterialIcon iconName={MaterialIconNames.Github} className={buttonIconClass}/><Typography className={buttonTextClass}>View</Typography>
            </Button>
          </div>
        </div>
      </Paper>
      <div className="paper-spacer"/>

      {/* React Electron Template */}
      <Paper className="content-paper" elevation={3}>
        <div className="content-inner">
          <div className="flex flex-col items-start justify-start h-full w-full">
            <div className="content-top-bar">
              <div className={iconWrapperClass}>
                <img className="max-w-full max-h-full" src="./resources/images/projects/electronTemplate.svg" alt="React Electron Template"/>
              </div>
              <div className={titleWrapperClass}>
                <Link className="content-font-link" style={{ color: "var(--primary-main)" }} onClick={() => NavigationUtils.goToWebsite("https://github.com/yupokevinlin/react-electron-typescript-template")}>
                  REACT ELECTRON TEMPLATE
                </Link>
              </div>
            </div>
          </div>
          <div className="content-divider"/>
          <Typography className="content-font-body !italic" style={{ color: "var(--secondary-dark)" }}>A template for setting up a hot reloadable electron dev environment</Typography>
          <div className="text-spacer"/><div className="text-spacer"/>
          <Typography className="content-font-title" style={{ color: "var(--primary-dark)" }}>FRONT-END</Typography>
          <div className="text-spacer"/>
          <Typography className="content-font-body" style={{ color: "var(--secondary-dark)" }}>• React / Typescript / Electron</Typography>
          <div className="text-spacer"/><div className="text-spacer"/>
          <Typography className="content-font-title" style={{ color: "var(--primary-dark)" }}>BUILD</Typography>
          <div className="text-spacer"/>
          <Typography className="content-font-body" style={{ color: "var(--secondary-dark)" }}>• Webpack</Typography>
          <div className="content-divider"/>
          <div className="text-spacer"/>
          <Paper className="h-max w-full" square elevation={3}>
            <ImageCarousel images={["/resources/images/projects/electrontemplate1.jpg", "/resources/images/projects/electrontemplate2.jpg"]}/>
          </Paper>
          <div className="text-spacer"/>
          <div className="content-divider"/>
          <div className="text-spacer"/>
          <div className={buttonWrapperClass}>
            <Button variant="contained" className={buttonClass} color="primary" onClick={() => NavigationUtils.goToWebsite("https://github.com/yupokevinlin/react-electron-typescript-template")}>
              <MaterialIcon iconName={MaterialIconNames.Github} className={buttonIconClass}/><Typography className={buttonTextClass}>View</Typography>
            </Button>
          </div>
        </div>
      </Paper>
      <div className="paper-spacer"/>
    </div>
  );
};

export default Projects;

