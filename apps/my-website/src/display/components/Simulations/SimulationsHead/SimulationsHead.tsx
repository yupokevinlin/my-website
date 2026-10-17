import React, { useEffect } from "react";
import Head from "next/head";
import { PERSON_ID, SITE_URL as SITE, profile } from "../../../../data/profile";

export interface SimulationsHeadProps {
  title: string;
  description: string;
  path: string;
  image: string;
}

const GUIDE_PATH = "/ray-tracing";
const GUIDE_NAME = "Relativistic Ray Tracing";
// Bump GUIDE_MODIFIED, and the matching <lastmod> in public/sitemap.xml, when
// the guide's content changes.
const GUIDE_PUBLISHED = "2026-10-14";
const GUIDE_MODIFIED = "2026-10-15";

// The guide is a TechArticle by Kevin (the Person on the home page). Each
// simulation page gets a breadcrumb: Kevin Lin > Relativistic Ray Tracing > page.
const structuredData = (title: string, description: string, path: string, image: string): object => {
  if (path === GUIDE_PATH) {
    return {
      "@context": "https://schema.org",
      "@type": "TechArticle",
      headline: GUIDE_NAME,
      description,
      url: `${SITE}${path}`,
      image: `${SITE}${image}`,
      inLanguage: "en",
      datePublished: GUIDE_PUBLISHED,
      dateModified: GUIDE_MODIFIED,
      author: { "@type": "Person", "@id": PERSON_ID, name: profile.name, url: `${SITE}/` },
    };
  }
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: profile.name, item: `${SITE}/` },
      { "@type": "ListItem", position: 2, name: GUIDE_NAME, item: `${SITE}${GUIDE_PATH}` },
      // Page titles read "<name> - Kevin Lin"
      { "@type": "ListItem", position: 3, name: title.split(" - ")[0], item: `${SITE}${path}` },
    ],
  };
};

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
      <meta property="og:site_name" content={profile.name}/>
      <meta property="og:url" content={`${SITE}${path}`}/>
      <meta property="og:title" content={title}/>
      <meta property="og:description" content={description}/>
      <meta property="og:image" content={`${SITE}${image}`}/>

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image"/>
      <meta name="twitter:title" content={title}/>
      <meta name="twitter:description" content={description}/>
      <meta name="twitter:image" content={`${SITE}${image}`}/>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData(title, description, path, image)) }}
      />
    </Head>
  );
};

export default SimulationsHead;
