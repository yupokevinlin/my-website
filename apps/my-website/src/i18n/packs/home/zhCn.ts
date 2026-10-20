import { MESSAGES_ZH_CN } from "../../messages/zhCn";
import { localizeHome } from "../../content/home/en";
import { HOME_ZH_CN } from "../../content/home/zhCn";
import { textPack } from "../textPack";

// The home page's text in Simplified Chinese
export default textPack({ messages: MESSAGES_ZH_CN, home: localizeHome(HOME_ZH_CN) });
