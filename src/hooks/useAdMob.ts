import { useEffect, useState } from 'react';
import { AdMob, BannerAdOptions, BannerAdSize, BannerAdPosition } from '@capacitor-community/admob';
import { Capacitor } from '@capacitor/core';

export const useAdMob = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeAdMob = async () => {
      if (!Capacitor.isNativePlatform()) {
        console.log('AdMob is only available on native platforms');
        return;
      }

      try {
        await AdMob.initialize({
          testingDevices: ['YOUR_TESTING_DEVICE_ID'],
          initializeForTesting: false,
        });
        setIsInitialized(true);
      } catch (err) {
        console.error('Failed to initialize AdMob:', err);
        setError(err instanceof Error ? err.message : 'Failed to initialize AdMob');
      }
    };

    initializeAdMob();
  }, []);

  const showBanner = async () => {
    if (!isInitialized) return;

    try {
      // Détection de la plateforme pour utiliser le bon Ad Unit ID
      const isIOS = Capacitor.getPlatform() === 'ios';
      const adId = isIOS 
        ? 'ca-app-pub-3284826601315861/1969364502' // iOS
        : 'ca-app-pub-3284826601315861/7061801284'; // Android

      const options: BannerAdOptions = {
        adId,
        adSize: BannerAdSize.ADAPTIVE_BANNER,
        position: BannerAdPosition.BOTTOM_CENTER,
        margin: 0,
        isTesting: false,
      };

      await AdMob.showBanner(options);
    } catch (err) {
      console.error('Failed to show banner:', err);
      setError(err instanceof Error ? err.message : 'Failed to show banner');
    }
  };

  const hideBanner = async () => {
    try {
      await AdMob.hideBanner();
    } catch (err) {
      console.error('Failed to hide banner:', err);
    }
  };

  const removeBanner = async () => {
    try {
      await AdMob.removeBanner();
    } catch (err) {
      console.error('Failed to remove banner:', err);
    }
  };

  return {
    isInitialized,
    error,
    showBanner,
    hideBanner,
    removeBanner,
  };
};
