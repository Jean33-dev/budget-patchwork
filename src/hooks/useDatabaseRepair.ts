
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { db } from "@/services/database";
import { WebSQLiteAdapter } from "@/services/database/web-sqlite-adapter";

export const useDatabaseRepair = () => {
  const [isRepairing, setIsRepairing] = useState(false);
  
  const repairDatabase = async () => {
    setIsRepairing(true);
    
    try {
      console.log("Début de la réparation de la base de données...");
      
      // Réinitialiser les tentatives d'initialisation
      WebSQLiteAdapter.resetInitializationAttempts?.();
      db.resetInitializationAttempts?.();
      
      // Fermer et recréer la connexion à la base de données
      toast({
        title: "Réparation en cours",
        description: "Fermeture de la connexion à la base de données..."
      });
      
      // Forcer la réinitialisation complète de la base de données
      const success = await db.init();
      
      if (success) {
        console.log("Réparation de la base de données réussie");
        toast({
          title: "Réparation réussie",
          description: "La base de données a été réinitialisée avec succès."
        });
        return true;
      } else {
        throw new Error("Échec de la réinitialisation de la base de données");
      }
    } catch (error) {
      console.error("Erreur lors de la réparation de la base de données:", error);
      toast({
        variant: "destructive",
        title: "Échec de la réparation",
        description: "Une erreur s'est produite lors de la réparation de la base de données."
      });
      return false;
    } finally {
      setIsRepairing(false);
    }
  };
  
  const clearDatabaseCache = async () => {
    setIsRepairing(true);
    
    try {
      console.log("Nettoyage du cache de la base de données...");
      toast({
        title: "Nettoyage en cours",
        description: "Suppression du cache de la base de données..."
      });
      
      // Tenter de nettoyer le cache IndexedDB
      if (window.indexedDB) {
        const dbDeletePromise = new Promise<boolean>((resolve) => {
          const DBDeleteRequest = window.indexedDB.deleteDatabase('sqlitedb');
          
          DBDeleteRequest.onsuccess = () => {
            console.log("Cache IndexedDB effacé avec succès");
            resolve(true);
          };
          
          DBDeleteRequest.onerror = () => {
            console.error("Erreur lors de la suppression du cache IndexedDB");
            resolve(false);
          };
        });
        
        const cacheDeleted = await dbDeletePromise;
        
        if (cacheDeleted) {
          toast({
            title: "Cache nettoyé",
            description: "Le cache de la base de données a été supprimé. Réinitialisation en cours..."
          });
          
          // Réinitialiser la base de données
          WebSQLiteAdapter.resetInitializationAttempts?.();
          db.resetInitializationAttempts?.();
          const success = await db.init();
          
          if (success) {
            toast({
              title: "Base de données réinitialisée",
              description: "La base de données a été réinitialisée avec succès après le nettoyage du cache."
            });
            return true;
          } else {
            throw new Error("Échec de la réinitialisation après le nettoyage du cache");
          }
        } else {
          throw new Error("Échec de la suppression du cache IndexedDB");
        }
      } else {
        // Fallback si IndexedDB n'est pas disponible
        toast({
          title: "IndexedDB non disponible",
          description: "Tentative de réinitialisation directe de la base de données..."
        });
        
        // Réinitialiser la base de données
        WebSQLiteAdapter.resetInitializationAttempts?.();
        db.resetInitializationAttempts?.();
        const success = await db.init();
        
        if (success) {
          toast({
            title: "Base de données réinitialisée",
            description: "La base de données a été réinitialisée avec succès."
          });
          return true;
        } else {
          throw new Error("Échec de la réinitialisation de la base de données");
        }
      }
    } catch (error) {
      console.error("Erreur lors du nettoyage du cache de la base de données:", error);
      toast({
        variant: "destructive",
        title: "Échec du nettoyage",
        description: "Une erreur s'est produite lors du nettoyage du cache de la base de données."
      });
      return false;
    } finally {
      setIsRepairing(false);
    }
  };
  
  return {
    isRepairing,
    repairDatabase,
    clearDatabaseCache
  };
};
