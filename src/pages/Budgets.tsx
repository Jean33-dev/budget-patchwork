import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Menu } from "lucide-react";
import { EnvelopeList } from "@/components/budget/EnvelopeList";
import { AddEnvelopeDialog } from "@/components/budget/AddEnvelopeDialog";
import { useState } from "react";
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

const Budgets = () => {
  const navigate = useNavigate();
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState<any>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editBudget, setEditBudget] = useState(0);

  // Temporary mock data - you should replace this with your actual data management
  const [budgets, setBudgets] = useState([
    { id: "1", title: "Budget Logement", budget: 2000, spent: 1500, type: "budget" as const },
    { id: "2", title: "Budget Alimentation", budget: 800, spent: 600, type: "budget" as const },
  ]);

  // Mock revenus data (à remplacer par vos données réelles)
  const totalRevenues = 2500; // Example: 2500€ de revenus

  // Calcul du montant total des budgets
  const totalBudgets = budgets.reduce((sum, budget) => sum + budget.budget, 0);

  // Calcul du montant restant à répartir
  const remainingAmount = totalRevenues - totalBudgets;

  const handleEnvelopeClick = (envelope: any) => {
    setSelectedBudget(envelope);
    setEditTitle(envelope.title);
    setEditBudget(envelope.budget);
    setEditDialogOpen(true);
  };

  const handleEditSubmit = () => {
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

  const handleViewExpenses = (envelope: any) => {
    navigate(`/dashboard/budget/expenses?budgetId=${envelope.id}`);
  };

  const handleAddEnvelope = (envelope: any) => {
    console.log("New envelope:", envelope);
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
