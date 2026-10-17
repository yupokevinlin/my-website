import React from "react";
import Document, { Html, Head, Main, NextScript } from "next/document";
import { SEASON_SCRIPT } from "../src/v2/season";

export default class MyDocument extends Document {
  override render() {
    return (
      <Html lang="en">
        <Head>
          <link id="main-icon" rel="icon" href="/resources/icons/winterIcon.svg" type="image/svg+xml"/>
          <link id="shortcut-icon" rel="shortcut icon" href="/resources/icons/winterIcon.svg" type="image/svg+xml"/>
          <link rel="apple-touch-icon" href="/resources/icons/apple-touch-icon.png"/>
          {/* Picks the season before the first paint; after the icon links, which it updates */}
          <script dangerouslySetInnerHTML={{ __html: SEASON_SCRIPT }}/>
        </Head>
        <body>
          <noscript>You need to enable JavaScript to run this app.</noscript>
          <Main/>
          <NextScript/>
        </body>
      </Html>
    );
  }
}
