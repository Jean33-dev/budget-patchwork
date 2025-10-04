
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.738683413a1d47c78d9626fde967f92a',
  appName: 'OptiBudget',
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
    },
    BluetoothLe: {
      displayStrings: {
        scanning: "Recherche d'appareils...",
        cancel: "Annuler",
        availableDevices: "Appareils disponibles",
        noDeviceFound: "Aucun appareil trouvé"
      }
    }
  },
  ios: {
    permissions: [
      "bluetooth-peripheral",
      "bluetooth-central",
      "nearby-interaction"
    ]
  },
  android: {
    permissions: [
      "android.permission.BLUETOOTH",
      "android.permission.BLUETOOTH_ADMIN",
      "android.permission.BLUETOOTH_CONNECT",
      "android.permission.BLUETOOTH_SCAN",
      "android.permission.BLUETOOTH_ADVERTISE",
      "android.permission.ACCESS_COARSE_LOCATION",
      "android.permission.ACCESS_FINE_LOCATION"
    ]
  }
};

export default config;
