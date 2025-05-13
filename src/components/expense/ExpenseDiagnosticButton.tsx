
import React from "react";
import { Button } from "@/components/ui/button";
import { Stethoscope } from "lucide-react";
import { expenseDiagnostic } from "@/utils/expense-diagnostic";

export function ExpenseDiagnosticButton() {
  const [isRunning, setIsRunning] = React.useState(false);
  
  const handleRunDiagnostic = async () => {
    setIsRunning(true);
    try {
      await expenseDiagnostic.runDiagnostic();
    } finally {
      setIsRunning(false);
    }
  };
  
  return (
    <Button
      variant="outline"
      size="sm"
      className="gap-2"
      onClick={handleRunDiagnostic}
      disabled={isRunning}
    >
      <Stethoscope className="h-4 w-4" />
      {isRunning ? "Diagnostic en cours..." : "Diagnostiquer"}
    </Button>
  );
}
