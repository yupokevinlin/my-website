import type { NextPage } from "next";
import { HomePage } from "../src/v2/HomePage";
import { HomeHead } from "../src/v2/components/HomeHead/HomeHead";

// The home page in English. pages/[locale]/index.tsx is the same page in the
// other languages.
const Index: NextPage = () => (
  <>
    <HomeHead/>
    <HomePage/>
  </>
);

export default Index;
