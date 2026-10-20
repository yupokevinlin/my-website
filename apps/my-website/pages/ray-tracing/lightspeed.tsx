import GuideText from "../../src/i18n/packs/guide/en";
import { withText } from "../../src/i18n/packs/withText";
import { LightspeedPage } from "../../src/display/pages/rayTracingPages";

// The near-light-speed simulation in English; pages/[locale]/ray-tracing/lightspeed.tsx is the same page in
// the other languages
export default withText(LightspeedPage, GuideText);
