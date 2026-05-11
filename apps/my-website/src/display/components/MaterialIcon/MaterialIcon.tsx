import React from "react";
import { SvgIconProps } from "@/components/SvgIcon";
import {
  ArrowUpwardIcon,
  BarChartIcon,
  Brightness3Icon,
  DescriptionIcon,
  DevicesIcon,
  FilterVintageIcon,
  GitHubIcon,
  LanguageIcon,
  LinkedInIcon,
  MailIcon,
  MenuIcon,
  PersonIcon,
  SchoolIcon,
  TrendingUpIcon,
} from "@/components/icons";
import { ExternalLinkIcon as ExternalLink } from "./SvgIcon/SvgIcons";
import { SnowflakeIcon as Snowflake } from "./SvgIcon/SvgIcons";
import { FlowerIcon as Flower } from "./SvgIcon/SvgIcons";
import { LeafIcon as Eco } from "./SvgIcon/SvgIcons";

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
  Flower = "Flower",
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
  const { iconName, ...svgIconProps } = props;
  switch (iconName) {
    case MaterialIconNames.ArrowUpward:
      return <ArrowUpwardIcon {...svgIconProps} />;
    case MaterialIconNames.BarChart:
      return <BarChartIcon {...svgIconProps} />;
    case MaterialIconNames.Brightness3:
      return <Brightness3Icon {...svgIconProps} />;
    case MaterialIconNames.Description:
      return <DescriptionIcon {...svgIconProps} />;
    case MaterialIconNames.Devices:
      return <DevicesIcon {...svgIconProps} />;
    case MaterialIconNames.Eco:
      return <Eco {...svgIconProps} />;
    case MaterialIconNames.ExternalLink:
      return <ExternalLink {...svgIconProps} />;
    case MaterialIconNames.FilterVintage:
      return <FilterVintageIcon {...svgIconProps} />;
    case MaterialIconNames.Flower:
      return <Flower {...svgIconProps} />;
    case MaterialIconNames.Github:
      return <GitHubIcon {...svgIconProps} />;
    case MaterialIconNames.Language:
      return <LanguageIcon {...svgIconProps} />;
    case MaterialIconNames.LinkedIn:
      return <LinkedInIcon {...svgIconProps} />;
    case MaterialIconNames.Person:
      return <PersonIcon {...svgIconProps} />;
    case MaterialIconNames.Mail:
      return <MailIcon {...svgIconProps} />;
    case MaterialIconNames.Menu:
      return <MenuIcon {...svgIconProps} />;
    case MaterialIconNames.School:
      return <SchoolIcon {...svgIconProps} />;
    case MaterialIconNames.Snowflake:
      return <Snowflake {...svgIconProps} />;
    case MaterialIconNames.TrendingUp:
      return <TrendingUpIcon {...svgIconProps} />;
    default:
      return null;
  }
};

export default MaterialIcon;

