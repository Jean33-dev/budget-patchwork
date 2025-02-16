import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Menu } from "lucide-react";
import { EnvelopeList } from "@/components/budget/EnvelopeList";
import { AddEnvelopeDialog } from "@/components/budget/AddEnvelopeDialog";
import { useState, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { MoneyInput } from "@/components/shared/MoneyInput";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Budget = {
  id: string;
  title: string;
  budget: number;
  spent: number;
  type: "budget";
};

const BUDGETS_STORAGE_KEY = "app_budgets";

const Budgets = () => {
  const navigate = useNavigate();
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState<Budget | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editBudget, setEditBudget] = useState(0);

  const [budgets, setBudgets] = useState<Budget[]>(() => {
    const stored = localStorage.getItem(BUDGETS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [
      { id: "1", title: "Budget Logement", budget: 2000, spent: 1500, type: "budget" },
      { id: "2", title: "Budget Alimentation", budget: 800, spent: 600, type: "budget" },
    ];
  });

  useEffect(() => {
    const budgetsForStorage = budgets.map(budget => ({
      id: budget.id,
      title: budget.title,
      amount: budget.budget,
      spent: budget.spent
    }));
    localStorage.setItem(BUDGETS_STORAGE_KEY, JSON.stringify(budgetsForStorage));
  }, [budgets]);

  const totalRevenues = 2500;
  const totalBudgets = budgets.reduce((sum, budget) => sum + budget.budget, 0);
  const remainingAmount = totalRevenues - totalBudgets;

  const handleEnvelopeClick = (envelope: Budget) => {
    setSelectedBudget(envelope);
    setEditTitle(envelope.title);
    setEditBudget(envelope.budget);
    setEditDialogOpen(true);
  };

  const handleEditSubmit = () => {
    if (!selectedBudget) return;

    const updatedBudgets = budgets.map(budget => {
      if (budget.id === selectedBudget.id) {
        return {
          ...budget,
          title: editTitle,
          budget: editBudget
        };
      }
      return budget;
    });

    setBudgets(updatedBudgets);
    setEditDialogOpen(false);
    toast({
      title: "Budget modifié",
      description: `Le budget "${editTitle}" a été mis à jour.`,
    });
  };

  const handleViewExpenses = (envelope: Budget) => {
    navigate(`/dashboard/budget/expenses?budgetId=${envelope.id}`);
  };

  const handleAddEnvelope = (envelope: { 
    title: string; 
    budget: number; 
    type: "income" | "expense" | "budget";
  }) => {
    if (envelope.type !== "budget") {
      toast({
        variant: "destructive",
        title: "Type invalide",
        description: "Seuls les budgets peuvent être ajoutés ici."
      });
      return;
    }

    const newId = (budgets.length + 1).toString();
    
    const newBudget: Budget = {
      id: newId,
      title: envelope.title,
      budget: envelope.budget,
      spent: 0,
      type: "budget"
    };

    setBudgets([...budgets, newBudget]);

    toast({
      title: "Budget ajouté",
      description: `Le budget "${envelope.title}" a été créé avec succès.`
    });

    setAddDialogOpen(false);
  };

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center gap-4 sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10 pb-4 border-b">
        <Button variant="outline" size="icon" onClick={() => navigate("/dashboard/budget")}>
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

        <h1 className="text-xl">Gestion des Budgets</h1>
      </div>

      <div className="space-y-4">
        <div className={`text-sm font-medium ${remainingAmount < 0 ? 'text-red-500' : ''}`}>
          Montant restant à répartir : {remainingAmount.toFixed(2)}€
        </div>
        {remainingAmount < 0 && (
          <Alert variant="destructive" className="py-2">
            <AlertDescription>
              Le total des budgets dépasse vos revenus. Veuillez réduire certains budgets.
            </AlertDescription>
          </Alert>
        )}
      </div>

      <EnvelopeList
        envelopes={budgets}
        type="budget"
        onAddClick={() => setAddDialogOpen(true)}
        onEnvelopeClick={handleEnvelopeClick}
        onViewExpenses={handleViewExpenses}
      />

      <AddEnvelopeDialog
        type="budget"
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onAdd={handleAddEnvelope}
      />

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier le budget</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Titre du budget</Label>
              <Input
                id="title"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder="Entrez le titre du budget"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="budget">Montant du budget</Label>
              <MoneyInput
                id="budget"
                value={editBudget}
                onChange={setEditBudget}
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleEditSubmit}>Enregistrer les modifications</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Budgets;
