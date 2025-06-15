
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
import { useTheme } from "@/context/ThemeContext";

const Expenses = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const budgetId = searchParams.get('budgetId');
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("ponctuel");
  const { t } = useTheme();

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
    handleUpdateExpense: handleUpdateRecurringExpense,
    getBudgetName,
    currentDate,
  } = useRecurringExpenses();

  useEffect(() => {
    if (error && !isLoading && !isProcessing) {
      console.error("Erreur détectée dans la page Expenses:", error);
      toast({
        variant: "destructive",
        title: t("expenses.errorTitle"),
        description: t("expenses.errorLoading")
      });
    }
  }, [error, isLoading, isProcessing, toast, t]);

  const handleRetry = async () => {
    forceReload();
  };

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <ExpensesHeader 
        onNavigate={navigate} 
        showReceiveButton={activeTab === "ponctuel"}
      />

      <Tabs defaultValue="ponctuel" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="ponctuel">{t("expenses.tabPontual")}</TabsTrigger>
          <TabsTrigger value="recurrent">{t("expenses.tabRecurring")}</TabsTrigger>
        </TabsList>

        <TabsContent value="ponctuel" className="mt-4">
          <AddButton 
            onClick={() => setAddDialogOpen(true)}
            label={t("expenses.addExpense")}
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
            handleUpdateExpense={handleUpdateRecurringExpense}
            getBudgetName={getBudgetName}
            currentDate={currentDate}
            currency={undefined}
          />
        </TabsContent>
      </Tabs>
      
      <ProcessingIndicator isProcessing={isProcessing} />
    </div>
  );
};

export default Expenses;
