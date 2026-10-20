import { type ReactNode, useEffect } from "react";
import clsx from "clsx";
import { LazyMotion, MotionConfig, domAnimation } from "framer-motion";
import { sans } from "./fonts";
import { SeasonProvider } from "./SeasonContext";
import { TopBar } from "./components/TopBar/TopBar";
import { Hero } from "./components/Hero/Hero";
import { About } from "./components/About/About";
import { Experience } from "./components/Experience/Experience";
import { Projects } from "./components/Projects/Projects";
import { Skills } from "./components/Skills/Skills";
import { Contact } from "./components/Contact/Contact";
import { Footer } from "./components/Footer/Footer";
import { PageScrollbar } from "./components/PageScrollbar/PageScrollbar";
import { HomeHead } from "./components/HomeHead/HomeHead";
import { useMessages } from "../i18n/LocaleContext";

// The home page at "/" (and /fr, /ja...), with its head. The previous design
// lives on at /v1 (src/root/App).
// Animations use framer-motion's small `m` components; visitors who ask for
// reduced motion get none of the movement.
export const HomePage = (): ReactNode => {
  const messages = useMessages();
  // Lets the document scroll in browsers without :has() (see globals.css)
  useEffect(() => {
    document.documentElement.classList.add("v2-page");
    return () => document.documentElement.classList.remove("v2-page");
  }, []);

  return (
    <>
      <HomeHead/>
      <SeasonProvider>
        <LazyMotion features={domAnimation} strict>
          <MotionConfig reducedMotion="user">
            <div className={clsx("v2 min-h-screen", sans.variable)}>
              <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-3 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:shadow">{messages.common.skipToContent}</a>
              <TopBar/>
              <main id="main">
                <Hero/>
                <About/>
                <Experience/>
                <Projects/>
                <Skills/>
                <Contact/>
              </main>
              <Footer/>
              <PageScrollbar/>
            </div>
          </MotionConfig>
        </LazyMotion>
      </SeasonProvider>
    </>
  );
};
