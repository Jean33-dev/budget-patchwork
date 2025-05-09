
import { useNavigate, useSearchParams } from "react-router-dom";
import { ExpensesHeader } from "@/components/budget/ExpensesHeader";
import { useExpenseManagement } from "@/hooks/useExpenseManagement";
import { useRecurringExpenses } from "@/hooks/useRecurringExpenses";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PontualExpensesTab } from "@/components/expense/PontualExpensesTab";
import { RecurringExpensesTab } from "@/components/expense/RecurringExpensesTab";
import { ProcessingIndicator } from "@/components/expense/ProcessingIndicator";
import { AddButton } from "@/components/budget/AddButton";
import { Expense } from "@/services/database/models/expense";

const Expenses = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const budgetId = searchParams.get('budgetId');
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("ponctuel");
  
  // Pour corriger les erreurs de type, nous devons adapter les hooks ou ajouter des wrappers
  const {
    expenses,
    availableBudgets,
    addDialogOpen,
    setAddDialogOpen,
    handleAddEnvelope,
    handleDeleteExpense: originalDeleteExpense,
    handleUpdateExpense: originalUpdateExpense,
    forceReload,
    isLoading,
    isProcessing,
    error,
    initAttempted
  } = useExpenseManagement(budgetId);

  // Wrapper pour assurer que les fonctions renvoient void
  const handleDeleteExpense = async (id: string): Promise<void> => {
    await originalDeleteExpense(id);
  };

  const handleUpdateExpense = async (expense: Expense): Promise<void> => {
    await originalUpdateExpense(expense);
  };

  const {
    recurringExpenses,
    availableBudgets: recurringAvailableBudgets,
    isLoading: isRecurringLoading,
    handleAddExpense: handleAddRecurringExpense,
    handleDeleteExpense: originalDeleteRecurringExpense,
    handleAddToCurrentMonth: originalAddToCurrentMonth,
    handleUpdateExpense: originalUpdateRecurringExpense,
    getBudgetName,
    currentDate,
  } = useRecurringExpenses();

  // Wrapper pour assurer que les fonctions renvoient void
  const handleDeleteRecurringExpense = async (id: string): Promise<void> => {
    await originalDeleteRecurringExpense(id);
  };

  const handleAddToCurrentMonth = async (id: string): Promise<void> => {
    await originalAddToCurrentMonth(id);
  };

  const handleUpdateRecurringExpense = async (expense: Expense): Promise<void> => {
    await originalUpdateRecurringExpense(expense);
  };

  useEffect(() => {
    if (error && !isLoading && !isProcessing) {
      console.error("Erreur détectée dans la page Expenses:", error);
      toast({
        variant: "destructive",
        title: "Erreur de chargement",
        description: "Une erreur est survenue lors du chargement des dépenses"
      });
    }
  }, [error, isLoading, isProcessing, toast]);

  const handleRetry = async () => {
    forceReload();
  };

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <ExpensesHeader onNavigate={navigate} />
      
      <Tabs defaultValue="ponctuel" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="ponctuel">Dépenses du mois</TabsTrigger>
          <TabsTrigger value="recurrent">Dépenses récurrentes</TabsTrigger>
        </TabsList>

        <TabsContent value="ponctuel" className="mt-4">
          <AddButton 
            onClick={() => setAddDialogOpen(true)}
            label="Ajouter une dépense"
          />

          <PontualExpensesTab
            isLoading={isLoading}
            error={error}
            initAttempted={initAttempted}
            isProcessing={isProcessing}
            expenses={expenses}
            availableBudgets={availableBudgets}
            addDialogOpen={addDialogOpen}
            setAddDialogOpen={setAddDialogOpen}
            handleAddEnvelope={handleAddEnvelope}
            handleDeleteExpense={handleDeleteExpense}
            handleUpdateExpense={handleUpdateExpense}
            forceReload={forceReload}
            handleRetry={handleRetry}
            budgetId={budgetId || undefined}
          />
        </TabsContent>

        <TabsContent value="recurrent" className="mt-4">
          <RecurringExpensesTab
            recurringExpenses={recurringExpenses}
            availableBudgets={recurringAvailableBudgets}
            isLoading={isRecurringLoading}
            handleAddExpense={handleAddRecurringExpense}
            handleDeleteExpense={handleDeleteRecurringExpense}
            handleAddToCurrentMonth={handleAddToCurrentMonth}
            handleUpdateExpense={handleUpdateRecurringExpense}
            getBudgetName={getBudgetName}
            currentDate={currentDate}
          />
        </TabsContent>
      </Tabs>
      
      <ProcessingIndicator isProcessing={isProcessing} />
    </div>
  );
};

export default Expenses;
