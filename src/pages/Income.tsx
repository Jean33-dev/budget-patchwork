import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { EnvelopeList } from "@/components/budget/EnvelopeList";
import { AddEnvelopeDialog } from "@/components/budget/AddEnvelopeDialog";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";

const Income = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [envelopes, setEnvelopes] = useState([
    { id: "1", title: "Salaire", budget: 5000, spent: 5000, type: "income" as const },
    { id: "2", title: "Freelance", budget: 1000, spent: 800, type: "income" as const },
  ]);

  const handleAddIncome = (newIncome: { title: string; budget: number; type: "income" }) => {
    const income = {
      id: Date.now().toString(),
      ...newIncome,
      spent: newIncome.budget, // Pour les revenus, on considère qu'ils sont déjà "dépensés"
    };
    
    setEnvelopes(prev => [...prev, income]);
    
    toast({
      title: "Succès",
      description: "Nouveau revenu ajouté",
    });
  };

  const handleIncomeClick = (envelope: {
    id: string;
    title: string;
    budget: number;
    spent: number;
    type: "income";
  }) => {
    toast({
      title: envelope.title,
      description: `Montant: ${envelope.budget.toFixed(2)} €`,
    });
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigate("/dashboard/budget")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold">Gestion des Revenus</h1>
      </div>

      <EnvelopeList
        envelopes={envelopes}
        type="income"
        onAddClick={() => setAddDialogOpen(true)}
        onEnvelopeClick={handleIncomeClick}
      />

      <AddEnvelopeDialog
        type="income"
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onAdd={handleAddIncome}
      />
    </div>
  );
};

export default Income;