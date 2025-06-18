
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface TransitionPageHeaderProps {
  onBackClick: () => void;
}

export const TransitionPageHeader = ({ onBackClick }: TransitionPageHeaderProps) => {
  const isMobile = useIsMobile();
  
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
      <h1 className={`text-xl font-semibold ${isMobile ? 'w-full sm:w-auto' : ''}`}>Transition de mois</h1>
    </div>
  );
};
