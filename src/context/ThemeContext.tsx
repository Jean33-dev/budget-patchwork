
import React, { createContext, useContext, useState } from "react";
import { supportedLanguages, translations, Currency } from "@/i18n/translations";

interface ThemeContextProps {
  invertColors: boolean;
  toggleInvertColors: () => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
  showToasts: boolean;
  toggleShowToasts: () => void;
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  currencySymbol: string;
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string) => string;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [invertColors, setInvertColors] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [showToasts, setShowToasts] = useState(true);
  const [currency, setCurrency] = useState<Currency>("EUR");
  const [language, setLanguage] = useState("fr"); // Default to French

  // Remonter le symbole pour tous les usages
  const currencySymbol = React.useMemo(() => {
    switch (currency) {
      case "EUR": return "€";
      case "USD": return "$";
      case "GBP": return "£";
      default: return "";
    }
  }, [currency]);

  // Simple translation function
  const t = (key: string) => {
    return translations[language]?.[key] ?? translations["en"]?.[key] ?? key;
  };

  return (
    <ThemeContext.Provider
      value={{
        invertColors,
        toggleInvertColors: () => setInvertColors((v) => !v),
        darkMode,
        toggleDarkMode: () => setDarkMode((v) => !v),
        showToasts,
        toggleShowToasts: () => setShowToasts((v) => !v),
        currency,
        setCurrency,
        currencySymbol,
        language,
        setLanguage,
        t,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
