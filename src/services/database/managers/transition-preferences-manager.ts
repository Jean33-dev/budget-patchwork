
import { toast } from "@/components/ui/use-toast";
import { DatabaseManagerCore } from '../database-manager-core';
import { SavedTransitionPreference } from '@/hooks/transition/useTransitionPreferencesGet';

export class TransitionPreferencesManager extends DatabaseManagerCore {
  /**
   * Crée la table des préférences de transition si elle n'existe pas
   */
  async createTransitionPreferencesTable(): Promise<boolean> {
    try {
      const initialized = await this.ensureInitialized();
      if (!initialized) {
        console.error("Database not initialized in createTransitionPreferencesTable");
        return false;
      }

      await this.db.execute(`
        CREATE TABLE IF NOT EXISTS transition_preferences (
          id TEXT PRIMARY KEY,
          preferences TEXT NOT NULL
        )
      `);
      
      return true;
    } catch (error) {
      console.error("Error creating transition preferences table:", error);
      return false;
    }
  }

  /**
   * Sauvegarde les préférences de transition dans SQLite
   */
  async saveTransitionPreferences(preferences: SavedTransitionPreference[]): Promise<boolean> {
    try {
      const initialized = await this.ensureInitialized();
      if (!initialized) {
        console.error("Database not initialized in saveTransitionPreferences");
        return false;
      }

      // S'assurer que la table existe
      await this.createTransitionPreferencesTable();

      // Convertir le tableau de préférences en JSON
      const preferencesJson = JSON.stringify(preferences);
      
      // Utiliser une clé fixe pour stocker les préférences (équivalent à la clé du localStorage)
      const key = "budget_transition_preferences";
      
      // Vérifier si une entrée existe déjà pour cette clé
      const existing = await this.db.query(`
        SELECT * FROM transition_preferences WHERE id = ?
      `, [key]);
      
      if (existing && existing.length > 0) {
        // Mettre à jour les préférences existantes
        await this.db.run(`
          UPDATE transition_preferences SET preferences = ? WHERE id = ?
        `, [preferencesJson, key]);
      } else {
        // Insérer de nouvelles préférences
        await this.db.run(`
          INSERT INTO transition_preferences (id, preferences) VALUES (?, ?)
        `, [key, preferencesJson]);
      }
      
      console.log("Préférences de transition sauvegardées dans SQLite");
      return true;
    } catch (error) {
      console.error("Error saving transition preferences:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de sauvegarder les préférences de transition"
      });
      return false;
    }
  }

  /**
   * Récupère les préférences de transition depuis SQLite
   */
  async getTransitionPreferences(): Promise<SavedTransitionPreference[] | null> {
    try {
      const initialized = await this.ensureInitialized();
      if (!initialized) {
        console.error("Database not initialized in getTransitionPreferences");
        return null;
      }

      // S'assurer que la table existe
      await this.createTransitionPreferencesTable();
      
      // Utiliser la même clé fixe que pour la sauvegarde
      const key = "budget_transition_preferences";
      
      // Récupérer les préférences
      const result = await this.db.query(`
        SELECT preferences FROM transition_preferences WHERE id = ?
      `, [key]);
      
      if (result && result.length > 0 && result[0].preferences) {
        // Convertir le JSON en objet JavaScript
        const preferences = JSON.parse(result[0].preferences) as SavedTransitionPreference[];
        console.log("Préférences de transition récupérées depuis SQLite:", preferences);
        return preferences;
      }
      
      console.log("Aucune préférence de transition trouvée dans SQLite");
      return null;
    } catch (error) {
      console.error("Error getting transition preferences:", error);
      return null;
    }
  }
}
