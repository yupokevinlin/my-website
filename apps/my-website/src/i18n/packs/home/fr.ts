import { MESSAGES_FR } from "../../messages/fr";
import { localizeHome } from "../../content/home/en";
import { HOME_FR } from "../../content/home/fr";
import { textPack } from "../textPack";

// The home page's text in French
export default textPack({ messages: MESSAGES_FR, home: localizeHome(HOME_FR) });
