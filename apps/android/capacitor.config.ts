// apps/android/capacitor.config.ts
// Capacitor config wrapping the MEDHAA web build into a native Android
// shell. Uses the same React build as Web/PWA — single codebase.

import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.bhaavajaalam.medhaa',
  appName: 'MEDHAA',
  webDir: '../web/dist',
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
    SocialLogin: {
      providers: {
        google: true,
        facebook: false,
        apple: false,
        twitter: false,
      },
      logLevel: 1,
    },
  },
};

export default config;
