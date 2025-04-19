
/**
 * Utilitaires pour gérer le localStorage
 */

/**
 * Liste des clés à conserver dans localStorage (ne pas migrer vers SQLite)
 */
export const KEYS_TO_KEEP_IN_LOCAL_STORAGE = [
  "budget_transition_preferences"
];

/**
 * Vérifie si une clé doit être conservée dans localStorage
 * @param key La clé à vérifier
 * @returns true si la clé doit être conservée dans localStorage
 */
export const shouldKeepInLocalStorage = (key: string): boolean => {
  return KEYS_TO_KEEP_IN_LOCAL_STORAGE.includes(key);
};

/**
 * Affiche le contenu actuel du localStorage dans la console
 */
export const logLocalStorageContent = (): void => {
  console.log("=== Contenu du localStorage ===");
  const allKeys = Object.keys(localStorage);
  allKeys.forEach(key => {
    try {
      const value = localStorage.getItem(key);
      console.log(`Clé: ${key}`);
      console.log(`Valeur: ${value}`);
      console.log("---");
    } catch (error) {
      console.error(`Erreur lors de la lecture de la clé ${key}:`, error);
    }
  });
  console.log("==============================");
};

/**
 * Récupère les données de toutes les clés dans localStorage qui doivent être migrées vers SQLite
 * @returns Un objet contenant les données à migrer par clé
 */
export const getDataToMigrateFromLocalStorage = (): Record<string, any> => {
  const dataToMigrate: Record<string, any> = {};
  const allKeys = Object.keys(localStorage);
  
  allKeys.forEach(key => {
    // Ne pas migrer les clés qui doivent rester dans localStorage
    if (shouldKeepInLocalStorage(key)) {
      return;
    }
    
    try {
      const value = localStorage.getItem(key);
      if (value) {
        try {
          dataToMigrate[key] = JSON.parse(value);
        } catch (e) {
          // Si ce n'est pas du JSON, stocker la valeur telle quelle
          dataToMigrate[key] = value;
        }
      }
    } catch (error) {
      console.error(`Erreur lors de la lecture de la clé ${key}:`, error);
    }
  });
  
  return dataToMigrate;
};

/**
 * Supprime toutes les clés du localStorage qui ont été migrées vers SQLite
 */
export const cleanupMigratedLocalStorageData = (): void => {
  const allKeys = Object.keys(localStorage);
  
  allKeys.forEach(key => {
    // Ne pas supprimer les clés qui doivent rester dans localStorage
    if (shouldKeepInLocalStorage(key)) {
      return;
    }
    
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Erreur lors de la suppression de la clé ${key}:`, error);
    }
  });
};
