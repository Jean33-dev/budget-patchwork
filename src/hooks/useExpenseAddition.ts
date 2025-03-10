
import { useToast } from "@/hooks/use-toast";
import { db } from "@/services/database";
import { Expense } from "@/types/expense";

export const useExpenseAddition = (
  setExpenses: React.Dispatch<React.SetStateAction<Expense[]>>,
  loadData: () => Promise<void>,
  budgetId: string | null
) => {
  const { toast } = useToast();

  const handleAddEnvelope = async (envelope: {
    title: string;
    budget: number;
    type: "income" | "expense" | "budget";
    linkedBudgetId?: string;
    date?: string;
  }): Promise<boolean> => {
    try {
      // Ensure we have a linked budget ID, using the provided budgetId from props or from envelope
      const selectedBudgetId = envelope.linkedBudgetId || budgetId;
      
      if (envelope.type === "expense" && !selectedBudgetId) {
        toast({
          variant: "destructive",
          title: "Budget manquant",
          description: "Veuillez sélectionner un budget pour cette dépense."
        });
        return false;
      }

      const newExpense: Expense = {
        id: Date.now().toString(),
        title: envelope.title,
        budget: envelope.budget,
        spent: envelope.budget,
        type: "expense",
        linkedBudgetId: selectedBudgetId,
        date: envelope.date || new Date().toISOString().split('T')[0]
      };

      console.log("Ajout d'une nouvelle dépense:", newExpense);
      await db.addExpense(newExpense);
      
      setExpenses(prev => [...prev, newExpense]);
      
      toast({
        title: "Dépense ajoutée",
        description: `La dépense "${envelope.title}" a été créée avec succès.`
      });
      
      await loadData();
      return true;
    } catch (error) {
      console.error("Erreur lors de l'ajout de la dépense:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'ajouter la dépense"
      });
      return false;
    }
  };

  return {
    handleAddEnvelope
  };
};
