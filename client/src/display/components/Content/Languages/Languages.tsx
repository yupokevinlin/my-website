import React from "react";
import {createStyles, Theme, useTheme} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";

export type LanguagesProps = LanguagesDataProps & LanguagesStyleProps & LanguagesEventProps;

export interface LanguagesDataProps {

}

export interface LanguagesStyleProps {

}

export interface LanguagesEventProps {

}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({

  }),
);

const Languages: React.FC<LanguagesProps> = (props) => {
  const theme: Theme = useTheme();
  const classes = useStyles();

  const {

  } = props;

  return (
    <div/>
  );
};

export default Languages;

