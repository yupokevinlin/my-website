import { EN_MESSAGES } from "../../messages/en";
import { EN_GUIDE_TEXT } from "../../messages/guide/en";
import { EN_RAY_TRACING } from "../../content/rayTracing/en";
import { EN_SIMULATIONS } from "../../content/simulations/en";
import { textPack } from "../textPack";

// The ray-tracing guide's text in English
export default textPack({
  messages: EN_MESSAGES,
  guide: { text: EN_GUIDE_TEXT, content: EN_RAY_TRACING, simulations: EN_SIMULATIONS },
});
