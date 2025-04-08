
import React, { useEffect } from "react";
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
  // Log progress updates for debugging
  useEffect(() => {
    if (progress) {
      console.log("TransitionActionButtons received progress:", progress);
    }
  }, [progress]);

  return (
    <div className="space-y-4">
      {isProcessing && (
        <div className="space-y-2">
          <Progress value={progress?.percentage || 0} className="h-2" />
          <p className="text-sm text-center text-muted-foreground">
            {progress?.step || "Initialisation..."} ({progress?.percentage || 0}%)
          </p>
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
