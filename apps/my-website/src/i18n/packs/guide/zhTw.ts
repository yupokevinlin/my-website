import { MESSAGES_ZH_TW } from "../../messages/zhTw";
import { GUIDE_TEXT_ZH_TW } from "../../messages/guide/zhTw";
import { localizeRayTracing } from "../../content/rayTracing/en";
import { RAY_TRACING_ZH_TW } from "../../content/rayTracing/zhTw";
import { localizeSimulations } from "../../content/simulations/en";
import { SIMULATIONS_ZH_TW } from "../../content/simulations/zhTw";
import { textPack } from "../textPack";

// The ray-tracing guide's text in Traditional Chinese
export default textPack({
  messages: MESSAGES_ZH_TW,
  guide: { text: GUIDE_TEXT_ZH_TW, content: localizeRayTracing(RAY_TRACING_ZH_TW), simulations: localizeSimulations(SIMULATIONS_ZH_TW) },
});
