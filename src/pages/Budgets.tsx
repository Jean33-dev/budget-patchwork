import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { EnvelopeList } from "@/components/budget/EnvelopeList";
import { AddEnvelopeDialog } from "@/components/budget/AddEnvelopeDialog";
import { useState } from "react";

const Budgets = () => {
  const navigate = useNavigate();
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  // Temporary mock data - you should replace this with your actual data management
  const budgets = [
    { id: "1", title: "Budget Logement", budget: 2000, spent: 1500, type: "budget" as const },
    { id: "2", title: "Budget Alimentation", budget: 800, spent: 600, type: "budget" as const },
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
        <h1 className="text-2xl font-bold">Gestion des Budgets</h1>
      </div>

      <EnvelopeList
        envelopes={budgets}
        type="budget"
        onAddClick={() => setAddDialogOpen(true)}
        onEnvelopeClick={handleEnvelopeClick}
      />

      <AddEnvelopeDialog
        type="budget"
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onAdd={handleAddEnvelope}
      />
    </div>
  );
};

export default Budgets;