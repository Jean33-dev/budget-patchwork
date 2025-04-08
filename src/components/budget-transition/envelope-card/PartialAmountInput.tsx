
import React, { useState, useEffect } from "react";
import { BudgetEnvelope } from "@/types/transition";
import { Button } from "@/components/ui/button";

interface PartialAmountInputProps {
  envelope: BudgetEnvelope;
  onPartialAmountChange: (amount: number) => void;
}

export const PartialAmountInput = ({
  envelope,
  onPartialAmountChange
}: PartialAmountInputProps) => {
  const [partialAmount, setPartialAmount] = useState(envelope.partialAmount || 0);
  
  // Update local state when envelope changes
  useEffect(() => {
    setPartialAmount(envelope.partialAmount || 0);
  }, [envelope.partialAmount]);
  
  const handlePartialAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const amount = parseFloat(e.target.value);
    if (!isNaN(amount) && amount >= 0 && amount <= envelope.remaining) {
      setPartialAmount(amount);
    }
  };
  
  const confirmPartialAmount = () => {
    onPartialAmountChange(partialAmount);
  };
  
  return (
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
  );
};
