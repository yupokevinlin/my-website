import GuideText from "../../src/i18n/packs/guide/en";
import { withText } from "../../src/i18n/packs/withText";
import { WormholePage } from "../../src/display/pages/rayTracingPages";

// The wormhole simulation in English; pages/[locale]/ray-tracing/wormhole.tsx is the same page in
// the other languages
export default withText(WormholePage, GuideText);
