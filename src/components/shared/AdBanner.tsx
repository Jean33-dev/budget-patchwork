import React, { useEffect } from "react";
import { useAdMob } from "@/hooks/useAdMob";

export const AdBanner = () => {
  const { isMobile, isInitialized, showBanner, removeBanner } = useAdMob();

  useEffect(() => {
    // Afficher la bannière AdMob sur mobile
    if (isMobile && isInitialized) {
      showBanner();
    }

    // Nettoyer la bannière au démontage du composant
    return () => {
      if (isMobile && isInitialized) {
        removeBanner();
      }
    };
  }, [isMobile, isInitialized, showBanner, removeBanner]);

  useEffect(() => {
    // Initialiser AdSense sur web
    if (!isMobile && typeof window !== 'undefined') {
      try {
        // @ts-ignore
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (error) {
        console.error('Erreur lors de l\'initialisation d\'AdSense:', error);
      }
    }
  }, [isMobile]);

  // Sur mobile, ne rien afficher car AdMob gère la bannière nativement
  if (isMobile) {
    return null;
  }

  // Sur web, afficher une bannière AdSense
  return (
    <div className="w-full mb-2 flex justify-center">
      <div className="w-full max-w-xl">
        <ins 
          className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client="ca-pub-3284826601315861"
          data-ad-slot="1680282011"
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>
    </div>
  );
};
