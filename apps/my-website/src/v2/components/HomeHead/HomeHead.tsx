import type { ReactNode } from "react";
import Head from "next/head";
import { homeJsonLd, homeSeo, profile } from "../../../data/profile";
import { useLocale } from "../../../i18n/LocaleContext";
import { OG_LOCALES } from "../../../i18n/locales";
import { alternateLinks, localeUrl } from "../../../i18n/seo";
import { useHomeContent } from "../../hooks/useHomeContent";

// The home page's <head> in the page's language: title, description, the
// canonical URL of this language's page, a link to every other language's
// page (hreflang), Open Graph and Twitter cards, and the JSON-LD, which stays
// in English (it describes who Kevin is, not the page's text)
export const HomeHead = (): ReactNode => {
  const locale = useLocale();
  const { seo } = useHomeContent();
  const url = localeUrl(locale, "/");
  return (
    <Head>
      <meta charSet="UTF-8"/>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover"/>
      <title>{seo.title}</title>
      <meta name="description" content={seo.description}/>
      <link rel="canonical" href={url}/>
      {alternateLinks("/").map((link) => <link key={`alternate-${link.hrefLang}`} rel="alternate" hrefLang={link.hrefLang} href={link.href}/>)}

      {/* Open Graph */}
      <meta property="og:type" content="website"/>
      <meta property="og:site_name" content={profile.name}/>
      <meta property="og:locale" content={OG_LOCALES[locale]}/>
      <meta property="og:url" content={url}/>
      <meta property="og:title" content={seo.title}/>
      <meta property="og:description" content={seo.description}/>
      <meta property="og:image" content={homeSeo.image}/>
      <meta property="og:image:width" content="1200"/>
      <meta property="og:image:height" content="630"/>
      <meta property="og:image:alt" content={seo.imageAlt}/>

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image"/>
      <meta name="twitter:title" content={seo.title}/>
      <meta name="twitter:description" content={seo.description}/>
      <meta name="twitter:image" content={homeSeo.image}/>
      <meta name="twitter:image:alt" content={seo.imageAlt}/>

      {/* Structured data: tells search engines which Kevin Lin this site is about */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(homeJsonLd) }}/>
    </Head>
  );
};
