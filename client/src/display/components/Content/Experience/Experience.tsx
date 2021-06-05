import React from "react";
import {createStyles, Theme, useTheme} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";

export type ExperienceProps = ExperienceDataProps & ExperienceStyleProps & ExperienceEventProps;

export interface ExperienceDataProps {

}

export interface ExperienceStyleProps {

}

export interface ExperienceEventProps {

}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({

  }),
);

const Experience: React.FC<ExperienceProps> = (props) => {
  const theme: Theme = useTheme();
  const classes = useStyles();

  const {

  } = props;

  return (
    <div/>
  );
};

export default Experience;

