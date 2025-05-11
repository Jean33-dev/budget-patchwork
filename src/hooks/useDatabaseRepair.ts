
import { useState } from "react";
import { db } from "@/services/database";
import { toast } from "@/components/ui/use-toast";

export const useDatabaseRepair = () => {
  const [isRepairing, setIsRepairing] = useState(false);
  const [repairSuccess, setRepairSuccess] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const repairDatabase = async () => {
    setIsRepairing(true);
    setRepairSuccess(false);
    setResetSuccess(false);
    
    try {
      console.log("Starting database repair process...");
      
      // Tentative de réparation
      await db.resetInitializationAttempts();
      
      // Forcer la réinitialisation de la base de données
      const success = await db.init();
      
      if (success) {
        console.log("Database repair successful");
        toast({
          title: "Succès",
          description: "La base de données a été réparée avec succès."
        });
        setRepairSuccess(true);
      } else {
        console.error("Database repair failed");
        toast({
          variant: "destructive",
          title: "Échec de la réparation",
          description: "Impossible de réparer la base de données. Essayez de réinitialiser la base de données."
        });
      }
    } catch (error) {
      console.error("Error repairing database:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur s'est produite lors de la réparation de la base de données."
      });
    } finally {
      setIsRepairing(false);
    }
  };

  const resetDatabase = async () => {
    if (window.confirm("Êtes-vous sûr de vouloir réinitialiser complètement la base de données ? Toutes vos données seront perdues.")) {
      setIsRepairing(true);
      setRepairSuccess(false);
      setResetSuccess(false);
      
      try {
        console.log("Starting database reset process...");
        
        // Effacer le localStorage pour éliminer toutes les données existantes
        localStorage.clear();
        
        // Réinitialiser les tentatives d'initialisation
        db.resetInitializationAttempts();
        
        // Forcer la réinitialisation complète de la base de données
        const success = await db.init();
        
        if (success) {
          console.log("Database reset successful");
          toast({
            title: "Succès",
            description: "La base de données a été réinitialisée avec succès. Toutes les données ont été effacées."
          });
          setResetSuccess(true);
        } else {
          console.error("Database reset failed");
          toast({
            variant: "destructive",
            title: "Échec de la réinitialisation",
            description: "Impossible de réinitialiser la base de données."
          });
        }
      } catch (error) {
        console.error("Error resetting database:", error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Une erreur s'est produite lors de la réinitialisation de la base de données."
        });
      } finally {
        setIsRepairing(false);
      }
    }
  };

  return {
    repairDatabase,
    resetDatabase,
    isRepairing,
    repairSuccess,
    resetSuccess
  };
};
