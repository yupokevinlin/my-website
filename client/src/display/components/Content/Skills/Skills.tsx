import React from "react";
import {createStyles, Theme, useTheme} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";

export type SkillsProps = SkillsDataProps & SkillsStyleProps & SkillsEventProps;

export interface SkillsDataProps {

}

export interface SkillsStyleProps {

}

export interface SkillsEventProps {

}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({

  }),
);

const Skills: React.FC<SkillsProps> = (props) => {
  const theme: Theme = useTheme();
  const classes = useStyles();

  const {

  } = props;

  return (
    <div/>
  );
};

export default Skills;

