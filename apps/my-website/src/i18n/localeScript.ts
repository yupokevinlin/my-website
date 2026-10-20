import { LOCALE_STORAGE_KEY, PREFIXED_LOCALES } from "./locales";

// Runs in <head> before the page is drawn (see _document.tsx). When a visitor
// who picked a language with the switcher opens an English page of the home
// page or the ray-tracing guide (/, /ray-tracing/...), it moves them to the
// same page in their language. Picking English saves "en", so it never moves
// them back and forth. Search engines save nothing, so they always get the
// page they asked for; /v1 is English only and never moves.
export const LOCALE_SCRIPT = `(function(){try{var s=localStorage.getItem(${JSON.stringify(LOCALE_STORAGE_KEY)}),l=${JSON.stringify(PREFIXED_LOCALES)},p=location.pathname;if(l.indexOf(s)<0)return;if(p!=="/"&&p!=="/ray-tracing"&&p.indexOf("/ray-tracing/")!==0)return;location.replace("/"+s+(p==="/"?"":p)+location.search+location.hash);}catch(e){}})();`;
