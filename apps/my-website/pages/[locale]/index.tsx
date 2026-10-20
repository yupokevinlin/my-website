import type { GetStaticPaths, GetStaticProps } from "next";
import HomeText from "../../src/i18n/packs/home/others";
import { withText } from "../../src/i18n/packs/withText";
import { localeStaticPaths, localeStaticProps } from "../../src/i18n/locales";
import { HomePage } from "../../src/v2/HomePage";

// The home page in each language other than English: /fr, /zh-cn, /zh-tw, /ja
export const getStaticPaths: GetStaticPaths = () => localeStaticPaths();
export const getStaticProps: GetStaticProps = (context) => localeStaticProps(context);

export default withText(HomePage, HomeText);
