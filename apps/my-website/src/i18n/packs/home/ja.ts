import { MESSAGES_JA } from "../../messages/ja";
import { localizeHome } from "../../content/home/en";
import { HOME_JA } from "../../content/home/ja";
import { textPack } from "../textPack";

// The home page's text in Japanese
export default textPack({ messages: MESSAGES_JA, home: localizeHome(HOME_JA) });
