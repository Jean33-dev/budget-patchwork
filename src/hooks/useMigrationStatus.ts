
import { useState, useEffect } from 'react';
import { db } from '@/services/database';
import { logLocalStorageContent } from '@/utils/localStorage-utils';

/**
 * Hook pour suivre et gérer l'état de la migration 
 * des données de localStorage vers SQLite
 */
export const useMigrationStatus = () => {
  const [isMigrationNeeded, setIsMigrationNeeded] = useState<boolean | null>(null);
  const [isMigrating, setIsMigrating] = useState(false);
  const [migrationSuccess, setMigrationSuccess] = useState<boolean | null>(null);

  // Vérifie si une migration est nécessaire au chargement
  useEffect(() => {
    checkMigrationStatus();
  }, []);

  const checkMigrationStatus = async () => {
    try {
      // Initialiser la base de données d'abord
      await db.init();
      
      // Afficher le contenu du localStorage pour debug
      logLocalStorageContent();
      
      // Vérifier si des données sont présentes dans localStorage
      const budgets = localStorage.getItem('budgets');
      const expenses = localStorage.getItem('expenses');
      const incomes = localStorage.getItem('incomes');
      const categories = localStorage.getItem('categories');
      
      // Vérifier si des données sont présentes dans SQLite
      const sqliteBudgets = await db.getBudgets();
      const sqliteExpenses = await db.getExpenses();
      const sqliteIncomes = await db.getIncomes();
      const sqliteCategories = await db.getCategories();
      
      // Migration nécessaire si données dans localStorage mais pas dans SQLite
      const hasLocalData = !!(
        (budgets && budgets !== '[]' && budgets !== '{}') ||
        (expenses && expenses !== '[]' && expenses !== '{}') ||
        (incomes && incomes !== '[]' && incomes !== '{}') ||
        (categories && categories !== '[]' && categories !== '{}')
      );
      
      const hasSqliteData = !!(
        sqliteBudgets.length > 0 ||
        sqliteExpenses.length > 0 ||
        sqliteIncomes.length > 0 ||
        sqliteCategories.length > 0
      );
      
      setIsMigrationNeeded(hasLocalData && !hasSqliteData);
      
      console.log("Migration status check:", {
        hasLocalData,
        hasSqliteData,
        isMigrationNeeded: hasLocalData && !hasSqliteData
      });
    } catch (error) {
      console.error("Error checking migration status:", error);
      setIsMigrationNeeded(false);
    }
  };

  const startMigration = async () => {
    setIsMigrating(true);
    setMigrationSuccess(null);
    
    try {
      // Effectuer la migration
      const success = await db.migrateFromLocalStorage();
      setMigrationSuccess(success);
      
      if (success) {
        setIsMigrationNeeded(false);
      }
      
      return success;
    } catch (error) {
      console.error("Error during migration:", error);
      setMigrationSuccess(false);
      return false;
    } finally {
      setIsMigrating(false);
    }
  };

  return {
    isMigrationNeeded,
    isMigrating,
    migrationSuccess,
    checkMigrationStatus,
    startMigration
  };
};
