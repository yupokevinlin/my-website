import type { Locale } from "../locales";
import { EN_MESSAGES, type Messages } from "./en";
import { MESSAGES_FR } from "./fr";
import { MESSAGES_JA } from "./ja";
import { MESSAGES_ZH_CN } from "./zhCn";
import { MESSAGES_ZH_TW } from "./zhTw";

export type { Messages };

// Every language's interface text, by locale
export const MESSAGES: Record<Locale, Messages> = {
  en: EN_MESSAGES,
  fr: MESSAGES_FR,
  "zh-cn": MESSAGES_ZH_CN,
  "zh-tw": MESSAGES_ZH_TW,
  ja: MESSAGES_JA,
};

export const getMessages = (locale: Locale): Messages => MESSAGES[locale];
