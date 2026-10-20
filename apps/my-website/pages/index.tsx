import HomeText from "../src/i18n/packs/home/en";
import { withText } from "../src/i18n/packs/withText";
import { HomePage } from "../src/v2/HomePage";

// The home page in English. pages/[locale]/index.tsx is the same page in the
// other languages.
export default withText(HomePage, HomeText);
