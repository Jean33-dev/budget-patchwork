
import React from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface MoneyInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  value: number;
  onChange: (value: number) => void;
  className?: string;
}

export const MoneyInput = ({ value, onChange, className, ...props }: MoneyInputProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Remove any non-digit characters except dots and commas
    let val = e.target.value.replace(/[^0-9.,]/g, "");
    
    // Replace comma with dot for decimal
    val = val.replace(",", ".");
    
    // Ensure only one decimal point
    const parts = val.split(".");
    if (parts.length > 2) {
      val = parts[0] + "." + parts.slice(1).join("");
    }
    
    // Convert to number
    const numVal = parseFloat(val) || 0;
    onChange(numVal);
  };

  const formatValue = (num: number) => {
    // Format the number with commas for decimal points
    return num.toFixed(2).replace(".", ",");
  };

  return (
    <div className={cn("relative", className)}>
      <Input
        type="text"
        value={formatValue(value)}
        onChange={handleChange}
        className="pl-8"
        {...props}
      />
      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">€</span>
    </div>
  );
};
