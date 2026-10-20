import { MESSAGES_ZH_CN } from "../../messages/zhCn";
import { GUIDE_TEXT_ZH_CN } from "../../messages/guide/zhCn";
import { localizeRayTracing } from "../../content/rayTracing/en";
import { RAY_TRACING_ZH_CN } from "../../content/rayTracing/zhCn";
import { localizeSimulations } from "../../content/simulations/en";
import { SIMULATIONS_ZH_CN } from "../../content/simulations/zhCn";
import { textPack } from "../textPack";

// The ray-tracing guide's text in Simplified Chinese
export default textPack({
  messages: MESSAGES_ZH_CN,
  guide: { text: GUIDE_TEXT_ZH_CN, content: localizeRayTracing(RAY_TRACING_ZH_CN), simulations: localizeSimulations(SIMULATIONS_ZH_CN) },
});
