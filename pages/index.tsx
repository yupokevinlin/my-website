import type { NextPage } from "next";
import Head from "next/head";
import App from "../src/app/App";

const Index: NextPage = () => {
  return (
    <div className={"root"}>
      <Head>
        <meta charSet="UTF-8"/>
        <meta
          name="viewport"
          content="width=device-width, height=device-height, initial-scale=1.0, user-scalable=no, maximum-scale=1.0, minimum-scale=1.0, shrink-to-fit=yes, minimal-ui"
        />
        <title>Kevin Lin - Full Stack Developer</title>
      </Head>
      <App/>
    </div>
  );
}

export default Index;
