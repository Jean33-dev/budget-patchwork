
import { Button } from "@/components/ui/button";
import { Share } from "lucide-react";

interface ExpenseShareButtonProps {
  onClick: () => void;
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive";
}

export const ExpenseShareButton = ({ onClick, variant = "outline" }: ExpenseShareButtonProps) => {
  return (
    <Button
      variant={variant}
      size="sm"
      className="flex items-center gap-1.5"
      onClick={onClick}
    >
      <Share size={16} />
      <span>Partager</span>
    </Button>
  );
};
