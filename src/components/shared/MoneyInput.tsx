import React from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface MoneyInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value: number;
  onChange: (value: number) => void;
  className?: string;
}

export const MoneyInput = ({ value, onChange, className, ...props }: MoneyInputProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9.]/g, "");
    const numVal = parseFloat(val) || 0;
    onChange(numVal);
  };

  return (
    <div className={cn("relative", className)}>
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
      <Input
        type="text"
        value={value.toFixed(2)}
        onChange={handleChange}
        className="pl-8"
        {...props}
      />
    </div>
  );
};