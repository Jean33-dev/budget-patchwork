import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { EnvelopeList } from "@/components/budget/EnvelopeList";
import { AddEnvelopeDialog } from "@/components/budget/AddEnvelopeDialog";
import { useState } from "react";

const Expenses = () => {
  const navigate = useNavigate();
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  // Temporary mock data - you should replace this with your actual data management
  const expenses = [
    { id: "1", title: "Loyer", budget: 1500, spent: 1500, type: "expense" as const },
    { id: "2", title: "Courses", budget: 600, spent: 450, type: "expense" as const },
  ];

  // Temporary mock data for available budgets
  const availableBudgets = [
    { id: "1", title: "Budget Logement" },
    { id: "2", title: "Budget Alimentation" },
  ];

  const handleEnvelopeClick = (envelope: any) => {
    console.log("Clicked envelope:", envelope);
  };

  const handleAddEnvelope = (envelope: any) => {
    console.log("New envelope:", envelope);
    setAddDialogOpen(false);
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => navigate("/dashboard/budget")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">Gestion des Dépenses</h1>
      </div>

      <EnvelopeList
        envelopes={expenses}
        type="expense"
        onAddClick={() => setAddDialogOpen(true)}
        onEnvelopeClick={handleEnvelopeClick}
      />

      <AddEnvelopeDialog
        type="expense"
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onAdd={handleAddEnvelope}
        availableBudgets={availableBudgets}
      />
    </div>
  );
};

export default Expenses;