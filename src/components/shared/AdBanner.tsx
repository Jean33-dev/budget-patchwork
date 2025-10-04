import React, { useEffect } from "react";
import { useAdMob } from "@/hooks/useAdMob";
import { Capacitor } from "@capacitor/core";

export const AdBanner = () => {
  const { showBanner, removeBanner } = useAdMob();

  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      showBanner();
    }

    return () => {
      if (Capacitor.isNativePlatform()) {
        removeBanner();
      }
    };
  }, [showBanner, removeBanner]);

  // Sur le web, afficher un placeholder
  if (!Capacitor.isNativePlatform()) {
    return (
      <div className="w-full mb-2 flex justify-center">
        <div className="w-full max-w-xl px-4 py-2 bg-muted border border-border rounded-lg text-center text-sm text-muted-foreground font-medium">
          Espace publicitaire
        </div>
      </div>
    );
  }

  // Sur mobile, AdMob affiche la bannière en overlay
  return null;
};
