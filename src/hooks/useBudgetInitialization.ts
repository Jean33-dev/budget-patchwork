
import { useState, useEffect, useCallback } from "react";
import { toast } from "@/components/ui/use-toast";
import { db } from "@/services/database";

export const useBudgetInitialization = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [initializationSuccess, setInitializationSuccess] = useState<boolean | null>(null);
  const [attempt, setAttempt] = useState(1);
  const maxAttempts = 3;

  // Fonction pour initialiser la base de données avec gestion des erreurs
  const initializeDatabase = useCallback(async () => {
    console.log("Starting database initialization process...");
    setIsRefreshing(true);
    setAttempt(1);
    
    try {
      // Réinitialiser les tentatives avant de commencer
      db.resetInitializationAttempts?.();
      
      // Essayer jusqu'à 3 fois d'initialiser la base de données
      let success = false;
      for (let currentAttempt = 1; currentAttempt <= maxAttempts; currentAttempt++) {
        setAttempt(currentAttempt);
        console.log(`Database initialization attempt ${currentAttempt}...`);
        try {
          // Ajouter un délai progressif entre les tentatives
          if (currentAttempt > 1) {
            const delay = 1000 * currentAttempt;
            console.log(`Waiting ${delay}ms before attempt ${currentAttempt}...`);
            await new Promise(resolve => setTimeout(resolve, delay));
          }
          
          // Tentative d'initialisation
          console.log(`Starting database initialization (attempt ${currentAttempt})...`);
          success = await db.init();
          
          if (success) {
            console.log(`Database initialized successfully on attempt ${currentAttempt}`);
            setInitializationSuccess(true);
            break;
          } else {
            console.error(`Database initialization failed on attempt ${currentAttempt}`);
          }
        } catch (initError) {
          console.error(`Error during initialization attempt ${currentAttempt}:`, initError);
        }
      }
      
      if (!success) {
        console.error("All initialization attempts failed");
        setInitializationSuccess(false);
        toast({
          variant: "destructive",
          title: "Erreur d'initialisation",
          description: "Impossible d'initialiser la base de données après plusieurs tentatives. Essayez de vider le cache et de rafraîchir la page."
        });
      }
      
      return success;
    } catch (error) {
      console.error("Error initializing database:", error);
      setInitializationSuccess(false);
      toast({
        variant: "destructive",
        title: "Erreur d'initialisation",
        description: "Une erreur s'est produite lors de l'initialisation de la base de données. Veuillez rafraîchir la page."
      });
      return false;
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  // Initialiser la base de données au premier chargement
  useEffect(() => {
    console.log("useBudgetInitialization: Initializing database on mount");
    initializeDatabase();
  }, [initializeDatabase]);

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    try {
      console.log("Manual refresh: Resetting initialization attempts");
      // Forcer la réinitialisation des tentatives avant une actualisation manuelle
      db.resetInitializationAttempts?.();
      
      console.log("Manual refresh: Starting database initialization");
      const success = await db.init();
      if (success) {
        console.log("Manual refresh: Database initialization successful");
        toast({
          title: "Actualisation terminée",
          description: "Les données ont été rafraîchies avec succès."
        });
        setInitializationSuccess(true);
        return true;
      } else {
        console.error("Manual refresh: Database initialization failed");
        toast({
          variant: "destructive",
          title: "Erreur d'actualisation",
          description: "Impossible d'initialiser la base de données. Veuillez réessayer."
        });
        setInitializationSuccess(false);
        return false;
      }
    } catch (error) {
      console.error("Error during manual refresh:", error);
      setInitializationSuccess(false);
      toast({
        variant: "destructive",
        title: "Erreur d'actualisation",
        description: "Une erreur s'est produite lors de l'actualisation des données."
      });
      return false;
    } finally {
      setIsRefreshing(false);
    }
  };

  const clearCacheAndRefresh = async () => {
    setIsRefreshing(true);
    try {
      console.log("Clearing cache and refreshing...");
      
      // Clear localStorage
      localStorage.clear();
      
      // Reset all initialization attempts
      db.resetInitializationAttempts?.();
      
      // Small delay to allow clearing to take effect
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Reinitialize
      const success = await initializeDatabase();
      
      if (success) {
        console.log("Database reinitialized successfully after cache clear");
        toast({
          title: "Cache vidé",
          description: "Le cache a été vidé et les données ont été réinitialisées avec succès."
        });
        return true;
      } else {
        console.error("Database reinitialization failed after cache clear");
        toast({
          variant: "destructive",
          title: "Erreur de réinitialisation",
          description: "Impossible de réinitialiser la base de données après avoir vidé le cache."
        });
        return false;
      }
    } catch (error) {
      console.error("Error during cache clear and refresh:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur s'est produite lors de la réinitialisation."
      });
      return false;
    } finally {
      setIsRefreshing(false);
    }
  };

  return {
    isRefreshing,
    initializationSuccess,
    handleManualRefresh,
    clearCacheAndRefresh,
    initializeDatabase,
    attempt,
    maxAttempts
  };
};
