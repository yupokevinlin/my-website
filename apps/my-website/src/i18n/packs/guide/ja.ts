import { MESSAGES_JA } from "../../messages/ja";
import { GUIDE_TEXT_JA } from "../../messages/guide/ja";
import { localizeRayTracing } from "../../content/rayTracing/en";
import { RAY_TRACING_JA } from "../../content/rayTracing/ja";
import { localizeSimulations } from "../../content/simulations/en";
import { SIMULATIONS_JA } from "../../content/simulations/ja";
import { textPack } from "../textPack";

// The ray-tracing guide's text in Japanese
export default textPack({
  messages: MESSAGES_JA,
  guide: { text: GUIDE_TEXT_JA, content: localizeRayTracing(RAY_TRACING_JA), simulations: localizeSimulations(SIMULATIONS_JA) },
});
