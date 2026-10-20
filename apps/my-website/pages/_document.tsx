import React from "react";
import Document, { Html, Head, Main, NextScript } from "next/document";
import { SEASON_SCRIPT } from "../src/v2/season";
import { LOCALE_SCRIPT } from "../src/i18n/localeScript";
import { LOCALE_TAGS, toLocale } from "../src/i18n/locales";
import { getMessages } from "../src/i18n/messages";

export default class MyDocument extends Document {
  override render() {
    // The page's language, from pages/[locale]/... (English otherwise)
    const locale = toLocale(this.props.__NEXT_DATA__.props?.pageProps?.locale);
    return (
      <Html lang={LOCALE_TAGS[locale]}>
        <Head>
          <link id="main-icon" rel="icon" href="/resources/icons/winterIcon.svg" type="image/svg+xml"/>
          <link id="shortcut-icon" rel="shortcut icon" href="/resources/icons/winterIcon.svg" type="image/svg+xml"/>
          <link rel="apple-touch-icon" href="/resources/icons/apple-touch-icon.png"/>
          {/* Moves a visitor who picked a language to it, before anything is drawn */}
          <script dangerouslySetInnerHTML={{ __html: LOCALE_SCRIPT }}/>
          {/* Picks the season before the first paint; after the icon links, which it updates */}
          <script dangerouslySetInnerHTML={{ __html: SEASON_SCRIPT }}/>
          {/* Without JavaScript, show the home page's scroll-in content in place */}
          <noscript dangerouslySetInnerHTML={{ __html: "<style>.v2-reveal{opacity:1!important;transform:none!important}</style>" }}/>
        </Head>
        <body>
          <noscript>{getMessages(locale).common.javascriptRequired}</noscript>
          <Main/>
          <NextScript/>
        </body>
      </Html>
    );
  }
}
