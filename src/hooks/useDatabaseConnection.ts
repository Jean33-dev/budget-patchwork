
import { useEffect, useState } from "react";
import { db } from "@/services/database";

/**
 * Hook that ensures database is initialized only once and provides connection status
 */
export const useDatabaseConnection = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Use a global flag to track if initialization has been attempted
    if ((window as any).__DB_INITIALIZED) {
      setIsInitialized(true);
      setIsLoading(false);
      return;
    }

    const initializeDb = async () => {
      setIsLoading(true);
      try {
        const success = await db.init();
        if (success) {
          (window as any).__DB_INITIALIZED = true;
          setIsInitialized(true);
        } else {
          setError(new Error("Database initialization failed"));
        }
      } catch (err) {
        console.error("Database initialization error:", err);
        setError(err instanceof Error ? err : new Error("Unknown database error"));
      } finally {
        setIsLoading(false);
      }
    };

    initializeDb();
  }, []);

  return { isInitialized, isLoading, error };
};
