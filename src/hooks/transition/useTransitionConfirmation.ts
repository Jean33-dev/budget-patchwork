
import { useState } from "react";
import { TransitionEnvelope, BudgetEnvelope } from "@/types/transition";
import { toast } from "sonner";

export const useTransitionConfirmation = (
  envelopes: BudgetEnvelope[],
  handleMonthTransition: (data: TransitionEnvelope[]) => Promise<boolean>,
  onComplete: () => void
) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [showTransferDialog, setShowTransferDialog] = useState(false);

  const handleTransitionConfirm = async () => {
    setIsProcessing(true);
    
    try {
      // Verify all transfer options have a target
      const missingTargets = envelopes.filter(
        env => env.transitionOption === "transfer" && !env.transferTargetId
      );
      
      if (missingTargets.length > 0) {
        toast.error("Certains transferts n'ont pas de budget cible");
        setIsProcessing(false);
        return;
      }
      
      // Verify all multi-transfer options have at least one target
      const missingMultiTargets = envelopes.filter(
        env => env.transitionOption === "multi-transfer" && (!env.multiTransfers || env.multiTransfers.length === 0)
      );
      
      if (missingMultiTargets.length > 0) {
        toast.error("Certains transferts multiples n'ont pas de cibles");
        setIsProcessing(false);
        return;
      }
      
      // Convert budget envelopes to transition envelopes format expected by the hook
      const transitionData = envelopes.map(env => ({
        id: env.id,
        title: env.title,
        transitionOption: env.transitionOption,
        transferTargetId: env.transferTargetId,
        multiTransfers: env.multiTransfers?.map(t => ({
          targetId: t.targetId,
          amount: t.amount
        }))
      }));
      
      console.log('Sending transition data:', transitionData);
      
      const success = await handleMonthTransition(transitionData);
      
      if (success) {
        toast.success("Transition effectuée avec succès");
        onComplete();
      } else {
        toast.error("Échec de la transition");
      }
    } catch (error) {
      console.error("Erreur lors de la transition:", error);
      toast.error("Une erreur est survenue");
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    isProcessing,
    showTransferDialog,
    setShowTransferDialog,
    handleTransitionConfirm
  };
};
