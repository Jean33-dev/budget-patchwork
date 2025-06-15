
import React from "react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/context/ThemeContext";

interface TransitionActionButtonsProps {
  onCancel: () => void;
  onConfirm: () => void;
  isProcessing: boolean;
}

export const TransitionActionButtons = ({
  onCancel,
  onConfirm,
  isProcessing
}: TransitionActionButtonsProps) => {
  const { t } = useTheme();
  return (
    <div className="flex justify-between pt-4 border-t">
      <Button 
        variant="outline" 
        onClick={onCancel}
      >
        {t("dashboard.cancel")}
      </Button>
      <Button 
        onClick={onConfirm}
        disabled={isProcessing}
      >
        {isProcessing ? t("transition.processing") : t("transition.confirm")}
      </Button>
    </div>
  );
};
