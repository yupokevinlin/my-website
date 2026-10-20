import { MESSAGES_ZH_TW } from "../../messages/zhTw";
import { localizeHome } from "../../content/home/en";
import { HOME_ZH_TW } from "../../content/home/zhTw";
import { textPack } from "../textPack";

// The home page's text in Traditional Chinese
export default textPack({ messages: MESSAGES_ZH_TW, home: localizeHome(HOME_ZH_TW) });
