import React from "react";
import {createStyles, Theme, useTheme} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";

export type ProjectsProps = ProjectsDataProps & ProjectsStyleProps & ProjectsEventProps;

export interface ProjectsDataProps {

}

export interface ProjectsStyleProps {

}

export interface ProjectsEventProps {

}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({

  }),
);

const Projects: React.FC<ProjectsProps> = (props) => {
  const theme: Theme = useTheme();
  const classes = useStyles();

  const {

  } = props;

  return (
    <div/>
  );
};

export default Projects;

