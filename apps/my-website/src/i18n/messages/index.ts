import type { Locale } from "../locales";
import { EN_MESSAGES, type Messages } from "./en";
import { MESSAGES_FR } from "./fr";
import { MESSAGES_JA } from "./ja";
import { MESSAGES_ZH_CN } from "./zhCn";
import { MESSAGES_ZH_TW } from "./zhTw";
import { EN_GUIDE_TEXT, type GuideText } from "./guide/en";
import { GUIDE_TEXT_FR } from "./guide/fr";
import { GUIDE_TEXT_JA } from "./guide/ja";
import { GUIDE_TEXT_ZH_CN } from "./guide/zhCn";
import { GUIDE_TEXT_ZH_TW } from "./guide/zhTw";

export type { GuideText, Messages };

// Every language's text at once, for _document and the tests. Pages load one
// language through its text pack (src/i18n/packs/), never through this file.

export const MESSAGES: Record<Locale, Messages> = {
  en: EN_MESSAGES,
  fr: MESSAGES_FR,
  "zh-cn": MESSAGES_ZH_CN,
  "zh-tw": MESSAGES_ZH_TW,
  ja: MESSAGES_JA,
};

export const GUIDE_TEXTS: Record<Locale, GuideText> = {
  en: EN_GUIDE_TEXT,
  fr: GUIDE_TEXT_FR,
  "zh-cn": GUIDE_TEXT_ZH_CN,
  "zh-tw": GUIDE_TEXT_ZH_TW,
  ja: GUIDE_TEXT_JA,
};

export const getMessages = (locale: Locale): Messages => MESSAGES[locale];
