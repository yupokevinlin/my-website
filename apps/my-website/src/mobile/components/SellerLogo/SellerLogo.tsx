import type { ReactNode } from "react";
import { sellerLogo } from "../../sellers";

export interface SellerLogoProps {
  seller: string;
  // The logo sits in the middle of its box instead of at its left edge
  centred?: boolean;
}

// The company a price is from, as its logo; its name is the logo's alt text.
// A seller without a logo file shows its name instead.
export const SellerLogo = ({ seller, centred = false }: SellerLogoProps): ReactNode => {
  const logo = sellerLogo(seller);
  if (!logo) return <span className="text-[16px] font-semibold text-slate-900">{seller}</span>;
  return <img src={logo} alt={seller} width={96} height={28} className={centred ? "h-8 w-28 object-contain" : "h-7 w-24 object-contain object-left"}/>;
};
