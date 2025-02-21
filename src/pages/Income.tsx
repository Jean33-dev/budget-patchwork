
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { EnvelopeList } from "@/components/budget/EnvelopeList";
import { AddEnvelopeDialog } from "@/components/budget/AddEnvelopeDialog";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Menu } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EnvelopeForm } from "@/components/budget/EnvelopeForm";
import { db, Income as IncomeType } from "@/services/database";

const defaultIncomes = [
  { id: "1", title: "Salaire", budget: 5000, spent: 5000, type: "income" as const },
  { id: "2", title: "Freelance", budget: 1000, spent: 800, type: "income" as const },
];

const Income = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedIncome, setSelectedIncome] = useState<{
    id: string;
    title: string;
    budget: number;
    type: "income";
  } | null>(null);
  const [envelopes, setEnvelopes] = useState<IncomeType[]>([]);

  // Initialiser la base de données et charger les revenus
  useEffect(() => {
    const initializeData = async () => {
      await db.init();
      const incomes = await db.getIncomes();
      if (incomes.length === 0) {
        // Si pas de revenus, ajouter les revenus par défaut
        for (const income of defaultIncomes) {
          await db.addIncome(income);
        }
        setEnvelopes(defaultIncomes);
      } else {
        setEnvelopes(incomes);
      }
    };
    
    initializeData();
  }, []);

  const handleAddIncome = async (newIncome: { title: string; budget: number; type: "income" }) => {
    const income = {
      id: Date.now().toString(),
      ...newIncome,
      spent: newIncome.budget,
    };
    
    await db.addIncome(income);
    setEnvelopes(prev => [...prev, income]);
    
    toast({
      title: "Succès",
      description: "Nouveau revenu ajouté",
    });
  };

  const handleEditIncome = async (editedIncome: { title: string; budget: number; type: "income" }) => {
    if (!selectedIncome) return;

    const updatedIncome = {
      ...selectedIncome,
      title: editedIncome.title,
      budget: editedIncome.budget,
      spent: editedIncome.budget,
    };

    await db.updateIncome(updatedIncome);
    setEnvelopes(prev => prev.map(env => 
      env.id === selectedIncome.id 
        ? updatedIncome
        : env
    ));

    setEditDialogOpen(false);
    setSelectedIncome(null);
    
    toast({
      title: "Succès",
      description: "Revenu modifié",
    });
  };

  const handleDeleteIncome = async (incomeId: string) => {
    await db.deleteIncome(incomeId);
    setEnvelopes(prev => prev.filter(env => env.id !== incomeId));
    
    toast({
      title: "Succès",
      description: "Revenu supprimé",
    });
  };

  const handleIncomeClick = (envelope: IncomeType) => {
    setSelectedIncome({
      id: envelope.id,
      title: envelope.title,
      budget: envelope.budget,
      type: envelope.type,
    });
    setEditDialogOpen(true);
  };

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center gap-4 sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10 pb-4 border-b">
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigate("/dashboard/budget")}
        >
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

        <h1 className="text-xl">Gestion des Revenus</h1>
      </div>

      <EnvelopeList
        envelopes={envelopes}
        type="income"
        onAddClick={() => setAddDialogOpen(true)}
        onEnvelopeClick={handleIncomeClick}
        onDeleteEnvelope={handleDeleteIncome}
      />

      <AddEnvelopeDialog
        type="income"
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onAdd={handleAddIncome}
      />

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier le revenu</DialogTitle>
          </DialogHeader>
          {selectedIncome && (
            <EnvelopeForm
              type="income"
              title={selectedIncome.title}
              setTitle={(title) => setSelectedIncome(prev => prev ? { ...prev, title } : null)}
              budget={selectedIncome.budget}
              setBudget={(budget) => setSelectedIncome(prev => prev ? { ...prev, budget } : null)}
              linkedBudgetId=""
              setLinkedBudgetId={() => {}}
              date=""
              setDate={() => {}}
              onSubmit={(e) => {
                e.preventDefault();
                if (selectedIncome) {
                  handleEditIncome(selectedIncome);
                }
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Income;
