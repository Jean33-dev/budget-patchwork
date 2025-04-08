
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { db } from "@/services/database";
import { Income } from "@/services/database/models/income";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { AddEnvelopeDialog } from "@/components/budget/AddEnvelopeDialog";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, PlusCircle, Calendar, RefreshCw } from "lucide-react";

const RecurringIncome = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [recurringIncomes, setRecurringIncomes] = useState<Income[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const currentDate = format(new Date(), "yyyy-MM-dd");

  useEffect(() => {
    loadRecurringIncomes();
  }, []);

  const loadRecurringIncomes = async () => {
    setIsLoading(true);
    try {
      await db.init();
      const incomes = await db.getRecurringIncomes();
      setRecurringIncomes(incomes);
    } catch (error) {
      console.error("Erreur lors du chargement des revenus récurrents:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les revenus récurrents"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddIncome = async (newIncome: { 
    title: string; 
    budget: number; 
    type: "income"; 
    date: string 
  }) => {
    try {
      const income = {
        id: Date.now().toString(),
        ...newIncome,
        spent: newIncome.budget,
        isRecurring: true
      };
      
      await db.addIncome(income);
      setRecurringIncomes(prev => [...prev, income]);
      
      toast({
        title: "Succès",
        description: "Nouveau revenu récurrent ajouté"
      });
      
      setAddDialogOpen(false);
    } catch (error) {
      console.error("Erreur lors de l'ajout du revenu récurrent:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'ajouter le revenu récurrent"
      });
    }
  };

  const handleDeleteIncome = async (id: string) => {
    try {
      await db.deleteIncome(id);
      setRecurringIncomes(prev => prev.filter(income => income.id !== id));
      
      toast({
        title: "Succès",
        description: "Revenu récurrent supprimé"
      });
    } catch (error) {
      console.error("Erreur lors de la suppression du revenu récurrent:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer le revenu récurrent"
      });
    }
  };

  const handleAddToCurrentMonth = async (incomeId: string) => {
    try {
      await db.copyRecurringIncomeToMonth(incomeId, currentDate);
      toast({
        title: "Succès",
        description: "Revenu ajouté au mois courant"
      });
    } catch (error) {
      console.error("Erreur lors de l'ajout du revenu au mois courant:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'ajouter le revenu au mois courant"
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Revenus Récurrents</h1>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={loadRecurringIncomes}>
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
        <div className="text-center py-8">Chargement des revenus récurrents...</div>
      ) : recurringIncomes.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Aucun revenu récurrent trouvé</p>
          <Button onClick={() => setAddDialogOpen(true)} variant="outline" className="mt-4">
            <PlusCircle className="h-4 w-4 mr-2" />
            Ajouter un revenu récurrent
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {recurringIncomes.map((income) => (
            <Card key={income.id} className="overflow-hidden">
              <CardHeader className="bg-primary/5 pb-2">
                <CardTitle className="flex justify-between items-center">
                  <span className="truncate">{income.title}</span>
                  <span className="text-lg font-semibold">{income.budget.toFixed(2)} €</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {income.date}
                  </div>
                  <div>Revenu récurrent</div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t pt-4">
                <Button 
                  variant="destructive" 
                  size="sm" 
                  onClick={() => handleDeleteIncome(income.id)}
                >
                  Supprimer
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleAddToCurrentMonth(income.id)}
                >
                  Ajouter au mois courant
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <AddEnvelopeDialog
        type="income"
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onAdd={handleAddIncome}
      />
    </div>
  );
};

export default RecurringIncome;
