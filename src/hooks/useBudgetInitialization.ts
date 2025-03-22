
import { useState, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";
import { db } from "@/services/database";

export const useBudgetInitialization = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Force database initialization on first load with multiple retries
  useEffect(() => {
    const ensureDbInitialized = async () => {
      console.log("Starting database initialization process...");
      setIsRefreshing(true);
      
      try {
        // Try up to 3 times to initialize the database
        let success = false;
        for (let attempt = 1; attempt <= 3; attempt++) {
          console.log(`Database initialization attempt ${attempt}...`);
          success = await db.init();
          if (success) {
            console.log(`Database successfully initialized on attempt ${attempt}`);
            break;
          }
          
          if (attempt < 3) {
            // Wait a bit before retrying
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        }
        
        if (!success) {
          toast({
            variant: "destructive",
            title: "Erreur d'initialisation",
            description: "Impossible d'initialiser la base de données après plusieurs tentatives. Veuillez rafraîchir la page."
          });
        }
      } catch (error) {
        console.error("Error initializing database:", error);
        toast({
          variant: "destructive",
          title: "Erreur d'initialisation",
          description: "Une erreur s'est produite lors de l'initialisation de la base de données. Veuillez rafraîchir la page."
        });
      } finally {
        setIsRefreshing(false);
      }
    };
    
    ensureDbInitialized();
  }, []);

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    try {
      const success = await db.init();
      if (success) {
        toast({
          title: "Actualisation terminée",
          description: "Les données ont été rafraîchies avec succès."
        });
      } else {
        toast({
          variant: "destructive",
          title: "Erreur d'actualisation",
          description: "Impossible d'initialiser la base de données. Veuillez réessayer."
        });
      }
    } catch (error) {
      console.error("Error during manual refresh:", error);
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
    handleManualRefresh
  };
};
