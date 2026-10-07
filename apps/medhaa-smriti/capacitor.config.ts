import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.bhaavajaalam.medhaasmriti',
  appName: 'Smṛti',
  webDir: 'www',
  bundledWebRuntime: false,
  server: {
    androidScheme: 'https',
  },
};

export default config;
