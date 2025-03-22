
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
      // Essayer jusqu'à 3 fois d'initialiser la base de données
      let success = false;
      for (let attempt = 1; attempt <= 3; attempt++) {
        console.log(`Database initialization attempt ${attempt}...`);
        success = await db.init();
        
        if (success) {
          console.log(`Database successfully initialized on attempt ${attempt}`);
          setInitializationSuccess(true);
          break;
        }
        
        if (attempt < 3) {
          // Attendre un peu avant de réessayer
          await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
        }
      }
      
      if (!success) {
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
    initializeDatabase();
  }, [initializeDatabase]);

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    try {
      // Forcer la réinitialisation des tentatives avant une actualisation manuelle
      db.resetInitializationAttempts?.();
      
      const success = await db.init();
      if (success) {
        toast({
          title: "Actualisation terminée",
          description: "Les données ont été rafraîchies avec succès."
        });
        setInitializationSuccess(true);
      } else {
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
    handleManualRefresh
  };
};
