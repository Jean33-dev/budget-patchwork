
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
import { db } from "@/services/database";
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

const Budgets = () => {
  const navigate = useNavigate();
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState<Budget | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editBudget, setEditBudget] = useState(0);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [totalRevenues, setTotalRevenues] = useState(0);

  useEffect(() => {
    const loadData = async () => {
      try {
        console.log("Chargement des budgets et revenus...");
        const budgetsData = await db.getBudgets();
        console.log("Budgets chargés:", budgetsData);
        setBudgets(budgetsData);

        // Charger les revenus depuis la base de données
        const incomesData = await db.getIncomes();
        console.log("Revenus chargés:", incomesData);
        const totalIncome = incomesData.reduce((sum, income) => sum + income.budget, 0);
        console.log("Total des revenus:", totalIncome);
        setTotalRevenues(totalIncome);
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de charger les données"
        });
      }
    };
    
    loadData();
  }, []);

  // Calculer le total des budgets alloués
  const totalBudgets = budgets.reduce((sum, budget) => sum + (budget.budget || 0), 0);
  console.log("Total des budgets:", totalBudgets);
  console.log("Total des revenus:", totalRevenues);
  
  // Calculer le montant restant
  const remainingAmount = totalRevenues - totalBudgets;
  console.log("Montant restant:", remainingAmount);

  const handleEnvelopeClick = (envelope: Budget) => {
    setSelectedBudget(envelope);
    setEditTitle(envelope.title);
    setEditBudget(envelope.budget);
    setEditDialogOpen(true);
  };

  const handleEditSubmit = async () => {
    if (!selectedBudget) return;

    try {
      const updatedBudget = {
        ...selectedBudget,
        title: editTitle,
        budget: editBudget
      };

      await db.updateBudget(updatedBudget);

      const updatedBudgets = budgets.map(budget => {
        if (budget.id === selectedBudget.id) {
          return updatedBudget;
        }
        return budget;
      });

      setBudgets(updatedBudgets);
      setEditDialogOpen(false);
      
      toast({
        title: "Budget modifié",
        description: `Le budget "${editTitle}" a été mis à jour.`
      });
    } catch (error) {
      console.error("Erreur lors de la modification du budget:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de modifier le budget"
      });
    }
  };

  const handleViewExpenses = (envelope: Budget) => {
    navigate(`/dashboard/budget/expenses?budgetId=${envelope.id}`);
  };

  const handleDeleteBudget = async (budget: Budget) => {
    try {
      // Vérifie si le budget a des dépenses associées
      const expenses = await db.getExpenses();
      const hasLinkedExpenses = expenses.some(expense => expense.linkedBudgetId === budget.id);
      
      if (hasLinkedExpenses) {
        toast({
          variant: "destructive",
          title: "Suppression impossible",
          description: "Ce budget a des dépenses qui lui sont affectées."
        });
        return;
      }

      await db.deleteBudget(budget.id);
      
      setBudgets(budgets.filter(b => b.id !== budget.id));
      
      toast({
        title: "Budget supprimé",
        description: `Le budget "${budget.title}" a été supprimé.`
      });
    } catch (error) {
      console.error("Erreur lors de la suppression du budget:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer le budget"
      });
    }
  };

  const handleAddEnvelope = async (envelope: { 
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

    try {
      const newBudget: Budget = {
        id: Date.now().toString(),
        title: envelope.title,
        budget: envelope.budget,
        spent: 0,
        type: "budget"
      };

      await db.addBudget(newBudget);
      setBudgets([...budgets, newBudget]);
      setAddDialogOpen(false);
      
      toast({
        title: "Budget ajouté",
        description: `Le budget "${envelope.title}" a été créé avec succès.`
      });
    } catch (error) {
      console.error("Erreur lors de l'ajout du budget:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'ajouter le budget"
      });
    }
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
        onDeleteClick={handleDeleteBudget}
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
