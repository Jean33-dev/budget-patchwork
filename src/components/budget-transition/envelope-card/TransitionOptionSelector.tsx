
import React from "react";
import { TransitionOption } from "@/types/transition";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TransitionOptionSelectorProps {
  selectedOption: TransitionOption;
  onOptionChange: (option: TransitionOption) => void;
}

export const TransitionOptionSelector = ({
  selectedOption,
  onOptionChange
}: TransitionOptionSelectorProps) => {
  const handleOptionChange = (value: string) => {
    onOptionChange(value as TransitionOption);
  };
  
  return (
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
  );
};
