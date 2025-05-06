
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface IncomeHeaderProps {
  title: string;
}

export const IncomeHeader = ({ title }: IncomeHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center gap-4 sticky top-0 bg-background/95 backdrop-blur-md z-10 py-4 mb-6 border-b">
      <Button
        variant="outline"
        size="icon"
        className="rounded-full shadow-sm hover:shadow-md hover:bg-primary/10 transition-all"
        onClick={() => navigate("/dashboard/budget")}
      >
        <ArrowLeft className="h-4 w-4" />
      </Button>

      <div className="flex-1">
        <h1 className="text-xl font-semibold bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent">
          {title}
        </h1>
        <p className="text-sm text-muted-foreground">
          Gérez efficacement vos sources de revenus
        </p>
      </div>
    </div>
  );
};
