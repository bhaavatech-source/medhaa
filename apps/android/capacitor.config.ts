// apps/android/capacitor.config.ts
// Capacitor config wrapping the MEDHAA web build into a native Android
// shell. Uses the same React build as Web/PWA — single codebase.

import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.bhavatech.medhaa',
  appName: 'MEDHAA',
  webDir: 'build',
  bundledWebRuntime: false,
  server: {
    androidScheme: 'https',
  },
  plugins: {
    // Used for parental control reminders (break time, session limits).
    LocalNotifications: {
      smallIcon: 'ic_stat_medhaa',
      iconColor: '#3B82F6',
    },
    // Google login on Android uses native Sign-In for a smoother UX
    // than the web OAuth redirect flow.
    GoogleAuth: {
      scopes: ['profile', 'email'],
      serverClientId: process.env.GOOGLE_ANDROID_CLIENT_ID,
    },
  },
};

export default config;
