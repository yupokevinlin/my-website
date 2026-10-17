import React, { useEffect } from "react";
import Head from "next/head";

export interface SimulationsHeadProps {
  title: string;
  description: string;
  path: string;
  image: string;
}

const SITE = "https://kevinyupolin.dev";
const FAVICON = "/ray-tracing/favicon.svg";
// The site-wide icon links from _document, which the home page points at the
// current season's icon.
const SITE_ICON_IDS = ["main-icon", "shortcut-icon"];

const SimulationsHead: React.FC<SimulationsHeadProps> = ({ title, description, path, image }) => {
  // The ray-tracing pages use a black hole icon instead of the seasonal one.
  // The links in _document survive client-side navigation, so point them at
  // the black hole while here and give the seasonal icon back on leaving.
  useEffect(() => {
    const links = SITE_ICON_IDS.map((id) => document.getElementById(id)).filter((l): l is HTMLLinkElement => l instanceof HTMLLinkElement);
    const previous = links.map((l) => l.getAttribute("href"));
    links.forEach((l) => l.setAttribute("href", FAVICON));
    return () => links.forEach((l, i) => {
      const href = previous[i];
      if (href) l.setAttribute("href", href);
    });
  }, []);

  return (
    <Head>
      <meta charSet="UTF-8"/>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover"/>
      <title>{title}</title>
      <meta name="description" content={description}/>
      <link rel="canonical" href={`${SITE}${path}`}/>
      {/* in the server HTML too, so a direct visit never shows the seasonal icon */}
      <link key="ray-tracing-icon" rel="icon" href={FAVICON} type="image/svg+xml"/>

      {/* Open Graph */}
      <meta property="og:type" content="website"/>
      <meta property="og:url" content={`${SITE}${path}`}/>
      <meta property="og:title" content={title}/>
      <meta property="og:description" content={description}/>
      <meta property="og:image" content={`${SITE}${image}`}/>

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image"/>
      <meta name="twitter:title" content={title}/>
      <meta name="twitter:description" content={description}/>
      <meta name="twitter:image" content={`${SITE}${image}`}/>
    </Head>
  );
};

export default SimulationsHead;
