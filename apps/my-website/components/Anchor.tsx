import React from "react";
import NextLink from "next/link";
import clsx from "clsx";

export interface AnchorProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
}

// A real <a href>, which search engines follow and a click handler isn't.
// Site pages ("/...") go through next/link; http(s) links open in a new tab.
const Anchor: React.FC<AnchorProps> = ({ href, rel, ...rest }) => {
  if (href.startsWith("/")) {
    return <NextLink href={href} rel={rel} {...rest}/>;
  }
  const external = /^https?:/.test(href);
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? clsx("noopener noreferrer", rel) : rel}
      {...rest}
    />
  );
};

export default Anchor;
