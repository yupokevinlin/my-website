import { initializeApp, type FirebaseApp } from "firebase/app";
import { getAnalytics, isSupported, type Analytics } from "firebase/analytics";

// Firebase web config. These values are not secret — they identify the project
// to Google's servers and are designed to be embedded in client code. Access is
// governed by Firebase Security Rules and authorized domains, not by hiding them.
const firebaseConfig = {
  apiKey: "AIzaSyDQ59XkMi8VJ0rll4CyABt4s3wARPvZ_iE",
  authDomain: "kevin-s-website-6e4a0.firebaseapp.com",
  projectId: "kevin-s-website-6e4a0",
  storageBucket: "kevin-s-website-6e4a0.firebasestorage.app",
  messagingSenderId: "698107401133",
  appId: "1:698107401133:web:aa3f071ba3304e111fc724",
  measurementId: "G-SCCRYQZ7QE",
};

let app: FirebaseApp | undefined;

/**
 * Initializes Firebase Analytics in the browser only. Safe to call on every
 * mount: app initialization is idempotent and analytics is gated behind
 * `isSupported()` so it no-ops in unsupported environments (e.g. SSR/build).
 */
export async function initAnalytics(): Promise<Analytics | undefined> {
  if (typeof window === "undefined") return undefined;

  app ??= initializeApp(firebaseConfig);

  if (await isSupported()) {
    return getAnalytics(app);
  }
  return undefined;
}
