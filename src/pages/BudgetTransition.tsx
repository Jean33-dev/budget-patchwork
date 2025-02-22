
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Save } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MoneyInput } from "@/components/shared/MoneyInput";
import { useCategories } from "@/hooks/useCategories";
import { useBudgets } from "@/hooks/useBudgets";

type TransitionOption = "reset" | "carry" | "partial" | "transfer";

interface BudgetEnvelope {
  id: string;
  title: string;
  budget: number;
  spent: number;
  remaining: number;
  transitionOption: TransitionOption;
  partialAmount?: number;
  transferTargetId?: string;
}

const BudgetTransition = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { categories, handleMonthTransition } = useCategories();
  const { budgets } = useBudgets();
  
  // État pour les enveloppes
  const [envelopes, setEnvelopes] = useState<BudgetEnvelope[]>([]);
  const [selectedEnvelope, setSelectedEnvelope] = useState<BudgetEnvelope | null>(null);
  const [showPartialDialog, setShowPartialDialog] = useState(false);
  const [showTransferDialog, setShowTransferDialog] = useState(false);

  // Charger les données des enveloppes depuis les catégories et les budgets
  useEffect(() => {
    const loadedEnvelopes: BudgetEnvelope[] = [];
    categories.forEach(category => {
      category.budgets.forEach(budgetId => {
        const budget = budgets.find(b => b.id === budgetId);
        if (budget) {
          loadedEnvelopes.push({
            id: `${category.id}-${budget.id}`,
            title: budget.title,
            budget: budget.budget,
            spent: budget.spent,
            remaining: budget.budget - budget.spent,
            transitionOption: "reset"
          });
        }
      });
    });
    console.log("Enveloppes chargées:", loadedEnvelopes);
    setEnvelopes(loadedEnvelopes);
  }, [categories, budgets]);

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
    
    setEnvelopes(prev =>
      prev.map(env =>
        env.id === selectedEnvelope.id
          ? { ...env, transferTargetId: targetId }
          : env
      )
    );
  };

  const calculateTransitionImpact = (envelope: BudgetEnvelope) => {
    switch (envelope.transitionOption) {
      case "reset":
        return 0;
      case "carry":
        return envelope.remaining;
      case "partial":
        return envelope.partialAmount || 0;
      case "transfer":
        return 0; // Le montant sera ajouté à l'enveloppe cible
      default:
        return 0;
    }
  };

  const handleTransitionConfirm = () => {
    // Vérifier que toutes les options sont correctement configurées
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

    // Préparer les données pour la transition
    const transitionData = envelopes.map(envelope => ({
      id: envelope.id,
      title: envelope.title,
      transitionOption: envelope.transitionOption,
      partialAmount: envelope.partialAmount,
      transferTargetId: envelope.transferTargetId
    }));

    // Appliquer les transitions
    const success = handleMonthTransition(transitionData);
    
    if (success) {
      navigate("/dashboard/budget");
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
              {envelopes.map((envelope) => (
                <div
                  key={envelope.id}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 border rounded-lg"
                >
                  <div className="space-y-1 flex-1">
                    <h3 className="font-medium">{envelope.title}</h3>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <div>Solde restant: {envelope.remaining.toFixed(2)}€</div>
                      {envelope.transitionOption === "partial" && envelope.partialAmount !== undefined && (
                        <div>Montant reporté: {envelope.partialAmount.toFixed(2)}€</div>
                      )}
                      {envelope.transitionOption === "transfer" && envelope.transferTargetId && (
                        <div>
                          Transfert vers: {
                            envelopes.find(e => e.id === envelope.transferTargetId)?.title
                          }
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <Select
                    value={envelope.transitionOption}
                    onValueChange={(value: TransitionOption) => 
                      handleOptionChange(envelope.id, value)
                    }
                  >
                    <SelectTrigger className="w-full sm:w-[200px]">
                      <SelectValue placeholder="Choisir une option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="reset">Réinitialiser</SelectItem>
                      <SelectItem value="carry">Reporter tout</SelectItem>
                      <SelectItem value="partial">Report partiel</SelectItem>
                      <SelectItem value="transfer">Transférer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button
            variant="outline"
            onClick={() => navigate("/dashboard/budget/budgets")}
          >
            Annuler
          </Button>
          <Button
            onClick={handleTransitionConfirm}
            className="gap-2"
          >
            <Save className="h-4 w-4" />
            Confirmer la transition
          </Button>
        </div>
      </div>

      {/* Dialog pour le report partiel */}
      <Dialog open={showPartialDialog} onOpenChange={setShowPartialDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Report partiel</DialogTitle>
            <DialogDescription>
              Choisissez le montant à reporter sur le mois suivant
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <MoneyInput
              value={selectedEnvelope?.partialAmount || 0}
              onChange={handlePartialAmountChange}
              placeholder="Montant à reporter"
              className="w-full"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPartialDialog(false)}>
              Annuler
            </Button>
            <Button onClick={() => setShowPartialDialog(false)}>
              Confirmer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog pour le transfert */}
      <Dialog open={showTransferDialog} onOpenChange={setShowTransferDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Transfert vers une autre enveloppe</DialogTitle>
            <DialogDescription>
              Choisissez l'enveloppe qui recevra les fonds
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Select
              value={selectedEnvelope?.transferTargetId}
              onValueChange={handleTransferTargetChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choisir une enveloppe" />
              </SelectTrigger>
              <SelectContent>
                {envelopes
                  .filter(env => env.id !== selectedEnvelope?.id)
                  .map(env => (
                    <SelectItem key={env.id} value={env.id}>
                      {env.title}
                    </SelectItem>
                  ))
                }
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowTransferDialog(false)}>
              Annuler
            </Button>
            <Button onClick={() => setShowTransferDialog(false)}>
              Confirmer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BudgetTransition;
