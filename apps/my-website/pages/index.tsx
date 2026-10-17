import type { NextPage } from "next";
import Head from "next/head";
import App from "../src/root/App";
import { SITE_URL, homeJsonLd, homeSeo, profile } from "../src/data/profile";

const Index: NextPage = () => {
  return (
    <div className={"root"}>
      <Head>
        <meta charSet="UTF-8"/>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, viewport-fit=cover"
        />
        <title>{homeSeo.title}</title>
        <meta name="description" content={homeSeo.description}/>
        <link rel="canonical" href={`${SITE_URL}/`}/>
        {/* The loading screen waits for this picture, so start it before the JavaScript */}
        <link rel="preload" as="image" href="/resources/seasons/winter.svg"/>

        {/* Open Graph */}
        <meta property="og:type" content="website"/>
        <meta property="og:site_name" content={profile.name}/>
        <meta property="og:locale" content="en_CA"/>
        <meta property="og:url" content={`${SITE_URL}/`}/>
        <meta property="og:title" content={homeSeo.title}/>
        <meta property="og:description" content={homeSeo.description}/>
        <meta property="og:image" content={homeSeo.image}/>
        <meta property="og:image:width" content="1200"/>
        <meta property="og:image:height" content="630"/>
        <meta property="og:image:alt" content={homeSeo.imageAlt}/>

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image"/>
        <meta name="twitter:title" content={homeSeo.title}/>
        <meta name="twitter:description" content={homeSeo.description}/>
        <meta name="twitter:image" content={homeSeo.image}/>
        <meta name="twitter:image:alt" content={homeSeo.imageAlt}/>

        {/* Structured data: tells search engines which Kevin Lin this site is about */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(homeJsonLd) }}
        />
      </Head>
      <App/>
    </div>
  );
};

export default Index;
