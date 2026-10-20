import type { GetStaticPaths, GetStaticProps } from "next";
import Page from "../../ray-tracing/index";
import { localeStaticPaths, localeStaticProps } from "../../../src/i18n/locales";

// The same page in each language other than English (/fr/ray-tracing...)
export const getStaticPaths: GetStaticPaths = () => localeStaticPaths();
export const getStaticProps: GetStaticProps = (context) => localeStaticProps(context);

export default Page;
