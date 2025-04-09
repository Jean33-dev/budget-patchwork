
import { useNavigate, useSearchParams } from "react-router-dom";
import { ExpensesHeader } from "@/components/budget/ExpensesHeader";
import { useExpenseManagement } from "@/hooks/useExpenseManagement";
import { useRecurringExpenses } from "@/hooks/useRecurringExpenses";
import { ExpenseList } from "@/components/budget/ExpenseList";
import { BudgetLoadingState } from "@/components/budget/BudgetLoadingState";
import { ExpenseErrorState } from "@/components/budget/ExpenseErrorState";
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RecurringExpenseGrid } from "@/components/recurring/RecurringExpenseGrid";
import { RecurringExpenseEmptyState } from "@/components/recurring/RecurringExpenseEmptyState";
import { AddEnvelopeDialog } from "@/components/budget/AddEnvelopeDialog";

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
    getBudgetName,
  } = useRecurringExpenses();
  
  const [addRecurringDialogOpen, setAddRecurringDialogOpen] = useState(false);

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
          <TabsTrigger value="ponctuel">Dépenses ponctuelles</TabsTrigger>
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
          {isRecurringLoading ? (
            <div className="text-center py-8">Chargement des dépenses récurrentes...</div>
          ) : recurringExpenses.length === 0 ? (
            <RecurringExpenseEmptyState onAddClick={() => setAddRecurringDialogOpen(true)} />
          ) : (
            <RecurringExpenseGrid
              expenses={recurringExpenses}
              getBudgetName={getBudgetName}
              onDelete={handleDeleteRecurringExpense}
            />
          )}

          <AddEnvelopeDialog
            type="expense"
            open={addRecurringDialogOpen}
            onOpenChange={setAddRecurringDialogOpen}
            onAdd={(expense) => handleAddRecurringExpense(expense)}
            availableBudgets={recurringAvailableBudgets.map(budget => ({
              id: budget.id,
              title: budget.title,
            }))}
            isRecurring={true}
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
