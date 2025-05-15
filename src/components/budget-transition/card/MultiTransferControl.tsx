
import React from 'react';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { ChevronDown, PlusCircle, Trash2 } from "lucide-react";
import { BudgetEnvelope } from "@/types/transition";
import { useIsMobile } from "@/hooks/use-mobile";

interface MultiTransferControlProps {
  envelope: BudgetEnvelope;
  otherEnvelopes: BudgetEnvelope[];
  multiTransfers: { targetId: string; targetTitle: string; amount: number }[];
  setMultiTransfers: (transfers: { targetId: string; targetTitle: string; amount: number }[]) => void;
  onMultiTransferChange: (envelopeId: string, transfers: { targetId: string; targetTitle: string; amount: number }[]) => void;
}

export const MultiTransferControl: React.FC<MultiTransferControlProps> = ({
  envelope,
  otherEnvelopes,
  multiTransfers,
  setMultiTransfers,
  onMultiTransferChange
}) => {
  const isMobile = useIsMobile();
  
  // Calculate remaining amount for multi-transfers
  const usedAmount = multiTransfers.reduce((sum, transfer) => sum + transfer.amount, 0);
  const availableAmount = envelope.remaining - usedAmount;
  
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
    onMultiTransferChange(envelope.id, updatedTransfers);
  };
  
  const handleRemoveMultiTransfer = (targetId: string) => {
    const updatedTransfers = multiTransfers.filter(t => t.targetId !== targetId);
    setMultiTransfers(updatedTransfers);
    onMultiTransferChange(envelope.id, updatedTransfers);
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
    onMultiTransferChange(envelope.id, updatedTransfers);
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
      onMultiTransferChange(envelope.id, updatedTransfers);
    }
  };
  
  return (
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
              inputMode="decimal"
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
  );
};
