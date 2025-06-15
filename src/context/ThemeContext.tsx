import React, { createContext, useContext, useState } from "react";

// --- TYPES DEVISE ---
export type Currency = "EUR" | "USD" | "GBP";

// Liste des langues disponibles
export const supportedLanguages = [
  { value: "fr", label: "Français" },
  { value: "en", label: "English" },
  { value: "es", label: "Español" },
  { value: "de", label: "Deutsch" },
  { value: "it", label: "Italiano" },
];

// Dictionnaire simplifié pour démo
const translations: Record<string, Record<string, string>> = {
  fr: {
    "settings.title": "Paramètres",
    "settings.display": "Affichage",
    "settings.displayDesc": "Personnalisez l'apparence de l'application",
    "settings.darkMode": "Mode sombre",
    "settings.darkModeDesc": "Activez un thème sombre dédié agréable et professionnel",
    "settings.invertColors": "Couleurs inversées (expérimental)",
    "settings.invertColorsDesc": "Inverser toutes les couleurs (peut rendre l'interface imprévisible)",
    "settings.notifications": "Notifications",
    "settings.notificationsDesc": "Afficher les notifications temporaires dans l'application",
    "settings.currency": "Devise utilisée",
    "settings.currencyDesc": "Choisissez la devise qui s'affichera dans toute l'application.",
    "settings.language": "Langue",
    "settings.languageDesc": "Sélectionnez la langue de l'application.",
    "settings.maintenance": "Maintenance de la base de données",
    "settings.maintenanceDesc": "Outils de réparation en cas de problème avec la base de données",
    "settings.resetConnection": "Réinitialiser la connexion",
    "settings.resetConnectionDesc": "Réinitialise la connexion à la base de données en cas de problème de communication",
    "settings.repairing": "Réparation en cours...",
    "settings.repair": "Réparer la connexion",
    "settings.advancedCleanup": "Nettoyage avancé",
    "settings.advancedCleanupDesc": "Supprime le cache de la base de données et force une réinitialisation complète",
    "settings.cleaning": "Nettoyage en cours...",
    "settings.clean": "Nettoyer le cache",
    "settings.cleanWarn": "Attention : Utilisez cette option uniquement en dernier recours. Les données ne seront pas perdues, mais l'application peut être temporairement indisponible pendant la réinitialisation.",
    "settings.logoutTitle": "Déconnexion sécurisée",
    "settings.logoutDesc": "Supprime votre code PIN et déconnecte l’accès à l’application. Il vous sera demandé d’en recréer un à la prochaine ouverture.",
    "settings.logout": "Se déconnecter / Réinitialiser le code PIN",
    "settings.logoutSuccess": "Déconnexion réussie.",
    "settings.back": "Retour",
    // -------- DASHBOARD --------
    "dashboard.title": "Tableau de bord",
    "dashboard.statsTitle": "Statistiques",
    "dashboard.monthTransition": "Transition vers un nouveau mois",
    "dashboard.confirmTransition": "Configurer la transition",
    "dashboard.transitionAlert": "Attention : Sauvegardez vos données",
    "dashboard.transitionWarning": "En passant au nouveau mois, vos dépenses et revenus du dashboard \"{dashboardTitle}\" seront réinitialisés. Ces données seront définitivement perdues.",
    "dashboard.cancel": "Annuler",
    "dashboard.stats.remaining": "Budget restant",
    "dashboard.stats.remainingAfter": "Budget restant après dépenses",
  },
  en: {
    "settings.title": "Settings",
    "settings.display": "Display",
    "settings.displayDesc": "Customize the appearance of the app",
    "settings.darkMode": "Dark mode",
    "settings.darkModeDesc": "Enable a dedicated, professional dark theme",
    "settings.invertColors": "Inverted colors (experimental)",
    "settings.invertColorsDesc": "Invert all colors (may make interface unpredictable)",
    "settings.notifications": "Notifications",
    "settings.notificationsDesc": "Show temporary notifications in the app",
    "settings.currency": "Currency used",
    "settings.currencyDesc": "Choose the currency displayed throughout the app.",
    "settings.language": "Language",
    "settings.languageDesc": "Select the application language.",
    "settings.maintenance": "Database maintenance",
    "settings.maintenanceDesc": "Repair tools in case of problems with the database",
    "settings.resetConnection": "Reset connection",
    "settings.resetConnectionDesc": "Reset the database connection if there is a communication issue",
    "settings.repairing": "Repairing...",
    "settings.repair": "Repair connection",
    "settings.advancedCleanup": "Advanced cleanup",
    "settings.advancedCleanupDesc": "Deletes the database cache and forces a full reset",
    "settings.cleaning": "Cleaning...",
    "settings.clean": "Clean cache",
    "settings.cleanWarn": "Warning: Only use this as a last resort. Your data won't be lost, but the app may be temporarily unavailable while resetting.",
    "settings.logoutTitle": "Secure logout",
    "settings.logoutDesc": "Deletes your PIN and signs you out. You'll need to set a new one next time.",
    "settings.logout": "Logout / Reset PIN code",
    "settings.logoutSuccess": "Logout successful.",
    "settings.back": "Back",
    // -------- DASHBOARD --------
    "dashboard.title": "Dashboard",
    "dashboard.statsTitle": "Statistics",
    "dashboard.monthTransition": "Month transition",
    "dashboard.confirmTransition": "Configure transition",
    "dashboard.transitionAlert": "Warning: Save your data",
    "dashboard.transitionWarning": "When switching to the new month, your expenses and income for the dashboard \"{dashboardTitle}\" will be reset. This data will be permanently lost.",
    "dashboard.cancel": "Cancel",
    "dashboard.stats.remaining": "Remaining budget",
    "dashboard.stats.remainingAfter": "Remaining after expenses",
  },
  es: {
    "settings.title": "Configuración",
    "settings.display": "Visualización",
    "settings.displayDesc": "Personaliza la apariencia de la aplicación",
    "settings.darkMode": "Modo oscuro",
    "settings.darkModeDesc": "Activa un tema oscuro dedicado, agradable y profesional",
    "settings.invertColors": "Colores invertidos (experimental)",
    "settings.invertColorsDesc": "Invierte todos los colores (puede hacer la interfaz impredecible)",
    "settings.notifications": "Notificaciones",
    "settings.notificationsDesc": "Mostrar notificaciones temporales en la aplicación",
    "settings.currency": "Moneda utilizada",
    "settings.currencyDesc": "Elige la moneda que se mostrará en toda la aplicación.",
    "settings.language": "Idioma",
    "settings.languageDesc": "Selecciona el idioma de la aplicación.",
    "settings.maintenance": "Mantenimiento de la base de datos",
    "settings.maintenanceDesc": "Herramientas de reparación para problemas con la base de datos",
    "settings.resetConnection": "Restablecer conexión",
    "settings.resetConnectionDesc": "Restablece la conexión si hay un problema",
    "settings.repairing": "Reparando...",
    "settings.repair": "Reparar conexión",
    "settings.advancedCleanup": "Limpieza avanzada",
    "settings.advancedCleanupDesc": "Elimina la caché de la base de datos y fuerza un reinicio completo",
    "settings.cleaning": "Limpiando...",
    "settings.clean": "Limpiar caché",
    "settings.cleanWarn": "Atención: utiliza esta opción solo como último recurso. Los datos no se perderán, pero la app puede estar temporalmente indisponible.",
    "settings.logoutTitle": "Cierre seguro de sesión",
    "settings.logoutDesc": "Elimina el PIN y cierra la sesión. Se te pedirá configurar uno nuevo al volver.",
    "settings.logout": "Cerrar sesión / Restablecer PIN",
    "settings.logoutSuccess": "Cierre de sesión exitoso.",
    "settings.back": "Atrás",
    // -------- DASHBOARD --------
    "dashboard.title": "Tablero",
    "dashboard.statsTitle": "Estadísticas",
    "dashboard.monthTransition": "Transición de mes",
    "dashboard.confirmTransition": "Configurar transición",
    "dashboard.transitionAlert": "Advertencia: ¡Guarde sus datos!",
    "dashboard.transitionWarning": "Al pasar al nuevo mes, sus gastos e ingresos del tablero \"{dashboardTitle}\" serán reiniciados. Estos datos se perderán permanentemente.",
    "dashboard.cancel": "Cancelar",
    "dashboard.stats.remaining": "Presupuesto restante",
    "dashboard.stats.remainingAfter": "Presupuesto después de gastos",
  },
  de: {
    "settings.title": "Einstellungen",
    "settings.display": "Anzeige",
    "settings.displayDesc": "Passen Sie das Aussehen der App an",
    "settings.darkMode": "Dunkler Modus",
    "settings.darkModeDesc": "Aktivieren Sie ein dediziertes, professionelles dunkles Thema",
    "settings.invertColors": "Invertierte Farben (experimentell)",
    "settings.invertColorsDesc": "Alle Farben invertieren (die Oberfläche kann unvorhersehbar werden)",
    "settings.notifications": "Benachrichtigungen",
    "settings.notificationsDesc": "Zeigen Sie temporäre Benachrichtigungen in der App an",
    "settings.currency": "Verwendete Währung",
    "settings.currencyDesc": "Wählen Sie die Währung, die in der ganzen App angezeigt wird.",
    "settings.language": "Sprache",
    "settings.languageDesc": "Wählen Sie die Anwendungssprache.",
    "settings.maintenance": "Datenbankwartung",
    "settings.maintenanceDesc": "Reparaturwerkzeuge bei Problemen mit der Datenbank",
    "settings.resetConnection": "Verbindung zurücksetzen",
    "settings.resetConnectionDesc": "Setzt die Verbindung zurück, wenn ein Problem besteht",
    "settings.repairing": "Wird repariert...",
    "settings.repair": "Verbindung reparieren",
    "settings.advancedCleanup": "Erweiterte Bereinigung",
    "settings.advancedCleanupDesc": "Löscht den Datenbank-Cache und erzwingt einen vollständigen Reset",
    "settings.cleaning": "Wird bereinigt...",
    "settings.clean": "Cache bereinigen",
    "settings.cleanWarn": "Achtung: Nur im Notfall verwenden. Ihre Daten gehen nicht verloren, aber die App kann vorübergehend nicht verfügbar sein.",
    "settings.logoutTitle": "Sicheres Abmelden",
    "settings.logoutDesc": "Entfernt Ihre PIN und meldet Sie ab. Sie müssen beim nächsten Öffnen eine neue vergeben.",
    "settings.logout": "Abmelden / PIN zurücksetzen",
    "settings.logoutSuccess": "Abmeldung erfolgreich.",
    "settings.back": "Zurück",
    // -------- DASHBOARD --------
    "dashboard.title": "Übersicht",
    "dashboard.statsTitle": "Statistiken",
    "dashboard.monthTransition": "Monatswechsel",
    "dashboard.confirmTransition": "Übergang konfigurieren",
    "dashboard.transitionAlert": "Achtung: Speichern Sie Ihre Daten",
    "dashboard.transitionWarning": "Beim Wechsel zum neuen Monat werden Ihre Ausgaben und Einnahmen für das Dashboard \"{dashboardTitle}\" zurückgesetzt. Diese Daten gehen dauerhaft verloren.",
    "dashboard.cancel": "Abbrechen",
    "dashboard.stats.remaining": "Verbleibendes Budget",
    "dashboard.stats.remainingAfter": "Verbleibend nach Ausgaben",
  },
  it: {
    "settings.title": "Impostazioni",
    "settings.display": "Aspetto",
    "settings.displayDesc": "Personalizza l'aspetto dell'app",
    "settings.darkMode": "Modalità scura",
    "settings.darkModeDesc": "Attiva un tema scuro dedicato e professionale",
    "settings.invertColors": "Colori invertiti (sperimentale)",
    "settings.invertColorsDesc": "Inverti tutti i colori (l'interfaccia può risultare imprevedibile)",
    "settings.notifications": "Notifiche",
    "settings.notificationsDesc": "Mostra notifiche temporanee nell'app",
    "settings.currency": "Valuta utilizzata",
    "settings.currencyDesc": "Scegli la valuta visualizzata in tutta l'app.",
    "settings.language": "Lingua",
    "settings.languageDesc": "Seleziona la lingua dell'app.",
    "settings.maintenance": "Manutenzione database",
    "settings.maintenanceDesc": "Strumenti di riparazione in caso di problemi con il database",
    "settings.resetConnection": "Ripristina connessione",
    "settings.resetConnectionDesc": "Ripristina la connessione al database in caso di problemi",
    "settings.repairing": "Riparazione in corso...",
    "settings.repair": "Ripara connessione",
    "settings.advancedCleanup": "Pulizia avanzata",
    "settings.advancedCleanupDesc": "Elimina la cache del database e forza un reset completo",
    "settings.cleaning": "Pulizia...",
    "settings.clean": "Pulisci cache",
    "settings.cleanWarn": "Attenzione: utilizzare solo come ultima risorsa. I dati non andranno persi, ma l'app potrebbe essere temporaneamente non disponibile.",
    "settings.logoutTitle": "Disconnessione sicura",
    "settings.logoutDesc": "Rimuove il codice PIN e ti disconnette. Dovrai crearne uno nuovo al prossimo accesso.",
    "settings.logout": "Disconnetti / Reimposta PIN",
    "settings.logoutSuccess": "Disconnessione riuscita.",
    "settings.back": "Indietro",
    // -------- DASHBOARD --------
    "dashboard.title": "Cruscotto",
    "dashboard.statsTitle": "Statistiche",
    "dashboard.monthTransition": "Transizione di mese",
    "dashboard.confirmTransition": "Configura transizione",
    "dashboard.transitionAlert": "Attenzione: Salva i tuoi dati",
    "dashboard.transitionWarning": "Quando si passa al nuovo mese, le spese e i ricavi del cruscotto \"{dashboardTitle}\" verranno azzerati. Questi dati andranno persi definitivamente.",
    "dashboard.cancel": "Annulla",
    "dashboard.stats.remaining": "Budget residuo",
    "dashboard.stats.remainingAfter": "Residuo dopo spese",
  }
};

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
