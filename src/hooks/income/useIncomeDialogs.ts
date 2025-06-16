
import { useState } from "react";
import { Income } from "@/services/database/models/income";

export const useIncomeDialogs = () => {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedIncome, setSelectedIncome] = useState<{
    id: string;
    title: string;
    budget: number;
    type: "income";
    date: string;
    isRecurring?: boolean;
  } | null>(null);

  const handleIncomeClick = (envelope: Income) => {
    setSelectedIncome({
      id: envelope.id,
      title: envelope.title,
      budget: envelope.budget,
      type: envelope.type,
      date: envelope.date,
      isRecurring: envelope.isRecurring
    });
    setEditDialogOpen(true);
  };

  return {
    editDialogOpen,
    setEditDialogOpen,
    selectedIncome,
    setSelectedIncome,
    handleIncomeClick
  };
};
