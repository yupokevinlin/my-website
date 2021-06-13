import React from "react";
import {SvgIcon, SvgIconProps} from "@material-ui/core";
import {SvgIconData, svgIconDataObject} from "./types";


export const ExternalLinkIcon: React.FC<SvgIconProps> = (props) => {
  const data: SvgIconData = svgIconDataObject["ExternalLink"];
  return (
    <SvgIcon {...props} viewBox={data.viewBox}>
      {
        data.path.map((path, index) => (
          <path key={index} d={path}/>
        ))
      }
    </SvgIcon>
  );
};

export const SnowflakeIcon: React.FC<SvgIconProps> = (props) =>  {
  const data: SvgIconData = svgIconDataObject["Snowflake"];
  return (
    <SvgIcon {...props} viewBox={data.viewBox}>
      {
        data.path.map((path, index) => (
          <path key={index} d={path}/>
        ))
      }
    </SvgIcon>
  );
};
