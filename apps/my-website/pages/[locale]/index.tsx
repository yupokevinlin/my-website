import type { GetStaticPaths, GetStaticProps } from "next";
import Index from "../index";
import { localeStaticPaths, localeStaticProps } from "../../src/i18n/locales";

// The home page in each language other than English: /fr, /zh-cn, /zh-tw, /ja
export const getStaticPaths: GetStaticPaths = () => localeStaticPaths();
export const getStaticProps: GetStaticProps = (context) => localeStaticProps(context);

export default Index;
