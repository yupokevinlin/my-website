import React, { useEffect, useRef } from "react";
import { ScrollNavigationDrawerMenuItemName } from "../ScrollNavigation/ScrollNavigationDrawer/ScrollNavigationDrawerMenuItem/types";

export interface SectionProps {
  name: ScrollNavigationDrawerMenuItemName;
  scrollObserver: IntersectionObserver | null;
  children?: React.ReactNode;
}

const Section: React.FC<SectionProps> = (props) => {
  const { name, scrollObserver } = props;
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current && scrollObserver) {
      scrollObserver.observe(ref.current);
    }
  }, [ref, scrollObserver]);

  return (
    <div className={`w-full h-max ${name}`} ref={ref} id={name}>
      {props.children}
    </div>
  );
};

export default Section;
