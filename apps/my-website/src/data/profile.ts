// Who the site is about. The home page's <head> and JSON-LD, the top bar, the
// Contact section and the resume link all read from here, so a new title,
// employer or link changes in one place. Keep it in step with LinkedIn and the
// resume; CLAUDE.md lists everything else to update when experience changes.

export const SITE_URL = "https://kevinyupolin.dev";

export const profile = {
  name: "Kevin Lin",
  // Other names people may search for. Only used in the JSON-LD.
  alternateNames: ["Kevin Yupo Lin", "Yupo Lin"],
  // The top bar subtitle, shortened from the LinkedIn headline.
  headline: "Full-Stack + AI Engineer",
  // The home page's eyebrow line, above the name.
  title: "Senior Full-Stack + AI Engineer",
  // The home page's one-line pitch, under the name.
  pitch: "I build fast, accessible React and Next.js products and the AI features inside them. Tech lead at Best Buy Canada, and co-founder and CTO of ForteCare.",
  // The stack named in the home page's quick-facts line.
  heroSkills: ["React", "Next.js", "TypeScript", "Node.js", "LLMs"],
  // First automation work, at Protrade in October 2016 (month 0 = January).
  // "Years building software" counts from here at build time.
  careerStart: { year: 2016, month: 9 },
  jobTitle: "Senior Software Engineer",
  employer: { name: "Best Buy Canada", url: "https://www.bestbuy.ca/" },
  school: { name: "The University of British Columbia", url: "https://www.ubc.ca/" },
  location: { city: "Vancouver", region: "BC", country: "CA" },
  email: "kevinyupolin@gmail.com",
  linkedIn: "https://www.linkedin.com/in/kevinyupolin",
  gitHub: "https://github.com/yupokevinlin",
  resume: "/resources/resume/kevin-lin-resume.pdf",
  knowsAbout: ["React", "Next.js", "TypeScript", "Node.js", "Generative AI", "Large language models", "Design systems", "WebGL"],
  // ISO 639-1 codes for the Languages section: English, Mandarin, French.
  knowsLanguage: ["en", "zh", "fr"],
};

// Title: 50-60 characters, name first. Description: 150-160 characters.
export const homeSeo = {
  title: "Kevin Lin | Senior Full-Stack & AI Engineer in Vancouver",
  description: "Kevin Lin is a senior full-stack and AI engineer in Vancouver, BC, building React, Next.js and TypeScript products. See his projects, experience and resume.",
  // LinkedIn caches images by URL for days, so bump ?v= whenever the image changes
  image: `${SITE_URL}/resources/og-image.png?v=2`,
  imageAlt: "Kevin Lin, Senior Full-Stack + AI Engineer in Vancouver, BC",
};

export const PERSON_ID = `${SITE_URL}/#person`;

// schema.org Person + WebSite for the home page. sameAs is how search engines
// tie this site to the LinkedIn and GitHub profiles, so list every profile.
export const homeJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: `${SITE_URL}/`,
      name: profile.name,
      publisher: { "@id": PERSON_ID },
    },
    {
      "@type": "Person",
      "@id": PERSON_ID,
      name: profile.name,
      alternateName: profile.alternateNames,
      url: `${SITE_URL}/`,
      image: homeSeo.image,
      jobTitle: profile.jobTitle,
      description: "Senior full-stack and AI engineer in Vancouver, BC, building React, Next.js and TypeScript products.",
      worksFor: { "@type": "Organization", name: profile.employer.name, url: profile.employer.url },
      alumniOf: { "@type": "CollegeOrUniversity", name: profile.school.name, url: profile.school.url },
      address: {
        "@type": "PostalAddress",
        addressLocality: profile.location.city,
        addressRegion: profile.location.region,
        addressCountry: profile.location.country,
      },
      knowsAbout: profile.knowsAbout,
      knowsLanguage: profile.knowsLanguage,
      sameAs: [profile.linkedIn, profile.gitHub],
    },
  ],
};
