
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useCategories } from "@/hooks/useCategories";
import { useBudgets } from "@/hooks/useBudgets";
import { TransitionOption, BudgetEnvelope } from "@/types/transition";
import { TransitionEnvelopeCard } from "@/components/budget-transition/TransitionEnvelopeCard";
import { PartialAmountDialog } from "@/components/budget-transition/PartialAmountDialog";
import { TransferDialog } from "@/components/budget-transition/TransferDialog";
import { toast } from "sonner";

const BudgetTransition = () => {
  const navigate = useNavigate();
  const { budgets } = useBudgets();
  const { handleMonthTransition, getTransitionPreferences } = useCategories();
  
  const [envelopes, setEnvelopes] = useState<BudgetEnvelope[]>([]);
  const [selectedEnvelope, setSelectedEnvelope] = useState<BudgetEnvelope | null>(null);
  const [showPartialDialog, setShowPartialDialog] = useState(false);
  const [showTransferDialog, setShowTransferDialog] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    // Map budgets to envelopes format
    const initialEnvelopes: BudgetEnvelope[] = budgets.map(budget => {
      const remaining = budget.budget + (budget.carriedOver || 0) - budget.spent;
      
      return {
        id: budget.id,
        title: budget.title,
        budget: budget.budget,
        spent: budget.spent,
        remaining: remaining,
        transitionOption: "reset" // Default option
      };
    });

    // Load saved preferences if available
    const savedPreferences = getTransitionPreferences();
    if (savedPreferences) {
      // Apply saved preferences to the envelopes
      setEnvelopes(
        initialEnvelopes.map(env => {
          const savedPref = savedPreferences.find(pref => pref.id === env.id);
          if (savedPref) {
            return {
              ...env,
              transitionOption: savedPref.transitionOption as TransitionOption,
              transferTargetId: savedPref.transferTargetId
            };
          }
          return env;
        })
      );
    } else {
      setEnvelopes(initialEnvelopes);
    }
  }, [budgets, getTransitionPreferences]);

  const handleOptionChange = (envelopeId: string, option: TransitionOption) => {
    setEnvelopes(prev => 
      prev.map(env => {
        if (env.id === envelopeId) {
          const updatedEnv = { ...env, transitionOption: option };
          if (option !== "partial") delete updatedEnv.partialAmount;
          if (option !== "transfer") delete updatedEnv.transferTargetId;
          return updatedEnv;
        }
        return env;
      })
    );

    const envelope = envelopes.find(env => env.id === envelopeId);
    if (envelope) {
      setSelectedEnvelope(envelope);
      if (option === "partial") {
        setShowPartialDialog(true);
      } else if (option === "transfer") {
        setShowTransferDialog(true);
      }
    }
  };

  const handlePartialAmountChange = (amount: number) => {
    if (!selectedEnvelope) return;
    
    setEnvelopes(prev =>
      prev.map(env =>
        env.id === selectedEnvelope.id
          ? { ...env, partialAmount: amount }
          : env
      )
    );
  };

  const handleTransferTargetChange = (targetId: string) => {
    if (!selectedEnvelope) return;
    
    const targetEnvelope = envelopes.find(env => env.id === targetId);
    if (!targetEnvelope) return;

    setEnvelopes(prev =>
      prev.map(env =>
        env.id === selectedEnvelope.id
          ? { 
              ...env, 
              transferTargetId: targetId,
              transferTargetTitle: targetEnvelope.title
            }
          : env
      )
    );
  };

  const handleTransitionConfirm = async () => {
    setIsProcessing(true);
    
    try {
      // Convert budget envelopes to transition envelopes format expected by the hook
      const transitionData = envelopes.map(env => ({
        id: env.id,
        title: env.title,
        transitionOption: env.transitionOption,
        partialAmount: env.partialAmount,
        transferTargetId: env.transferTargetId
      }));
      
      const success = await handleMonthTransition(transitionData);
      
      if (success) {
        toast.success("Transition effectuée avec succès");
        navigate("/dashboard/budget");
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

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center gap-4 pb-4 border-b">
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigate("/dashboard/budget")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-xl font-semibold">Transition de mois</h1>
      </div>

      <div className="space-y-6">
        <div className="bg-muted/40 p-4 rounded-lg">
          <h2 className="font-medium mb-2">Comment gérer vos budgets pour le mois prochain</h2>
          <p className="text-sm text-muted-foreground">
            Pour chaque budget, choisissez comment il doit être traité pour le mois prochain :
          </p>
          <ul className="text-sm text-muted-foreground list-disc list-inside mt-2 space-y-1">
            <li><strong>Réinitialiser</strong> : Remet le budget à son montant initial, sans report</li>
            <li><strong>Reporter intégralement</strong> : Conserve le montant restant comme report pour le mois suivant</li>
            <li><strong>Reporter partiellement</strong> : Définissez un montant spécifique à reporter</li>
            <li><strong>Transférer</strong> : Déplace le montant restant vers un autre budget</li>
          </ul>
        </div>

        <div className="grid gap-4">
          {envelopes.map(envelope => (
            <TransitionEnvelopeCard
              key={envelope.id}
              envelope={envelope}
              otherEnvelopes={envelopes.filter(e => e.id !== envelope.id)}
              onOptionChange={handleOptionChange}
            />
          ))}
        </div>

        <div className="flex justify-between pt-4 border-t">
          <Button 
            variant="outline" 
            onClick={() => navigate("/dashboard/budget")}
          >
            Annuler
          </Button>
          <Button 
            onClick={handleTransitionConfirm}
            disabled={isProcessing}
          >
            {isProcessing ? "Traitement en cours..." : "Confirmer la transition"}
          </Button>
        </div>
      </div>

      {selectedEnvelope && (
        <>
          <PartialAmountDialog
            open={showPartialDialog}
            onOpenChange={setShowPartialDialog}
            envelope={selectedEnvelope}
            onAmountChange={handlePartialAmountChange}
          />

          <TransferDialog
            open={showTransferDialog}
            onOpenChange={setShowTransferDialog}
            envelope={selectedEnvelope}
            targetEnvelopes={envelopes.filter(e => e.id !== selectedEnvelope.id)}
            onTargetChange={handleTransferTargetChange}
          />
        </>
      )}
    </div>
  );
};

export default BudgetTransition;
