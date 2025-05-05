
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface IncomeHeaderProps {
  title: string;
}

export const IncomeHeader = ({ title }: IncomeHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center gap-4 sticky top-0 bg-background/80 backdrop-blur-md z-10 pb-4 border-b border-border/50">
      <Button 
        variant="ghost" 
        size="icon"
        className="rounded-full hover:bg-secondary/80"
        onClick={() => navigate("/dashboard/budget")}
      >
        <ArrowLeft className="h-4 w-4" />
      </Button>

      <h1 className="text-xl font-semibold text-gradient">{title}</h1>
    </div>
  );
};
