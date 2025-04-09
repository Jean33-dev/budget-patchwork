
import { useNavigate, useSearchParams } from "react-router-dom";
import { ExpensesHeader } from "@/components/budget/ExpensesHeader";
import { useExpenseManagement } from "@/hooks/useExpenseManagement";
import { useRecurringExpenses } from "@/hooks/useRecurringExpenses";
import { ExpenseList } from "@/components/budget/ExpenseList";
import { BudgetLoadingState } from "@/components/budget/BudgetLoadingState";
import { ExpenseErrorState } from "@/components/budget/ExpenseErrorState";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RecurringExpenseGrid } from "@/components/recurring/RecurringExpenseGrid";
import { RecurringExpenseEmptyState } from "@/components/recurring/RecurringExpenseEmptyState";
import { AddEnvelopeDialog } from "@/components/budget/AddEnvelopeDialog";
import { Expense } from "@/services/database/models/expense";
import { AddButton } from "@/components/budget/AddButton";

const Expenses = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const budgetId = searchParams.get('budgetId');
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("ponctuel");
  
  const {
    expenses,
    availableBudgets,
    addDialogOpen,
    setAddDialogOpen,
    handleAddEnvelope,
    handleDeleteExpense,
    handleUpdateExpense,
    forceReload,
    isLoading,
    isProcessing,
    error,
    initAttempted
  } = useExpenseManagement(budgetId);

  const {
    recurringExpenses,
    availableBudgets: recurringAvailableBudgets,
    isLoading: isRecurringLoading,
    handleAddExpense: handleAddRecurringExpense,
    handleDeleteExpense: handleDeleteRecurringExpense,
    handleAddToCurrentMonth,
    handleUpdateExpense: handleUpdateRecurringExpense,
    getBudgetName,
    currentDate,
  } = useRecurringExpenses();
  
  const [addRecurringDialogOpen, setAddRecurringDialogOpen] = useState(false);
  const [editRecurringExpense, setEditRecurringExpense] = useState<Expense | null>(null);

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

  // Wrapper function for type safety
  const handleAddRecurringExpenseWrapper = (expense: { 
    title: string; 
    budget: number; 
    type: "income" | "expense" | "budget";
    linkedBudgetId?: string;
    date: string;
    isRecurring?: boolean;
  }) => {
    if (expense.type === "expense") {
      handleAddRecurringExpense(expense);
    } else {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Le type doit être 'expense'"
      });
    }
  };

  // Wrapper function for type safety
  const handleEditRecurringExpense = (expense: Expense) => {
    setEditRecurringExpense(expense);
    setAddRecurringDialogOpen(true);
  };

  // Wrapper function for type safety
  const handleUpdateRecurringExpenseWrapper = (data: Expense) => {
    if (data.type === "expense") {
      handleUpdateRecurringExpense(data);
    }
  };

  useEffect(() => {
    if (!addRecurringDialogOpen) {
      setEditRecurringExpense(null);
    }
  }, [addRecurringDialogOpen]);

  const openAddRecurringDialog = () => {
    setEditRecurringExpense(null);
    setAddRecurringDialogOpen(true);
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
              defaultBudgetId={budgetId || undefined}
            />
          )}
        </TabsContent>

        <TabsContent value="recurrent" className="mt-4">
          <AddButton
            onClick={openAddRecurringDialog}
            label="Ajouter une dépense récurrente"
          />

          {isRecurringLoading ? (
            <div className="text-center py-8">Chargement des dépenses récurrentes...</div>
          ) : recurringExpenses.length === 0 ? (
            <RecurringExpenseEmptyState onAddClick={openAddRecurringDialog} />
          ) : (
            <RecurringExpenseGrid
              expenses={recurringExpenses}
              getBudgetName={getBudgetName}
              onDelete={handleDeleteRecurringExpense}
              onAddToCurrentMonth={handleAddToCurrentMonth}
              onEdit={handleEditRecurringExpense}
              currentDate={currentDate}
            />
          )}

          <AddEnvelopeDialog
            type="expense"
            open={addRecurringDialogOpen}
            onOpenChange={setAddRecurringDialogOpen}
            onAdd={editRecurringExpense ? 
              (data) => handleUpdateRecurringExpenseWrapper({...editRecurringExpense, ...data} as Expense) : 
              handleAddRecurringExpenseWrapper}
            availableBudgets={recurringAvailableBudgets.map(budget => ({
              id: budget.id,
              title: budget.title,
            }))}
            isRecurring={true}
            defaultValues={editRecurringExpense ? {
              title: editRecurringExpense.title,
              budget: editRecurringExpense.budget,
              linkedBudgetId: editRecurringExpense.linkedBudgetId,
              date: editRecurringExpense.date,
            } : undefined}
            dialogTitle={editRecurringExpense ? "Modifier la dépense récurrente" : "Ajouter une dépense récurrente"}
          />
        </TabsContent>
      </Tabs>
      
      {isProcessing && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
              <p className="text-lg font-medium">Opération en cours...</p>
              <p className="text-sm text-gray-500 text-center">
                Veuillez patienter pendant le traitement de votre demande.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Expenses;
