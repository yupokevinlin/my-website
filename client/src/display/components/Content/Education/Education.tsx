import React from "react";
import {createStyles, Theme, useTheme} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";

export type EducationProps = EducationDataProps & EducationStyleProps & EducationEventProps;

export interface EducationDataProps {

}

export interface EducationStyleProps {

}

export interface EducationEventProps {

}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({

  }),
);

const Education: React.FC<EducationProps> = (props) => {
  const theme: Theme = useTheme();
  const classes = useStyles();

  const {

  } = props;

  return (
    <div/>
  );
};

export default Education;

