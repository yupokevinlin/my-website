import type { NextPage } from "next";
import Head from "next/head";
import App from "../src/app/App";

const Index: NextPage = () => {
  return (
    <div className={"root-container"}>
      <Head>
        <meta charSet="UTF-8"/>
        <meta
          name="viewport"
          content="width=device-width, height=device-height, initial-scale=1.0, user-scalable=no, maximum-scale=1.0, minimum-scale=1.0, shrink-to-fit=yes, minimal-ui"
        />
        <link id="main-icon" rel="icon" href="./resources/icons/winterIcon.svg" type="image/x-icon"/>
        <link id="shortcut-icon" rel="shortcut icon" href="./resources/icons/winterIcon.svg" type="image/x-icon"/>
        <link rel="preconnect" href="https://fonts.gstatic.com"/>
        <link href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap" rel="stylesheet"/>
        <noscript>You need to enable JavaScript to run this app.</noscript>
        <title>Kevin Lin - Full Stack Developer</title>
      </Head>
      <body>
        <div className={"root"}>
          <App/>
        </div>
      </body>

    </div>
  )
}

export default Index;
