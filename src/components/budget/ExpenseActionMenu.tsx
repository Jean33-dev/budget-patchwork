
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface ExpenseActionMenuProps {
  onDeleteClick: (e: React.MouseEvent) => void;
}

export const ExpenseActionMenu = ({ onDeleteClick }: ExpenseActionMenuProps) => {
  return (
    <Button 
      variant="ghost" 
      size="sm" 
      className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
      onClick={(e) => {
        e.stopPropagation();
        onDeleteClick(e);
      }}
    >
      <span className="sr-only">Supprimer</span>
      <Trash2 className="h-4 w-4" />
    </Button>
  );
};
