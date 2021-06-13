import React from "react";
import {SvgIconProps} from "@material-ui/core";

import ArrowUpward from "@material-ui/icons/ArrowUpward";
import BarChart from "@material-ui/icons/BarChart";
import Description from "@material-ui/icons/Description";
import Person from "@material-ui/icons/Person";
import TrendingUp from "@material-ui/icons/TrendingUp";
import Language from "@material-ui/icons/Language";
import School from "@material-ui/icons/School";
import Mail from "@material-ui/icons/Mail";
import Menu from "@material-ui/icons/Menu";
import Devices from "@material-ui/icons/Devices";
import LinkedIn from "@material-ui/icons/LinkedIn";
import GitHub from "@material-ui/icons/GitHub";
import FilterVintage from "@material-ui/icons/FilterVintage";
import Eco from "@material-ui/icons/Eco";
import Brightness3 from "@material-ui/icons/Brightness3";
import {ExternalLinkIcon as ExternalLink} from "./SvgIcon/SvgIcons";
import {SnowflakeIcon as Snowflake} from "./SvgIcon/SvgIcons";



export interface MaterialIconProps extends SvgIconProps {
  iconName: MaterialIconNames;
}

export enum MaterialIconNames {
  ArrowUpward = "ArrowUpward",
  BarChart = "BarChart",
  Brightness3 = "Brightness3",
  Description = "Description",
  Devices = "Devices",
  Eco = "Eco",
  ExternalLink = "ExternalLink",
  FilterVintage = "FilterVintage",
  Github = "Github",
  Language = "Language",
  LinkedIn = "LinkedIn",
  Person = "Person",
  Mail = "Mail",
  Menu = "Menu",
  School = "School",
  Snowflake = "Snowflake",
  TrendingUp = "TrendingUp",
}

const MaterialIcon: React.FC<MaterialIconProps> = (props) => {
  const copiedProps: MaterialIconProps = { ...props };
  delete copiedProps.iconName;
  const svgIconProps: SvgIconProps = { ...copiedProps };
  switch (props.iconName) {
    case MaterialIconNames.ArrowUpward: {
      return <ArrowUpward {...svgIconProps}/>;
    }
    case MaterialIconNames.BarChart: {
      return <BarChart {...svgIconProps}/>;
    }
    case MaterialIconNames.Brightness3: {
      return <Brightness3 {...svgIconProps}/>;
    }
    case MaterialIconNames.Description: {
      return <Description {...svgIconProps}/>;
    }
    case MaterialIconNames.Devices: {
      return <Devices {...svgIconProps}/>;
    }
    case MaterialIconNames.Eco: {
      return <Eco {...svgIconProps}/>;
    }
    case MaterialIconNames.ExternalLink: {
      return <ExternalLink {...svgIconProps}/>;
    }
    case MaterialIconNames.FilterVintage: {
      return <FilterVintage {...svgIconProps}/>;
    }
    case MaterialIconNames.Github: {
      return <GitHub {...svgIconProps}/>;
    }
    case MaterialIconNames.Language: {
      return <Language {...svgIconProps}/>;
    }
    case MaterialIconNames.LinkedIn: {
      return <LinkedIn {...svgIconProps}/>;
    }
    case MaterialIconNames.Person: {
      return <Person {...svgIconProps}/>;
    }
    case MaterialIconNames.Mail: {
      return <Mail {...svgIconProps}/>;
    }
    case MaterialIconNames.Menu: {
      return <Menu {...svgIconProps}/>;
    }
    case MaterialIconNames.School: {
      return <School {...svgIconProps}/>;
    }
    case MaterialIconNames.Snowflake: {
      return <Snowflake {...svgIconProps}/>;
    }
    case MaterialIconNames.TrendingUp: {
      return <TrendingUp {...svgIconProps}/>;
    }
  }
};

export default MaterialIcon;
