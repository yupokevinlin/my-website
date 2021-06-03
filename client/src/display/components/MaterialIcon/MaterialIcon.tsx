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

export interface MaterialIconProps extends SvgIconProps {
  iconName: MaterialIconNames;
}

export enum MaterialIconNames {
  ArrowUpward = "ArrowUpward",
  BarChart = "BarChart",
  Description = "Description",
  Devices = "Devices",
  Language = "Language",
  Person = "Person",
  Mail = "Mail",
  Menu = "Menu",
  School = "School",
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
    case MaterialIconNames.Description: {
      return <Description {...svgIconProps}/>;
    }
    case MaterialIconNames.Devices: {
      return <Devices {...svgIconProps}/>;
    }
    case MaterialIconNames.Language: {
      return <Language {...svgIconProps}/>;
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
    case MaterialIconNames.TrendingUp: {
      return <TrendingUp {...svgIconProps}/>;
    }
  }
};

export default MaterialIcon;
