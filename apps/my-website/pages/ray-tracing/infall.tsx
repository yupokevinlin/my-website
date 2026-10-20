import GuideText from "../../src/i18n/packs/guide/en";
import { withText } from "../../src/i18n/packs/withText";
import { InfallPage } from "../../src/display/pages/rayTracingPages";

// The infall simulation in English; pages/[locale]/ray-tracing/infall.tsx is the same page in
// the other languages
export default withText(InfallPage, GuideText);
