
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
import { ChevronDown, PlusCircle, Trash2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface TransitionEnvelopeCardProps {
  envelope: BudgetEnvelope;
  otherEnvelopes: BudgetEnvelope[]; 
  onOptionChange: (envelopeId: string, option: TransitionOption) => void;
  onTransferTargetChange?: (envelopeId: string, targetId: string) => void;
  onPartialAmountChange?: (envelopeId: string, amount: number) => void;
  onMultiTransferChange?: (envelopeId: string, transfers: { targetId: string; targetTitle: string; amount: number }[]) => void;
}

export const TransitionEnvelopeCard = ({
  envelope,
  otherEnvelopes,
  onOptionChange,
  onTransferTargetChange,
  onPartialAmountChange,
  onMultiTransferChange
}: TransitionEnvelopeCardProps) => {
  // Local state to display selected option
  const [partialAmount, setPartialAmount] = useState(envelope.partialAmount || 0);
  const [selectedOption, setSelectedOption] = useState<TransitionOption>(envelope.transitionOption);
  const [multiTransfers, setMultiTransfers] = useState<{ targetId: string; targetTitle: string; amount: number }[]>(
    envelope.multiTransfers || []
  );
  
  // Calculate remaining amount for multi-transfers
  const usedAmount = multiTransfers.reduce((sum, transfer) => sum + transfer.amount, 0);
  const availableAmount = envelope.remaining - usedAmount;
  
  // Update the local state when the envelope changes
  useEffect(() => {
    setSelectedOption(envelope.transitionOption);
    setPartialAmount(envelope.partialAmount || 0);
    setMultiTransfers(envelope.multiTransfers || []);
  }, [envelope.transitionOption, envelope.partialAmount, envelope.multiTransfers]);
  
  // Debug logs
  console.log('Rendering envelope card:', {
    id: envelope.id,
    title: envelope.title,
    option: envelope.transitionOption,
    selectedOption: selectedOption,
    targetId: envelope.transferTargetId,
    targetTitle: envelope.transferTargetTitle,
    multiTransfers
  });

  // Determine whether to show the additional inputs based on envelope prop
  const showPartialInput = selectedOption === "partial";
  const showTransferOptions = selectedOption === "transfer";
  const showMultiTransferOptions = selectedOption === "multi-transfer";

  const handleOptionChange = (value: string) => {
    const option = value as TransitionOption;
    console.log(`Option changed for ${envelope.id} from ${selectedOption} to:`, option);
    
    // Update local state first
    setSelectedOption(option);
    
    // Then update parent state
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
  
  const handleAddMultiTransfer = () => {
    if (availableAmount <= 0) return;
    
    // Find the first envelope that's not already in the transfers
    const usedIds = multiTransfers.map(t => t.targetId);
    const availableEnvelope = otherEnvelopes.find(env => !usedIds.includes(env.id));
    
    if (!availableEnvelope) return;
    
    const newTransfer = {
      targetId: availableEnvelope.id,
      targetTitle: availableEnvelope.title,
      amount: Math.min(availableAmount, 10) // Default to 10 or whatever is available
    };
    
    const updatedTransfers = [...multiTransfers, newTransfer];
    setMultiTransfers(updatedTransfers);
    
    if (onMultiTransferChange) {
      onMultiTransferChange(envelope.id, updatedTransfers);
    }
  };
  
  const handleRemoveMultiTransfer = (targetId: string) => {
    const updatedTransfers = multiTransfers.filter(t => t.targetId !== targetId);
    setMultiTransfers(updatedTransfers);
    
    if (onMultiTransferChange) {
      onMultiTransferChange(envelope.id, updatedTransfers);
    }
  };
  
  const handleMultiTransferTargetChange = (index: number, targetId: string) => {
    const targetEnvelope = otherEnvelopes.find(env => env.id === targetId);
    if (!targetEnvelope) return;
    
    const updatedTransfers = [...multiTransfers];
    updatedTransfers[index] = {
      ...updatedTransfers[index],
      targetId,
      targetTitle: targetEnvelope.title
    };
    
    setMultiTransfers(updatedTransfers);
    
    if (onMultiTransferChange) {
      onMultiTransferChange(envelope.id, updatedTransfers);
    }
  };
  
  const handleMultiTransferAmountChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const amount = parseFloat(e.target.value);
    
    // Calculate how much amount is used by other transfers
    const otherTransfersAmount = multiTransfers.reduce((sum, t, i) => 
      i !== index ? sum + t.amount : sum, 0
    );
    
    // Max amount is the total remaining minus what's used by other transfers
    const maxAmount = envelope.remaining - otherTransfersAmount;
    
    if (!isNaN(amount) && amount >= 0 && amount <= maxAmount) {
      const updatedTransfers = [...multiTransfers];
      updatedTransfers[index] = {
        ...updatedTransfers[index],
        amount
      };
      
      setMultiTransfers(updatedTransfers);
      
      if (onMultiTransferChange) {
        onMultiTransferChange(envelope.id, updatedTransfers);
      }
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 border rounded-lg">
      <div className="space-y-1 flex-1">
        <h3 className="font-medium">{envelope.title}</h3>
        <div className="text-sm text-muted-foreground space-y-1">
          <div>Solde restant: {envelope.remaining.toFixed(2)}€</div>
          {selectedOption === "partial" && envelope.partialAmount !== undefined && (
            <div>Montant reporté: {envelope.partialAmount.toFixed(2)}€</div>
          )}
          {selectedOption === "transfer" && envelope.transferTargetTitle && (
            <div>
              Transfert vers: {envelope.transferTargetTitle}
            </div>
          )}
          {selectedOption === "multi-transfer" && multiTransfers.length > 0 && (
            <div>
              <div>Transferts multiples:</div>
              <ul className="list-disc pl-5 mt-1">
                {multiTransfers.map((transfer, index) => (
                  <li key={index}>{transfer.amount.toFixed(2)}€ vers {transfer.targetTitle}</li>
                ))}
              </ul>
              {availableAmount > 0 && (
                <div className="mt-1">Reste disponible: {availableAmount.toFixed(2)}€</div>
              )}
            </div>
          )}
        </div>
      </div>
      
      <div className="flex flex-col gap-2 w-full sm:w-auto">
        <Select
          value={selectedOption}
          onValueChange={handleOptionChange}
        >
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Choisir une option" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="carry">Reporter tout</SelectItem>
            <SelectItem value="reset">Réinitialiser</SelectItem>
            <SelectItem value="transfer">Transférer</SelectItem>
            <SelectItem value="multi-transfer">Transferts multiples</SelectItem>
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
        
        {showMultiTransferOptions && (
          <div className="space-y-2 w-full sm:w-[300px] border rounded p-2">
            {multiTransfers.map((transfer, index) => (
              <div key={index} className="flex flex-col gap-1">
                {index > 0 && <Separator className="my-1" />}
                <div className="flex items-center justify-between gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="h-8 text-xs flex-1 truncate">
                        {transfer.targetTitle}
                        <ChevronDown className="ml-1 h-3 w-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      {otherEnvelopes
                        .filter(env => env.id !== envelope.id && 
                          !multiTransfers.some(t => t.targetId === env.id && t.targetId !== transfer.targetId))
                        .map(targetEnv => (
                          <DropdownMenuItem 
                            key={targetEnv.id} 
                            onClick={() => handleMultiTransferTargetChange(index, targetEnv.id)}
                          >
                            {targetEnv.title}
                          </DropdownMenuItem>
                        ))
                      }
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8"
                    onClick={() => handleRemoveMultiTransfer(transfer.targetId)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={transfer.amount}
                    onChange={(e) => handleMultiTransferAmountChange(index, e)}
                    min="0"
                    step="0.01"
                    className="flex h-8 w-full rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background"
                  />
                  <span className="text-sm">€</span>
                </div>
              </div>
            ))}
            
            <Button 
              size="sm" 
              variant="outline" 
              className="w-full mt-2 flex items-center justify-center"
              disabled={availableAmount <= 0 || multiTransfers.length >= otherEnvelopes.length}
              onClick={handleAddMultiTransfer}
            >
              <PlusCircle className="h-4 w-4 mr-1" />
              Ajouter un transfert
            </Button>
          </div>
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
