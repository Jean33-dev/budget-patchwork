
import React, { createContext, useContext, useState, useEffect } from "react";

type ThemeContextType = {
  invertColors: boolean;
  toggleInvertColors: () => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
  showToasts: boolean;
  toggleShowToasts: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [invertColors, setInvertColors] = useState<boolean>(() => {
    const savedPreference = localStorage.getItem("invertColors");
    return savedPreference === "true";
  });

  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem("darkMode");
    return saved ? saved === "true" : false;
  });

  const [showToasts, setShowToasts] = useState<boolean>(() => {
    const savedToastPreference = localStorage.getItem("showToasts");
    return savedToastPreference !== "false";
  });

  // Appliquer la classe du Dark Mode sur l'élément root
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    // Pour garantir la priorité, le dark mode retire invert-colors si activé simultanément
    if (darkMode && document.documentElement.classList.contains("invert-colors")) {
      document.documentElement.classList.remove("invert-colors");
      setInvertColors(false);
    }
    localStorage.setItem("darkMode", darkMode.toString());
  }, [darkMode]);

  // Mettre à jour la classe du document en fonction de la préférence d'inversion
  useEffect(() => {
    if (!darkMode) {
      if (invertColors) {
        document.documentElement.classList.add("invert-colors");
      } else {
        document.documentElement.classList.remove("invert-colors");
      }
    }
    localStorage.setItem("invertColors", invertColors.toString());
  }, [invertColors, darkMode]);

  useEffect(() => {
    localStorage.setItem("showToasts", showToasts.toString());
  }, [showToasts]);

  const toggleInvertColors = () => {
    // Désactive le dark mode si l'inversion est activée
    if (!invertColors && darkMode) {
      setDarkMode(false);
    }
    setInvertColors(prev => !prev);
  };

  const toggleDarkMode = () => {
    // Désactive l'inversion s'il y a activation du dark mode
    if (!darkMode && invertColors) {
      setInvertColors(false);
    }
    setDarkMode(prev => !prev);
  };

  const toggleShowToasts = () => {
    setShowToasts(prev => !prev);
  };

  return (
    <ThemeContext.Provider value={{
      invertColors,
      toggleInvertColors,
      darkMode,
      toggleDarkMode,
      showToasts,
      toggleShowToasts,
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

