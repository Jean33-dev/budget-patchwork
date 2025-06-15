
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTheme } from "@/context/ThemeContext";

interface TransitionPageHeaderProps {
  onBackClick: () => void;
}

export const TransitionPageHeader = ({ onBackClick }: TransitionPageHeaderProps) => {
  const isMobile = useIsMobile();
  const { t } = useTheme();
  
  return (
    <div className={`flex items-center gap-4 pb-4 border-b ${isMobile ? 'flex-wrap' : ''}`}>
      <Button
        variant="outline"
        size="icon"
        onClick={onBackClick}
        className="shrink-0"
      >
        <ArrowLeft className="h-4 w-4" />
      </Button>
      <h1 className={`text-xl font-semibold ${isMobile ? 'w-full sm:w-auto' : ''}`}>{t("dashboard.monthTransition")}</h1>
    </div>
  );
};
