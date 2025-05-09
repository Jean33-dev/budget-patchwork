
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Bluetooth, Share, Download } from "lucide-react";
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
      
      console.log("Tentative de vérification Bluetooth avant ouverture du dialogue");
      // Détection allégée du Bluetooth - considérer comme disponible par défaut sur mobile
      const isAvailable = await BluetoothService.isBluetoothAvailable();
      console.log("Résultat de la vérification Bluetooth:", isAvailable);
      
      if (!isAvailable) {
        toast({
          variant: "destructive",
          title: "Partage non disponible",
          description: "Aucune méthode de partage n'est disponible sur cet appareil."
        });
        return;
      }
      
      // Ouvrir le dialogue de partage
      setDialogOpen(true);
    } catch (error) {
      console.error("Erreur lors de la vérification du partage:", error);
      toast({
        variant: "destructive",
        title: "Erreur de vérification",
        description: "Une erreur est survenue lors de la vérification des capacités de partage."
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
          <span>Vérification en cours...</span>
        ) : (
          <>
            <Share className="h-4 w-4" />
            <span>Partager les dépenses</span>
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
