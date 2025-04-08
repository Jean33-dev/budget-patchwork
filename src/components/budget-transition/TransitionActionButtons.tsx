
import React from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress"; 

interface TransitionActionButtonsProps {
  onCancel: () => void;
  onConfirm: () => void;
  isProcessing: boolean;
  progress?: { step: string; percentage: number } | null;
}

export const TransitionActionButtons = ({
  onCancel,
  onConfirm,
  isProcessing,
  progress
}: TransitionActionButtonsProps) => {
  return (
    <div className="space-y-4">
      {isProcessing && progress && (
        <div className="space-y-2">
          <Progress value={progress.percentage} className="h-2" />
          <p className="text-sm text-center text-muted-foreground">{progress.step} ({progress.percentage}%)</p>
        </div>
      )}
      
      <div className="flex justify-between pt-4 border-t">
        <Button 
          variant="outline" 
          onClick={onCancel}
          disabled={isProcessing}
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
    </div>
  );
};
