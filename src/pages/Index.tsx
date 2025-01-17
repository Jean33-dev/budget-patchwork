import { useState } from "react";
import { DashboardOverview } from "@/components/dashboard/DashboardOverview";
import { EnvelopeList } from "@/components/budget/EnvelopeList";
import { AddEnvelopeDialog } from "@/components/budget/AddEnvelopeDialog";
import { useToast } from "@/components/ui/use-toast";

interface Envelope {
  id: string;
  title: string;
  budget: number;
  spent: number;
  type: "income" | "expense";
}

const Index = () => {
  const { toast } = useToast();
  const [envelopes, setEnvelopes] = useState<Envelope[]>([
    { id: "1", title: "Salary", budget: 5000, spent: 5000, type: "income" },
    { id: "2", title: "Freelance", budget: 1000, spent: 800, type: "income" },
    { id: "3", title: "Rent", budget: 1500, spent: 1500, type: "expense" },
    { id: "4", title: "Groceries", budget: 600, spent: 450, type: "expense" },
    { id: "5", title: "Entertainment", budget: 200, spent: 180, type: "expense" },
  ]);

  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [activeType, setActiveType] = useState<"income" | "expense">("income");

  const totalIncome = envelopes
    .filter((env) => env.type === "income")
    .reduce((sum, env) => sum + env.budget, 0);

  const totalExpenses = envelopes
    .filter((env) => env.type === "expense")
    .reduce((sum, env) => sum + env.spent, 0);

  const handleAddEnvelope = (newEnvelope: { title: string; budget: number; type: "income" | "expense" }) => {
    const envelope: Envelope = {
      id: Date.now().toString(),
      ...newEnvelope,
      spent: newEnvelope.type === "income" ? newEnvelope.budget : 0,
    };
    
    setEnvelopes([...envelopes, envelope]);
    toast({
      title: "Success",
      description: `New ${newEnvelope.type} envelope created`,
    });
  };

  const handleEnvelopeClick = (envelope: Envelope) => {
    toast({
      title: envelope.title,
      description: `Budget: $${envelope.budget.toFixed(2)}, Spent: $${envelope.spent.toFixed(2)}`,
    });
  };

  const handleAddClick = (type: "income" | "expense") => {
    setActiveType(type);
    setAddDialogOpen(true);
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <h1 className="text-4xl font-bold">Budget Dashboard</h1>
      
      <DashboardOverview
        totalIncome={totalIncome}
        totalExpenses={totalExpenses}
        envelopes={envelopes}
      />
      
      <div className="space-y-8">
        <EnvelopeList
          envelopes={envelopes}
          type="income"
          onAddClick={() => handleAddClick("income")}
          onEnvelopeClick={handleEnvelopeClick}
        />
        
        <EnvelopeList
          envelopes={envelopes}
          type="expense"
          onAddClick={() => handleAddClick("expense")}
          onEnvelopeClick={handleEnvelopeClick}
        />
      </div>

      <AddEnvelopeDialog
        type={activeType}
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onAdd={handleAddEnvelope}
      />
    </div>
  );
};

export default Index;