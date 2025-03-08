
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { BudgetEnvelope, TransitionOption } from "@/types/transition";
import { ChevronDown } from "lucide-react";

interface TransitionEnvelopeCardProps {
  envelope: BudgetEnvelope;
  otherEnvelopes: BudgetEnvelope[]; 
  onOptionChange: (envelopeId: string, option: TransitionOption) => void;
  onTransferTargetChange?: (envelopeId: string, targetId: string) => void;
  onPartialAmountChange?: (envelopeId: string, amount: number) => void;
}

export const TransitionEnvelopeCard = ({
  envelope,
  otherEnvelopes,
  onOptionChange,
  onTransferTargetChange,
  onPartialAmountChange
}: TransitionEnvelopeCardProps) => {
  // Local state to display selected option
  const [partialAmount, setPartialAmount] = useState(envelope.partialAmount || 0);
  
  // Debug logs
  console.log('Rendering envelope card:', {
    id: envelope.id,
    title: envelope.title,
    option: envelope.transitionOption,
    targetId: envelope.transferTargetId,
    targetTitle: envelope.transferTargetTitle
  });

  // Determine whether to show the additional inputs based on envelope prop
  const showPartialInput = envelope.transitionOption === "partial";
  const showTransferOptions = envelope.transitionOption === "transfer";

  const handleOptionChange = (value: string) => {
    const option = value as TransitionOption;
    console.log(`Option changed for ${envelope.id} from ${envelope.transitionOption} to:`, option);
    onOptionChange(envelope.id, option);
  };

  const handleTransferTargetSelect = (targetId: string) => {
    if (onTransferTargetChange) {
      console.log(`Transfer target selected for ${envelope.id}:`, targetId);
      onTransferTargetChange(envelope.id, targetId);
    }
  };

  const handlePartialAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const amount = parseFloat(e.target.value);
    if (!isNaN(amount) && amount >= 0 && amount <= envelope.remaining) {
      setPartialAmount(amount);
      if (onPartialAmountChange) {
        onPartialAmountChange(envelope.id, amount);
      }
    }
  };

  const confirmPartialAmount = () => {
    if (onPartialAmountChange) {
      onPartialAmountChange(envelope.id, partialAmount);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 border rounded-lg">
      <div className="space-y-1 flex-1">
        <h3 className="font-medium">{envelope.title}</h3>
        <div className="text-sm text-muted-foreground space-y-1">
          <div>Solde restant: {envelope.remaining.toFixed(2)}€</div>
          {envelope.transitionOption === "partial" && envelope.partialAmount !== undefined && (
            <div>Montant reporté: {envelope.partialAmount.toFixed(2)}€</div>
          )}
          {envelope.transitionOption === "transfer" && envelope.transferTargetTitle && (
            <div>
              Transfert vers: {envelope.transferTargetTitle}
            </div>
          )}
        </div>
      </div>
      
      <div className="flex flex-col gap-2 w-full sm:w-auto">
        <Select
          value={envelope.transitionOption}
          onValueChange={handleOptionChange}
        >
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Choisir une option" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="carry">Reporter tout</SelectItem>
            <SelectItem value="reset">Réinitialiser</SelectItem>
            <SelectItem value="transfer">Transférer</SelectItem>
            <SelectItem value="partial">Report partiel</SelectItem>
          </SelectContent>
        </Select>

        {showTransferOptions && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full sm:w-[200px]">
                {envelope.transferTargetTitle || "Choisir une enveloppe"}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-full sm:w-[200px]">
              {otherEnvelopes.map(targetEnv => (
                <DropdownMenuItem 
                  key={targetEnv.id} 
                  onClick={() => handleTransferTargetSelect(targetEnv.id)}
                >
                  {targetEnv.title}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {showPartialInput && (
          <div className="flex w-full sm:w-[200px] gap-2">
            <input
              type="number"
              value={partialAmount}
              onChange={handlePartialAmountChange}
              min="0"
              max={envelope.remaining}
              step="0.01"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
            />
            <Button variant="outline" size="sm" onClick={confirmPartialAmount}>
              OK
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
