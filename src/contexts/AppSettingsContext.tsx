
import React, { createContext, useContext, useState, useEffect } from "react";

type Currency = "EUR" | "USD" | "GBP" | "CAD" | "CHF";
type Language = "fr" | "en" | "es" | "de" | "it";
type Theme = "light" | "dark" | "system";

interface AppSettings {
  currency: Currency;
  language: Language;
  theme: Theme;
}

interface AppSettingsContextType {
  settings: AppSettings;
  updateCurrency: (currency: Currency) => void;
  updateLanguage: (language: Language) => void;
  updateTheme: (theme: Theme) => void;
}

const defaultSettings: AppSettings = {
  currency: "EUR",
  language: "fr",
  theme: "light"
};

const AppSettingsContext = createContext<AppSettingsContextType | undefined>(undefined);

export function AppSettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(() => {
    // Récupérer les paramètres sauvegardés dans localStorage
    const savedSettings = localStorage.getItem("appSettings");
    return savedSettings ? JSON.parse(savedSettings) : defaultSettings;
  });

  // Mettre à jour le thème du document
  useEffect(() => {
    if (settings.theme === "dark") {
      document.documentElement.classList.add("dark");
    } else if (settings.theme === "light") {
      document.documentElement.classList.remove("dark");
    } else if (settings.theme === "system") {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      if (prefersDark) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  }, [settings.theme]);

  // Sauvegarder les paramètres quand ils changent
  useEffect(() => {
    localStorage.setItem("appSettings", JSON.stringify(settings));
  }, [settings]);

  const updateCurrency = (currency: Currency) => {
    setSettings(prev => ({ ...prev, currency }));
  };

  const updateLanguage = (language: Language) => {
    setSettings(prev => ({ ...prev, language }));
  };

  const updateTheme = (theme: Theme) => {
    setSettings(prev => ({ ...prev, theme }));
  };

  return (
    <AppSettingsContext.Provider 
      value={{ settings, updateCurrency, updateLanguage, updateTheme }}
    >
      {children}
    </AppSettingsContext.Provider>
  );
}

export function useAppSettings() {
  const context = useContext(AppSettingsContext);
  if (context === undefined) {
    throw new Error("useAppSettings must be used within an AppSettingsProvider");
  }
  return context;
}
