import { MESSAGES_FR } from "../../messages/fr";
import { GUIDE_TEXT_FR } from "../../messages/guide/fr";
import { localizeRayTracing } from "../../content/rayTracing/en";
import { RAY_TRACING_FR } from "../../content/rayTracing/fr";
import { localizeSimulations } from "../../content/simulations/en";
import { SIMULATIONS_FR } from "../../content/simulations/fr";
import { textPack } from "../textPack";

// The ray-tracing guide's text in French
export default textPack({
  messages: MESSAGES_FR,
  guide: { text: GUIDE_TEXT_FR, content: localizeRayTracing(RAY_TRACING_FR), simulations: localizeSimulations(SIMULATIONS_FR) },
});
