import React from "react";
import Head from "next/head";

export interface SimulationsHeadProps {
  title: string;
  description: string;
  path: string;
  image: string;
}

const SITE = "https://kevinyupolin.dev";

const SimulationsHead: React.FC<SimulationsHeadProps> = ({ title, description, path, image }) => (
  <Head>
    <meta charSet="UTF-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover"/>
    <title>{title}</title>
    <meta name="description" content={description}/>
    <link rel="canonical" href={`${SITE}${path}`}/>

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

export default SimulationsHead;
