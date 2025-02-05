import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardOverview } from "@/components/dashboard/DashboardOverview";
import { BudgetStats } from "@/components/dashboard/BudgetStats";

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
          { id: "3", title: "Loyer", budget: 1500, spent: 1500, type: "expense" },
          { id: "4", title: "Courses", budget: 600, spent: 450, type: "expense" },
          { id: "5", title: "Loisirs", budget: 200, spent: 180, type: "expense" },
          { id: "6", title: "Budget Logement", budget: 2000, spent: 1500, type: "budget" },
          { id: "7", title: "Budget Alimentation", budget: 800, spent: 600, type: "budget" },
        ],
        remainingBudget: previousRemainingBudget
      }]);
    }
  }, [currentDate, monthlyBudgets]);

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
        onMonthChange={setCurrentDate}
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
    </div>
  );
};

export default Dashboard;