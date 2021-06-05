import React from "react";
import {createStyles, Theme, useTheme} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";

export type ContactProps = ContactDataProps & ContactStyleProps & ContactEventProps;

export interface ContactDataProps {

}

export interface ContactStyleProps {

}

export interface ContactEventProps {

}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({

  }),
);

const Contact: React.FC<ContactProps> = (props) => {
  const theme: Theme = useTheme();
  const classes = useStyles();

  const {

  } = props;

  return (
    <div/>
  );
};

export default Contact;

