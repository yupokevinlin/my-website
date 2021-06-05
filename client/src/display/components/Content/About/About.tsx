import React from "react";
import {createStyles, Theme, useTheme} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";

export type AboutProps = AboutDataProps & AboutStyleProps & AboutEventProps;

export interface AboutDataProps {

}

export interface AboutStyleProps {

}

export interface AboutEventProps {

}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({

  }),
);

const About: React.FC<AboutProps> = (props) => {
  const theme: Theme = useTheme();
  const classes = useStyles();

  const {

  } = props;

  return (
    <div/>
  );
};

export default About;

