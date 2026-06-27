import type { NextPage } from "next";
import Head from "next/head";
import App from "../src/root/App";

const Index: NextPage = () => {
  return (
    <div className={"root"}>
      <Head>
        <meta charSet="UTF-8"/>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, viewport-fit=cover"
        />
        <title>Kevin Lin - Full Stack Developer</title>
        <meta
          name="description"
          content="Kevin Lin is a full stack developer. Explore my portfolio of projects, professional experience, skills, and ways to get in touch."
        />
        <link rel="canonical" href="https://kevinyupolin.dev/"/>

        {/* Open Graph */}
        <meta property="og:type" content="website"/>
        <meta property="og:url" content="https://kevinyupolin.dev/"/>
        <meta property="og:title" content="Kevin Lin - Full Stack Developer"/>
        <meta
          property="og:description"
          content="Kevin Lin is a full stack developer. Explore my portfolio of projects, professional experience, skills, and ways to get in touch."
        />
        <meta property="og:image" content="https://kevinyupolin.dev/resources/og-image.png"/>
        <meta property="og:image:alt" content="Kevin Lin - Full Stack Developer"/>

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image"/>
        <meta name="twitter:title" content="Kevin Lin - Full Stack Developer"/>
        <meta
          name="twitter:description"
          content="Kevin Lin is a full stack developer. Explore my portfolio of projects, professional experience, skills, and ways to get in touch."
        />
        <meta name="twitter:image" content="https://kevinyupolin.dev/resources/og-image.png"/>
      </Head>
      <App/>
    </div>
  );
};

export default Index;

