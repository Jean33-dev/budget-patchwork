
import React from 'react';
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
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { TransitionOption, BudgetEnvelope } from "@/types/transition";
import { useTheme } from "@/context/ThemeContext";

interface OptionSelectorProps {
  envelope: BudgetEnvelope;
  otherEnvelopes: BudgetEnvelope[];
  selectedOption: TransitionOption;
  onOptionChange: (option: TransitionOption) => void;
  onTransferTargetSelect: (targetId: string) => void;
}

export const OptionSelector: React.FC<OptionSelectorProps> = ({
  envelope,
  otherEnvelopes,
  selectedOption,
  onOptionChange,
  onTransferTargetSelect,
}) => {
  const { t } = useTheme();

  // Determine whether to show the additional inputs based on selected option
  const showTransferOptions = selectedOption === "transfer";
  
  return (
    <>
      <Select
        value={selectedOption}
        onValueChange={(value) => onOptionChange(value as TransitionOption)}
      >
        <SelectTrigger className="w-full sm:w-[200px]">
          <SelectValue placeholder={t("transition.selectOptionPlaceholder") || "Select an option"} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="carry">{t("transition.option.carry")}</SelectItem>
          <SelectItem value="reset">{t("transition.option.reset")}</SelectItem>
          <SelectItem value="transfer">{t("transition.option.transfer")}</SelectItem>
          <SelectItem value="multi-transfer">{t("transition.option.multiTransfer")}</SelectItem>
        </SelectContent>
      </Select>

      {showTransferOptions && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full sm:w-[200px]">
              {envelope.transferTargetTitle || t("transition.selectEnvelopePlaceholder")}
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
      )}
    </>
  );
};
