
import { useState } from "react";
import { DashboardOverview } from "@/components/dashboard/DashboardOverview";
import { EnvelopeList } from "@/components/budget/EnvelopeList";
import { AddEnvelopeDialog } from "@/components/budget/AddEnvelopeDialog";
import { useToast } from "@/components/ui/use-toast";
import { useTheme } from "@/context/ThemeContext";

interface Envelope {
  id: string;
  title: string;
  budget: number;
  spent: number;
  type: "income" | "expense";
  category?: string;
  date: string;
}

const Index = () => {
  const { toast } = useToast();
  const { t, currencySymbol } = useTheme();
  const [envelopes, setEnvelopes] = useState<Envelope[]>([
    { 
      id: "1", 
      title: t("index.salary"),
      budget: 5000, 
      spent: 5000, 
      type: "income",
      date: new Date().toISOString().split('T')[0]
    },
    { 
      id: "2", 
      title: t("index.freelance"),
      budget: 1000, 
      spent: 800, 
      type: "income",
      date: new Date().toISOString().split('T')[0]
    },
    { 
      id: "3", 
      title: t("index.rent"),
      budget: 1500, 
      spent: 1500, 
      type: "expense", 
      category: t("index.housing"),
      date: new Date().toISOString().split('T')[0]
    },
    { 
      id: "4", 
      title: t("index.groceries"),
      budget: 600, 
      spent: 450, 
      type: "expense", 
      category: t("index.food"),
      date: new Date().toISOString().split('T')[0]
    },
    { 
      id: "5", 
      title: t("index.leisure"),
      budget: 200, 
      spent: 180, 
      type: "expense", 
      category: t("index.leisure"),
      date: new Date().toISOString().split('T')[0]
    },
  ]);

  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [activeType, setActiveType] = useState<"income" | "expense">("income");

  const totalIncome = envelopes
    .filter((env) => env.type === "income")
    .reduce((sum, env) => sum + env.budget, 0);

  const totalExpenses = envelopes
    .filter((env) => env.type === "expense")
    .reduce((sum, env) => sum + env.spent, 0);

  const handleAddEnvelope = (newEnvelope: { 
    title: string; 
    budget: number; 
    type: "income" | "expense" | "budget";
    linkedBudgetId?: string;
    date: string;
  }) => {
    const envelope: Envelope = {
      id: Date.now().toString(),
      title: newEnvelope.title,
      budget: newEnvelope.budget,
      spent: newEnvelope.type === "income" ? newEnvelope.budget : 0,
      type: newEnvelope.type as "income" | "expense",
      date: newEnvelope.date
    };
    
    setEnvelopes([...envelopes, envelope]);
    toast({
      title: t("index.success"),
      description: newEnvelope.type === "income"
        ? t("index.toast.income")
        : t("index.toast.expense"),
    });
  };

  const handleEnvelopeClick = (envelope: Envelope) => {
    toast({
      title: envelope.title,
      description: `${t("index.budget")}: ${envelope.budget.toFixed(2)} ${currencySymbol}, ${t("index.spent")}: ${envelope.spent.toFixed(2)} ${currencySymbol}${envelope.category ? `, ${t("index.category")}: ${envelope.category}` : ""}`,
    });
  };

  const handleAddClick = (type: "income" | "expense") => {
    setActiveType(type);
    setAddDialogOpen(true);
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <h1 className="text-4xl font-bold">{t("index.title")}</h1>
      
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
