
import { useState } from "react";
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

type TransitionOption = "reset" | "carry" | "partial" | "transfer";

interface BudgetEnvelope {
  id: string;
  title: string;
  budget: number;
  spent: number;
  remaining: number;
  transitionOption: TransitionOption;
}

const BudgetTransition = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Exemple de données - à remplacer par les vraies données
  const [envelopes, setEnvelopes] = useState<BudgetEnvelope[]>([
    {
      id: "1",
      title: "Logement",
      budget: 1000,
      spent: 800,
      remaining: 200,
      transitionOption: "reset"
    },
    {
      id: "2",
      title: "Alimentation",
      budget: 500,
      spent: 450,
      remaining: 50,
      transitionOption: "reset"
    },
  ]);

  const handleOptionChange = (envelopeId: string, option: TransitionOption) => {
    setEnvelopes(prev => 
      prev.map(env => 
        env.id === envelopeId 
          ? { ...env, transitionOption: option }
          : env
      )
    );
  };

  const handleTransitionConfirm = () => {
    // TODO: Implémenter la logique de transition
    toast({
      title: "Transition effectuée",
      description: "Les budgets ont été mis à jour pour le nouveau mois.",
    });
    navigate("/dashboard/budget");
  };

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center gap-4 sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10 pb-4 border-b">
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigate("/dashboard/budget")}
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
                    <div className="text-sm text-muted-foreground">
                      Solde restant: {envelope.remaining.toFixed(2)}€
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
            onClick={() => navigate("/dashboard/budget")}
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
    </div>
  );
};

export default BudgetTransition;
