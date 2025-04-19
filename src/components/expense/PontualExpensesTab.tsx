
import { ExpenseList } from "@/components/budget/ExpenseList";
import { BudgetLoadingState } from "@/components/budget/BudgetLoadingState";
import { ExpenseErrorState } from "@/components/budget/ExpenseErrorState";
import { Expense } from "@/services/database/models/expense";
import { Budget } from "@/hooks/useBudgets";
import { useEffect } from "react";

interface PontualExpensesTabProps {
  isLoading: boolean;
  error: Error | null;
  initAttempted: boolean;
  isProcessing: boolean;
  expenses: Expense[];
  availableBudgets: Budget[];
  addDialogOpen: boolean;
  setAddDialogOpen: (open: boolean) => void;
  handleAddEnvelope: (envelope: {
    title: string;
    budget: number;
    type: "income" | "expense" | "budget";
    linkedBudgetId?: string;
    date: string;
  }) => void;
  handleDeleteExpense: (id: string) => void;
  handleUpdateExpense: (expense: Expense) => void;
  forceReload: () => void;
  handleRetry: () => Promise<void>;
  budgetId: string | undefined;
}

export const PontualExpensesTab = ({
  isLoading,
  error,
  initAttempted,
  isProcessing,
  expenses,
  availableBudgets,
  addDialogOpen,
  setAddDialogOpen,
  handleAddEnvelope,
  handleDeleteExpense,
  handleUpdateExpense,
  forceReload,
  handleRetry,
  budgetId
}: PontualExpensesTabProps) => {
  
  // Log pour déboguer
  useEffect(() => {
    console.log("PontualExpensesTab - expenses count:", expenses.length);
    if (expenses.length > 0) {
      console.log("Sample expense:", expenses[0]);
    } else {
      console.log("No expenses found in PontualExpensesTab");
    }
  }, [expenses]);
  
  return (
    <>
      {isLoading && (
        <BudgetLoadingState attempt={1} maxAttempts={1} />
      )}
      
      {error && initAttempted && !isProcessing && (
        <ExpenseErrorState 
          retryAttempt={1}
          maxRetryAttempts={3}
          isRetrying={false}
          handleRetry={handleRetry}
          handleForceReload={forceReload}
          handleClearCacheAndReload={() => window.location.reload()}
        />
      )}
      
      {!isLoading && !error && (
        <ExpenseList
          expenses={expenses}
          availableBudgets={availableBudgets}
          addDialogOpen={addDialogOpen}
          setAddDialogOpen={setAddDialogOpen}
          handleAddEnvelope={handleAddEnvelope}
          handleDeleteExpense={handleDeleteExpense}
          handleUpdateExpense={handleUpdateExpense}
          defaultBudgetId={budgetId}
        />
      )}
    </>
  );
};
