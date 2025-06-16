
import { useState } from "react";
import { Income } from "@/services/database/models/income";

export const useRecurringIncomeDialogs = () => {
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedIncome, setSelectedIncome] = useState<{
    id: string;
    title: string;
    budget: number;
    type: "income";
    date: string;
    isRecurring?: boolean;
  } | null>(null);

  const handleIncomeClick = (income: Income) => {
    setSelectedIncome({
      id: income.id,
      title: income.title,
      budget: income.budget,
      type: income.type,
      date: income.date,
      isRecurring: income.isRecurring
    });
    setEditDialogOpen(true);
  };

  return {
    addDialogOpen,
    setAddDialogOpen,
    editDialogOpen,
    setEditDialogOpen,
    selectedIncome,
    setSelectedIncome,
    handleIncomeClick
  };
};
