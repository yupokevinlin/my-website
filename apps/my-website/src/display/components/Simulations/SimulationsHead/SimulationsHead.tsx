import React, { useEffect } from "react";
import Head from "next/head";
import { PERSON_ID, SITE_URL as SITE, profile } from "../../../../data/profile";
import { useLocale, useMessages } from "../../../../i18n/LocaleContext";
import { LOCALE_TAGS, OG_LOCALES } from "../../../../i18n/locales";
import { alternateLinks, localeUrl } from "../../../../i18n/seo";

export type GuidePage = "overview" | "blackhole" | "infall" | "wormhole" | "lightspeed";

export interface SimulationsHeadProps {
  // Which page: its name and description come from the dictionary
  // (rayTracing.heads), in the page's language
  page: GuidePage;
  // The page's path without a language prefix
  path: string;
  image: string;
}

const GUIDE_PATH = "/ray-tracing";
// Bump GUIDE_MODIFIED, and the matching <lastmod> in public/sitemap.xml, when
// the guide's content changes.
const GUIDE_PUBLISHED = "2026-10-14";
const GUIDE_MODIFIED = "2026-10-19";

// The guide is a TechArticle by Kevin (the Person on the home page). Each
// simulation page gets a breadcrumb: Kevin Lin > Relativistic Ray Tracing > page.
const structuredData = (name: string, guideName: string, description: string, url: string, guideUrl: string, image: string, language: string, isGuide: boolean): object => {
  if (isGuide) {
    return {
      "@context": "https://schema.org",
      "@type": "TechArticle",
      headline: guideName,
      description,
      url,
      image: `${SITE}${image}`,
      inLanguage: language,
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
      { "@type": "ListItem", position: 2, name: guideName, item: guideUrl },
      { "@type": "ListItem", position: 3, name, item: url },
    ],
  };
};

const FAVICON = "/ray-tracing/favicon.svg";
// The site-wide icon links from _document, which the home page points at the
// current season's icon.
const SITE_ICON_IDS = ["main-icon", "shortcut-icon"];

const SimulationsHead: React.FC<SimulationsHeadProps> = ({ page, path, image }) => {
  const locale = useLocale();
  const { heads } = useMessages().rayTracing;
  const { name, description } = heads[page];
  const title = `${name} - ${profile.name}`;
  const url = localeUrl(locale, path);

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

  const data = structuredData(name, heads.overview.name, description, url, localeUrl(locale, GUIDE_PATH), image, LOCALE_TAGS[locale], path === GUIDE_PATH);

  return (
    <Head>
      <meta charSet="UTF-8"/>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover"/>
      <title>{title}</title>
      <meta name="description" content={description}/>
      <link rel="canonical" href={url}/>
      {alternateLinks(path).map((link) => <link key={`alternate-${link.hrefLang}`} rel="alternate" hrefLang={link.hrefLang} href={link.href}/>)}
      {/* in the server HTML too, so a direct visit never shows the seasonal icon */}
      <link key="ray-tracing-icon" rel="icon" href={FAVICON} type="image/svg+xml"/>

      {/* Open Graph */}
      <meta property="og:type" content="website"/>
      <meta property="og:site_name" content={profile.name}/>
      <meta property="og:locale" content={OG_LOCALES[locale]}/>
      <meta property="og:url" content={url}/>
      <meta property="og:title" content={title}/>
      <meta property="og:description" content={description}/>
      <meta property="og:image" content={`${SITE}${image}`}/>

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image"/>
      <meta name="twitter:title" content={title}/>
      <meta name="twitter:description" content={description}/>
      <meta name="twitter:image" content={`${SITE}${image}`}/>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}/>
    </Head>
  );
};

export default SimulationsHead;
