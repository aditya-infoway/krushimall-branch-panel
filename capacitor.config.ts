import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.krushimall.branch',   
  appName: 'KrushiMall Branch',
  webDir: 'dist',
  server: {
    androidScheme: 'http',
    cleartext: true,
  }
};

export default config;