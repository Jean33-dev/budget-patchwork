
import { useState } from "react";
import { toast } from "sonner";
import { TransitionEnvelope } from "@/types/transition";
import { useCategories } from "../useCategories";

/**
 * Hook to manage the transition process execution
 */
export const useTransitionProcess = (
  envelopes: any[],
  onComplete: () => void
) => {
  const { handleMonthTransition } = useCategories();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState<{ step: string; percentage: number } | null>(null);

  const handleTransitionConfirm = async () => {
    setIsProcessing(true);
    setProgress({ step: "Démarrage", percentage: 5 });
    
    try {
      // Verify all transfer options have a target
      const missingTargets = envelopes.filter(
        env => env.transitionOption === "transfer" && !env.transferTargetId
      );
      
      if (missingTargets.length > 0) {
        toast.error("Certains transferts n'ont pas de budget cible");
        setIsProcessing(false);
        setProgress(null);
        return;
      }
      
      // Verify all multi-transfer options have at least one target
      const missingMultiTargets = envelopes.filter(
        env => env.transitionOption === "multi-transfer" && (!env.multiTransfers || env.multiTransfers.length === 0)
      );
      
      if (missingMultiTargets.length > 0) {
        toast.error("Certains transferts multiples n'ont pas de cibles");
        setIsProcessing(false);
        setProgress(null);
        return;
      }
      
      // Convert budget envelopes to transition envelopes format expected by the hook
      const transitionData = envelopes.map(env => ({
        id: env.id,
        title: env.title,
        transitionOption: env.transitionOption,
        partialAmount: env.partialAmount,
        transferTargetId: env.transferTargetId,
        multiTransfers: env.multiTransfers?.map(t => ({
          targetId: t.targetId,
          amount: t.amount
        }))
      }));
      
      console.log('Sending transition data:', transitionData);
      
      const success = await handleMonthTransition(transitionData);
      
      if (success) {
        setProgress({ step: "Terminé", percentage: 100 });
        toast.success("Transition effectuée avec succès");
        setTimeout(() => {
          onComplete();
        }, 1000);
      } else {
        toast.error("Échec de la transition");
        setProgress(null);
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
    progress,
    handleTransitionConfirm
  };
};
