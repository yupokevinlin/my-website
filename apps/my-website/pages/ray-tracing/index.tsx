import GuideText from "../../src/i18n/packs/guide/en";
import { withText } from "../../src/i18n/packs/withText";
import { RayTracingOverview } from "../../src/display/pages/rayTracingPages";

// The guide's overview in English; pages/[locale]/ray-tracing/index.tsx is the same page in
// the other languages
export default withText(RayTracingOverview, GuideText);
