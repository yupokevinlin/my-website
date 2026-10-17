import React, { useEffect } from "react";
import clsx from "clsx";
import { fontVars } from "./fonts";
import { SeasonProvider } from "./SeasonContext";
import TopBar from "./components/TopBar";
import Hero from "./components/Hero";
// Redesign step 1: today's sections sit under the new hero until step 2 replaces them
import SectionWrapper from "../display/components/SectionWrapper/SectionWrapper";
import { ScrollNavigationDrawerMenuItemName as Name } from "../display/components/ScrollNavigation/ScrollNavigationDrawer/ScrollNavigationDrawerMenuItem/types";
import About from "../display/components/Content/About/About";
import Experience from "../display/components/Content/Experience/Experience";
import Projects from "../display/components/Content/Projects/Projects";
import Skills from "../display/components/Content/Skills/Skills";
import Languages from "../display/components/Content/Languages/Languages";
import Education from "../display/components/Content/Education/Education";
import Contact from "../display/components/Content/Contact/Contact";

const LEGACY_SECTIONS: Array<[Name, string, React.FC]> = [
  [Name.ABOUT, "about", About],
  [Name.EXPERIENCE, "experience", Experience],
  [Name.PROJECTS, "projects", Projects],
  [Name.SKILLS, "skills", Skills],
  [Name.LANGUAGES, "languages", Languages],
  [Name.EDUCATION, "education", Education],
  [Name.CONTACT, "contact", Contact],
];

// The home page at "/". Today's design lives on at /v1 (src/root/App).
const HomePage: React.FC = () => {
  // Lets the document scroll in browsers without :has() (see globals.css)
  useEffect(() => {
    document.documentElement.classList.add("v2-page");
    return () => document.documentElement.classList.remove("v2-page");
  }, []);

  return (
    <SeasonProvider>
      <div className={clsx("v2 min-h-screen", fontVars)}>
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-3 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:shadow">Skip to content</a>
        <TopBar/>
        <main id="main">
          <Hero/>
          {LEGACY_SECTIONS.map(([name, id, Section]) => (
            <div key={id} id={id}>
              <SectionWrapper name={name}><Section/></SectionWrapper>
            </div>
          ))}
        </main>
      </div>
    </SeasonProvider>
  );
};

export default HomePage;
