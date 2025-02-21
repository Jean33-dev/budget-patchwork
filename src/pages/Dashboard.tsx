
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardOverview } from "@/components/dashboard/DashboardOverview";
import { BudgetStats } from "@/components/dashboard/BudgetStats";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Envelope {
  id: string;
  title: string;
  budget: number;
  spent: number;
  type: "income" | "expense" | "budget";
}

interface MonthlyBudget {
  date: string;
  envelopes: Envelope[];
  remainingBudget: number;
}

const MONTHLY_BUDGETS_KEY = "app_monthly_budgets";
const INCOMES_KEY = "app_incomes";
const EXPENSES_KEY = "app_expenses";
const BUDGETS_KEY = "app_budgets";

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [monthlyBudgets, setMonthlyBudgets] = useState<MonthlyBudget[]>(() => {
    const stored = localStorage.getItem(MONTHLY_BUDGETS_KEY);
    return stored ? JSON.parse(stored) : [];
  });
  const [showTransitionDialog, setShowTransitionDialog] = useState(false);
  const [nextDate, setNextDate] = useState<Date | null>(null);

  // Sauvegarder les budgets mensuels dans le localStorage
  useEffect(() => {
    localStorage.setItem(MONTHLY_BUDGETS_KEY, JSON.stringify(monthlyBudgets));
  }, [monthlyBudgets]);

  useEffect(() => {
    const currentMonthKey = currentDate.toISOString().slice(0, 7);
    if (!monthlyBudgets.find(mb => mb.date === currentMonthKey)) {
      const previousMonth = new Date(currentDate);
      previousMonth.setMonth(previousMonth.getMonth() - 1);
      const previousMonthKey = previousMonth.toISOString().slice(0, 7);
      const previousBudget = monthlyBudgets.find(mb => mb.date === previousMonthKey);

      // Récupérer toutes les données stockées
      const storedBudgets = localStorage.getItem(BUDGETS_KEY);
      const storedIncomes = localStorage.getItem(INCOMES_KEY);
      const storedExpenses = localStorage.getItem(EXPENSES_KEY);

      const currentBudgets = storedBudgets ? JSON.parse(storedBudgets) : [];
      const currentIncomes = storedIncomes ? JSON.parse(storedIncomes) : [];
      const currentExpenses = storedExpenses ? JSON.parse(storedExpenses) : [];
      
      // Créer les enveloppes à partir des données stockées
      const budgetEnvelopes = currentBudgets.map((budget: any) => ({
        id: budget.id,
        title: budget.title,
        budget: budget.amount || budget.budget,
        spent: budget.spent || 0,
        type: "budget" as const
      }));

      const incomeEnvelopes = currentIncomes.map((income: any) => ({
        id: income.id,
        title: income.title,
        budget: income.budget,
        spent: income.spent || income.budget,
        type: "income" as const
      }));

      const expenseEnvelopes = currentExpenses.map((expense: any) => ({
        id: expense.id,
        title: expense.title,
        budget: expense.budget,
        spent: expense.spent,
        type: "expense" as const
      }));

      // Si c'est le premier mois et qu'il n'y a pas de données stockées, ajouter des données par défaut
      const defaultIncomes = incomeEnvelopes.length === 0 ? [
        { id: "1", title: "Salaire", budget: 5000, spent: 5000, type: "income" as const },
        { id: "2", title: "Freelance", budget: 1000, spent: 800, type: "income" as const }
      ] : [];

      setMonthlyBudgets(prev => [...prev, {
        date: currentMonthKey,
        envelopes: [
          ...budgetEnvelopes,
          ...incomeEnvelopes,
          ...expenseEnvelopes,
          ...defaultIncomes
        ],
        remainingBudget: previousBudget ? previousBudget.remainingBudget : 0
      }]);

      // Sauvegarder les nouvelles données
      if (budgetEnvelopes.length > 0) {
        localStorage.setItem(BUDGETS_KEY, JSON.stringify(budgetEnvelopes));
      }
      if (incomeEnvelopes.length > 0 || defaultIncomes.length > 0) {
        localStorage.setItem(INCOMES_KEY, JSON.stringify([...incomeEnvelopes, ...defaultIncomes]));
      }
      if (expenseEnvelopes.length > 0) {
        localStorage.setItem(EXPENSES_KEY, JSON.stringify(expenseEnvelopes));
      }
    }
  }, [currentDate, monthlyBudgets]);

  const handleMonthChange = (newDate: Date) => {
    const newMonthKey = newDate.toISOString().slice(0, 7);
    const currentMonthKey = currentDate.toISOString().slice(0, 7);
    
    if (newMonthKey !== currentMonthKey) {
      setNextDate(newDate);
      setShowTransitionDialog(true);
    }
  };

  const handleTransitionConfirm = () => {
    if (nextDate) {
      navigate("/dashboard/budget/transition");
    }
    setShowTransitionDialog(false);
  };

  const handleTransitionCancel = () => {
    setNextDate(null);
    setShowTransitionDialog(false);
  };

  const currentMonthBudget = monthlyBudgets.find(
    mb => mb.date === currentDate.toISOString().slice(0, 7)
  ) || { envelopes: [], remainingBudget: 0 };

  const totalIncome = currentMonthBudget.envelopes
    .filter((env) => env.type === "income")
    .reduce((sum, env) => sum + env.budget, 0);

  const totalBudgets = currentMonthBudget.envelopes
    .filter((env) => env.type === "budget")
    .reduce((sum, env) => sum + env.budget, 0);

  const totalExpenses = currentMonthBudget.envelopes
    .filter((env) => env.type === "expense")
    .reduce((sum, env) => sum + env.spent, 0);

  const remainingBudget = totalIncome - totalBudgets;
  const remainingBudgetAfterExpenses = totalBudgets - totalExpenses;

  return (
    <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-8 space-y-6 sm:space-y-8">
      <DashboardHeader
        currentDate={currentDate}
        onMonthChange={handleMonthChange}
        onBackClick={() => navigate("/")}
      />
      
      <DashboardOverview
        totalIncome={totalIncome}
        totalExpenses={totalExpenses}
        envelopes={currentMonthBudget.envelopes}
      />
      
      <BudgetStats
        remainingBudget={remainingBudget}
        remainingBudgetAfterExpenses={remainingBudgetAfterExpenses}
      />

      <AlertDialog open={showTransitionDialog} onOpenChange={setShowTransitionDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Transition vers un nouveau mois</AlertDialogTitle>
            <AlertDialogDescription>
              Voulez-vous configurer la transition des budgets vers le nouveau mois ? 
              Cela vous permettra de définir comment chaque budget doit être géré pour le mois suivant.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleTransitionCancel}>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleTransitionConfirm}>
              Configurer la transition
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Dashboard;
