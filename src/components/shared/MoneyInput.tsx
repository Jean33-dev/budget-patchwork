
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

interface MoneyInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  value: number;
  onChange: (value: number) => void;
  className?: string;
}

export const MoneyInput = ({ value = 0, onChange, className, ...props }: MoneyInputProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const isMobile = useIsMobile();

  const formatValue = (num: number): string => {
    if (isEditing) {
      return num.toString();
    }
    // Assurons-nous que num est un nombre valide
    const safeNum = typeof num === 'number' && !isNaN(num) ? num : 0;
    return safeNum.toFixed(2).replace(".", ",");
  };

  const [inputValue, setInputValue] = useState(formatValue(value));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;

    // Autorise uniquement les chiffres et une seule virgule/point
    val = val.replace(/[^\d.,]/g, "");
    
    // Remplace la virgule par un point pour le calcul
    val = val.replace(",", ".");
    
    // S'assure qu'il n'y a qu'un seul point décimal
    const parts = val.split(".");
    if (parts.length > 2) {
      val = parts[0] + "." + parts.slice(1).join("");
    }
    
    // Limite à 2 décimales pendant la saisie
    if (parts[1] && parts[1].length > 2) {
      val = parts[0] + "." + parts[1].slice(0, 2);
    }

    setInputValue(val);
    const numVal = parseFloat(val) || 0;
    onChange(numVal);
  };

  const handleFocus = () => {
    setIsEditing(true);
    // Assurons-nous que value est un nombre valide
    const safeValue = typeof value === 'number' && !isNaN(value) ? value : 0;
    setInputValue(safeValue.toString().replace(".", ","));
  };

  const handleBlur = () => {
    setIsEditing(false);
    setInputValue(formatValue(value));
  };

  // Mettre à jour la valeur affichée si la prop value change
  useEffect(() => {
    setInputValue(formatValue(value));
  }, [value]);

  return (
    <div className={cn("relative", className)}>
      <Input
        type={isMobile ? "number" : "text"}
        inputMode="decimal"
        pattern="[0-9]*[.,]?[0-9]*"
        value={inputValue}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className="pl-8"
        step="0.01"
        {...props}
      />
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">€</span>
    </div>
  );
};
