
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home } from "lucide-react";
import { ExpenseDiagnosticButton } from "@/components/expense/ExpenseDiagnosticButton";

interface ExpensesHeaderProps {
  onNavigate?: (path: string) => void;
}

export const ExpensesHeader = ({ onNavigate }: ExpensesHeaderProps) => {
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    if (onNavigate) {
      onNavigate(path);
    } else {
      navigate(path);
    }
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-1"
          onClick={() => handleNavigation("/dashboard")}
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Retour</span>
        </Button>

        <h1 className="text-2xl font-bold">Dépenses</h1>
      </div>
      
      <div className="flex items-center gap-2">
        <ExpenseDiagnosticButton />
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-1"
          onClick={() => handleNavigation("/")}
        >
          <Home className="h-4 w-4" />
          <span>Accueil</span>
        </Button>
      </div>
    </div>
  );
};
