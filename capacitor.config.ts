
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.738683413a1d47c78d9626fde967f92a',
  appName: 'Budget Patchwork',
  webDir: 'dist',
  server: {
    url: 'https://73868341-3a1d-47c7-8d96-26fde967f92a.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SQLite: {
      iosLocation: 'Library/budget-db',
      androidLocation: 'databases',
      androidDatabaseLocation: 'default',
      iosDatabaseLocation: 'Library'
    }
  }
};

export default config;
