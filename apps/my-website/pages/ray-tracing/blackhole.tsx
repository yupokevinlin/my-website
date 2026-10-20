import GuideText from "../../src/i18n/packs/guide/en";
import { withText } from "../../src/i18n/packs/withText";
import { BlackHolePage } from "../../src/display/pages/rayTracingPages";

// The black hole simulation in English; pages/[locale]/ray-tracing/blackhole.tsx is the same page in
// the other languages
export default withText(BlackHolePage, GuideText);
