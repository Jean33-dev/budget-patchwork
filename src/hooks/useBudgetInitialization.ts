
import { useState, useEffect, useCallback } from "react";
import { toast } from "@/components/ui/use-toast";
import { db } from "@/services/database";

export const useBudgetInitialization = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [initializationSuccess, setInitializationSuccess] = useState<boolean | null>(null);

  // Fonction pour initialiser la base de données avec gestion des erreurs
  const initializeDatabase = useCallback(async () => {
    console.log("Starting database initialization process...");
    setIsRefreshing(true);
    
    try {
      // Réinitialiser les tentatives avant de commencer
      db.resetInitializationAttempts?.();
      
      // Essayer jusqu'à 3 fois d'initialiser la base de données
      let success = false;
      for (let attempt = 1; attempt <= 3; attempt++) {
        console.log(`Database initialization attempt ${attempt}...`);
        try {
          success = await db.init();
          
          if (success) {
            console.log(`Database successfully initialized on attempt ${attempt}`);
            setInitializationSuccess(true);
            break;
          }
        } catch (initError) {
          console.error(`Error during initialization attempt ${attempt}:`, initError);
        }
        
        if (attempt < 3) {
          // Attendre un peu avant de réessayer
          console.log(`Waiting before attempt ${attempt + 1}...`);
          await new Promise(resolve => setTimeout(resolve, 1500 * attempt));
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
      } else {
        console.error("Manual refresh: Database initialization failed");
        toast({
          variant: "destructive",
          title: "Erreur d'actualisation",
          description: "Impossible d'initialiser la base de données. Veuillez réessayer."
        });
        setInitializationSuccess(false);
      }
    } catch (error) {
      console.error("Error during manual refresh:", error);
      setInitializationSuccess(false);
      toast({
        variant: "destructive",
        title: "Erreur d'actualisation",
        description: "Une erreur s'est produite lors de l'actualisation des données."
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  return {
    isRefreshing,
    initializationSuccess,
    handleManualRefresh,
    initializeDatabase // Exporter la fonction pour permettre de réinitialiser la base depuis l'extérieur
  };
};
