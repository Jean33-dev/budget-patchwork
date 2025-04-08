
import React from "react";
import { BudgetEnvelope } from "@/types/transition";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

interface TransferOptionsProps {
  envelope: BudgetEnvelope;
  otherEnvelopes: BudgetEnvelope[];
  onTransferTargetSelect: (targetId: string) => void;
}

export const TransferOptions = ({
  envelope,
  otherEnvelopes,
  onTransferTargetSelect
}: TransferOptionsProps) => {
  return (
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
            onClick={() => onTransferTargetSelect(targetEnv.id)}
          >
            {targetEnv.title}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
