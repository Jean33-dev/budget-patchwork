
import { useState, useEffect, useCallback } from "react";
import { toast } from "@/components/ui/use-toast";
import { db } from "@/services/database";

export const useExpenseRetry = (loadData: () => Promise<void>) => {
  const [isRetrying, setIsRetrying] = useState(false);
  const [retryAttempt, setRetryAttempt] = useState(1);
  const maxRetryAttempts = 10; // Nombre maximal de tentatives
  
  // Auto-retry on initial load failure with exponential backoff
  useEffect(() => {
    let timer: number | undefined;
    
    const setupRetry = (error: any, initAttempted: boolean) => {
      if (error && initAttempted && retryAttempt < maxRetryAttempts) {
        console.log(`Auto-retrying due to error (attempt ${retryAttempt + 1}/${maxRetryAttempts})`);
        
        // Set a timer with exponential backoff for retries
        const retryDelay = Math.min(1000 * Math.pow(2, retryAttempt), 30000); // Max delay of 30 seconds
        console.log(`Waiting ${retryDelay}ms before retry...`);
        
        timer = window.setTimeout(() => {
          handleRetry();
        }, retryDelay);
      }
    };
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [retryAttempt, loadData]);

  const handleRetry = useCallback(async () => {
    if (isRetrying) return;
    
    setIsRetrying(true);
    setRetryAttempt(prev => Math.min(prev + 1, maxRetryAttempts));
    
    try {
      console.log(`Manual retry attempt ${retryAttempt + 1}/${maxRetryAttempts}`);
      
      // Importation dynamique de web-sqlite-adapter pour accéder à resetInitializationAttempts
      try {
        const { WebSQLiteAdapter } = await import('@/services/database/web-sqlite-adapter');
        WebSQLiteAdapter.resetInitializationAttempts?.();
        console.log("Reset WebSQLiteAdapter initialization attempts");
      } catch (e) {
        console.warn("Could not reset WebSQLiteAdapter attempts:", e);
      }
      
      // Réinitialiser les tentatives avant de réessayer
      db.resetInitializationAttempts?.();
      
      toast({
        title: "Nouvelle tentative",
        description: `Tentative de rechargement des données (${retryAttempt}/${maxRetryAttempts})`,
      });
      
      // Forcer le rechargement des données
      await loadData();
    } catch (e) {
      console.error("Retry failed:", e);
      toast({
        variant: "destructive",
        title: "Échec de la tentative",
        description: "Impossible de charger les données. Veuillez réessayer."
      });
    } finally {
      setIsRetrying(false);
    }
  }, [isRetrying, retryAttempt, loadData, maxRetryAttempts]);

  // Force a full page reload when all retries have failed
  const handleForceReload = useCallback(() => {
    console.log("Forcing page reload...");
    window.location.reload();
  }, []);

  // Clear cache and reload when other methods fail
  const handleClearCacheAndReload = useCallback(() => {
    console.log("Clearing cache and reloading...");
    
    // Tenter de nettoyer le cache IndexedDB si disponible
    if (window.indexedDB) {
      try {
        const DBDeleteRequest = window.indexedDB.deleteDatabase('sqlitedb');
        DBDeleteRequest.onsuccess = () => {
          console.log("IndexedDB cache cleared successfully");
          // Tenter de nettoyer également le cache du Service Worker
          if (navigator.serviceWorker && navigator.serviceWorker.controller) {
            navigator.serviceWorker.controller.postMessage({
              type: 'CLEAR_CACHE'
            });
          }
          toast({
            title: "Cache vidé",
            description: "Rechargement de la page..."
          });
          setTimeout(() => window.location.reload(), 1000);
        };
        DBDeleteRequest.onerror = () => {
          console.error("Error clearing IndexedDB cache");
          window.location.reload();
        };
      } catch (e) {
        console.error("Failed to clear IndexedDB:", e);
        window.location.reload();
      }
    } else {
      // Fallback to just reloading if IndexedDB is not available
      window.location.reload();
    }
  }, []);

  return {
    isRetrying,
    retryAttempt,
    maxRetryAttempts,
    handleRetry,
    handleForceReload,
    handleClearCacheAndReload
  };
};
