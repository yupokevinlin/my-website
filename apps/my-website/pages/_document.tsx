import React from "react";
import Document, { Html, Head, Main, NextScript } from "next/document";

export default class MyDocument extends Document {
  override render() {
    return (
      <Html lang="en">
        <Head>
          <link id="main-icon" rel="icon" href="./resources/icons/winterIcon.svg" type="image/x-icon"/>
          <link id="shortcut-icon" rel="shortcut icon" href="./resources/icons/winterIcon.svg" type="image/x-icon"/>
          <noscript>You need to enable JavaScript to run this app.</noscript>
        </Head>
        <body>
          <Main/>
          <NextScript/>
        </body>
      </Html>
    );
  }
}
