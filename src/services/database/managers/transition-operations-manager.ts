
import { toast } from "@/components/ui/use-toast";
import { SavedTransitionPreference } from "@/hooks/transition/useTransitionPreferencesGet";
import { DatabaseManagerFactory } from '../database-manager-factory';

export class TransitionOperationsManager {
  private ensureInitialized: () => Promise<boolean>;
  private managerFactory: DatabaseManagerFactory;

  constructor(
    ensureInitialized: () => Promise<boolean>,
    managerFactory: DatabaseManagerFactory
  ) {
    this.ensureInitialized = ensureInitialized;
    this.managerFactory = managerFactory;
  }

  async getTransitionPreferences(): Promise<SavedTransitionPreference[] | null> {
    try {
      const initialized = await this.ensureInitialized();
      if (!initialized) {
        console.error("Database not initialized in getTransitionPreferences");
        return null;
      }
      // Obtenez le gestionnaire de préférences de transition
      const transitionManager = this.managerFactory.getTransitionPreferencesManager();
      return transitionManager.getTransitionPreferences();
    } catch (error) {
      console.error("Error in getTransitionPreferences:", error);
      return null;
    }
  }

  async saveTransitionPreferences(preferences: SavedTransitionPreference[]): Promise<boolean> {
    try {
      const initialized = await this.ensureInitialized();
      if (!initialized) {
        console.error("Database not initialized in saveTransitionPreferences");
        return false;
      }
      // Obtenez le gestionnaire de préférences de transition
      const transitionManager = this.managerFactory.getTransitionPreferencesManager();
      return transitionManager.saveTransitionPreferences(preferences);
    } catch (error) {
      console.error("Error in saveTransitionPreferences:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de sauvegarder les préférences de transition"
      });
      return false;
    }
  }
}
