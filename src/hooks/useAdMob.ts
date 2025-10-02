import { useEffect, useState } from 'react';
import { Capacitor } from '@capacitor/core';
import { AdMob, BannerAdOptions, BannerAdSize, BannerAdPosition } from '@capacitor-community/admob';

const AD_UNIT_IDS = {
  ios: 'ca-app-pub-3284826601315861/1680282011',
  android: 'ca-app-pub-3284826601315861/1680282011', // À remplacer avec l'ID Android
};

export const useAdMob = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const initializeAdMob = async () => {
      // Vérifier si on est sur mobile
      const platform = Capacitor.getPlatform();
      const mobile = platform === 'ios' || platform === 'android';
      setIsMobile(mobile);

      if (!mobile) {
        return;
      }

      try {
        // Initialiser AdMob
        await AdMob.initialize();
        
        setIsInitialized(true);
      } catch (error) {
        console.error('Erreur lors de l\'initialisation d\'AdMob:', error);
      }
    };

    initializeAdMob();
  }, []);

  const showBanner = async () => {
    if (!isInitialized || !isMobile) {
      return;
    }

    try {
      const platform = Capacitor.getPlatform();
      const adUnitId = platform === 'ios' ? AD_UNIT_IDS.ios : AD_UNIT_IDS.android;

      const options: BannerAdOptions = {
        adId: adUnitId,
        adSize: BannerAdSize.ADAPTIVE_BANNER,
        position: BannerAdPosition.BOTTOM_CENTER,
        margin: 0,
      };

      await AdMob.showBanner(options);
    } catch (error) {
      console.error('Erreur lors de l\'affichage de la bannière AdMob:', error);
    }
  };

  const hideBanner = async () => {
    if (!isInitialized || !isMobile) {
      return;
    }

    try {
      await AdMob.hideBanner();
    } catch (error) {
      console.error('Erreur lors du masquage de la bannière AdMob:', error);
    }
  };

  const removeBanner = async () => {
    if (!isInitialized || !isMobile) {
      return;
    }

    try {
      await AdMob.removeBanner();
    } catch (error) {
      console.error('Erreur lors de la suppression de la bannière AdMob:', error);
    }
  };

  return {
    isInitialized,
    isMobile,
    showBanner,
    hideBanner,
    removeBanner,
  };
};
