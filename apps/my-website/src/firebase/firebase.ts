import { initializeApp, type FirebaseApp } from "firebase/app";
import { getAnalytics, isSupported, type Analytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

let app: FirebaseApp | undefined;

/**
 * Initializes Firebase Analytics in the browser only. Safe to call on every
 * mount: app initialization is idempotent and analytics is gated behind
 * `isSupported()` so it no-ops in unsupported environments (e.g. SSR/build).
 */
export async function initAnalytics(): Promise<Analytics | undefined> {
  if (typeof window === "undefined") return undefined;
  if (!firebaseConfig.apiKey) return undefined;

  app ??= initializeApp(firebaseConfig);

  if (await isSupported()) {
    return getAnalytics(app);
  }
  return undefined;
}
