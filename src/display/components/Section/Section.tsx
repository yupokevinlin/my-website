import React, {useEffect, useRef} from "react";
import {createStyles, Theme, useTheme} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import {ScrollNavigationDrawerMenuItemName} from "../ScrollNavigation/ScrollNavigationDrawer/ScrollNavigationDrawerMenuItem/types";

export type SectionProps = SectionDataProps & SectionStyleProps & SectionEventProps;

export interface SectionDataProps {
  name: ScrollNavigationDrawerMenuItemName,
  scrollObserver: IntersectionObserver | null;
}

export interface SectionStyleProps {

}

export interface SectionEventProps {

}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    section: {
      width: "100%",
      height: "max-content",
    },
  }),
);

const Section: React.FC<SectionProps> = (props) => {
  const theme: Theme = useTheme();
  const classes = useStyles();

  const {
    name,
    scrollObserver,
  } = props;

  const ref: React.MutableRefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref) {
      if (!!ref && !!scrollObserver) {
        scrollObserver.observe(ref.current);
      }
    }
  }, [ref, scrollObserver]);

  return (
    <div className={`${classes.section} ${name}`} ref={ref} id={name}>
      {
        props.children
      }
    </div>
  );
};

export default Section;

