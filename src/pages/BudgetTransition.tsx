
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useCategories } from "@/hooks/useCategories";
import { useBudgets } from "@/hooks/useBudgets";
import { TransitionEnvelopeCard } from "@/components/budget-transition/TransitionEnvelopeCard";
import { PartialAmountDialog } from "@/components/budget-transition/PartialAmountDialog";
import { TransferDialog } from "@/components/budget-transition/TransferDialog";
import { BudgetEnvelope, TransitionOption } from "@/types/transition";
import { db } from "@/services/database";
import { useTransitionHandling } from "@/hooks/useTransitionHandling";

const BudgetTransition = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { categories } = useCategories();
  const { budgets, refreshData } = useBudgets();
  
  const [envelopes, setEnvelopes] = useState<BudgetEnvelope[]>([]);
  const [selectedEnvelope, setSelectedEnvelope] = useState<BudgetEnvelope | null>(null);
  const [showPartialDialog, setShowPartialDialog] = useState(false);
  const [showTransferDialog, setShowTransferDialog] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  // Retrieve the transition handling hook with the new preferences functionality
  const { handleMonthTransition, getTransitionPreferences } = useTransitionHandling(categories, () => {});

  useEffect(() => {
    const loadEnvelopes = async () => {
      try {
        // Charger tous les budgets directement depuis la base de données
        const budgetsData = await db.getBudgets();
        console.log("Budgets chargés:", budgetsData);
        
        // Récupérer les préférences sauvegardées
        const savedPreferences = getTransitionPreferences();
        console.log("Préférences de transition récupérées:", savedPreferences);
        
        // Préparer les enveloppes avec les options par défaut ou préférences sauvegardées
        const loadedEnvelopes = budgetsData.map(budget => {
          // Rechercher une préférence pour ce budget
          const savedPref = savedPreferences?.find(pref => pref.id === budget.id);
          
          // Déterminer l'option de transition: utiliser la préférence sauvegardée ou "carry" par défaut
          const transitionOption = savedPref?.transitionOption || "carry";
          
          const envelope: BudgetEnvelope = {
            id: budget.id,
            title: budget.title,
            budget: budget.budget,
            spent: budget.spent,
            remaining: budget.budget + (budget.carriedOver || 0) - budget.spent,
            transitionOption: transitionOption
          };
          
          // Si l'option est "transfer", ajouter l'ID de la cible si disponible
          if (transitionOption === "transfer" && savedPref?.transferTargetId) {
            envelope.transferTargetId = savedPref.transferTargetId;
            
            // Trouver le titre du budget cible
            const targetBudget = budgetsData.find(b => b.id === savedPref.transferTargetId);
            if (targetBudget) {
              envelope.transferTargetTitle = targetBudget.title;
            }
          }
          
          return envelope;
        });

        console.log("Enveloppes préparées:", loadedEnvelopes);
        setEnvelopes(loadedEnvelopes);
      } catch (error) {
        console.error("Erreur lors du chargement des enveloppes:", error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de charger les budgets pour la transition"
        });
      }
    };

    loadEnvelopes();
  }, [toast, getTransitionPreferences]);

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
    const invalidEnvelopes = envelopes.filter(env => {
      if (env.transitionOption === "partial" && !env.partialAmount) return true;
      if (env.transitionOption === "transfer" && !env.transferTargetId) return true;
      return false;
    });

    if (invalidEnvelopes.length > 0) {
      toast({
        variant: "destructive",
        title: "Configuration incomplète",
        description: "Veuillez configurer toutes les options de transition.",
      });
      return;
    }

    setIsTransitioning(true);

    try {
      const transitionData = envelopes.map(envelope => ({
        id: envelope.id,
        title: envelope.title,
        transitionOption: envelope.transitionOption,
        partialAmount: envelope.partialAmount,
        transferTargetId: envelope.transferTargetId,
        remaining: envelope.remaining
      }));

      console.log("Données de transition:", transitionData);

      const success = await handleMonthTransition(transitionData);
      
      if (success) {
        // Rafraîchir les données avant de naviguer
        await refreshData();
        navigate("/dashboard/budget");
      }
    } catch (error) {
      console.error("Erreur pendant la transition:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la transition."
      });
    } finally {
      setIsTransitioning(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center gap-4 sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10 pb-4 border-b">
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigate("/dashboard/budget/budgets")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-xl font-semibold">Transition vers le nouveau mois</h1>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Prévisualisation des changements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {envelopes.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  Aucun budget à transitionner
                </p>
              ) : (
                envelopes.map((envelope) => (
                  <TransitionEnvelopeCard
                    key={envelope.id}
                    envelope={envelope}
                    onOptionChange={handleOptionChange}
                  />
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button
            variant="outline"
            onClick={() => navigate("/dashboard/budget/budgets")}
            disabled={isTransitioning}
          >
            Annuler
          </Button>
          <Button
            onClick={handleTransitionConfirm}
            className="gap-2"
            disabled={isTransitioning}
          >
            <Save className="h-4 w-4" />
            {isTransitioning ? "Traitement en cours..." : "Confirmer la transition"}
          </Button>
        </div>
      </div>

      <PartialAmountDialog
        open={showPartialDialog}
        onOpenChange={setShowPartialDialog}
        selectedEnvelope={selectedEnvelope}
        onAmountChange={handlePartialAmountChange}
      />

      <TransferDialog
        open={showTransferDialog}
        onOpenChange={setShowTransferDialog}
        selectedEnvelope={selectedEnvelope}
        envelopes={envelopes}
        onTransferTargetChange={handleTransferTargetChange}
      />
    </div>
  );
};

export default BudgetTransition;
