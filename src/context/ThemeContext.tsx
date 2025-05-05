
import React, { createContext, useContext, useState, useEffect } from "react";

type ThemeContextType = {
  invertColors: boolean;
  toggleInvertColors: () => void;
  showToasts: boolean;
  toggleShowToasts: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [invertColors, setInvertColors] = useState<boolean>(() => {
    // Récupérer la préférence de l'utilisateur depuis le localStorage
    const savedPreference = localStorage.getItem("invertColors");
    return savedPreference === "true";
  });

  const [showToasts, setShowToasts] = useState<boolean>(() => {
    // Récupérer la préférence des toasts depuis le localStorage
    const savedToastPreference = localStorage.getItem("showToasts");
    // Par défaut, les toasts sont activés (null ou "true")
    return savedToastPreference !== "false";
  });

  // Mettre à jour la classe du document en fonction de la préférence
  useEffect(() => {
    if (invertColors) {
      document.documentElement.classList.add("invert-colors");
    } else {
      document.documentElement.classList.remove("invert-colors");
    }
    
    // Sauvegarder la préférence dans localStorage
    localStorage.setItem("invertColors", invertColors.toString());
  }, [invertColors]);

  // Sauvegarder la préférence des toasts
  useEffect(() => {
    localStorage.setItem("showToasts", showToasts.toString());
  }, [showToasts]);

  const toggleInvertColors = () => {
    setInvertColors(prev => !prev);
  };

  const toggleShowToasts = () => {
    setShowToasts(prev => !prev);
  };

  return (
    <ThemeContext.Provider value={{ 
      invertColors, 
      toggleInvertColors,
      showToasts,
      toggleShowToasts
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
