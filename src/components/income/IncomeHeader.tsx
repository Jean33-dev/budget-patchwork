
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface IncomeHeaderProps {
  title: string;
}

export const IncomeHeader = ({ title }: IncomeHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center gap-4 sticky top-0 bg-background/95 backdrop-blur-md z-10 py-4 mb-4 border-b">
      <Button
        variant="outline"
        size="icon"
        className="rounded-full shadow-sm hover:shadow transition-all"
        onClick={() => navigate("/dashboard/budget")}
      >
        <ArrowLeft className="h-4 w-4" />
      </Button>

      <h1 className="text-xl font-semibold">{title}</h1>
    </div>
  );
};
