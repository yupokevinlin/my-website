import type { GetStaticPaths, GetStaticProps } from "next";
import GuideText from "../../../src/i18n/packs/guide/others";
import { withText } from "../../../src/i18n/packs/withText";
import { localeStaticPaths, localeStaticProps } from "../../../src/i18n/locales";
import { WormholePage } from "../../../src/display/pages/rayTracingPages";

// The wormhole simulation in each language other than English (/fr/ray-tracing...)
export const getStaticPaths: GetStaticPaths = () => localeStaticPaths();
export const getStaticProps: GetStaticProps = (context) => localeStaticProps(context);

export default withText(WormholePage, GuideText);
