
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Bluetooth, Share } from "lucide-react";
import { ExpenseShareDialog } from "./ExpenseShareDialog";
import { Expense } from "@/services/database/models/expense";
import { Budget } from "@/types/categories";
import { BluetoothService } from "@/services/bluetooth/bluetooth-service";
import { useToast } from "@/components/ui/use-toast";

interface ExpenseShareButtonProps {
  expenses: Expense[];
  budgets: Budget[];
}

export function ExpenseShareButton({ expenses, budgets }: ExpenseShareButtonProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const { toast } = useToast();
  
  // Créer un mapping des IDs de budget à leurs noms pour l'affichage
  const budgetNames = budgets.reduce((acc, budget) => {
    acc[budget.id] = budget.title;
    return acc;
  }, {} as Record<string, string>);
  
  const handleOpenShareDialog = async () => {
    try {
      setIsChecking(true);
      
      // Vérifier la disponibilité du Bluetooth avant d'ouvrir le dialogue
      const isAvailable = await BluetoothService.isBluetoothAvailable();
      
      if (!isAvailable) {
        toast({
          variant: "destructive",
          title: "Bluetooth non disponible",
          description: "Le Bluetooth n'est pas disponible ou activé sur cet appareil. Veuillez activer le Bluetooth et réessayer."
        });
        return;
      }
      
      // Ouvrir le dialogue si le Bluetooth est disponible
      setDialogOpen(true);
    } catch (error) {
      console.error("Erreur lors de la vérification du Bluetooth:", error);
      toast({
        variant: "destructive",
        title: "Erreur Bluetooth",
        description: "Impossible de vérifier la disponibilité du Bluetooth. Veuillez réessayer."
      });
    } finally {
      setIsChecking(false);
    }
  };
  
  return (
    <>
      <Button 
        variant="outline" 
        size="sm" 
        className="gap-2" 
        onClick={handleOpenShareDialog}
        disabled={isChecking}
      >
        {isChecking ? (
          <span>Vérification du Bluetooth...</span>
        ) : (
          <>
            <Bluetooth className="h-4 w-4" />
            <span>Partager via Bluetooth</span>
          </>
        )}
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
