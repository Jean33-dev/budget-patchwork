
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Menu } from "lucide-react";
import { EnvelopeList } from "@/components/budget/EnvelopeList";
import { AddEnvelopeDialog } from "@/components/budget/AddEnvelopeDialog";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Expenses = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const budgetId = searchParams.get('budgetId');
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  // Temporary mock data - you should replace this with your actual data management
  const expenses = [
    { 
      id: "1", 
      title: "Loyer", 
      budget: 1500, 
      spent: 1500, 
      type: "expense" as const,
      linkedBudgetId: "1",
      date: "2024-04-01"
    },
    { 
      id: "2", 
      title: "Courses", 
      budget: 600, 
      spent: 450, 
      type: "expense" as const,
      linkedBudgetId: "2",
      date: "2024-04-05"
    },
  ];

  // Temporary mock data for available budgets
  const availableBudgets = [
    { id: "1", title: "Budget Logement" },
    { id: "2", title: "Budget Alimentation" },
  ];

  // Filtrer les dépenses si un budgetId est spécifié
  const filteredExpenses = budgetId 
    ? expenses.filter(expense => expense.linkedBudgetId === budgetId)
    : expenses;

  // Trouver le titre du budget actuel
  const currentBudget = budgetId 
    ? availableBudgets.find(budget => budget.id === budgetId)?.title 
    : null;

  const handleEnvelopeClick = (envelope: any) => {
    console.log("Clicked envelope:", envelope);
  };

  const handleAddEnvelope = (envelope: any) => {
    console.log("New envelope:", envelope);
    setAddDialogOpen(false);
  };

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center gap-4 sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10 pb-4 border-b">
        <Button variant="outline" size="icon" onClick={() => navigate("/dashboard/budget/budgets")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <Menu className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem onClick={() => navigate("/dashboard/budget")}>
              Tableau de Bord
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/dashboard/budget/income")}>
              Gérer les Revenus
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/dashboard/budget/categories")}>
              Gérer les Catégories
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/dashboard/budget/budgets")}>
              Gérer les Budgets
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/dashboard/budget/expenses")}>
              Gérer les Dépenses
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <h1 className="text-xl font-semibold">
          {currentBudget 
            ? `Dépenses - ${currentBudget}`
            : "Toutes les Dépenses"
          }
        </h1>
      </div>

      <div className="mt-6">
        <EnvelopeList
          envelopes={filteredExpenses}
          type="expense"
          onAddClick={() => setAddDialogOpen(true)}
          onEnvelopeClick={handleEnvelopeClick}
          availableBudgets={availableBudgets}
        />
      </div>

      <AddEnvelopeDialog
        type="expense"
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onAdd={handleAddEnvelope}
        availableBudgets={availableBudgets}
        defaultBudgetId={budgetId || undefined}
      />
    </div>
  );
};

export default Expenses;
