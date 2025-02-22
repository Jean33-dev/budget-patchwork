
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BudgetEnvelope, TransitionOption } from "@/types/transition";

interface TransitionEnvelopeCardProps {
  envelope: BudgetEnvelope;
  onOptionChange: (envelopeId: string, option: TransitionOption) => void;
}

export const TransitionEnvelopeCard = ({
  envelope,
  onOptionChange,
}: TransitionEnvelopeCardProps) => {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 border rounded-lg">
      <div className="space-y-1 flex-1">
        <h3 className="font-medium">{envelope.title}</h3>
        <div className="text-sm text-muted-foreground space-y-1">
          <div>Solde restant: {envelope.remaining.toFixed(2)}€</div>
          {envelope.transitionOption === "partial" && envelope.partialAmount !== undefined && (
            <div>Montant reporté: {envelope.partialAmount.toFixed(2)}€</div>
          )}
          {envelope.transitionOption === "transfer" && envelope.transferTargetId && (
            <div>
              Transfert vers: {envelope.transferTargetTitle}
            </div>
          )}
        </div>
      </div>
      
      <Select
        value={envelope.transitionOption}
        onValueChange={(value: TransitionOption) => 
          onOptionChange(envelope.id, value)
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
  );
};
