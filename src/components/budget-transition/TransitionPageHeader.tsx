
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { ExportImportButtons } from "../shared/ExportImportButtons";

interface TransitionPageHeaderProps {
  onBackClick: () => void;
}

export const TransitionPageHeader = ({ onBackClick }: TransitionPageHeaderProps) => {
  return (
    <div className="flex items-center justify-between pb-4 border-b">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={onBackClick}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-xl font-semibold">Transition de mois</h1>
      </div>
      
      <ExportImportButtons />
    </div>
  );
};
