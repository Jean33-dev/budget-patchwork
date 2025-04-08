
import React from "react";
import { Button } from "@/components/ui/button";

interface TransitionActionButtonsProps {
  onCancel: () => void;
  onConfirm: () => void;
  isProcessing: boolean;
}

export const TransitionActionButtons = ({
  onCancel,
  onConfirm,
  isProcessing
}: TransitionActionButtonsProps) => {
  return (
    <div className="flex justify-between pt-4 border-t">
      <Button 
        variant="outline" 
        onClick={onCancel}
      >
        Annuler
      </Button>
      <Button 
        onClick={onConfirm}
        disabled={isProcessing}
      >
        {isProcessing ? "Traitement en cours..." : "Confirmer la transition"}
      </Button>
    </div>
  );
};
