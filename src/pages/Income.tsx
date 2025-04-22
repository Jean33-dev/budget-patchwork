import { useState } from "react";
import { useRecurringIncome } from "@/hooks/useRecurringIncome";
import { AddEnvelopeDialog } from "@/components/budget/AddEnvelopeDialog";
import { IncomeHeader } from "@/components/income/IncomeHeader";
import { useIncomeManagement } from "@/hooks/useIncomeManagement";
import { IncomeGrid } from "@/components/income/IncomeGrid";
import { IncomeEmptyState } from "@/components/income/IncomeEmptyState";
import { RecurringIncomeGrid } from "@/components/recurring/RecurringIncomeGrid";
import { RecurringIncomeEmptyState } from "@/components/recurring/RecurringIncomeEmptyState";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { AddButton } from "@/components/budget/AddButton";

const Income = () => {
  const [activeTab, setActiveTab] = useState("ponctuel");
  const { toast } = useToast();
  
  const {
    envelopes: nonRecurringIncomes,
    addDialogOpen: addNonRecurringDialogOpen,
    setAddDialogOpen: setAddNonRecurringDialogOpen,
    editDialogOpen: editNonRecurringDialogOpen,
    setEditDialogOpen: setEditNonRecurringDialogOpen,
    selectedIncome: selectedNonRecurringIncome,
    setSelectedIncome: setSelectedNonRecurringIncome,
    handleAddIncome: handleAddNonRecurringIncome,
    handleEditIncome: handleEditNonRecurringIncome,
    handleDeleteIncome: handleDeleteNonRecurringIncome,
    handleIncomeClick: handleNonRecurringIncomeClick,
    isLoading: isNonRecurringLoading
  } = useIncomeManagement();

  const {
    recurringIncomes,
    isLoading: isRecurringLoading,
    addDialogOpen: addRecurringDialogOpen,
    setAddDialogOpen: setAddRecurringDialogOpen,
    editDialogOpen: editRecurringDialogOpen,
    setEditDialogOpen: setEditRecurringDialogOpen,
    selectedIncome: selectedRecurringIncome,
    setSelectedIncome: setSelectedRecurringIncome,
    handleAddIncome: handleAddRecurringIncome,
    handleEditIncome: handleEditRecurringIncome,
    handleDeleteIncome: handleDeleteRecurringIncome,
    handleIncomeClick: handleRecurringIncomeClick,
  } = useRecurringIncome();

  const handleAddRecurringIncomeWrapper = (income: {
    title: string;
    budget: number;
    type: "income" | "expense" | "budget";
    date: string;
    isRecurring?: boolean;
  }) => {
    if (income.type === "income") {
      handleAddRecurringIncome(income);
    } else {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Le type doit être 'income'"
      });
    }
  };

  const filteredNonRecurringIncomes = nonRecurringIncomes.filter(income => !income.isRecurring);

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <IncomeHeader title="Gestion des Revenus" />
      
      <Tabs defaultValue="ponctuel" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="ponctuel">Revenus ponctuels</TabsTrigger>
          <TabsTrigger value="recurrent">Revenus récurrents</TabsTrigger>
        </TabsList>

        <TabsContent value="ponctuel" className="mt-4">
          <AddButton
            onClick={() => setAddNonRecurringDialogOpen(true)}
            label="Ajouter un revenu ponctuel"
          />

          {isNonRecurringLoading ? (
            <div className="text-center py-8">Chargement des revenus...</div>
          ) : filteredNonRecurringIncomes.length === 0 ? (
            <IncomeEmptyState onAddClick={() => setAddNonRecurringDialogOpen(true)} />
          ) : (
            <IncomeGrid
              incomes={filteredNonRecurringIncomes}
              onDelete={handleDeleteNonRecurringIncome}
              onIncomeClick={handleNonRecurringIncomeClick}
            />
          )}

          <AddEnvelopeDialog
            type="income"
            open={addNonRecurringDialogOpen}
            onOpenChange={setAddNonRecurringDialogOpen}
            onAdd={handleAddNonRecurringIncome}
          />

          <EditIncomeDialog
            open={editNonRecurringDialogOpen}
            onOpenChange={setEditNonRecurringDialogOpen}
            selectedIncome={selectedNonRecurringIncome}
            setSelectedIncome={setSelectedNonRecurringIncome}
            onEditIncome={handleEditNonRecurringIncome}
          />
        </TabsContent>

        <TabsContent value="recurrent" className="mt-4">
          <AddButton
            onClick={() => setAddRecurringDialogOpen(true)}
            label="Ajouter un revenu récurrent"
          />

          {isRecurringLoading ? (
            <div className="text-center py-8">Chargement des revenus récurrents...</div>
          ) : recurringIncomes.length === 0 ? (
            <RecurringIncomeEmptyState onAddClick={() => setAddRecurringDialogOpen(true)} />
          ) : (
            <RecurringIncomeGrid
              incomes={recurringIncomes}
              onDelete={handleDeleteRecurringIncome}
              onIncomeClick={handleRecurringIncomeClick}
            />
          )}

          <AddEnvelopeDialog
            type="income"
            open={addRecurringDialogOpen}
            onOpenChange={setAddRecurringDialogOpen}
            onAdd={handleAddRecurringIncomeWrapper}
            isRecurring={true}
          />

          <EditIncomeDialog
            open={editRecurringDialogOpen}
            onOpenChange={setEditRecurringDialogOpen}
            selectedIncome={selectedRecurringIncome}
            setSelectedIncome={setSelectedRecurringIncome}
            onEditIncome={handleEditRecurringIncome}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Income;
