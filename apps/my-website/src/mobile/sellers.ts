// Each seller's logo, in public/resources/images/mobile/. They are the
// companies' own marks, shown only to say whose price a row is.
const LOGOS: Record<string, string> = {
  Apple: "apple.svg",
  "Best Buy": "bestbuy.svg",
  Costco: "costco.svg",
  Amazon: "amazon.svg",
  Telus: "telus.svg",
  Rogers: "rogers.svg",
  Bell: "bell.svg",
  "Freedom Mobile": "freedom.svg",
  Fido: "fido.png",
  Koodo: "koodo.svg",
  "Virgin Plus": "virgin.svg",
};

export const sellerLogo = (seller: string): string | undefined => (LOGOS[seller] ? `/resources/images/mobile/${LOGOS[seller]}` : undefined);
