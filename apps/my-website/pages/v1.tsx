import type { NextPage } from "next";
import Head from "next/head";
import App from "../src/root/App";
import { profile } from "../src/data/profile";

// The previous design, kept as it was when the redesign launched. It stays out
// of search results (noindex, not in the sitemap) so it never competes with
// "/", and the new footer links to it. Don't update it when experience changes.
const V1: NextPage = () => {
  return (
    <div className={"root"}>
      <Head>
        <meta charSet="UTF-8"/>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, viewport-fit=cover"
        />
        <title>{`${profile.name} | Previous version`}</title>
        <meta name="robots" content="noindex"/>
      </Head>
      <App/>
    </div>
  );
};

export default V1;
