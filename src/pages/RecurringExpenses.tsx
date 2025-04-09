
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { db } from "@/services/database";
import { Expense } from "@/services/database/models/expense";
import { Budget } from "@/services/database/models/budget";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { AddEnvelopeDialog } from "@/components/budget/AddEnvelopeDialog";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, PlusCircle, Calendar, RefreshCw, Wallet } from "lucide-react";

const RecurringExpenses = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [recurringExpenses, setRecurringExpenses] = useState<Expense[]>([]);
  const [availableBudgets, setAvailableBudgets] = useState<Budget[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const currentDate = format(new Date(), "yyyy-MM-dd");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      await db.init();
      const expenses = await db.getRecurringExpenses();
      const budgets = await db.getBudgets();
      setRecurringExpenses(expenses);
      setAvailableBudgets(budgets);
    } catch (error) {
      console.error("Erreur lors du chargement des dépenses récurrentes:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les dépenses récurrentes"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddExpense = async (newExpense: { 
    title: string; 
    budget: number; 
    type: "expense";
    linkedBudgetId?: string;
    date: string;
  }) => {
    try {
      const expense = {
        id: Date.now().toString(),
        ...newExpense,
        spent: 0,
        isRecurring: true
      };
      
      await db.addExpense(expense);
      setRecurringExpenses(prev => [...prev, expense]);
      
      toast({
        title: "Succès",
        description: "Nouvelle dépense récurrente ajoutée"
      });
      
      setAddDialogOpen(false);
    } catch (error) {
      console.error("Erreur lors de l'ajout de la dépense récurrente:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'ajouter la dépense récurrente"
      });
    }
  };

  const handleDeleteExpense = async (id: string) => {
    try {
      await db.deleteExpense(id);
      setRecurringExpenses(prev => prev.filter(expense => expense.id !== id));
      
      toast({
        title: "Succès",
        description: "Dépense récurrente supprimée"
      });
    } catch (error) {
      console.error("Erreur lors de la suppression de la dépense récurrente:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer la dépense récurrente"
      });
    }
  };

  const getBudgetName = (budgetId?: string) => {
    if (!budgetId) return "Aucun budget";
    const budget = availableBudgets.find(b => b.id === budgetId);
    return budget ? budget.title : "Budget inconnu";
  };

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Dépenses Récurrentes</h1>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={loadData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualiser
          </Button>
          <Button onClick={() => setAddDialogOpen(true)}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Ajouter
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-8">Chargement des dépenses récurrentes...</div>
      ) : recurringExpenses.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Aucune dépense récurrente trouvée</p>
          <Button onClick={() => setAddDialogOpen(true)} variant="outline" className="mt-4">
            <PlusCircle className="h-4 w-4 mr-2" />
            Ajouter une dépense récurrente
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {recurringExpenses.map((expense) => (
            <Card key={expense.id} className="overflow-hidden">
              <CardHeader className="bg-destructive/5 pb-2">
                <CardTitle className="flex justify-between items-center">
                  <span className="truncate">{expense.title}</span>
                  <span className="text-lg font-semibold">{expense.budget.toFixed(2)} €</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {expense.date}
                  </div>
                  <div className="flex items-center">
                    <Wallet className="h-4 w-4 mr-1" />
                    {getBudgetName(expense.linkedBudgetId)}
                  </div>
                  <div>Dépense récurrente</div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t pt-4">
                <Button 
                  variant="destructive" 
                  size="sm" 
                  onClick={() => handleDeleteExpense(expense.id)}
                >
                  Supprimer
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <AddEnvelopeDialog
        type="expense"
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onAdd={handleAddExpense}
        availableBudgets={availableBudgets.map(budget => ({
          id: budget.id,
          title: budget.title,
        }))}
      />
    </div>
  );
};

export default RecurringExpenses;
