
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Bluetooth } from "lucide-react";
import { ExpenseShareDialog } from "./ExpenseShareDialog";
import { Expense } from "@/services/database/models/expense";
import { Budget } from "@/types/categories";

interface ExpenseShareButtonProps {
  expenses: Expense[];
  budgets: Budget[];
}

export function ExpenseShareButton({ expenses, budgets }: ExpenseShareButtonProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  
  // Créer un mapping des IDs de budget à leurs noms pour l'affichage
  const budgetNames = budgets.reduce((acc, budget) => {
    acc[budget.id] = budget.title;
    return acc;
  }, {} as Record<string, string>);
  
  return (
    <>
      <Button 
        variant="outline" 
        size="sm" 
        className="gap-2" 
        onClick={() => setDialogOpen(true)}
      >
        <Bluetooth className="h-4 w-4" />
        <span>Partager via Bluetooth</span>
      </Button>
      
      <ExpenseShareDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        expenses={expenses}
        budgetNames={budgetNames}
      />
    </>
  );
}
