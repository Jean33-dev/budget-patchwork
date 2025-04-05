
import { useState, useEffect } from "react";
import { db } from "@/services/database";
import { Expense } from "../models/expense";
import { Budget } from "@/types/categories";

export const useExpenseDataLoading = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [availableBudgets, setAvailableBudgets] = useState<Budget[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [initAttempted, setInitAttempted] = useState(false);

  // Fonction de chargement des données
  const loadData = async () => {
    try {
      console.log("useExpenseDataLoading: Starting data load");
      setIsLoading(true);
      
      // Get current dashboard ID from URL
      const url = window.location.pathname;
      const urlMatch = url.match(/\/dashboard\/(dashboard_[0-9]+)/);
      const dashboardIdFromUrl = urlMatch ? urlMatch[1] : null;
      const currentDashboardId = dashboardIdFromUrl || 'budget';
      
      console.log(`Loading expenses for dashboard ID: ${currentDashboardId}`);
      
      // Charger toutes les dépenses
      const allExpenses = await db.getExpenses();
      
      // Filtrer les dépenses par tableau de bord actif
      const filteredExpenses = allExpenses.filter(expense => 
        !expense.dashboardId || expense.dashboardId === currentDashboardId
      );
      
      console.log(`Loaded ${allExpenses.length} total expenses, filtered to ${filteredExpenses.length} for current dashboard`);
      
      setExpenses(filteredExpenses);
      
      // Charger les budgets disponibles
      const budgets = await db.getBudgets();
      setAvailableBudgets(budgets);
      
      setError(null);
    } catch (error) {
      console.error("Error loading expense data:", error);
      setError(error instanceof Error ? error : new Error("Failed to load expense data"));
    } finally {
      setIsLoading(false);
      setInitAttempted(true);
    }
  };

  // Chargement initial des données
  useEffect(() => {
    const initializeData = async () => {
      try {
        await db.init();
        await loadData();
      } catch (error) {
        console.error("Failed to initialize expense data:", error);
        setError(error instanceof Error ? error : new Error("Failed to initialize expense data"));
        setInitAttempted(true);
        setIsLoading(false);
      }
    };

    initializeData();
  }, []);

  return {
    expenses,
    availableBudgets,
    isLoading,
    error,
    initAttempted,
    loadData
  };
};
