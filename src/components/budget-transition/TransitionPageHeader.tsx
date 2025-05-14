
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface TransitionPageHeaderProps {
  onBackClick: () => void;
}

export const TransitionPageHeader = ({ onBackClick }: TransitionPageHeaderProps) => {
  return (
    <div className="flex items-center gap-4 pb-4 border-b">
      <Button
        variant="outline"
        size="icon"
        onClick={onBackClick}
      >
        <ArrowLeft className="h-4 w-4" />
      </Button>
      <h1 className="text-xl font-semibold">Transition de mois</h1>
    </div>
  );
};
