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

export const FlowerIcon: React.FC<SvgIconProps> = (props) => {
  return (
    <SvgIcon {...props} viewBox={"0 0 24 24"}>
      <path key={"path1"} d={"M18.7 12.4c-.28-.16-.57-.29-.86-.4.29-.11.58-.24.86-.4 1.92-1.11 2.99-3.12 3-5.19-1.79-1.03-4.07-1.11-6 0-.28.16-.54.35-.78.54.05-.31.08-.63.08-.95 0-2.22-1.21-4.15-3-5.19C10.21 1.85 9 3.78 9 6c0 .32.03.64.08.95-.24-.2-.5-.39-.78-.55-1.92-1.11-4.2-1.03-6 0 0 2.07 1.07 4.08 3 5.19.28.16.57.29.86.4-.29.11-.58.24-.86.4-1.92 1.11-2.99 3.12-3 5.19 1.79 1.03 4.07 1.11 6 0 .28-.16.54-.35.78-.54-.05.32-.08.64-.08.96 0 2.22 1.21 4.15 3 5.19 1.79-1.04 3-2.97 3-5.19 0-.32-.03-.64-.08-.95.24.2.5.38.78.54 1.92 1.11 4.2 1.03 6 0-.01-2.07-1.08-4.08-3-5.19zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"}/>
      <circle
        style={{fill: "#ffaa00"}}
        id="path2"
        cx="12"
        cy="12"
        r="4" />
    </SvgIcon>
  )
};
