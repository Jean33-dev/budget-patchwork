import { useState, useEffect } from "react";
import { DashboardOverview } from "@/components/dashboard/DashboardOverview";
import { EnvelopeList } from "@/components/budget/EnvelopeList";
import { AddEnvelopeDialog } from "@/components/budget/AddEnvelopeDialog";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { MonthSelector } from "@/components/budget/MonthSelector";

interface Envelope {
  id: string;
  title: string;
  budget: number;
  spent: number;
  type: "income" | "expense" | "budget";
  category?: string;
}

interface MonthlyBudget {
  date: string;
  envelopes: Envelope[];
  remainingBudget: number;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [monthlyBudgets, setMonthlyBudgets] = useState<MonthlyBudget[]>([]);
  
  useEffect(() => {
    const currentMonthKey = currentDate.toISOString().slice(0, 7);
    if (!monthlyBudgets.find(mb => mb.date === currentMonthKey)) {
      const previousMonth = new Date(currentDate);
      previousMonth.setMonth(previousMonth.getMonth() - 1);
      const previousMonthKey = previousMonth.toISOString().slice(0, 7);
      const previousBudget = monthlyBudgets.find(mb => mb.date === previousMonthKey);
      
      const previousRemainingBudget = previousBudget ? 
        previousBudget.envelopes
          .filter(env => env.type === "expense")
          .reduce((acc, env) => acc + (env.budget - env.spent), 0) + 
        previousBudget.remainingBudget : 0;

      setMonthlyBudgets(prev => [...prev, {
        date: currentMonthKey,
        envelopes: [
          { id: "1", title: "Salaire", budget: 5000, spent: 5000, type: "income" },
          { id: "2", title: "Freelance", budget: 1000, spent: 800, type: "income" },
          { id: "3", title: "Loyer", budget: 1500, spent: 1500, type: "expense", category: "Logement" },
          { id: "4", title: "Courses", budget: 600, spent: 450, type: "expense", category: "Alimentation" },
          { id: "5", title: "Loisirs", budget: 200, spent: 180, type: "expense", category: "Loisirs" },
          { id: "6", title: "Budget Logement", budget: 2000, spent: 1500, type: "budget", category: "Logement" },
          { id: "7", title: "Budget Alimentation", budget: 800, spent: 600, type: "budget", category: "Alimentation" },
        ],
        remainingBudget: previousRemainingBudget
      }]);
    }
  }, [currentDate, monthlyBudgets]);

  const currentMonthBudget = monthlyBudgets.find(
    mb => mb.date === currentDate.toISOString().slice(0, 7)
  ) || { envelopes: [], remainingBudget: 0 };

  const handleMonthChange = (newDate: Date) => {
    setCurrentDate(newDate);
  };

  // Calcul des revenus totaux
  const totalIncome = currentMonthBudget.envelopes
    .filter((env) => env.type === "income")
    .reduce((sum, env) => sum + env.budget, 0);

  // Calcul du budget total des dépenses
  const totalExpenseBudget = currentMonthBudget.envelopes
    .filter((env) => env.type === "expense")
    .reduce((sum, env) => sum + env.budget, 0);

  // Calcul des dépenses réelles
  const totalExpenses = currentMonthBudget.envelopes
    .filter((env) => env.type === "expense")
    .reduce((sum, env) => sum + env.spent, 0);

  // Calcul du budget restant après allocation aux dépenses
  const remainingBudget = totalIncome - totalExpenseBudget;

  // Calcul du budget non utilisé (différence entre budget alloué et dépenses réelles)
  const unusedBudget = totalExpenseBudget - totalExpenses;

  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [activeType, setActiveType] = useState<"income" | "expense" | "budget">("income");

  const handleAddClick = (type: "income" | "expense" | "budget") => {
    setActiveType(type);
    setAddDialogOpen(true);
  };

  const handleAddEnvelope = (newEnvelope: { 
    title: string; 
    budget: number; 
    type: "income" | "expense" | "budget"; 
    category?: string;
    linkedBudgetId?: string;
  }) => {
    const envelope: Envelope = {
      id: Date.now().toString(),
      ...newEnvelope,
      spent: newEnvelope.type === "income" ? newEnvelope.budget : 0,
    };
    
    const currentMonthKey = currentDate.toISOString().slice(0, 7);
    
    // Si c'est une dépense, mettre à jour le montant dépensé du budget associé
    if (newEnvelope.type === "expense" && newEnvelope.linkedBudgetId) {
      setMonthlyBudgets(prev => prev.map(mb => 
        mb.date === currentMonthKey 
          ? {
              ...mb,
              envelopes: [
                ...mb.envelopes,
                envelope,
              ].map(env => 
                env.id === newEnvelope.linkedBudgetId
                  ? { ...env, spent: env.spent + newEnvelope.budget }
                  : env
              )
            }
          : mb
      ));
    } else {
      // Pour les autres types (revenus et budgets)
      setMonthlyBudgets(prev => prev.map(mb => 
        mb.date === currentMonthKey 
          ? { ...mb, envelopes: [...mb.envelopes, envelope] }
          : mb
      ));
    }

    toast({
      title: "Succès",
      description: `Nouvelle enveloppe ${
        newEnvelope.type === "income" 
          ? "de revenu" 
          : newEnvelope.type === "expense"
          ? "de dépense"
          : "de budget"
      } créée`,
    });
  };

  // Obtenir les budgets disponibles pour la sélection dans le dialogue d'ajout de dépense
  const availableBudgets = currentMonthBudget.envelopes
    .filter(env => env.type === "budget")
    .map(budget => ({
      id: budget.id,
      title: budget.title,
      category: budget.category || ""
    }));

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => navigate("/")}
            className="shrink-0"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-4xl font-bold">Tableau de Bord Budget</h1>
        </div>
        <MonthSelector currentDate={currentDate} onMonthChange={handleMonthChange} />
      </div>
      
      <DashboardOverview
        totalIncome={totalIncome}
        totalExpenses={totalExpenses}
        envelopes={currentMonthBudget.envelopes}
      />
      
      <div className="space-y-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-blue-800">
            Budget restant après allocation : {remainingBudget.toFixed(2)} €
          </p>
        </div>

        {unusedBudget > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-800">
              Budget non utilisé : {unusedBudget.toFixed(2)} €
            </p>
          </div>
        )}
      </div>

      <div className="space-y-8">
        <EnvelopeList
          envelopes={currentMonthBudget.envelopes}
          type="income"
          onAddClick={() => handleAddClick("income")}
          onEnvelopeClick={handleEnvelopeClick}
        />
        
        <EnvelopeList
          envelopes={currentMonthBudget.envelopes}
          type="budget"
          onAddClick={() => handleAddClick("budget")}
          onEnvelopeClick={handleEnvelopeClick}
        />
        
        <EnvelopeList
          envelopes={currentMonthBudget.envelopes}
          type="expense"
          onAddClick={() => handleAddClick("expense")}
          onEnvelopeClick={handleEnvelopeClick}
        />
      </div>

      <AddEnvelopeDialog
        type={activeType}
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onAdd={handleAddEnvelope}
        availableBudgets={availableBudgets}
      />
    </div>
  );
};

export default Dashboard;
