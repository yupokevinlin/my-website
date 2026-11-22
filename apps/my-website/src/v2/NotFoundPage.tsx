import { type ReactNode, useEffect } from "react";
import Head from "next/head";
import clsx from "clsx";
import { sans } from "./fonts";
import { ButtonLink } from "./components/ButtonLink/ButtonLink";
import { Eyebrow } from "./components/Eyebrow/Eyebrow";
import { SceneLayers } from "./components/SceneLayers/SceneLayers";

// The page for an address that doesn't exist (pages/404.tsx; Firebase serves
// it as 404.html). It looks like the home page's ending: the season's scene,
// full screen, with a frosted card over it, whose text follows the hero
// card's contrast rules. English only: a static export has one 404 page.
export const NotFoundPage = (): ReactNode => {
  // Lets the document scroll in browsers without :has() (see globals.css)
  useEffect(() => {
    document.documentElement.classList.add("v2-page");
    return () => document.documentElement.classList.remove("v2-page");
  }, []);

  return (
    <>
      <Head>
        <meta charSet="UTF-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover"/>
        <title>Page not found | Kevin Lin</title>
        <meta name="robots" content="noindex"/>
      </Head>
      <div className={clsx("v2 min-h-screen", sans.variable)}>
        <main className="relative isolate flex min-h-[100svh] flex-col justify-start overflow-hidden px-4 pb-72 pt-24 sm:justify-center sm:pb-20 sm:pt-20 md:px-8">
          <div aria-hidden="true" className="absolute inset-0 -z-10">
            <SceneLayers/>
          </div>
          <div className="mx-auto w-full max-w-[640px] rounded-[32px] border border-white/70 bg-white/[0.72] px-5 py-10 text-center shadow-[0_30px_80px_-30px_rgba(15,23,42,0.5)] backdrop-blur-xl sm:px-8 sm:py-12 md:px-12 md:py-14">
            <Eyebrow onScene large className="justify-center">Error 404</Eyebrow>
            <h1 className="mt-3 text-[36px] font-bold leading-tight tracking-[-0.025em] text-[var(--v2-ink)] md:text-[52px]">Page not found</h1>
            <p className="mx-auto mt-4 max-w-[30rem] text-[17px] leading-relaxed text-[var(--v2-body)]">
              There&rsquo;s nothing at this address. It may have moved, or the link may have a typo.
            </p>
            <div className="mt-8 flex justify-center">
              <ButtonLink href="/" className="px-6 py-3.5 text-[16px]">Go back home</ButtonLink>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};
