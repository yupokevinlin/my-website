import type { NextPage } from "next";
import { NotFoundPage } from "../src/v2/NotFoundPage";

// The page for an address that doesn't exist, styled like the home page.
// English only, noindex, and not in the sitemap.
const NotFound: NextPage = () => <NotFoundPage/>;

export default NotFound;
